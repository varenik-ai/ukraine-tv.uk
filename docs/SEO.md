# SEO: разметка, sitemap, индексация

## Что делает генератор (`tools/build.py`)
- `title`/`description` по шаблонам из `tools/i18n.py`; `canonical`; взаимный `hreflang` uk/en/ru + `x-default` (для страниц стран `x-default` = en).
- Open Graph и Twitter с картинкой 1200×630 на канал (`assets/og/<slug>.jpg`, uk в корне, `en/`, `ru/`), создаются `tools/gen_og.py`.
- JSON-LD: канал — `WebPage` + `BreadcrumbList` + `FAQPage`; главная — `WebSite` + `Organization` + `CollectionPage` + `ItemList` + `FAQPage`; категория — `CollectionPage` + `BreadcrumbList` + `ItemList` + `FAQPage`; страна — `WebPage` + `BreadcrumbList` + `FAQPage`; статья блога — `Article` + `BreadcrumbList`.
- Один `<h1>` на странице; число каналов подставляется из реестра (с правильным склонением uk/ru).
- `sitemap.xml` с hreflang и `lastmod` (дата меняется только при изменении содержимого страницы; хранится в `data/lastmod.json`), `robots.txt`, `404.html` с `noindex`, 301-заглушки для удалённых каналов и старых адресов.

## После крупных изменений
1. Search Console → ресурс `ukraine-tv.uk` → Файлы Sitemap → `sitemap.xml` (проверить, что статус «Успешно»).
2. **IndexNow** (Bing, Yandex и др.): ключ лежит в корне сайта (`<ключ>.txt`, значение — имя файла). Отправка всех URL из sitemap:
   ```bash
   python3 - <<'PY' > /tmp/in.json
   import re, json
   urls = re.findall(r'<loc>([^<]+)</loc>', open('sitemap.xml').read())
   key = '2b53f62ba4280d0654deed7f1ba0f301'
   print(json.dumps({'host': 'ukraine-tv.uk', 'key': key, 'keyLocation': f'https://ukraine-tv.uk/{key}.txt', 'urlList': urls}))
   PY
   curl -X POST https://api.indexnow.org/IndexNow -H 'Content-Type: application/json; charset=utf-8' -d @/tmp/in.json
   ```
3. У Google нет API отправки URL для обычных сайтов: «Запросить индексирование» — только вручную в Search Console для ключевых страниц.
4. Яндекс Вебмастер: переотправить sitemap (подтверждение сайта — метатег в `<head>`, генерируется).

## Что учитывать
- Окно согласия не показывается роботам (см. docs/ADS_AND_CONSENT.md), иначе страницы не индексировались бы.
- Не удалять страницы-заглушки редиректов удалённых каналов: они сохраняют ссылки.
- Страницы стран и блог — основная точка входа по низкочастотным запросам; тексты — в `tools/countries.py`, `tools/blog.py`.
