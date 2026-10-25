# Каналы: добавить, проверить, убрать

Идентификатор канала (`id`) — один и тот же везде: реестр, воркеры (`/stream?channel=<id>`), сайт, мини-апп, бот.

```
data/channels.json ──build.py──► сайт (страницы, sitemap, app-channels.json)
        │
        └─► ukraine-tv-hub: gen_worker_streams.py → воркеры; gen_app_channels.py → мини-апп и бот
```

## 1. Проверить источник
Критерии: `https`, живой `MEDIA-SEQUENCE`, сегмент скачивается быстрее своей длительности, CORS на сегментах (иначе нужен прокси сегментов только для этого канала — поле `needs_segment_proxy`).

```bash
python3 ../ukraine-tv-hub/tools/test_streams.py data/channels.json
```

## 2. Добавить канал
1. `data/channels.json` → `channels`: `id`, `slug` (`…-live`), `group` (одна из 7 категорий), `name`, `desc`, `icon`, `color`, `iconBg`, `tags`, `source.url`, `source.status`, при необходимости `needs_segment_proxy`.
2. `tools/texts.py` → `NAMES` (uk, en, ru), `TAGLINE`, `ABOUT` для этого `id`.
3. Логотип: `tools/fetch_logos.py` (карта `LOGO_IDS`, нужен Pillow) → `assets/logos/<id>.png`; OG-картинки: `python3 tools/gen_og.py`.
4. EPG (если у канала есть программа в фидах): `CHANNEL_MAP` в `scripts/update_epg.py`.
5. `python3 tools/build.py` → проверить, закоммитить, запушить.
6. Воркеры и мини-апп: в `ukraine-tv-hub` выполнить `./deploy-workers.sh` (перегенерирует список каналов воркера и мини-аппа, прогонит тесты, задеплоит три копии), затем `npx wrangler deploy -c bot-worker/wrangler.toml` (обновит список в боте), запушить hub.
7. Обновить закреплённый пост канала: отправить боту `/post`.

## 3. Убрать канал
Перенести запись из `channels` в `removed` (с причиной) — генератор поставит редиректы со старых страниц, уберёт канал из sitemap. Далее шаги 5–7.

## 4. Периодическая проверка
Источники иногда меняются или отваливаются. Раз в неделю: `test_streams.py`, затем по результатам правка `source.url` или перевод в `removed`. Статус каждой записи (`source.status`, `source.checked`) хранится в реестре.
