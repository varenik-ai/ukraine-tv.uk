"""Тексты главной страницы (разметка по образцу russian-tv.com) и строки home.js. Числа каналов подставляет build.py."""

HOME = {
 'uk': dict(
  nav_ch='Канали', nav_about='Про сайт', locale='uk-UA',
  bc='🇺🇦 Українське ТБ онлайн', h1='Дивіться українське ТБ онлайн безкоштовно', meta_247='Пряма трансляція 24/7',
  tg_sub='Підписатися', grid_hint='Оберіть канал у списку нижче ↓', player_status='Оберіть канал для перегляду',
  epg_h='Програма передач',
  cta_title='Дивіться без реклами в Telegram', cta_desc='{cn} у прямому ефірі просто в месенджері',
  cta_feats=['Без реєстрації', 'iOS · Android · Desktop', 'Без VPN з будь-якої країни', 'Якість підбирається автоматично'], cta_btn='Відкрити Україна ТВ',
  recent_h='🕐 Нещодавно переглянуті',
  cards=[('📡', '{N}', 'Каналів в ефірі'), ('🆓', '0', 'Повністю безкоштовно'), ('🌍', '∞', 'Країн без VPN'), ('🌐', '3', 'Мови сайту: UA · EN · RU'), ('🕐', '24/7', 'Без перерв')],
  seo_h='Українське телебачення онлайн безкоштовно — {cn} у прямому ефірі',
  seo_cat='{cat}:', seo_tg='Також доступно в Telegram — підпишіться на {tg} і дивіться на будь-якому пристрої.',
  faq_extra=[('Чи можна дивитися через Chromecast або Smart TV?', 'Так. У Chrome натисніть кнопку «Трансляція на ТБ» у плеєрі, на iPhone — AirPlay. На Smart TV відкрийте вбудований браузер і перейдіть на ukraine-tv.uk.'),
             ('Де дивитися {n1} онлайн безкоштовно?', '<a href="{u1}">{n1} онлайн</a> доступний безкоштовно на ukraine-tv.uk — прямий ефір без реєстрації та VPN, з будь-якої країни.'),
             ('Де дивитися {n2} онлайн?', '<a href="{u2}">{n2} у прямому ефірі</a> — безкоштовно на ukraine-tv.uk. Трансляція йде цілодобово.')],
  js=dict(watch_suffix=' — дивитися онлайн', mute='🔇 Вимкнути звук', unmute='🔊 Увімкнути звук', fs='⛶ Повний екран', fs_exit='✕ Вийти', reload='🔄 Перепідключитися',
          press_play='Натисніть ▶ для відтворення', st_live='Пряма трансляція — ', st_backup_short='сервер'),
 ),
 'en': dict(
  nav_ch='Channels', nav_about='About', locale='en-GB',
  bc='🇺🇦 Ukrainian TV online', h1='Watch Ukrainian TV online for free', meta_247='Live 24/7',
  tg_sub='Subscribe', grid_hint='Choose a channel from the list below ↓', player_status='Choose a channel to watch',
  epg_h='TV guide',
  cta_title='Watch without ads in Telegram', cta_desc='{cn} live, right in the messenger',
  cta_feats=['No sign-up', 'iOS · Android · Desktop', 'No VPN from any country', 'Quality adjusts automatically'], cta_btn='Open Ukraine TV',
  recent_h='🕐 Recently watched',
  cards=[('📡', '{N}', 'Channels on air'), ('🆓', '0', 'Completely free'), ('🌍', '∞', 'Countries, no VPN'), ('🌐', '3', 'Site languages: UA · EN · RU'), ('🕐', '24/7', 'Non-stop')],
  seo_h='Ukrainian TV online for free — {cn} live',
  seo_cat='{cat}:', seo_tg='Also available in Telegram — subscribe to {tg} and watch on any device.',
  faq_extra=[('Can I watch via Chromecast or Smart TV?', 'Yes. In Chrome press the "Cast to TV" button in the player, on iPhone use AirPlay. On a Smart TV open the built-in browser and go to ukraine-tv.uk.'),
             ('Where can I watch {n1} online for free?', '<a href="{u1}">{n1} online</a> is free on ukraine-tv.uk — a live stream with no sign-up and no VPN, from any country.'),
             ('Where can I watch {n2} online?', '<a href="{u2}">{n2} live</a> — free on ukraine-tv.uk. The stream runs around the clock.')],
  js=dict(watch_suffix=' — watch online', mute='🔇 Mute', unmute='🔊 Turn on sound', fs='⛶ Fullscreen', fs_exit='✕ Exit', reload='🔄 Reconnect',
          press_play='Press ▶ to play', st_live='Live — ', st_backup_short='server'),
 ),
 'ru': dict(
  nav_ch='Каналы', nav_about='О сайте', locale='ru-RU',
  bc='🇺🇦 Украинское ТВ онлайн', h1='Смотрите украинское ТВ онлайн бесплатно', meta_247='Прямая трансляция 24/7',
  tg_sub='Подписаться', grid_hint='Выберите канал в списке ниже ↓', player_status='Выберите канал для просмотра',
  epg_h='Программа передач',
  cta_title='Смотрите без рекламы в Telegram', cta_desc='{cn} в прямом эфире прямо в мессенджере',
  cta_feats=['Без регистрации', 'iOS · Android · Desktop', 'Без VPN из любой страны', 'Качество подбирается автоматически'], cta_btn='Открыть Украина ТВ',
  recent_h='🕐 Недавно просмотренные',
  cards=[('📡', '{N}', 'Каналов в эфире'), ('🆓', '0', 'Полностью бесплатно'), ('🌍', '∞', 'Стран без VPN'), ('🌐', '3', 'Языка сайта: UA · EN · RU'), ('🕐', '24/7', 'Без перерывов')],
  seo_h='Украинское телевидение онлайн бесплатно — {cn} в прямом эфире',
  seo_cat='{cat}:', seo_tg='Также доступно в Telegram — подпишитесь на {tg} и смотрите на любом устройстве.',
  faq_extra=[('Можно ли смотреть через Chromecast или Smart TV?', 'Да. В Chrome нажмите кнопку «Трансляция на ТВ» в плеере, на iPhone — AirPlay. На Smart TV откройте встроенный браузер и перейдите на ukraine-tv.uk.'),
             ('Где смотреть {n1} онлайн бесплатно?', '<a href="{u1}">{n1} онлайн</a> доступен бесплатно на ukraine-tv.uk — прямой эфир без регистрации и VPN, из любой страны.'),
             ('Где смотреть {n2} онлайн?', '<a href="{u2}">{n2} в прямом эфире</a> — бесплатно на ukraine-tv.uk. Трансляция идёт круглосуточно.')],
  js=dict(watch_suffix=' — смотреть онлайн', mute='🔇 Выключить звук', unmute='🔊 Включить звук', fs='⛶ Полный экран', fs_exit='✕ Выйти', reload='🔄 Переподключиться',
          press_play='Нажмите ▶ для воспроизведения', st_live='Прямая трансляция — ', st_backup_short='сервер'),
 ),
}

