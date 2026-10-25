"""Строки интерфейса сайта (uk / en / ru)."""
LANGS = ['uk', 'en', 'ru']
PREFIX = {'uk': '', 'en': '/en', 'ru': '/ru'}
HTML_LANG = {'uk': 'uk', 'en': 'en', 'ru': 'ru'}
OG_LOCALE = {'uk': 'uk_UA', 'en': 'en_US', 'ru': 'ru_RU'}
IN_LANG = {'uk': 'uk-UA', 'en': 'en', 'ru': 'ru-RU'}
LABEL = {'uk': 'UA', 'en': 'EN', 'ru': 'RU'}

# категории: id -> {lang: (название, slug)}; порядок = порядок на сайте
CATS = {
 'news':          {'uk': ('Новини та загальні', 'novyny'),         'en': ('News & general', 'news'),            'ru': ('Новости и общие', 'novosti')},
 'entertainment': {'uk': ('Розваги та кіно', 'rozvahy-ta-kino'),   'en': ('Entertainment & movies', 'entertainment'), 'ru': ('Развлечения и кино', 'razvlecheniya')},
 'public':        {'uk': ('Суспільні та громадські', 'suspilne'),  'en': ('Public & community', 'public'),   'ru': ('Общественные', 'obshchestvennye')},
 'regional':      {'uk': ('Регіональні', 'rehionalni'),            'en': ('Regional', 'regional'),            'ru': ('Региональные', 'regionalnye')},
 'music':         {'uk': ('Музика', 'muzyka'),                      'en': ('Music', 'music'),                  'ru': ('Музыка', 'muzyka')},
 'kids':          {'uk': ('Дитячі', 'dytiachi'),                    'en': ('Kids', 'kids'),                    'ru': ('Детские', 'detskie')},
 'thematic':      {'uk': ('Тематичні', 'tematychni'),               'en': ('Themed', 'thematic'),              'ru': ('Тематические', 'tematicheskie')},
}
CAT_EMOJI = {'news': '📡', 'entertainment': '🎬', 'public': '📺', 'regional': '🏙️', 'music': '🎵', 'kids': '👶', 'thematic': '🎯'}
GROUP_TO_CAT = ['news', 'entertainment', 'public', 'regional', 'music', 'kids', 'thematic']  # по порядку registry.groups
CAT_DESC = {
 'news': {'uk': 'Українські новинні та загальнонаціональні телеканали онлайн: новини, аналітика, парламентські трансляції. Безкоштовно, без реєстрації та VPN.',
          'en': 'Ukrainian news and national TV channels online: news, analysis, parliament broadcasts. Free, no sign-up, no VPN.',
          'ru': 'Украинские новостные и общенациональные телеканалы онлайн: новости, аналитика, парламентские трансляции. Бесплатно, без регистрации и VPN.'},
 'entertainment': {'uk': 'Українські розважальні та кіноканали онлайн: серіали, кіно, шоу та гумор. Дивіться безкоштовно, 24/7.',
                   'en': 'Ukrainian entertainment and movie channels online: series, films, shows and comedy. Watch free, 24/7.',
                   'ru': 'Украинские развлекательные и киноканалы онлайн: сериалы, кино, шоу и юмор. Смотрите бесплатно, 24/7.'},
 'public': {'uk': 'Суспільні та громадські українські телеканали онлайн: армійський та громадський канали у прямому ефірі.',
            'en': 'Public and community Ukrainian TV channels online: army and community channels live.',
            'ru': 'Общественные украинские телеканалы онлайн: армейский и общественный каналы в прямом эфире.'},
 'regional': {'uk': 'Регіональні українські телеканали онлайн: місцеві новини та програми різних міст. Безкоштовно, 24/7.',
              'en': 'Regional Ukrainian TV channels online: local news and programmes from different cities. Free, 24/7.',
              'ru': 'Региональные украинские телеканалы онлайн: местные новости и программы разных городов. Бесплатно, 24/7.'},
 'music': {'uk': 'Українські музичні телеканали онлайн: кліпи та хіти українських виконавців, 24/7 безкоштовно.',
           'en': 'Ukrainian music TV channels online: clips and hits by Ukrainian artists, free 24/7.',
           'ru': 'Украинские музыкальные телеканалы онлайн: клипы и хиты украинских исполнителей, 24/7 бесплатно.'},
 'kids': {'uk': 'Дитячі українські телеканали онлайн: мультфільми та розвивальні програми для дітей. Безкоштовно, без реєстрації.',
          'en': 'Ukrainian kids\' TV channels online: cartoons and educational programmes for children. Free, no sign-up.',
          'ru': 'Детские украинские телеканалы онлайн: мультфильмы и развивающие программы для детей. Бесплатно, без регистрации.'},
 'thematic': {'uk': 'Тематичні українські телеканали онлайн: риболовля, мода, культура, адаптивний спорт. Безкоштовно, 24/7.',
              'en': 'Themed Ukrainian TV channels online: fishing, fashion, culture and adaptive sport. Free, 24/7.',
              'ru': 'Тематические украинские телеканалы онлайн: рыбалка, мода, культура, адаптивный спорт. Бесплатно, 24/7.'},
}

