#!/usr/bin/env python3
"""Генератор сайта ukraine-tv.uk: каналы, главная, категории, статика, sitemap — на uk / en / ru.
Источник правды: data/channels.json + tools/texts.py + tools/i18n.py. Запуск: python3 tools/build.py
Идемпотентен: повторный запуск без изменений данных не меняет файлы (lastmod берётся из data/lastmod.json)."""
import json, os, re, sys, html, hashlib, datetime
sys.path.insert(0, os.path.dirname(__file__))
from i18n import *            # noqa
import texts
import countries as CO
import blog as BLOG

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = 'https://ukraine-tv.uk'
TG = 'https://t.me/UkraineTVHub'
TG_APP = 'https://t.me/UkraineTVHub_bot'
CONTACT = 'dyaltd@gmail.com'
OG_IMAGE = DOMAIN + '/og-image.jpg'
TODAY = datetime.date.today().isoformat()
TG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.66 7.85c-.12.53-.44.66-.89.41l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.5.24l.18-2.51 4.57-4.13c.2-.17-.04-.27-.31-.1l-5.65 3.56-2.43-.76c-.62-.19-.63-.62.13-.92l8.96-3.46c.52-.19 1 .13.84.93z"/></svg>'
POPULAR = ['pershyi', 'inter', 'oneplusone', 'kvartal', 'channel5', 'espreso']
ASSET_V = '3'
esc = html.escape
written = {}       # abs path -> content (для sitemap и записи)
pages = []         # (lang-agnostic key, {lang: path}) для sitemap


# ───────────────────────── данные ─────────────────────────
reg = json.load(open(os.path.join(ROOT, 'data/channels.json'), encoding='utf-8'))
CH = []
for c in reg['channels']:
    cat = GROUP_TO_CAT[reg['groups'].index(c['group'])]
    if c['id'] == 'marafon':
        cat = 'news'
    nm, tg, ab = texts.NAMES[c['id']], texts.TAGLINE[c['id']], texts.ABOUT[c['id']]
    logo = '/assets/logos/%s.png' % c['id'] if os.path.exists(os.path.join(ROOT, 'assets/logos/%s.png' % c['id'])) else None
    CH.append(dict(id=c['id'], slug=c['slug'], logo=logo, cat=cat, icon=c['icon'], color=c['color'], bg=c['iconBg'],
                   name=dict(zip(LANGS, nm)), tag=dict(zip(LANGS, tg)), about=dict(zip(LANGS, ab))))
CAT_ORDER = list(CATS)
CH.sort(key=lambda c: CAT_ORDER.index(c['cat']))   # стабильная сортировка сохраняет порядок внутри категории
N = len(CH)
BY_ID = {c['id']: c for c in CH}
REMOVED = [r['slug'] for r in reg.get('removed', [])]


def p(lang, slug=''):
    """путь страницы: p('en','ntn-live') -> /en/ntn-live/"""
    return (PREFIX[lang] + '/' + slug + '/').replace('//', '/') if slug else (PREFIX[lang] + '/')


def ab(path):
    return DOMAIN + path


def put(path, content):
    written[path] = content


def jld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '</script>'


# ───────────────────────── общие блоки ─────────────────────────
def head(lang, title, desc, alts, extra='', xdefault='uk', og=None, robots='index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', og_type='website'):
    s = S[lang]
    canon = alts[lang]
    hl = ''.join('<link rel="alternate" hreflang="%s" href="%s"/>\n  ' % (l, ab(alts[l])) for l in LANGS if l in alts)
    if xdefault in alts:
        hl += '<link rel="alternate" hreflang="x-default" href="%s"/>' % ab(alts[xdefault])
    return f'''<!DOCTYPE html>
<html lang="{HTML_LANG[lang]}" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}"/>
  <meta name="robots" content="{robots}"/>
  <link rel="canonical" href="{ab(canon)}"/>
  {hl}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  <meta name="theme-color" content="#005BBB"/>
  <meta name="google-site-verification" content="Pks9QUQKaCCYB4X-kCuaEZKaO2iLILr3aABfVFeoegU"/>
  <meta name="yandex-verification" content="2380544e518b1e3a"/>
  <meta property="og:type" content="{og_type}"/>
  <meta property="og:site_name" content="{esc(s['site'])}"/>
  <meta property="og:title" content="{esc(title)}"/>
  <meta property="og:description" content="{esc(desc)}"/>
  <meta property="og:url" content="{ab(canon)}"/>
  <meta property="og:locale" content="{OG_LOCALE[lang]}"/>
  <meta property="og:image" content="{og or OG_IMAGE}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="{esc(title)}"/>
  <meta name="twitter:description" content="{esc(desc)}"/>
  <meta name="twitter:image" content="{og or OG_IMAGE}"/>
  {extra}
  <link rel="preload" href="/assets/fonts/inter-cyrillic.woff2" as="font" type="font/woff2" crossorigin/>
  <style>@font-face{{font-family:"Inter";font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/inter-cyrillic.woff2) format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}}@font-face{{font-family:"Inter";font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/inter-cyrillic-ext.woff2) format("woff2");unicode-range:U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F}}@font-face{{font-family:"Inter";font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/inter-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}}@font-face{{font-family:"Inter";font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/inter-latin-ext.woff2) format("woff2");unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF}}</style>
  <link rel="stylesheet" href="/assets/site.css?v={ASSET_V}"/>
  <script defer src="/assets/consent.js?v={ASSET_V}"></script>
</head>'''


def header(lang, alts, back=True):
    s = S[lang]
    sw = ''.join('<a href="%s"%s>%s</a>' % (alts.get(l, p(l)), ' class="active"' if l == lang else '', LABEL[l]) for l in LANGS)
    nav = '<nav><a href="%s">%s</a></nav>' % (p(lang), s['nav_all']) if back else '<nav></nav>'
    return f'''<header>
  <a href="{p(lang)}" class="logo"><span class="logo-flag">🇺🇦</span><span class="logo-text"><span class="r">{s['logo'][0]}</span></span><span class="b">{s['logo'][1]}</span></a>
  {nav}
  <div class="h-right">
    <a href="{TG}" target="_blank" rel="noopener" class="tg-btn">{TG_SVG}<span>{s['subscribe']}</span></a>
    <div class="lang-switch">{sw}</div>
  </div>
</header>'''