# ── категории, страны, блог (разметка по образцу эталона) ──
MONTH = {'uk': 'Жовтень 2026', 'en': 'October 2026', 'ru': 'Октябрь 2026'}
FLAGS = {'australia': '🇦🇺', 'austria': '🇦🇹', 'belgium': '🇧🇪', 'canada': '🇨🇦', 'czech-republic': '🇨🇿', 'france': '🇫🇷', 'germany': '🇩🇪', 'israel': '🇮🇱',
         'italy': '🇮🇹', 'netherlands': '🇳🇱', 'poland': '🇵🇱', 'spain': '🇪🇸', 'sweden': '🇸🇪', 'uk': '🇬🇧', 'usa': '🇺🇸'}
BLOG_SUB = {'uk': 'Поради та інструкції: як дивитися українське ТБ онлайн — вдома і за кордоном.',
            'en': 'Tips and guides on watching Ukrainian TV online, at home and abroad.',
            'ru': 'Советы и инструкции: как смотреть украинское ТВ онлайн — дома и за рубежом.'}
CAT = {
 'uk': dict(h='{cat} онлайн — дивитися безкоштовно', p1='{cat} — розділ, у якому зібрано {cn}. Усі канали доступні безкоштовно, без реєстрації та без VPN, з будь-якої країни.',
            p2='У цьому розділі: {names}.', faq_h='Часті питання', q1='Де дивитися «{cat}» онлайн безкоштовно?', a1='На ukraine-tv.uk: оберіть канал і натисніть ▶ — трансляція запуститься одразу, без реєстрації.',
            q2='Чи потрібен VPN?', a2='Ні. Сайт відкривається з будь-якої країни без VPN.', live='LIVE'),
 'en': dict(h='{cat} online — watch for free', p1='{cat} is a section with {cn}. All channels are free, with no sign-up and no VPN, from any country.',
            p2='In this section: {names}.', faq_h='FAQ', q1='Where can I watch "{cat}" online for free?', a1='On ukraine-tv.uk: pick a channel and press ▶ — the stream starts right away, no sign-up needed.',
            q2='Do I need a VPN?', a2='No. The site opens from any country without a VPN.', live='LIVE'),
 'ru': dict(h='{cat} онлайн — смотреть бесплатно', p1='{cat} — раздел, в котором собрано {cn}. Все каналы доступны бесплатно, без регистрации и без VPN, из любой страны.',
            p2='В этом разделе: {names}.', faq_h='Частые вопросы', q1='Где смотреть «{cat}» онлайн бесплатно?', a1='На ukraine-tv.uk: выберите канал и нажмите ▶ — трансляция запустится сразу, без регистрации.',
            q2='Нужен ли VPN?', a2='Нет. Сайт открывается из любой страны без VPN.', live='LIVE'),
}
COUNTRY = {
 'uk': dict(cta='▶ Дивитися зараз — безкоштовно', badges=['✅ Без VPN', '🆓 Безкоштовно', '📱 Усі пристрої', '📡 {cn}', '🕐 Прямий ефір 24/7'],
            info=[('📡', '{N}', 'каналів прямого ефіру'), ('🆓', '0', 'без підписки'), ('🌍', 'Без VPN', 'працює {in_}'), ('📱', 'Будь-які', 'пристрої')], seo_h='Українське ТБ {in_} — дивитися онлайн'),
 'en': dict(cta='▶ Watch now — free', badges=['✅ No VPN', '🆓 Free', '📱 All devices', '📡 {cn}', '🕐 Live 24/7'],
            info=[('📡', '{N}', 'live channels'), ('🆓', '0', 'no subscription'), ('🌍', 'No VPN', 'works {in_}'), ('📱', 'Any', 'device')], seo_h='Ukrainian TV {in_} — watch online'),
 'ru': dict(cta='▶ Смотреть сейчас — бесплатно', badges=['✅ Без VPN', '🆓 Бесплатно', '📱 Все устройства', '📡 {cn}', '🕐 Прямой эфир 24/7'],
            info=[('📡', '{N}', 'каналов прямого эфира'), ('🆓', '0', 'без подписки'), ('🌍', 'Без VPN', 'работает {in_}'), ('📱', 'Любые', 'устройства')], seo_h='Украинское ТВ {in_} — смотреть онлайн'),
}