S = {
 'uk': dict(
  site='Україна ТВ', logo=('Україна', 'ТВ'), domain_tag='ukraine-tv.uk',
  nav_all='← Усі канали', subscribe='Підписатися', home='Головна', all_ch='Усі {cn} — обрати інший', search='Пошук каналу...',
  live='В ЕФІРІ', live_247='Пряма трансляція 24/7', watch_prompt='{name} — натисніть для перегляду', status_idle='Натисніть ▶ для запуску трансляції',
  similar='Схожі канали', popular='⭐ Популярні канали', about_h='Про канал {name}', faq_h='Часті питання про {name}',
  tg_banner='<b>Підпишіться в Telegram</b> — запасний спосіб дивитися, якщо сайт буде недоступний', tg_pulse='Дивитися канали в Telegram',
  tg_card_h='Дивіться в Telegram', tg_card_p='Усі {cn} в одному застосунку — безкоштовно. На iOS, Android і Desktop.', tg_card_btn='Підписатися на @UkraineTVHub',
  epg_h='Програма на сьогодні', epg_now='Зараз в ефірі', epg_left='залишилось ', epg_upd='оновлено ',
  footer_tag='Безкоштовне українське ТБ онлайн', f_all='Усі канали', f_about='Про сайт', f_priv='Конфіденційність', f_cookie='Налаштування cookie', f_adv='Реклама',
  f_note='Сайт не зберігає відеоконтент. Усі трансляції надаються третіми сторонами й доступні у відкритому доступі в мережі Інтернет.',
  f_legal='Посилання на трансляції взято з відкритих джерел. На звернення правовласника трансляцію буде видалено після підтвердження прав — <a href="{priv}#rightsholders" style="color:inherit;text-decoration:underline">докладніше</a>.',
  home_title='Україна ТВ — українські телеканали онлайн безкоштовно ({cn})', home_h1='Українські телеканали онлайн',
  home_desc='Дивіться українські телеканали онлайн безкоштовно: новини, кіно, серіали, музика та дитячі канали — {cn} у прямому ефірі. Без реєстрації та VPN, 24/7 на телефоні й комп\'ютері.',
  home_lead='{cn} у прямому ефірі — безкоштовно, без реєстрації та VPN.',
  home_intro='Україна ТВ — безкоштовна добірка українських телеканалів у прямому ефірі: новини, кіно та серіали, музика, дитячі й регіональні канали. Сайт працює з будь-якої країни, на комп\'ютері, смартфоні та планшеті; ті самі канали доступні в Telegram-застосунку. Якщо потік одного з серверів недоступний, плеєр автоматично переключається на резервний.',
  all_tab='Усі', ch_count='{cn}',
  cat_title='{cat} — українські телеканали онлайн', cat_h1='{cat} — телеканали онлайн',
  ch_title='▶ {name} дивитися онлайн безкоштовно — пряма трансляція 24/7',
  ch_desc='{name} онлайн — {tag_l}. Дивіться пряму трансляцію безкоштовно, без реєстрації та VPN, на телефоні й комп\'ютері, 24/7.',
  ch_h1='{name} дивитися онлайн безкоштовно',
  ch_p2='Дивитися {name} онлайн на ukraine-tv.uk можна безкоштовно: без реєстрації, VPN та встановлення застосунків — на комп\'ютері, смартфоні й планшеті. Якщо потік не вантажиться, плеєр автоматично пробує резервний сервер.',
  faq=[('Як дивитися {name} онлайн безкоштовно?', 'Відкрийте цю сторінку й натисніть ▶ — трансляція {name} запуститься автоматично. Реєстрація та VPN не потрібні.'),
       ('Чи можна дивитися {name} за кордоном?', 'Так. Сайт відкривається з будь-якої країни, VPN не потрібен.'),
       ('Чи доступний {name} на iPhone та Android?', 'Так. Відкрийте ukraine-tv.uk/{slug}/ у Safari (iPhone) або Chrome (Android) — трансляція запуститься одразу.'),
       ('Яка якість трансляції?', 'Якість залежить від джерела каналу та вашого інтернету. Якщо в каналу кілька рівнів якості, у плеєрі з\'являється кнопка ⚙ — за слабкого зв\'язку оберіть нижчий рівень.'),
       ('Що робити, якщо {name} не вантажиться?', 'Зачекайте кілька секунд — плеєр сам переключиться на резервний сервер. Якщо не допомогло, оновіть сторінку або оберіть інший канал зі списку.')],
  home_faq=[('Скільки каналів доступно?', 'Зараз на сайті {cn}: новини, кіно, серіали, музика, дитячі, регіональні та тематичні.'),
            ('Це безкоштовно?', 'Так. Перегляд безкоштовний, реєстрація та підписка не потрібні.'),
            ('Чи потрібен VPN?', 'Ні. Сайт відкривається з будь-якої країни без VPN.'),
            ('Чи є застосунок у Telegram?', 'Так. Усі канали доступні в Telegram-застосунку @UkraineTVHub_bot — на iOS, Android і Desktop.')],
  faq_h_home='Часті питання',
  not_found_h='Сторінку не знайдено', not_found_p='Такої сторінки немає або канал було вилучено. Перейдіть до списку каналів.',
 ),
 'en': dict(
  site='Ukraine TV', logo=('Ukraine', 'TV'), domain_tag='ukraine-tv.uk',
  nav_all='← All channels', subscribe='Subscribe', home='Home', all_ch='All {cn} — pick another', search='Search channel...',
  live='LIVE', live_247='Live 24/7', watch_prompt='{name} — tap to watch', status_idle='Press ▶ to start the stream',
  similar='Similar channels', popular='⭐ Popular channels', about_h='About {name}', faq_h='{name} — FAQ',
  tg_banner='<b>Join us on Telegram</b> — a backup way to watch if the site is unavailable', tg_pulse='Watch channels on Telegram',
  tg_card_h='Watch on Telegram', tg_card_p='All {cn} in one app — free. On iOS, Android and Desktop.', tg_card_btn='Subscribe to @UkraineTVHub',
  epg_h='Today\'s schedule', epg_now='On air now', epg_left='left: ', epg_upd='updated ',
  footer_tag='Free Ukrainian TV online', f_all='All channels', f_about='About', f_priv='Privacy', f_cookie='Cookie settings', f_adv='Advertising',
  f_note='This site does not host video content. All streams are provided by third parties and are publicly available on the Internet.',
  f_legal='Stream links are taken from open sources. At a rights holder\'s request a stream will be removed after proof of ownership — <a href="{priv}#rightsholders" style="color:inherit;text-decoration:underline">details</a>.',
  home_title='Ukraine TV — Ukrainian TV channels online, free ({cn})', home_h1='Ukrainian TV channels online',
  home_desc='Watch Ukrainian TV channels online for free: news, movies, series, music and kids\' channels — {cn} live. No sign-up, no VPN, 24/7 on phone and computer.',
  home_lead='{cn} live — free, no sign-up, no VPN.',
  home_intro='Ukraine TV is a free collection of live Ukrainian TV channels: news, movies and series, music, kids\' and regional channels. The site works from any country on computer, smartphone and tablet, and the same channels are available in our Telegram app. If one server\'s stream is unavailable, the player switches to a backup automatically.',
  all_tab='All', ch_count='{cn}',
  cat_title='{cat} — Ukrainian TV channels online', cat_h1='{cat} — TV channels online',
  ch_title='▶ {name} Live — Watch Online Free, 24/7',
  ch_desc='{name} online — {tag_l}. Watch the live stream free, no sign-up, no VPN, on phone and computer, 24/7.',
  ch_h1='{name} live — watch online free',
  ch_p2='You can watch {name} online at ukraine-tv.uk for free: no sign-up, no VPN and no app to install — on computer, smartphone and tablet. If the stream does not load, the player automatically tries a backup server.',
  faq=[('How do I watch {name} online for free?', 'Open this page and press ▶ — the {name} stream starts automatically. No sign-up or VPN needed.'),
       ('Can I watch {name} abroad?', 'Yes. The site opens from any country, no VPN needed.'),
       ('Is {name} available on iPhone and Android?', 'Yes. Open ukraine-tv.uk/en/{slug}/ in Safari (iPhone) or Chrome (Android) and the stream starts right away.'),
       ('What is the stream quality?', 'Quality depends on the channel\'s source and your connection. If a channel offers several quality levels, a ⚙ button appears in the player — pick a lower one on a weak connection.'),
       ('What if {name} does not load?', 'Wait a few seconds — the player switches to a backup server on its own. If that does not help, refresh the page or pick another channel from the list.')],
  home_faq=[('How many channels are available?', 'There are currently {cn}: news, movies, series, music, kids, regional and themed.'),
            ('Is it free?', 'Yes. Watching is free; no registration or subscription is required.'),
            ('Do I need a VPN?', 'No. The site opens from any country without a VPN.'),
            ('Is there a Telegram app?', 'Yes. All channels are available in the Telegram app @UkraineTVHub_bot on iOS, Android and Desktop.')],
  faq_h_home='FAQ',
  not_found_h='Page not found', not_found_p='This page does not exist or the channel was removed. Go to the channel list.',
 ),
 'ru': dict(
  site='Украина ТВ', logo=('Украина', 'ТВ'), domain_tag='ukraine-tv.uk',
  nav_all='← Все каналы', subscribe='Подписаться', home='Главная', all_ch='Все {cn} — выбрать другой', search='Поиск канала...',
  live='В ЭФИРЕ', live_247='Прямая трансляция 24/7', watch_prompt='{name} — нажмите для просмотра', status_idle='Нажмите ▶ для запуска трансляции',
  similar='Похожие каналы', popular='⭐ Популярные каналы', about_h='О канале {name}', faq_h='Частые вопросы о {name}',
  tg_banner='<b>Подпишитесь в Telegram</b> — запасной способ смотреть, если сайт станет недоступен', tg_pulse='Смотреть каналы в Telegram',
  tg_card_h='Смотрите в Telegram', tg_card_p='Все {cn} в одном приложении — бесплатно. На iOS, Android и Desktop.', tg_card_btn='Подписаться на @UkraineTVHub',
  epg_h='Программа на сегодня', epg_now='Сейчас в эфире', epg_left='осталось ', epg_upd='обновлено ',
  footer_tag='Бесплатное украинское ТВ онлайн', f_all='Все каналы', f_about='О сайте', f_priv='Конфиденциальность', f_cookie='Настройки cookie', f_adv='Реклама',
  f_note='Сайт не хранит видеоконтент. Все трансляции предоставляются третьими сторонами и доступны в открытом доступе в сети Интернет.',
  f_legal='Ссылки на трансляции взяты из открытых источников. По обращению правообладателя трансляция будет удалена после подтверждения прав — <a href="{priv}#rightsholders" style="color:inherit;text-decoration:underline">подробнее</a>.',
  home_title='Украина ТВ — украинские телеканалы онлайн бесплатно ({cn})', home_h1='Украинские телеканалы онлайн',
  home_desc='Смотрите украинские телеканалы онлайн бесплатно: новости, кино, сериалы, музыка и детские каналы — {cn} в прямом эфире. Без регистрации и VPN, 24/7 на телефоне и компьютере.',
  home_lead='{cn} в прямом эфире — бесплатно, без регистрации и VPN.',
  home_intro='Украина ТВ — бесплатная подборка украинских телеканалов в прямом эфире: новости, кино и сериалы, музыка, детские и региональные каналы. Сайт работает из любой страны, на компьютере, смартфоне и планшете; те же каналы доступны в Telegram-приложении. Если поток одного из серверов недоступен, плеер автоматически переключается на резервный.',
  all_tab='Все', ch_count='{cn}',
  cat_title='{cat} — украинские телеканалы онлайн', cat_h1='{cat} — телеканалы онлайн',
  ch_title='▶ {name} смотреть онлайн бесплатно — прямой эфир 24/7',
  ch_desc='{name} онлайн — {tag_l}. Смотрите прямую трансляцию бесплатно, без регистрации и VPN, на телефоне и компьютере, 24/7.',
  ch_h1='{name} смотреть онлайн бесплатно',
  ch_p2='Смотреть {name} онлайн на ukraine-tv.uk можно бесплатно: без регистрации, VPN и установки приложений — на компьютере, смартфоне и планшете. Если поток не загружается, плеер автоматически пробует резервный сервер.',
  faq=[('Как смотреть {name} онлайн бесплатно?', 'Откройте эту страницу и нажмите ▶ — трансляция {name} запустится автоматически. Регистрация и VPN не нужны.'),
       ('Можно ли смотреть {name} за рубежом?', 'Да. Сайт открывается из любой страны, VPN не нужен.'),
       ('Доступен ли {name} на iPhone и Android?', 'Да. Откройте ukraine-tv.uk/ru/{slug}/ в Safari (iPhone) или Chrome (Android) — трансляция запустится сразу.'),
       ('Какое качество трансляции?', 'Качество зависит от источника канала и вашего интернета. Если у канала несколько уровней качества, в плеере появляется кнопка ⚙ — при слабой связи выберите уровень ниже.'),
       ('Что делать, если {name} не загружается?', 'Подождите несколько секунд — плеер сам переключится на резервный сервер. Если не помогло, обновите страницу или выберите другой канал из списка.')],
  home_faq=[('Сколько каналов доступно?', 'Сейчас на сайте {cn}: новости, кино, сериалы, музыка, детские, региональные и тематические.'),
            ('Это бесплатно?', 'Да. Просмотр бесплатный, регистрация и подписка не нужны.'),
            ('Нужен ли VPN?', 'Нет. Сайт открывается из любой страны без VPN.'),
            ('Есть ли приложение в Telegram?', 'Да. Все каналы доступны в Telegram-приложении @UkraineTVHub_bot — на iOS, Android и Desktop.')],
  faq_h_home='Частые вопросы',
  not_found_h='Страница не найдена', not_found_p='Такой страницы нет или канал был удалён. Перейдите к списку каналов.',
 ),
}