def footer(lang):
    s = S[lang]
    return f'''<footer>
  <div class="footer-inner">
    <div>
      <div class="footer-logo">🇺🇦 <span style="color:#FFD500">{s['logo'][0]}</span> <span style="color:#2f7de1">{s['logo'][1]}</span></div>
      <div class="footer-copy" style="margin-top:4px">© {datetime.date.today().year} · {s['footer_tag']}</div>
    </div>
    <div class="footer-links">
      <a href="{p(lang)}">{s['f_all']}</a>
      <a href="{CO.HUB[lang]}">{CO.C[lang]['breadcrumb_hub']}</a>
      <a href="{p(lang, 'about')}">{s['f_about']}</a>
      <a href="{p(lang, 'privacy')}">{s['f_priv']}</a>
      <a href="{p(lang, 'advertising')}">{s['f_adv']}</a>
      <a href="{p(lang, 'blog')}">{BLOG_LABEL[lang]}</a>
      <a href="#" data-cookie-settings>{s['f_cookie']}</a>
    </div>
    <div class="footer-tg"><a href="{TG}" target="_blank" rel="noopener">{TG_SVG} {s['subscribe']} @UkraineTVHub</a></div>
  </div>
  <div style="text-align:center;margin-top:16px;font-size:11px;color:var(--muted2)">{s['f_note']}</div>
  <div class="legal-note" style="text-align:center;margin:10px auto 0;max-width:760px;padding:0 12px;font-size:11px;line-height:1.5;color:#8b8ba0">{s['f_legal'].format(priv=p(lang, 'privacy'))}</div>
</footer>'''


def icon_html(c, cls):
    if c.get('logo'):  # логотип на светлой плитке; при ошибке загрузки — текстовая иконка
        return ('<div class="%s lg"><img src="%s?v=%s" alt="" loading="lazy" decoding="async" onerror="var d=this.parentNode;d.className=d.className.replace(\' lg\',\'\');d.style.cssText=\'background:%s;color:%s\';d.textContent=\'%s\'"></div>'
                % (cls, c['logo'], ASSET_V, c['bg'], c['color'], esc(c['icon']).replace("'", '')))
    return '<div class="%s" style="background:%s;color:%s">%s</div>' % (cls, c['bg'], c['color'], esc(c['icon']))


def sidebar(lang, cur):
    out = []
    for cat in CAT_ORDER:
        items = [c for c in CH if c['cat'] == cat]
        if not items:
            continue
        out.append('<div class="cat-label-s">%s %s</div>' % (CAT_EMOJI[cat], esc(CATS[cat][lang][0])))
        for c in items:
            nm = esc(c['name'][lang])
            out.append('<a href="%s" class="ch-item-s%s" data-name="%s" aria-label="%s">%s<div><div class="ch-name-s">%s</div><div class="ch-desc-s">%s</div></div><div class="live-dot-s"></div></a>'
                       % (p(lang, c['slug']), ' active' if c['id'] == cur['id'] else '', nm, nm, icon_html(c, 'ch-icon-s'), nm, esc(c['tag'][lang])))
    return '\n'.join(out)


def similar(cur):
    same = [c for c in CH if c['cat'] == cur['cat']]
    i = next(k for k, c in enumerate(same) if c['id'] == cur['id'])
    ring = same[i + 1:] + same[:i]
    rest = [c for c in CH if c['cat'] != cur['cat']]
    return (ring + rest)[:4]


