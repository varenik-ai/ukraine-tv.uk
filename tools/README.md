# Генератор сайта ukraine-tv.uk

Все страницы (главная, каналы, категории, about/privacy, 404, редиректы, sitemap, robots, proxy.json) собираются одной командой:

```bash
python3 tools/build.py        # идемпотентно: без изменений данных ничего не перезаписывает
```

Источники правды:
- `data/channels.json` — реестр каналов (id, slug, группа, цвета, источник потока, статус).
- `tools/texts.py` — названия, слоганы и описания каналов (uk / en / ru).
- `tools/i18n.py` — строки интерфейса, категории, склонение числительных.
- `assets/` — `site.css`, `player.js` (плеер: ротация прокси, watchdog), `player-ui.js`, `quality.js`, `site-ux.js`, `analytics.js`.

**Не править HTML вручную** — он перезаписывается генератором.

## Как добавить канал
1. Проверить поток: `python3 ../ukraine-tv-hub/tools/test_streams.py data/channels.json`.
2. Добавить запись в `data/channels.json` (id, slug `…-live`, группа, иконка, цвета, `source.url`).
3. Добавить `NAMES`, `TAGLINE`, `ABOUT` для id в `tools/texts.py`.
4. `python3 tools/build.py`, затем в репозитории `ukraine-tv-hub`: `./deploy-workers.sh` (перегенерирует список каналов воркера и задеплоит три копии).

## Как убрать канал
Удалить из `channels` и добавить в `removed` (с причиной) — генератор сам поставит редиректы со старых страниц.

## Локальная проверка
В `ukraine-tv-hub`: `node tools/dev_server.mjs ../ukraine-tv.uk` — сайт на :8765 вместе с локальным воркером.
