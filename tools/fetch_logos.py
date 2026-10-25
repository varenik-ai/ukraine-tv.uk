#!/usr/bin/env python3
"""Скачивает логотипы каналов из базы iptv-org (logos.json), обрезает пустые поля и сохраняет
assets/logos/<id>.png (макс. сторона 192 px). Запуск (нужен Pillow): python3 tools/fetch_logos.py
Соответствие id сайта -> id канала iptv-org: LOGO_IDS. Каналы без логотипа остаются с текстовой иконкой."""
import io, json, os, sys, urllib.request
from PIL import Image

LOGO_IDS = {
 'pershyi': 'Pershyi.ua', 'channel5': 'Channel5.ua', 'espreso': 'EspresoTV.ua', 'kyiv24': 'Kyiv.ua', 'news24': 'Channel24.ua',
 'rada': 'RadaTV.ua', 'marafon': '1Plus1Marafon.ua', 'ntn': 'NTN.ua', 'inter': 'Inter.ua', 'oneplusone': '1Plus1International.ua',
 'kvartal': 'KvartalTV.ua', 'mega': 'Mega.ua', 'k2': 'K2.ua', 'filmualive': 'FilmUALive.ua', 'cinema4ever': '4everCinema.ua',
 'drama4ever': '4everDrama.ua', 'armytv': 'ArmyTV.ua', 'irt': 'IRT.ua', 'tva': 'TVA.ua', 'ntk': 'NTKTV.ua',
 'muzvar': 'Muzvar.ua', 'nashemus': 'NASHEMusic.ua', 'm1': 'M1.ua', 'music4ever': '4everMusic.ua', 'uamusic': 'UAMusic.ua',
 'nikikids': 'NikiKids.ua', 'nikijunior': 'NikiJunior.ua', 'rybalka': 'Rybalka.ua', 'svarozhychy': 'Svarozhychy.ua', 'equalympic': 'Equalympic.ua',
}
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/124 Safari/537.36'}
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'logos')
MAXSIDE = 192


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()


def main():
    db = json.loads(get('https://iptv-org.github.io/api/logos.json'))
    by = {}
    for l in db:
        by.setdefault(l['channel'], []).append(l)
    ok, miss = [], []
    for cid, iid in LOGO_IDS.items():
        cands = sorted(by.get(iid, []), key=lambda l: (l['format'] not in ('PNG', 'SVG'), -(l['width'] or 0)))
        done = False
        for l in cands:
            try:
                im = Image.open(io.BytesIO(get(l['url']))).convert('RGBA')
                bbox = im.getchannel('A').getbbox() or (0, 0) + im.size
                im = im.crop(bbox)
                if min(im.size) < 24:
                    continue
                im.thumbnail((MAXSIDE, MAXSIDE), Image.LANCZOS)
                im.save(os.path.join(OUT, cid + '.png'), optimize=True)
                ok.append((cid, im.size)); done = True
                break
            except Exception as e:
                print('  %s: %s failed: %s' % (cid, l['url'][:50], str(e)[:50]), file=sys.stderr)
        if not done:
            miss.append(cid)
    print('saved %d: %s' % (len(ok), ', '.join('%s %dx%d' % (c, *s) for c, s in ok)))
    print('no logo:', miss)


if __name__ == '__main__':
    main()