# ───────────────────────── страница канала ─────────────────────────
def channel_page(lang, c):
    s, js = S[lang], JS[lang]
    name = c['name'][lang]
    alts = {l: p(l, c['slug']) for l in LANGS}
    cat_name, cat_slug = CATS[c['cat']][lang]
    title = s['ch_title'].format(name=name)
    desc = s['ch_desc'].format(name=name, tag_l=c['tag'][lang][0].lower() + c['tag'][lang][1:])
    faq = [(q.format(name=name, slug=c['slug']), a.format(name=name, slug=c['slug'])) for q, a in s['faq']]
    graph = [
        {'@type': 'WebPage', '@id': ab(alts[lang]), 'url': ab(alts[lang]), 'name': title, 'description': desc, 'inLanguage': IN_LANG[lang], 'isPartOf': {'@id': DOMAIN + '/#website'}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': s['home'], 'item': ab(p(lang))},
            {'@type': 'ListItem', 'position': 2, 'name': cat_name, 'item': ab(p(lang, cat_slug))},
            {'@type': 'ListItem', 'position': 3, 'name': name, 'item': ab(alts[lang])}]},
        {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faq]},
    ]
    sim = ''.join('<a href="%s" class="sim-item">%s<div><div class="sim-name">%s</div><div class="sim-cat">%s</div></div><span class="sim-live">LIVE</span></a>\n'
                  % (p(lang, x['slug']), icon_html(x, 'sim-icon'), esc(x['name'][lang]), esc(CATS[x['cat']][lang][0])) for x in similar(c))
    pop = ''.join('<a href="%s" class="pop-item">%s<span class="pop-name">%s</span><span class="pop-live">LIVE</span></a>\n      '
                  % (p(lang, BY_ID[x]['slug']), icon_html(BY_ID[x], 'pop-icon'), esc(BY_ID[x]['name'][lang])) for x in POPULAR if x in BY_ID)
    faq_html = ''.join('<details><summary>%s <span>▾</span></summary><p>%s</p></details>\n      ' % (esc(q), esc(a)) for q, a in faq)
    cfg = json.dumps({'id': c['id'], 'name': name, 'slug': c['slug'], 'lang': lang, 't': js}, ensure_ascii=False)
    body = f'''<body>
{header(lang, alts)}

<div class="breadcrumb">
  <a href="{p(lang)}">{s['home']}</a><span>›</span>
  <a href="{p(lang, cat_slug)}">{esc(cat_name)}</a><span>›</span>
  <span>{esc(name)}</span>
</div>

<div class="page-title-wrap">
  <h1>{esc(s['ch_h1'].format(name=name))}</h1>
  <div class="channel-meta">
    <span class="cat-badge">{esc(cat_name)}</span>
    <span class="live-badge"><span class="live-dot"></span>{s['live']}</span>
    <span>{s['live_247']}</span>
  </div>
</div>

<a href="{p(lang)}" class="all-channels-cta"><span class="all-channels-cta-icon">📺</span><span class="all-channels-cta-text">{esc(s['all_ch'].format(cn=cn(lang, N)))}</span><span class="all-channels-cta-arrow">→</span></a>

<div class="page-wrap">

  <aside class="left-sidebar">
    <div class="sidebar-search-wrap">
      <span class="s-icon">🔍</span>
      <input type="text" id="ch-search" placeholder="{esc(s['search'])}">
    </div>
    <div class="ch-list-scroll" id="ch-list">
{sidebar(lang, c)}
    </div>
  </aside>

  <div class="main-col">
    <a href="{TG}" target="_blank" rel="noopener" class="tg-banner-desk"><div class="tg-banner-desk-icon">{TG_SVG}</div><div class="tg-banner-desk-text">{s['tg_banner']}</div><span class="tg-banner-desk-arrow">→</span></a>

    <div class="player-wrap" id="player-wrap">
      <video id="video" playsinline webkit-playsinline></video>
      <div class="player-overlay" id="overlay">
        {('<img class="ov-logo" src="%s?v=%s" alt="" width="120" height="60">' % (c['logo'], ASSET_V)) if c.get('logo') else ''}
        <div class="play-btn">▶</div>
        <div style="color:var(--muted);font-size:14px">{esc(s['watch_prompt'].format(name=name))}</div>
      </div>
      <button class="fs-btn" id="fs-btn" title="Fullscreen">⛶</button>
    </div>

    <a href="{TG_APP}" target="_blank" rel="noopener" class="tg-pulse-banner"><div class="tg-pulse-icon">{TG_SVG}</div><div class="tg-pulse-text">{s['tg_pulse']}</div><span class="tg-pulse-arrow">→</span></a>
    <div class="player-status" id="status">{s['status_idle']}</div>
    <div class="epg-box" id="epg-box">
      <div class="epg-head"><h3>{s['epg_h']}</h3><span class="epg-updated" id="epg-updated"></span></div>
      <div class="epg-current" id="epg-current" style="display:none">
        <div class="epg-current-label" id="epg-current-label"></div>
        <div class="epg-current-title" id="epg-current-title"></div>
        <div class="epg-progress"><div class="epg-progress-bar" id="epg-progress-bar" style="width:0%"></div></div>
        <div class="epg-current-time"><span id="epg-time-start"></span><span id="epg-time-left"></span><span id="epg-time-stop"></span></div>
      </div>
      <div class="epg-list" id="epg-list"></div>
    </div>

    <div class="tg-card tg-card-mob">
      <div class="tg-card-live"><span class="tg-card-live-dot"></span>{s['live']} · {s['live_247']}</div>
      <h3>{s['tg_card_h']}</h3>
      <p>{esc(s['tg_card_p'].format(cn=cn(lang, N)))}</p>
      <a href="{TG}" target="_blank" rel="noopener" class="tg-btn-card" style="gap:8px">{TG_SVG} {s['tg_card_btn']}</a>
    </div>

    <div class="desc-box">
      <h2>{esc(s['about_h'].format(name=name))}</h2>
      <div class="cat-tag-wrap"><a href="{p(lang, cat_slug)}" class="cat-tag">{CAT_EMOJI[c['cat']]} {esc(cat_name)}</a></div>
      <p>{esc(c['about'][lang])}</p>
      <p>{esc(s['ch_p2'].format(name=name))}</p>
    </div>

    <div class="faq-box">
      <h2>{esc(s['faq_h'].format(name=name))}</h2>
      {faq_html}
    </div>
  </div>

<div class="related-section">
    <div class="sim-box">
      <h3>{s['similar']}</h3>
{sim}    </div>

    <div class="pop-box">
      <div class="pop-title">{s['popular']}</div>
      {pop}    </div>
</div>
</div>

{footer(lang)}

<script>window.UTV={cfg};</script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.15/hls.min.js"></script>
<script defer src="/assets/quality.js?v={ASSET_V}"></script>
<script defer src="/assets/player.js?v={ASSET_V}"></script>
<script defer src="/assets/site-ux.js?v={ASSET_V}"></script>
<script defer src="/assets/player-ui.js?v={ASSET_V}"></script>
<script defer src="/assets/cast.js?v={ASSET_V}"></script>
</body>
</html>
'''
    extra = '<link rel="preconnect" href="https://ukraine-stream-a.dyaltd.workers.dev" crossorigin/>\n  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com"/>\n  ' + jld({'@context': 'https://schema.org', '@graph': graph})
    og = DOMAIN + '/assets/og/' + ('' if lang == 'uk' else lang + '/') + c['slug'] + '.jpg'
    return head(lang, title, desc, alts, extra, og=og if os.path.exists(os.path.join(ROOT, og.replace(DOMAIN, '').lstrip('/'))) else None) + '\n' + body


# ───────────────────────── главная и категории ─────────────────────────
def cards(lang, items):
    return '\n'.join('<a href="%s" class="card" data-name="%s">%s<div><div class="nm">%s</div><div class="ds">%s</div></div><span class="lv"></span></a>'
                     % (p(lang, c['slug']), esc(c['name'][lang]), icon_html(c, 'ico'), esc(c['name'][lang]), esc(c['tag'][lang])) for c in items)


SEARCH_JS = '''<script>(function(){var i=document.getElementById('home-q');if(!i)return;i.addEventListener('input',function(){var q=this.value.toLowerCase();document.querySelectorAll('.card').forEach(function(c){c.style.display=(!q||c.dataset.name.toLowerCase().indexOf(q)>-1)?'':'none'});document.querySelectorAll('.grid').forEach(function(g){var h=g.previousElementSibling,any=false;g.querySelectorAll('.card').forEach(function(c){if(c.style.display!=='none')any=true});g.style.display=any?'':'none';if(h&&h.classList.contains('cat-h'))h.style.display=any?'':'none'})})})();</script>'''


