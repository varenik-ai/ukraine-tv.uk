# ukraine-tv.uk — украинские телеканалы онлайн

Бесплатный сайт для просмотра украинских телеканалов в прямом эфире (uk, en, ru). Статический сайт на GitHub Pages, генерируется Python-скриптом. Видеопотоки отдают воркеры Cloudflare; те же каналы доступны в Telegram-мини-аппе ([ukraine-tv-hub](https://github.com/varenik-ai/ukraine-tv-hub)).

- Сайт: https://ukraine-tv.uk (uk — корень, `/en/`, `/ru/`)
- Telegram: бот `@UkraineTVHub_bot`, канал `@UkraineTVHub`
- Эталон: https://russian-tv.com (`varenik-ai/russian-tv-site`, `varenik-ai/russia-tv-hub`)

## Как устроено

```
источники HLS ──► 3 воркера Cloudflare (ukraine-stream-a/b/c, + домен s.ukraine-tv.uk)
                          ▲  /stream?channel=<id>
                          │
GitHub Pages (этот репозиторий) ──► Cloudflare (прокси, TLS) ──► браузер
  data/channels.json ─► tools/build.py ─► HTML (все страницы, sitemap, proxy.json)
```

- **Реестр каналов** — `data/channels.json`, единственный источник правды (id одинаковый на сайте, в воркерах, мини-аппе и боте).
- **Генератор** — `tools/build.py` (идемпотентен). HTML вручную не править: он перезаписывается.
- **Плеер** — `assets/player.js` (страницы каналов), `assets/home.js` (главная), `player-ui.js`, `quality.js`, `cast.js` (Chromecast/AirPlay), `site-ux.js`. hls.js закреплён на 1.5.15.
- **Стили** — `site.css` (общие и страница канала), `home.css`, `pages.css` (генерируются из CSS эталона: `tools/make_ref_css.py`).
- **Согласие и реклама** — `assets/gate.js`, `assets/ads.js` (см. [docs/ADS_AND_CONSENT.md](docs/ADS_AND_CONSENT.md)).
- **EPG** — `scripts/update_epg.py` + GitHub Action `.github/workflows/update-epg.yml` (4 раза в сутки) → `epg.json`.

## Быстрый старт

```bash
python3 tools/build.py            # собрать сайт (повторный запуск: 0 изменённых файлов)
python3 tools/gen_og.py           # OG-картинки (нужен Pillow)
python3 tools/fetch_logos.py      # логотипы каналов (нужен Pillow)
# локально: сайт + воркер (из репозитория ukraine-tv-hub)
node --no-warnings ../ukraine-tv-hub/tools/dev_server.mjs ../ukraine-tv.uk   # http://localhost:8765
```

Публикация: `git push origin main` → GitHub Pages обновляется за 1–2 минуты. Браузеры кэшируют HTML до 10 минут; при смене ассетов поднимайте `ASSET_V` в `tools/build.py`.

## Документация

| Файл | О чём |
|---|---|
| [docs/CHANNELS.md](docs/CHANNELS.md) | добавить, проверить, убрать канал; связь с воркерами и мини-аппом |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Cloudflare, домены, воркеры, секреты, деплой, диагностика |
| [docs/ADS_AND_CONSENT.md](docs/ADS_AND_CONSENT.md) | окно согласия, Monetag, Adsterra, проверка |
| [docs/SEO.md](docs/SEO.md) | разметка, sitemap, hreflang, IndexNow, Search Console |
| [tools/README.md](tools/README.md) | описание генераторов |
| [CLAUDE.md](CLAUDE.md) | памятка для ИИ-ассистента, работающего с репозиторием |

## Структура репозитория

```
data/            channels.json (реестр), app-channels.json (для мини-аппа), lastmod.json (даты sitemap)
tools/           build.py, i18n.py, texts.py, countries.py, blog.py, home_i18n.py, make_ref_css.py, gen_og.py, fetch_logos.py
assets/          css/js, logos/, og/, fonts/
scripts/         update_epg.py
*/index.html     сгенерированные страницы (каналы, категории, страны, блог, about…)
en/, ru/         английская и русская версии
```