# строки для assets/player.js (статусы плеера)
JS = {
 'uk': dict(st_freeze='⏳ Виявлено зависання, перепідключення...', st_buffer='⏳ Буферизація...', st_restore='⏳ Відновлення відтворення...',
            st_playing='▶ Трансляцію запущено', st_resume='⏳ Відновлення після паузи...', st_unavail='⏳ Джерело мовлення тимчасово недоступне, продовжуємо спроби автоматично...',
            st_reconnect='⏳ Перепідключення до трансляції...', st_backup='⏳ Резервний сервер', st_retry='⏳ Перепідключення', st_connect='⏳ Підключення...',
            st_nosupport='Ваш браузер не підтримує відтворення цього потоку', epg_now='Зараз в ефірі', epg_left='залишилось ', epg_upd='оновлено '),
 'en': dict(st_freeze='⏳ Freeze detected, reconnecting...', st_buffer='⏳ Buffering...', st_restore='⏳ Restoring playback...',
            st_playing='▶ Stream started', st_resume='⏳ Restoring after pause...', st_unavail='⏳ The source is temporarily unavailable, we keep trying automatically...',
            st_reconnect='⏳ Reconnecting to the stream...', st_backup='⏳ Backup server', st_retry='⏳ Reconnecting', st_connect='⏳ Connecting...',
            st_nosupport='Your browser cannot play this stream', epg_now='On air now', epg_left='left: ', epg_upd='updated '),
 'ru': dict(st_freeze='⏳ Обнаружено зависание, переподключение...', st_buffer='⏳ Буферизация...', st_restore='⏳ Восстановление воспроизведения...',
            st_playing='▶ Трансляция запущена', st_resume='⏳ Восстановление после паузы...', st_unavail='⏳ Источник вещания временно недоступен, продолжаем попытки автоматически...',
            st_reconnect='⏳ Переподключение к трансляции...', st_backup='⏳ Резервный сервер', st_retry='⏳ Переподключение', st_connect='⏳ Подключение...',
            st_nosupport='Ваш браузер не поддерживает воспроизведение этого потока', epg_now='Сейчас в эфире', epg_left='осталось ', epg_upd='обновлено '),
}


def cn(lang, n):
    """«33 канали» / «7 каналів» / «33 channels» / «33 канала» / «7 каналов»"""
    if lang == 'en':
        return '%d channel%s' % (n, '' if n == 1 else 's')
    m10, m100 = n % 10, n % 100
    one, few, many = ('канал', 'канали', 'каналів') if lang == 'uk' else ('канал', 'канала', 'каналов')
    w = one if (m10 == 1 and m100 != 11) else few if (2 <= m10 <= 4 and not 12 <= m100 <= 14) else many
    return '%d %s' % (n, w)