def home_page(lang):
    s = S[lang]
    alts = {l: p(l) for l in LANGS}
    title, desc = s['home_title'].format(cn=cn(lang, N)), s['home_desc'].format(cn=cn(lang, N))
    tabs = '<a href="#top" class="on">%s</a>' % s['all_tab'] + ''.join('<a href="#cat-%s">%s %s</a>' % (cat, CAT_EMOJI[cat], esc(CATS[cat][lang][0])) for cat in CAT_ORDER if any(c['cat'] == cat for c in CH))
    sections = ''
    for cat in CAT_ORDER:
        items = [c for c in CH if c['cat'] == cat]
        if items:
            sections += '<h2 class="cat-h" id="cat-%s"><a href="%s">%s %s</a> <span>%s</span></h2>\n<div class="grid">\n%s\n</div>\n' % (cat, p(lang, CATS[cat][lang][1]), CAT_EMOJI[cat], esc(CATS[cat][lang][0]), s['ch_count'].format(cn=cn(lang, len(items))), cards(lang, items))
    faq = [(q, a.format(cn=cn(lang, N))) for q, a in s['home_faq']]
    faq_html = ''.join('<details><summary>%s <span>▾</span></summary><p>%s</p></details>\n' % (esc(q), esc(a)) for q, a in faq)
    graph = [
        {'@type': 'WebSite', '@id': DOMAIN + '/#website', 'url': DOMAIN + '/', 'name': s['site'], 'inLanguage': IN_LANG[lang]},
        {'@type': 'Organization', '@id': DOMAIN + '/#org', 'name': s['site'], 'url': DOMAIN + '/', 'sameAs': [TG]},
        {'@type': 'CollectionPage', 'url': ab(alts[lang]), 'name': title, 'description': desc, 'inLanguage': IN_LANG[lang], 'isPartOf': {'@id': DOMAIN + '/#website'}},
        {'@type': 'ItemList', 'numberOfItems': N, 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': c['name'][lang], 'url': ab(p(lang, c['slug']))} for i, c in enumerate(CH)]},
        {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faq]},
    ]
    body = f'''<body id="top">
{header(lang, alts, back=False)}
<div class="hero"><h1>{esc(s['home_h1'])}</h1><p class="lead">{esc(s['home_lead'].format(cn=cn(lang, N)))}</p></div>
<div class="tabs" role="navigation">{tabs}</div>
<div class="home-search"><input id="home-q" type="search" placeholder="{esc(s['search'])}" aria-label="{esc(s['search'])}"/></div>
{sections}
<div class="home-box"><h2>{esc(s['site'])}</h2><p>{esc(s['home_intro'])}</p></div>
<div class="faq-box home-box" id="faq"><h2>{s['faq_h_home']}</h2>
{faq_html}</div>
<br/>
{footer(lang)}
{SEARCH_JS}
</body>
</html>
'''
    return head(lang, title, desc, alts, jld({'@context': 'https://schema.org', '@graph': graph})) + '\n' + body


