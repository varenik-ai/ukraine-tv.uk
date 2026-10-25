# Эксплуатация: Cloudflare, воркеры, деплой, диагностика

## Инфраструктура

| Что | Где | Примечание |
|---|---|---|
| Сайт | GitHub Pages, репозиторий `varenik-ai/ukraine-tv.uk`, ветка `main`, `CNAME` = `ukraine-tv.uk` | HTML кэшируется браузером на 10 минут (`max-age=600`) |
| CDN/прокси | Cloudflare, зона `ukraine-tv.uk` (id `a41f4468cebce9ca5bc0234a02b1e3c4`), аккаунт `dyaltd` (id `e9c51d680a2f01c508e400a282beb2a8`) | оранжевое облако на apex и `www`; SSL Full, Always HTTPS, TLS ≥ 1.2, TLS 1.3, `nosniff`; HSTS выключен |
| Воркеры потоков | `ukraine-stream-a/b/c` (`*.dyaltd.workers.dev`), домен `https://s.ukraine-tv.uk` → `ukraine-stream-a` | независимые копии одного кода (репозиторий `ukraine-tv-hub`, `src/`) |
| Список воркеров для клиентов | `https://ukraine-tv.uk/proxy.json` (генерируется `build.py`, первым идёт `s.ukraine-tv.uk`) | сайт и мини-апп берут его на лету и ротируют при ошибках |
| Бот | воркер `ukraine-tv-bot` (webhook), см. `ukraine-tv-hub/README.md` | работает без компьютера владельца |
| EPG | GitHub Action `.github/workflows/update-epg.yml` → `epg.json` | 4 раза в сутки; блок скрывается, если данные старше 36 часов |

## Секреты (имена; значения не хранить в репозитории и не присылать в чат)
- `BOT_TOKEN`, `ADMIN_IDS`, `WEBHOOK_SECRET` — `ukraine-tv-hub/.env` на машине владельца; в Cloudflare лежат как секреты воркера `ukraine-tv-bot` (`./setup-bot.sh`).
- `CF_API_TOKEN` — только на время работ (файл `.cf.env`, права 600). После работ токен отзывают в панели Cloudflare (My Profile → API Tokens) и файл удаляют.
- Токен `git push` не имеет прав `workflow`: файлы в `.github/workflows/` добавляются через веб-интерфейс GitHub.

## Деплой
1. Сайт: `python3 tools/build.py` → коммит → `git push origin main`.
2. Воркеры: в `ukraine-tv-hub` — `./deploy-workers.sh` (нужен `wrangler login`; переменные `REGISTRY` и `APP_CHANNELS` по умолчанию указывают на `../ukraine-tv.uk/data/…`).
3. Бот: `npx wrangler deploy -c bot-worker/wrangler.toml` (секреты хранятся в Cloudflare и при деплое не теряются).

## Проверки перед пушем
```bash
python3 tools/build.py && python3 tools/build.py     # второй прогон: written/changed: 0
python3 - <<'PY'
import re, json, glob, os
bad = 0
for f in glob.glob('**/index.html', recursive=True) + ['404.html']:
    h = open(f, encoding='utf-8').read()
    if 'http-equiv="refresh"' in h: continue
    for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S): json.loads(m)
    for l in re.findall(r'(?:href|src)="(/[^"#?]*)', h):
        if l.startswith('//'): continue
        p = l.strip('/')
        if not (os.path.exists(p) or os.path.exists(p + '/index.html') or l == '/'): print('BROKEN', f, l); bad += 1
print('problems:', bad)
PY
```

## Диагностика
- **Канал не играет.** `curl -s https://s.ukraine-tv.uk/stream?channel=<id> -H 'Origin: https://ukraine-tv.uk'` — должен вернуть плейлист; 403 = источник/Origin не разрешён, 404 = нет канала в воркере (забыли `deploy-workers.sh`), 502 = источник упал. Затем `test_streams.py`.
- **`/proxy.json` отдаёт не JSON.** Проверить маршруты воркеров на зоне (в панели Cloudflare → Workers Routes): маршрутов вида `ukraine-tv.uk/proxy*` и `/stream*` быть не должно (раньше вели на старые воркеры).
- **Окно согласия или реклама не показываются.** Расширения-блокировщики режут скрипты по имени и скрывают элементы; для проверки открывайте сайт в окне без расширений. Встроенная страховка в `<head>` закрывает сайт, если `gate.js` не выполнился. См. docs/ADS_AND_CONSENT.md.
- **Окно инкогнито «помнит» отказ.** Новые окна инкогнито делят хранилище, пока открыто любое инкогнито-окно Chrome.
- **Страница выглядит старой.** HTML в кэше браузера до 10 минут; открыть с `?v=…` или жёстко обновить.

## Старые воркеры (удалять только после падения трафика)
`birch-stream` и `ukraine-worker` ещё получали основной трафик (старые версии мини-аппа и закэшированные страницы); `stream-gateway`, `ukraine-mirror`, `ukraine-proxy-2`, `ukraine-tv-uk` почти без трафика. Остаются маршруты `api.ukraine-tv.uk/*` и `stream.ukraine-tv.uk/*`. Перед удалением смотреть запросы за неделю в аналитике Workers; удаление необратимо — только с подтверждения владельца. Воркеры `russia-worker`, `birch-creek`, `oak-valley`, `bulgaria-worker`, `korea-worker` относятся к другим проектам и не трогаются.
