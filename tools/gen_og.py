#!/usr/bin/env python3
"""Генерирует OG-картинки 1200×630 для каналов: assets/og/<slug>.jpg (uk), assets/og/en/<slug>.jpg, assets/og/ru/<slug>.jpg.
Нужен Pillow и шрифт с кириллицей (macOS: Arial Bold). Запуск: python3 tools/gen_og.py"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
import texts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = ['/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']
FONT = next(f for f in FONTS if os.path.exists(f))
W, H = 1200, 630
SUB = {'uk': ('ДИВИТИСЯ ОНЛАЙН БЕЗКОШТОВНО', 'ПРЯМИЙ ЕФІР'), 'en': ('WATCH ONLINE FREE', 'LIVE'), 'ru': ('СМОТРЕТЬ ОНЛАЙН БЕСПЛАТНО', 'ПРЯМОЙ ЭФИР')}
BRAND = {'uk': 'Україна ТВ', 'en': 'Ukraine TV', 'ru': 'Украина ТВ'}


def font(size):
    return ImageFont.truetype(FONT, size)


def bg():
    im = Image.new('RGB', (W, H), (8, 8, 16))
    d = ImageDraw.Draw(im)
    for y in range(H):   # вертикальный градиент синий -> тёмный
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(0 + 14 * t), int(40 - 26 * t), int(96 - 70 * t)))
    d.rectangle([0, H - 14, W, H], fill=(255, 213, 0))    # жёлтая полоса — флаг
    d.rectangle([0, H - 28, W, H - 14], fill=(0, 91, 187))
    return im


def fit_text(d, text, maxw, start):
    size = start
    while size > 28 and d.textlength(text, font=font(size)) > maxw:
        size -= 4
    return font(size)


def make(c, lang, out):
    im = bg(); d = ImageDraw.Draw(im)
    # плитка с логотипом или текстовой иконкой
    tile = (80, 110, 360, 360)
    d.rounded_rectangle([tile[0], tile[1], tile[0] + tile[2] - 80, tile[1] + 250], radius=36, fill=(244, 246, 251))
    box = (tile[0] + 20, tile[1] + 20, tile[0] + tile[2] - 100, tile[1] + 230)
    lp = os.path.join(ROOT, 'assets/logos/%s.png' % c['id'])
    if os.path.exists(lp):
        lg = Image.open(lp).convert('RGBA'); lg.thumbnail((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
        im.paste(lg, (box[0] + (box[2] - box[0] - lg.width) // 2, box[1] + (box[3] - box[1]) // 2 - lg.height // 2 + 10), lg)
    else:
        f = fit_text(d, c['icon'], box[2] - box[0], 90)
        d.text(((box[0] + box[2]) // 2, (box[1] + box[3]) // 2 + 10), c['icon'], font=f, fill=tuple(int(c['color'][i:i + 2], 16) for i in (1, 3, 5)), anchor='mm')
    x = 420
    name = texts.NAMES[c['id']][['uk', 'en', 'ru'].index(lang)]
    d.text((x, 150), BRAND[lang].upper() + '  ·  ' + SUB[lang][1], font=font(34), fill=(255, 213, 0))
    d.text((x, 215), name, font=fit_text(d, name, W - x - 60, 96), fill=(255, 255, 255))
    d.text((x, 345), SUB[lang][0], font=fit_text(d, SUB[lang][0], W - x - 60, 40), fill=(190, 205, 235))
    d.text((x, 410), 'ukraine-tv.uk', font=font(36), fill=(125, 180, 255))
    # бейдж LIVE
    d.rounded_rectangle([x, 480, x + 150, 536], radius=28, fill=(229, 57, 53))
    d.ellipse([x + 22, 500, x + 38, 516], fill=(255, 255, 255)); d.text((x + 52, 508), 'LIVE', font=font(30), fill=(255, 255, 255), anchor='lm')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, 'JPEG', quality=84, optimize=True, progressive=True)


def main():
    reg = json.load(open(os.path.join(ROOT, 'data/channels.json'), encoding='utf-8'))
    n = 0
    for c in reg['channels']:
        for lang in ('uk', 'en', 'ru'):
            sub = '' if lang == 'uk' else lang + '/'
            make(c, lang, os.path.join(ROOT, 'assets/og', sub + c['slug'] + '.jpg')); n += 1
    print('generated', n)


if __name__ == '__main__':
    main()