def category_page(lang, cat):
    s = S[lang]
    name, slug = CATS[cat][lang]
    alts = {l: p(l, CATS[cat][l][1]) for l in LANGS}
    items = [c for c in CH if c['cat'] == cat]
    title, desc = s['cat_title'].format(cat=name), CAT_DESC[cat][lang]
    graph = [
        {'@type': 'CollectionPage', 'url': ab(alts[lang]), 'name': title, 'description': desc, 'inLanguage': IN_LANG[lang], 'isPartOf': {'@id': DOMAIN + '/#website'}},
        {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': s['home'], 'item': ab(p(lang))}, {'@type': 'ListItem', 'position': 2, 'name': name, 'item': ab(alts[lang])}]},
        {'@type': 'ItemList', 'numberOfItems': len(items), 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': c['name'][lang], 'url': ab(p(lang, c['slug']))} for i, c in enumerate(items)]},
    ]
    others = ' '.join('<a href="%s"%s>%s %s</a>' % (p(lang, CATS[k][lang][1]), ' class="on"' if k == cat else '', CAT_EMOJI[k], esc(CATS[k][lang][0])) for k in CAT_ORDER if any(c['cat'] == k for c in CH))
    body = f'''<body>
{header(lang, alts)}
<div class="breadcrumb"><a href="{p(lang)}">{s['home']}</a><span>›</span><span>{esc(name)}</span></div>
<div class="hero"><h1>{esc(s['cat_h1'].format(cat=name))}</h1><p class="lead">{esc(desc)}</p></div>
<div class="tabs"><a href="{p(lang)}">{s['all_tab']}</a>{others}</div>
<div class="grid" style="padding-top:16px">
{cards(lang, items)}
</div>
<br/>
{footer(lang)}
</body>
</html>
'''
    return head(lang, title, desc, alts, jld({'@context': 'https://schema.org', '@graph': graph})) + '\n' + body


# ───────────────────────── статические страницы ─────────────────────────
STATIC = {
 'about': {
  'uk': ('Про сайт', 'Україна ТВ — безкоштовний сервіс перегляду українських телеканалів онлайн', [
      ('h2', 'Що це за сайт'), ('p', 'Україна ТВ збирає в одному місці українські телеканали, що доступні в прямому ефірі у відкритому доступі: новини, кіно, серіали, музика, дитячі, регіональні та тематичні канали. Перегляд безкоштовний, реєстрація не потрібна.'),
      ('h2', 'Як це працює'), ('p', 'Сайт не зберігає і не розповсюджує відео. Плеєр підключається до відкритих потоків, які надають треті сторони. Ті самі канали доступні в Telegram-застосунку @UkraineTVHub_bot.'),
      ('h2', 'Зворотний зв\'язок'), ('p', 'Питання, пропозиції каналів, повідомлення про проблеми: ' + CONTACT + ' або Telegram ' + TG + '.')]),
  'en': ('About', 'Ukraine TV — a free service for watching Ukrainian TV channels online', [
      ('h2', 'What this site is'), ('p', 'Ukraine TV brings Ukrainian TV channels that are openly available live into one place: news, movies, series, music, kids\', regional and themed channels. Watching is free and no registration is needed.'),
      ('h2', 'How it works'), ('p', 'The site does not store or distribute video. The player connects to open streams provided by third parties. The same channels are available in the Telegram app @UkraineTVHub_bot.'),
      ('h2', 'Contact'), ('p', 'Questions, channel suggestions, problem reports: ' + CONTACT + ' or Telegram ' + TG + '.')]),
  'ru': ('О сайте', 'Украина ТВ — бесплатный сервис просмотра украинских телеканалов онлайн', [
      ('h2', 'Что это за сайт'), ('p', 'Украина ТВ собирает в одном месте украинские телеканалы, доступные в прямом эфире в открытом доступе: новости, кино, сериалы, музыка, детские, региональные и тематические каналы. Просмотр бесплатный, регистрация не нужна.'),
      ('h2', 'Как это работает'), ('p', 'Сайт не хранит и не распространяет видео. Плеер подключается к открытым потокам, которые предоставляют третьи стороны. Те же каналы доступны в Telegram-приложении @UkraineTVHub_bot.'),
      ('h2', 'Обратная связь'), ('p', 'Вопросы, предложения каналов, сообщения о проблемах: ' + CONTACT + ' или Telegram ' + TG + '.')]),
 },
 'privacy': {
  'uk': ('Конфіденційність', 'Політика конфіденційності — Україна ТВ', [
      ('h2', 'Які дані ми обробляємо'), ('p', 'Сайт не вимагає реєстрації і не збирає персональних даних напряму. Для аналітики використовуються Google Analytics (GA4) та Microsoft Clarity: вони можуть записувати технічні дані візиту (сторінки, тип пристрою, приблизну країну) за допомогою файлів cookie. Вони вмикаються лише після вашої згоди; змінити вибір можна за посиланням «Налаштування cookie» внизу сторінки.'),
      ('h2', 'Третя сторона'), ('p', 'Потоки каналів надають треті сторони; під час перегляду ваш браузер звертається до їхніх серверів і серверів Cloudflare, через які ми віддаємо плейлисти.'),
      ('h2', 'Cookie'), ('p', 'Ви можете вимкнути або видалити cookie в налаштуваннях браузера; сайт продовжить працювати.'),
      ('h2 id="rightsholders"', 'Правовласникам'), ('p', 'Посилання на трансляції взято з відкритих джерел; сайт не зберігає відео. Якщо ви правовласник і вважаєте, що трансляцію не слід показувати на сайті, надішліть звернення на ' + CONTACT + ' із підтвердженням прав і вказівкою адреси сторінки — ми розглянемо його і за потреби приберемо канал.')]),
  'en': ('Privacy', 'Privacy policy — Ukraine TV', [
      ('h2', 'What data we process'), ('p', 'The site requires no registration and does not directly collect personal data. For analytics we use Google Analytics (GA4) and Microsoft Clarity, which may record technical visit data (pages, device type, approximate country) using cookies. They are enabled only after you consent; you can change your choice with the "Cookie settings" link at the bottom of the page.'),
      ('h2', 'Third parties'), ('p', 'Channel streams are provided by third parties; while you watch, your browser contacts their servers and the Cloudflare servers through which we serve playlists.'),
      ('h2', 'Cookies'), ('p', 'You can disable or delete cookies in your browser settings; the site keeps working.'),
      ('h2 id="rightsholders"', 'Rights holders'), ('p', 'Stream links are taken from open sources; the site does not store video. If you are a rights holder and believe a stream should not be shown on the site, send a request to ' + CONTACT + ' with proof of ownership and the page address — we will review it and remove the channel if needed.')]),
  'ru': ('Конфиденциальность', 'Политика конфиденциальности — Украина ТВ', [
      ('h2', 'Какие данные мы обрабатываем'), ('p', 'Сайт не требует регистрации и не собирает персональные данные напрямую. Для аналитики используются Google Analytics (GA4) и Microsoft Clarity: они могут записывать технические данные визита (страницы, тип устройства, примерную страну) с помощью файлов cookie. Они включаются только после вашего согласия; изменить выбор можно по ссылке «Настройки cookie» внизу страницы.'),
      ('h2', 'Третьи стороны'), ('p', 'Потоки каналов предоставляют третьи стороны; при просмотре ваш браузер обращается к их серверам и к серверам Cloudflare, через которые мы отдаём плейлисты.'),
      ('h2', 'Cookie'), ('p', 'Вы можете отключить или удалить cookie в настройках браузера; сайт продолжит работать.'),
      ('h2 id="rightsholders"', 'Правообладателям'), ('p', 'Ссылки на трансляции взяты из открытых источников; сайт не хранит видео. Если вы правообладатель и считаете, что трансляцию не следует показывать на сайте, отправьте обращение на ' + CONTACT + ' с подтверждением прав и адресом страницы — мы рассмотрим его и при необходимости уберём канал.')]),
 },
}

STATIC['advertising'] = {
  'uk': ('Реклама на сайті', 'Реклама на Україна ТВ — співпраця та розміщення', [
      ('h2', 'Аудиторія'), ('p', 'Україна ТВ — безкоштовний сайт і Telegram-застосунок для перегляду українських телеканалів онлайн. Аудиторія — українці в Україні та за кордоном, яких цікавлять новини, кіно, музика та дитячий контент.'),
      ('h2', 'Формати'), ('p', 'Банери на сторінках каналів і головній, нативні згадки в Telegram-каналі @UkraineTVHub, спонсорство тематичних добірок. Конкретні формати та ціни узгоджуємо індивідуально.'),
      ('h2', 'Як зв\'язатися'), ('p', 'Напишіть на ' + CONTACT + ' або в Telegram ' + TG + ' — вкажіть компанію, формат і бажаний період.')]),
  'en': ('Advertising', 'Advertise on Ukraine TV — partnerships and placements', [
      ('h2', 'Audience'), ('p', 'Ukraine TV is a free website and Telegram app for watching Ukrainian TV channels online. Our audience is Ukrainians at home and abroad interested in news, movies, music and kids\' content.'),
      ('h2', 'Formats'), ('p', 'Banners on channel pages and the home page, native mentions in the Telegram channel @UkraineTVHub and sponsorship of themed selections. Specific formats and prices are agreed individually.'),
      ('h2', 'Contact'), ('p', 'Write to ' + CONTACT + ' or on Telegram ' + TG + ' — include your company, the format and the preferred period.')]),
  'ru': ('Реклама на сайте', 'Реклама на Украина ТВ — сотрудничество и размещение', [
      ('h2', 'Аудитория'), ('p', 'Украина ТВ — бесплатный сайт и Telegram-приложение для просмотра украинских телеканалов онлайн. Аудитория — украинцы в Украине и за рубежом, которых интересуют новости, кино, музыка и детский контент.'),
      ('h2', 'Форматы'), ('p', 'Баннеры на страницах каналов и главной, нативные упоминания в Telegram-канале @UkraineTVHub, спонсорство тематических подборок. Конкретные форматы и цены согласуем индивидуально.'),
      ('h2', 'Как связаться'), ('p', 'Напишите на ' + CONTACT + ' или в Telegram ' + TG + ' — укажите компанию, формат и желаемый период.')]),
}


def static_page(lang, key):
    s = S[lang]
    h1, desc, blocks = STATIC[key][lang]
    alts = {l: p(l, key) for l in LANGS}
    inner = ''.join('<%s>%s</%s>' % (t, esc(x), t.split(' ')[0]) if t != 'p' else '<p>%s</p>' % esc(x) for t, x in blocks)
    inner = re.sub(r'(https://t\.me/[A-Za-z0-9_]+)', r'<a href="\1">\1</a>', inner)
    inner = inner.replace(CONTACT, '<a href="mailto:%s">%s</a>' % (CONTACT, CONTACT))
    title = '%s — %s' % (h1, s['site'])
    body = f'''<body>
{header(lang, alts)}
<main class="static"><h1>{esc(h1)}</h1>{inner}</main>
{footer(lang)}
</body>
</html>
'''
    return head(lang, title, desc, alts) + '\n' + body


BLOG_LABEL = {'uk': 'Блог', 'en': 'Blog', 'ru': 'Блог'}


def _blocks(blocks):
    out = ''
    for t_, x in blocks:
        if t_ in ('ul', 'ol'):
            out += '<%s>%s</%s>' % (t_, ''.join('<li>%s</li>' % esc(i) for i in x), t_)
        else:
            out += '<%s>%s</%s>' % (t_, esc(x), t_)
    out = re.sub(r'(?<![A-Za-z0-9@])@([A-Za-z0-9_]{5,})', r'<a href="https://t.me/\1">@\1</a>', out)
    return out.replace(CONTACT, '<a href="mailto:%s">%s</a>' % (CONTACT, CONTACT))


def blog_index(lang):
    s = S[lang]
    h1, title, desc = BLOG.INDEX[lang]
    alts = {l: p(l, 'blog') for l in LANGS}
    items = ''.join('<li><a href="%s">%s</a><p>%s</p></li>' % (p(lang, 'blog/' + a['slug']), esc(a['title'][lang]), esc(a['desc'][lang])) for a in BLOG.ARTICLES)
    ld = jld({'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': title, 'url': ab(p(lang, 'blog'))})
    return head(lang, title, desc, alts, extra=ld) + '\n' + f'''<body>
{header(lang, alts)}
<main class="static"><h1>{esc(h1)}</h1><ul class="blog-list">{items}</ul></main>
{footer(lang)}
</body>
</html>
'''


def blog_article(lang, a):
    s = S[lang]
    alts = {l: p(l, 'blog/' + a['slug']) for l in LANGS}
    h1 = a['title'][lang]
    ld = jld({'@context': 'https://schema.org', '@type': 'Article', 'headline': h1, 'description': a['desc'][lang], 'inLanguage': lang,
              'datePublished': BLOG.DATE, 'dateModified': BLOG.DATE, 'mainEntityOfPage': ab(p(lang, 'blog/' + a['slug'])),
              'author': {'@type': 'Organization', 'name': s['site']}, 'publisher': {'@type': 'Organization', 'name': s['site'], 'url': DOMAIN + '/'}})
    bc = jld({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': s['site'], 'item': ab(p(lang))},
        {'@type': 'ListItem', 'position': 2, 'name': BLOG_LABEL[lang], 'item': ab(p(lang, 'blog'))},
        {'@type': 'ListItem', 'position': 3, 'name': h1, 'item': ab(p(lang, 'blog/' + a['slug']))}]})
    return head(lang, '%s — %s' % (h1, s['site']), a['desc'][lang], alts, extra=ld + bc, og_type='article') + '\n' + f'''<body>
{header(lang, alts)}
<main class="static"><p><a href="{p(lang, 'blog')}">&larr; {BLOG_LABEL[lang]}</a></p><h1>{esc(h1)}</h1>{_blocks(a['body'][lang])}</main>
{footer(lang)}
</body>
</html>
'''


def not_found():
    s = S['uk']
    alts = {'uk': '/404.html'}
    h = head('uk', s['not_found_h'] + ' — ' + s['site'], s['not_found_p'], alts, robots='noindex, follow')
    h = h.replace('<link rel="alternate" hreflang="uk" href="https://ukraine-tv.uk/404.html"/>\n  ', '').replace('<link rel="alternate" hreflang="x-default" href="https://ukraine-tv.uk/404.html"/>', '')
    return h + f'''
<body>
{header('uk', {'uk': '/', 'en': '/en/', 'ru': '/ru/'}, back=False)}
<main class="static"><h1>{s['not_found_h']}</h1><p>{s['not_found_p']}</p><p><a href="/">{s['f_all']}</a> · <a href="/en/">English</a> · <a href="/ru/">Русский</a></p></main>
{footer('uk')}
</body>
</html>
'''


def redirect_stub(target):
    t = ab(target)
    return f'''<!DOCTYPE html>
<html lang="uk"><head><meta charset="UTF-8"/><title>Redirect</title><link rel="canonical" href="{t}"/><meta http-equiv="refresh" content="0; url={target}"/><meta name="robots" content="noindex, follow"/></head>
<body><p><a href="{target}">{t}</a></p><script>location.replace({json.dumps(target)});</script></body></html>
'''



# ───────────────────────── страницы стран ─────────────────────────
COUNTRY_CHANNELS = ['pershyi', 'inter', 'oneplusone', 'kvartal', 'channel5', 'espreso', 'ntn', 'marafon', 'nikikids', 'muzvar']


def cname(lang, co):
    return co['en'].replace('the ', '', 1) if lang == 'en' else co[lang]


def country_path(lang, co):
    return '/%s/' % co['slug_en'] if lang == 'en' else '/%s/' % co['slug_uk'] if lang == 'uk' else '/ru/%s/' % co['slug_ru']


def country_alts(co):
    return {l: country_path(l, co) for l in LANGS}


def kw(lang, co=None):
    c = {'cn': cn(lang, N), 'n': len(CO.COUNTRIES), 'site': S[lang]['site']}
    if co:
        c.update(country=co[lang], in_=co.get(lang + '_in', 'in ' + co['en']), tz=CO.TZ[co['tz']][lang])
    return c


def country_page(lang, co):
    s, c = S[lang], CO.C[lang]
    k = kw(lang, co)
    alts = country_alts(co)
    title = c['title'].format(**k) + ' | Ukraine-TV.uk'
    desc = c['desc'].format(**k)
    faq = [(q.format(**k), a.format(**k)) for q, a in c['faq']]
    chans = [BY_ID[i] for i in COUNTRY_CHANNELS if i in BY_ID][:8]
    others = ''.join('<a href="%s">%s</a>' % (country_path(lang, o), esc(cname(lang, o))) for o in CO.COUNTRIES if o['id'] != co['id'])
    graph = [
        {'@type': 'WebPage', '@id': ab(alts[lang]), 'url': ab(alts[lang]), 'name': title, 'description': desc, 'inLanguage': IN_LANG[lang], 'isPartOf': {'@id': DOMAIN + '/#website'}},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': s['home'], 'item': ab(p(lang))},
            {'@type': 'ListItem', 'position': 2, 'name': c['breadcrumb_hub'], 'item': ab(CO.HUB[lang])},
            {'@type': 'ListItem', 'position': 3, 'name': cname(lang, co), 'item': ab(alts[lang])}]},
        {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faq]},
    ]
    steps = ''.join('<li>%s</li>' % esc(t.format(**k)) for t in c['steps'])
    faq_html = ''.join('<details><summary>%s <span>▾</span></summary><p>%s</p></details>\n' % (esc(q), esc(a)) for q, a in faq)
    cats = ' '.join('<a href="%s">%s %s</a>' % (p(lang, CATS[x][lang][1]), CAT_EMOJI[x], esc(CATS[x][lang][0])) for x in CAT_ORDER if any(ch['cat'] == x for ch in CH))
    body = f'''<body>
{header(lang, alts, back=False)}
<div class="breadcrumb"><a href="{p(lang)}">{s['home']}</a><span>›</span><a href="{CO.HUB[lang]}">{esc(c['breadcrumb_hub'])}</a><span>›</span><span>{esc(cname(lang, co))}</span></div>
<div class="hero"><h1>{esc(c['h1'].format(**k))}</h1><p class="lead">{esc(c['lead'].format(**k))}</p></div>
<h2 class="cat-h">{esc(c['popular_h'].format(**k))}</h2>
<div class="grid">
{cards(lang, chans)}
</div>
<div class="tabs" style="padding-top:4px"><a href="{p(lang)}" class="on">{esc(c['all_cats'])}: {s['all_tab']}</a>{cats}</div>
<div class="home-box"><h2>{esc(c['how_h'].format(**k))}</h2><ol class="steps">{steps}</ol></div>
<div class="home-box"><h2>{esc(c['tz_h'])}</h2><p>{esc(c['tz_p'].format(**k))}</p></div>
<div class="faq-box home-box" id="faq"><h2>{esc(c['faq_h'])}</h2>
{faq_html}</div>
<div class="home-box"><h2>{esc(c['others_h'])}</h2><div class="others">{others}</div></div>
<br/>
{footer(lang)}
</body>
</html>
'''
    return head(lang, title, desc, alts, jld({'@context': 'https://schema.org', '@graph': graph}), xdefault='en') + '\n' + body


