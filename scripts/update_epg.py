#!/usr/bin/env python3
"""update_epg.py — собирает epg.json (программа передач) из публичных XMLTV-фидов.

Источники (по приоритету канала, первый с данными на «сейчас» побеждает):
  B — iptv-epg.org (UA)        чистые id вида Pershyi.ua
  A — epgshare01.online (UA1)  украинские названия, [UA-UA]
Запускается в GitHub Actions (.github/workflows/update-epg.yml), не на Cloudflare Worker (лимит CPU).
Время хранится в UTC (ISO, Z); страница переводит во время зрителя. Каналы без данных в epg.json
отсутствуют — страница в этом случае прячет блок, а не показывает выдуманное.
"""
import gzip, io, json, sys, urllib.request
from datetime import datetime, timedelta, timezone
from xml.etree import ElementTree as ET

FEEDS = {
    'B': 'https://iptv-epg.org/files/epg-ua.xml.gz',
    'A': 'https://epgshare01.online/epgshare01/epg_ripper_UA1.xml.gz',
}
OUTPUT = 'epg.json'
WINDOW_BACK = timedelta(hours=3)    # уже закончившиеся передачи не нужны, но идущую показываем с запасом
WINDOW_FWD = timedelta(hours=30)

# id канала сайта -> [(фид, id в XMLTV), ...] по убыванию приоритета
CHANNEL_MAP = {
    'pershyi':    [('B', 'Pershyi.ua'), ('A', 'Перший.[UA-RU].ua')],
    'channel5':   [('B', 'Channel5.ua')],
    'espreso':    [('B', 'Espreso.ua')],
    'kyiv24':     [('A', 'Київ.24.[UA-UA].ua'), ('A', 'Київ.24.[UA-RU].ua')],
    'news24':     [('A', '24.канал.[UA-UA].ua')],
    'rada':       [('B', 'Rada.ua')],
    'marafon':    [('B', '1+1MARAFON.ua')],
    'ntn':        [('B', 'NTN.ua')],
    'inter':      [('B', 'Inter.ua'), ('A', 'Інтер.[UA-UA].ua')],
    'oneplusone': [('A', '1+1.International.[UA-UA].ua'), ('A', '1+1.International.[UA-RU].ua')],
    'kvartal':    [('B', 'KvartalTV.ua')],
    'mega':       [('B', 'Mega.ua')],
    'k2':         [('B', 'K2.ua')],
    'armytv':     [('A', 'Армія.ТБ.[UA-UA].ua')],
    'tva':        [('B', 'TVA.ua')],
    'nashemus':   [('A', '#НАШЕ.music.HD.[UA-UA].ua')],
    'm1':         [('B', 'M1.ua')],
    'music4ever': [('B', '4everMusic.ua')],
    'uamusic':    [('B', 'UAMusic.ua')],
    'nikikids':   [('B', 'NikiKids.ua')],
    'nikijunior': [('B', 'NikiJunior.ua')],
    'rybalka':    [('B', 'Rybalka.ua')],
    'svarozhychy': [('B', 'Svarozhychy.ua')],
    'equalympic': [('B', 'Equalympic.ua')],
}


def parse_ts(s):
    """'20261024003000 +0000' -> aware UTC datetime"""
    s = s.strip()
    dt = datetime.strptime(s[:14], '%Y%m%d%H%M%S')
    off = s[14:].strip()
    tz = timezone.utc
    if off and off[0] in '+-' and len(off) >= 5:
        delta = timedelta(hours=int(off[1:3]), minutes=int(off[3:5]))
        tz = timezone(delta if off[0] == '+' else -delta)
    return dt.replace(tzinfo=tz).astimezone(timezone.utc)


def load_feed(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (ukraine-tv.uk EPG bot)'})
    for attempt in range(3):
        try:
            raw = urllib.request.urlopen(req, timeout=120).read()
            return gzip.GzipFile(fileobj=io.BytesIO(raw)).read() if raw[:2] == b'\x1f\x8b' else raw
        except Exception as e:
            print('feed %s attempt %d failed: %s' % (url, attempt + 1, e), file=sys.stderr)
    return None


def main():
    now = datetime.now(timezone.utc)
    lo, hi = now - WINDOW_BACK, now + WINDOW_FWD
    wanted = {}   # (feed, xmltv id) -> список передач
    for ids in CHANNEL_MAP.values():
        for key in ids:
            wanted[key] = []
    ok_feeds = 0
    for tag, url in FEEDS.items():
        data = load_feed(url)
        if not data:
            continue
        ok_feeds += 1
        for ev, el in ET.iterparse(io.BytesIO(data), events=('end',)):
            if el.tag != 'programme':
                continue
            key = (tag, el.get('channel'))
            if key in wanted:
                try:
                    st, sp = parse_ts(el.get('start')), parse_ts(el.get('stop'))
                    t = el.find('title')
                    title = (t.text or '').strip() if t is not None else ''
                except Exception:
                    el.clear(); continue
                if title and sp > lo and st < hi:
                    wanted[key].append({'title': title, 'start': st.strftime('%Y-%m-%dT%H:%M:%SZ'), 'stop': sp.strftime('%Y-%m-%dT%H:%M:%SZ')})
            el.clear()
    if ok_feeds == 0:
        print('no feed could be loaded — epg.json left unchanged', file=sys.stderr)
        return 1
    channels = {}
    for cid, cands in CHANNEL_MAP.items():
        for key in cands:
            items = sorted(wanted[key], key=lambda p: p['start'])
            # годится, если «сейчас» покрыто и есть следующая передача
            cur = [p for p in items if p['start'] <= now.strftime('%Y-%m-%dT%H:%M:%SZ') < p['stop']]
            if cur and len(items) >= 2:
                channels[cid] = items
                break
    out = {'generated_at': now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'source': 'iptv-epg.org + epgshare01.online', 'channels': channels}
    text = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    try:
        if json.load(open(OUTPUT, encoding='utf-8')).get('channels') == channels:
            print('no programme changes')
            return 0
    except Exception:
        pass
    open(OUTPUT, 'w', encoding='utf-8').write(text + '\n')
    print('epg.json: %d/%d channels, %d programmes, %d bytes' % (len(channels), len(CHANNEL_MAP), sum(len(v) for v in channels.values()), len(text)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
