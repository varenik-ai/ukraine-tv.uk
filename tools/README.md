# Генератор сайта ukraine-tv.uk

Все страницы (главная, каналы, категории, about/privacy, 404, редиректы, sitemap, robots, proxy.json) собираются одной командой:

```bash
python3 tools/build.py        # идемпотентно: без изменений данных ничего не перезаписывает
```

Источники правды:
- `data/channels.json` — реестр каналов (id, slug, группа, цвета, источник потока, статус).
- `tools/texts.py` — названия, слоганы и описания каналов (uk / en / ru).
- `tools/i18n.py` — строки интерфейса, категории, склонение числительных.
- `assets/` — `site.css`, `player.js` (плеер: ротация прокси, watchdog), `player-ui.js`, `quality.js`, `site-ux.js`, `gate.js` (согласие), `ads.js` (реклама), `cast.js`, `home.js`.

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

## Страницы стран
Данные и тексты — `tools/countries.py` (15 стран × uk/en/ru + три хаба «за кордоном»). Адреса прежние: en — в корне (`/ukrainian-tv-in-germany/`), uk — в корне, ru — под `/ru/`. У этих страниц `x-default` = en.

## EPG (программа передач)
`scripts/update_epg.py` собирает `epg.json` из двух XMLTV-фидов (iptv-epg.org и epgshare01.online); workflow лежит в `.github/workflows/update-epg.yml` (шаблон-дубликат — `scripts/update-epg.workflow.yml`; токену git для пуша нужен scope `workflow`, поэтому файл добавляется через веб-интерфейс GitHub); он запускает скрипт 4 раза в сутки и коммитит изменения. Соответствие «канал сайта → id в фиде» — `CHANNEL_MAP` в скрипте (сейчас 20 из 33 каналов; для остальных блок скрыт). Страница прячет блок, если гид старше 36 часов. Ручной запуск: `python3 scripts/update_epg.py`.


## Верстка по образцу russian-tv.com

- `tools/make_ref_css.py [путь/к/russian-tv-site]` — берёт CSS страниц эталона и пишет `assets/home.css` (главная) и `assets/pages.css` (категории, страны, about, блог, статья); все селекторы под `body.<класс>` (`home`, `cat`, `country`, `static`, `blog`, `article`), футер общий (`site.css`). Запускать при обновлении эталона.
- `tools/home_i18n.py` — тексты главной, категорий, стран и блога (uk/en/ru); `assets/home.js` — плеер и интерфейс главной (сайдбар, плитки, EPG, «недавно смотрели»), данные приходят из `window.UTV_HOME` (собирает `home_data()` в `build.py`).


## Подробнее
См. `README.md` и `docs/` (CHANNELS, OPERATIONS, ADS_AND_CONSENT, SEO) в корне репозитория.