def hub_page(lang):
    s, c = S[lang], CO.C[lang]
    k = kw(lang)
    alts = dict(CO.HUB)
    title = c['hub_title'].format(**k) + ' | Ukraine-TV.uk'
    desc = c['hub_desc']
    graph = [
        {'@type': 'CollectionPage', 'url': ab(alts[lang]), 'name': title, 'description': desc, 'inLanguage': IN_LANG[lang], 'isPartOf': {'@id': DOMAIN + '/#website'}},
        {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': s['home'], 'item': ab(p(lang))}, {'@type': 'ListItem', 'position': 2, 'name': c['breadcrumb_hub'], 'item': ab(alts[lang])}]},
        {'@type': 'ItemList', 'numberOfItems': len(CO.COUNTRIES), 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': cname(lang, o), 'url': ab(country_path(lang, o))} for i, o in enumerate(CO.COUNTRIES)]},
    ]
    kk = lambda o: dict(kw(lang, o))
    cards_html = ''.join('<a class="hub-card" href="%s"><b>%s %s</b><span>%s</span></a>' % (country_path(lang, o), '', esc(cname(lang, o)), esc(c['card_p'].format(**kk(o)))) for o in CO.COUNTRIES)
    body = f'''<body>
{header(lang, alts, back=False)}
<div class="breadcrumb"><a href="{p(lang)}">{s['home']}</a><span>›</span><span>{esc(c['breadcrumb_hub'])}</span></div>
<div class="hero"><h1>{esc(c['hub_h1'])}</h1><p class="lead">{esc(c['hub_lead'])}</p></div>
<div class="hub-grid">{cards_html}</div>
<br/>
{footer(lang)}
</body>
</html>
'''
    return head(lang, title, desc, alts, jld({'@context': 'https://schema.org', '@graph': graph}), xdefault='en') + '\n' + body


# ───────────────────────── сборка ─────────────────────────
def main():
    for lang in LANGS:
        put(p(lang) + 'index.html', home_page(lang))
        for c in CH:
            put(p(lang, c['slug']) + 'index.html', channel_page(lang, c))
        for cat in CAT_ORDER:
            if any(c['cat'] == cat for c in CH):
                put(p(lang, CATS[cat][lang][1]) + 'index.html', category_page(lang, cat))
        for key in STATIC:
            put(p(lang, key) + 'index.html', static_page(lang, key))
        put(p(lang, 'blog') + 'index.html', blog_index(lang))
        for a in BLOG.ARTICLES:
            put(p(lang, 'blog/' + a['slug']) + 'index.html', blog_article(lang, a))
    for co in CO.COUNTRIES:
        for lang in LANGS:
            put(country_path(lang, co) + 'index.html', country_page(lang, co))
    for lang in LANGS:
        put(CO.HUB[lang] + 'index.html', hub_page(lang))
    put('/404.html', not_found())

    # редиректы: удалённые каналы и старые англ. категории
    for slug in REMOVED + ['ukraina24-live']:
        put('/' + slug + '/index.html', redirect_stub(p('uk')))
        put('/en/' + slug + '/index.html', redirect_stub(p('en')))
    old_cats = {'ukrainian-news-channels': 'news', 'ukrainian-entertainment-channels': 'entertainment', 'ukrainian-music-channels': 'music',
                'ukrainian-kids-channels': 'kids', 'ukrainian-regional-channels': 'regional', 'ukrainian-thematic-channels': 'thematic', 'ukrainian-public-broadcasting': 'public'}
    for slug, cat in old_cats.items():
        put('/' + slug + '/index.html', redirect_stub(p('en', CATS[cat]['en'][1])))

    # данные для мини-аппа (ukraine-tv-hub/tools/gen_app_channels.py)
    app = {'version': 1, 'groups': []}
    for cat in CAT_ORDER:
        items = [c for c in CH if c['cat'] == cat]
        if items:
            app['groups'].append({'cat': cat, 'emoji': CAT_EMOJI[cat], 'labels': {l: CATS[cat][l][0] for l in LANGS},
                                  'channels': [{'id': c['id'], 'name': c['name']['uk'], 'nameEn': c['name']['en'], 'nameRu': c['name']['ru'], 'icon': c['icon'],
                                                'color': c['color'], 'iconBg': c['bg'], 'slug': c['slug'], 'logo': (DOMAIN + c['logo']) if c.get('logo') else None} for c in items]})
    put('/data/app-channels.json', json.dumps(app, ensure_ascii=False, indent=1) + '\n')

    # proxy.json
    put('/proxy.json', json.dumps({'urls': ['https://ukraine-stream-a.dyaltd.workers.dev', 'https://ukraine-stream-b.dyaltd.workers.dev', 'https://ukraine-stream-c.dyaltd.workers.dev']}, indent=2) + '\n')
    put('/robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' % DOMAIN)

    # lastmod: меняется только если изменилось содержимое
    cache_path = os.path.join(ROOT, 'data/lastmod.json')
    cache = json.load(open(cache_path)) if os.path.exists(cache_path) else {}
    sm = []
    def lm(path, content):
        h = hashlib.sha1(content.encode('utf-8')).hexdigest()
        e = cache.get(path)
        if not e or e['hash'] != h:
            cache[path] = e = {'hash': h, 'date': TODAY}
        return e['date']
    keys = [(None, {'alts': dict(CO.HUB), 'xdef': 'en'})] + [(None, {'alts': country_alts(co), 'xdef': 'en'}) for co in CO.COUNTRIES] + [('', None)] + [(c['slug'], c) for c in CH] + [(CATS[cat]['uk'][1], cat) for cat in CAT_ORDER if any(c['cat'] == cat for c in CH)] + [(k, None) for k in STATIC] + [('blog', None)] + [('blog/' + a['slug'], None) for a in BLOG.ARTICLES]
    urls = []
    def alt_paths(entry):
        slug, obj = entry
        if isinstance(obj, dict) and 'alts' in obj:
            return obj['alts']
        if isinstance(obj, str):                       # категория
            return {l: p(l, CATS[obj][l][1]) for l in LANGS}
        return {l: p(l, slug) for l in LANGS}
    for entry in keys:
        alts = alt_paths(entry)
        for l in LANGS:
            path = alts[l]
            urls.append((path, alts, lm(path, written[path + 'index.html']), (entry[1] or {}).get('xdef', 'uk') if isinstance(entry[1], dict) else 'uk'))
    # прежние страницы вне генератора (страны и т.п.), если файл существует
    old = os.path.join(ROOT, 'sitemap.xml')
    gen = {u[0] for u in urls}
    stubs = {'/' + s_ + '/' for s_ in REMOVED + ['ukraina24-live']} | {'/en/' + s_ + '/' for s_ in REMOVED + ['ukraina24-live']} | {'/' + k + '/' for k in old_cats}
    extra = []
    if os.path.exists(old):
        for loc in re.findall(r'<loc>([^<]+)</loc>', open(old, encoding='utf-8').read()):
            path = loc.replace(DOMAIN, '')
            if path in gen or path in stubs or not path.endswith('/'):
                continue
            if os.path.exists(os.path.join(ROOT, path.strip('/'), 'index.html')) and ('-tv-' in path or 'tv-' in path):
                extra.append(path)
    out = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for path, alts, date, xdef in urls:
        out.append('  <url><loc>%s</loc><lastmod>%s</lastmod>' % (ab(path), date))
        for l in LANGS:
            out.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (l, ab(alts[l])))
        out.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>' % ab(alts[xdef]))
        out.append('  </url>')
    for path in sorted(set(extra)):
        out.append('  <url><loc>%s</loc></url>' % ab(path))
    out.append('</urlset>')
    put('/sitemap.xml', '\n'.join(out) + '\n')

    json.dump(cache, open(cache_path, 'w'), indent=0, sort_keys=True)
    changed = 0
    for path, content in written.items():
        full = os.path.join(ROOT, path.lstrip('/'))
        os.makedirs(os.path.dirname(full), exist_ok=True)
        if not os.path.exists(full) or open(full, encoding='utf-8').read() != content:
            open(full, 'w', encoding='utf-8').write(content); changed += 1
    print('pages: %d, written/changed: %d, sitemap urls: %d (+%d legacy)' % (len(written), changed, len(urls), len(set(extra))))


if __name__ == '__main__':
    main()
