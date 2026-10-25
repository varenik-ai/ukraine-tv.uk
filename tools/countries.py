"""Страницы «Украинское ТВ в <стране>»: данные и тексты (uk / en / ru). URL сохранены прежними."""

# tz: ключ в TZ; slug_*: прежние адреса страниц (en — в корне сайта, uk — в корне, ru — под /ru/)
COUNTRIES = [
 dict(id='australia', tz='au', en='Australia', uk='Австралія', uk_in='в Австралії', ru='Австралия', ru_in='в Австралии',
      slug_en='ukrainian-tv-in-australia', slug_uk='ukrainske-tv-v-avstralii', slug_ru='ukrainskoe-tv-v-avstralii'),
 dict(id='austria', tz='cet', en='Austria', uk='Австрія', uk_in='в Австрії', ru='Австрия', ru_in='в Австрии',
      slug_en='ukrainian-tv-in-austria', slug_uk='ukrainske-tv-u-avstrii', slug_ru='ukrainskoe-tv-v-avstrii'),
 dict(id='belgium', tz='cet', en='Belgium', uk='Бельгія', uk_in='у Бельгії', ru='Бельгия', ru_in='в Бельгии',
      slug_en='ukrainian-tv-in-belgium', slug_uk='ukrainske-tv-u-belhii', slug_ru='ukrainskoe-tv-v-belgii'),
 dict(id='canada', tz='ca', en='Canada', uk='Канада', uk_in='у Канаді', ru='Канада', ru_in='в Канаде',
      slug_en='ukrainian-tv-in-canada', slug_uk='ukrainske-tv-u-kanadi', slug_ru='ukrainskoe-tv-v-kanade'),
 dict(id='czech-republic', tz='cet', en='the Czech Republic', uk='Чехія', uk_in='у Чехії', ru='Чехия', ru_in='в Чехии',
      slug_en='ukrainian-tv-in-czech-republic', slug_uk='ukrainske-tv-u-chekhii', slug_ru='ukrainskoe-tv-v-chekhii'),
 dict(id='france', tz='cet', en='France', uk='Франція', uk_in='у Франції', ru='Франция', ru_in='во Франции',
      slug_en='ukrainian-tv-in-france', slug_uk='ukrainske-tv-u-frantsii', slug_ru='ukrainskoe-tv-v-frantsii'),
 dict(id='germany', tz='cet', en='Germany', uk='Німеччина', uk_in='у Німеччині', ru='Германия', ru_in='в Германии',
      slug_en='ukrainian-tv-in-germany', slug_uk='ukrainske-tv-u-nimechchyni', slug_ru='ukrainskoe-tv-v-germanii'),
 dict(id='israel', tz='il', en='Israel', uk='Ізраїль', uk_in='в Ізраїлі', ru='Израиль', ru_in='в Израиле',
      slug_en='ukrainian-tv-in-israel', slug_uk='ukrainske-tv-v-izraili', slug_ru='ukrainskoe-tv-v-izraile'),
 dict(id='italy', tz='cet', en='Italy', uk='Італія', uk_in='в Італії', ru='Италия', ru_in='в Италии',
      slug_en='ukrainian-tv-in-italy', slug_uk='ukrainske-tv-u-italii', slug_ru='ukrainskoe-tv-v-italii'),
 dict(id='netherlands', tz='cet', en='the Netherlands', uk='Нідерланди', uk_in='у Нідерландах', ru='Нидерланды', ru_in='в Нидерландах',
      slug_en='ukrainian-tv-in-netherlands', slug_uk='ukrainske-tv-u-niderlandakh', slug_ru='ukrainskoe-tv-v-niderlandakh'),
 dict(id='poland', tz='cet', en='Poland', uk='Польща', uk_in='у Польщі', ru='Польша', ru_in='в Польше',
      slug_en='ukrainian-tv-in-poland', slug_uk='ukrainske-tv-u-polshchi', slug_ru='ukrainskoe-tv-v-polshe'),
 dict(id='spain', tz='cet', en='Spain', uk='Іспанія', uk_in='в Іспанії', ru='Испания', ru_in='в Испании',
      slug_en='ukrainian-tv-in-spain', slug_uk='ukrainske-tv-u-ispanii', slug_ru='ukrainskoe-tv-v-ispanii'),
 dict(id='sweden', tz='cet', en='Sweden', uk='Швеція', uk_in='у Швеції', ru='Швеция', ru_in='в Швеции',
      slug_en='ukrainian-tv-in-sweden', slug_uk='ukrainske-tv-u-shvetsii', slug_ru='ukrainskoe-tv-v-shvetsii'),
 dict(id='uk', tz='gb', en='the United Kingdom', uk='Велика Британія', uk_in='у Великій Британії', ru='Великобритания', ru_in='в Великобритании',
      slug_en='ukrainian-tv-in-uk', slug_uk='ukrainske-tv-u-velykobrytanii', slug_ru='ukrainskoe-tv-v-velikobritanii'),
 dict(id='usa', tz='us', en='the USA', uk='США', uk_in='у США', ru='США', ru_in='в США',
      slug_en='ukrainian-tv-in-usa', slug_uk='ukrainske-tv-u-ssha', slug_ru='ukrainskoe-tv-v-ssha'),
]
HUB = {'en': '/en/ukrainian-tv-abroad/', 'uk': '/ukrainske-tv-za-kordonom/', 'ru': '/ru/ukrainskoe-tv-za-rubezhom/'}

# Разница с Киевом (общие сведения; из-за разных дат перехода на летнее время возможны отклонения на час)
TZ = {
 'cet': {'uk': 'на 1 годину менше, ніж у Києві', 'en': '1 hour behind Kyiv', 'ru': 'на 1 час меньше, чем в Киеве'},
 'gb':  {'uk': 'на 2 години менше, ніж у Києві', 'en': '2 hours behind Kyiv', 'ru': 'на 2 часа меньше, чем в Киеве'},
 'il':  {'uk': 'приблизно такий самий, як у Києві', 'en': 'about the same as in Kyiv', 'ru': 'примерно такое же, как в Киеве'},
 'us':  {'uk': 'на 7–10 годин менше, ніж у Києві (залежно від штату)', 'en': '7–10 hours behind Kyiv (depending on the state)', 'ru': 'на 7–10 часов меньше, чем в Киеве (в зависимости от штата)'},
 'ca':  {'uk': 'на 7–10 годин менше, ніж у Києві (залежно від провінції)', 'en': '7–10 hours behind Kyiv (depending on the province)', 'ru': 'на 7–10 часов меньше, чем в Киеве (в зависимости от провинции)'},
 'au':  {'uk': 'на 6–9 годин більше, ніж у Києві (залежно від міста та сезону)', 'en': '6–9 hours ahead of Kyiv (depending on the city and season)', 'ru': 'на 6–9 часов больше, чем в Киеве (в зависимости от города и сезона)'},
}

C = {
 'uk': dict(
  title='Українське ТБ {in_} онлайн безкоштовно — без VPN', h1='Українське ТБ {in_} — безкоштовно онлайн',
  desc='Дивіться українські телеканали {in_} онлайн безкоштовно: новини, кіно, серіали, музика та дитячі канали. Без VPN і реєстрації, на телефоні й комп\'ютері, 24/7.',
  lead='Українці {in_} можуть дивитися рідні телеканали прямо в браузері — безкоштовно, без реєстрації та VPN. {cn} у прямому ефірі.',
  breadcrumb_hub='Українське ТБ за кордоном', watch_h='Дивитися зараз', popular_h='Популярні канали {in_}', all_cats='Усі категорії каналів',
  how_h='Як дивитися українське ТБ {in_}', steps=['Відкрийте цю сторінку або головну {site} у браузері на комп\'ютері, телефоні чи планшеті.', 'Оберіть канал із добірки вище та натисніть ▶ — трансляція запуститься автоматично.', 'За бажанням скористайтеся Telegram-застосунком @UkraineTVHub_bot: ті самі канали, зручно на смартфоні.'],
  tz_h='Різниця в часі з Києвом', tz_p='Місцевий час {in_}: {tz}. На сторінках каналів блок «Програма на сьогодні» показує час за годинником вашого пристрою.',
  faq_h='Часті питання', faq=[
   ('Чи потрібен VPN, щоб дивитися українське ТБ {in_}?', 'Ні. Сайт відкривається з будь-якої країни без VPN і без реєстрації.'),
   ('Чи безкоштовне українське ТБ {in_}?', 'Так. Перегляд усіх каналів на сайті безкоштовний, підписка не потрібна.'),
   ('Чи можна дивитися на iPhone та Android?', 'Так. Відкрийте сайт у Safari (iPhone) або Chrome (Android), або скористайтеся Telegram-застосунком — трансляція запуститься одразу.'),
   ('Які канали доступні {in_}?', 'Доступно {cn}: новини, кіно та серіали, музика, дитячі, регіональні та тематичні. Повний список — на головній сторінці.'),
   ('Яка різниця в часі з Києвом {in_}?', 'Місцевий час {in_}: {tz}.')],
  others_h='Українське ТБ в інших країнах', hub_title='Українське ТБ за кордоном — онлайн безкоштовно у {n} країнах', hub_h1='Українське ТБ за кордоном',
  hub_desc='Українські телеканали онлайн для українців за кордоном: Німеччина, Польща, Велика Британія, США, Канада та інші країни. Безкоштовно, без VPN, 24/7.',
  hub_lead='Оберіть країну — на сторінці є добірка каналів, поради щодо перегляду та різниця в часі з Києвом.', card_p='Дивитися українські канали {in_}'),
 'en': dict(
  title='Watch Ukrainian TV in {country} Free Online — No VPN', h1='Watch Ukrainian TV in {country} — Free Online',
  desc='Watch Ukrainian TV channels in {country} online for free: news, movies, series, music and kids\' channels. No VPN or sign-up, on phone and computer, 24/7.',
  lead='Ukrainians in {country} can watch their home TV channels right in the browser — free, with no sign-up and no VPN. {cn} live.',
  breadcrumb_hub='Ukrainian TV abroad', watch_h='Watch now', popular_h='Popular Ukrainian channels in {country}', all_cats='All channel categories',
  how_h='How to watch Ukrainian TV in {country}', steps=['Open this page or the {site} home page in a browser on a computer, phone or tablet.', 'Pick a channel from the selection above and press ▶ — the stream starts automatically.', 'Optionally use the Telegram app @UkraineTVHub_bot: the same channels, convenient on a smartphone.'],
  tz_h='Time difference with Kyiv', tz_p='Local time in {country}: {tz}. On channel pages the "Today\'s schedule" block shows times in your device\'s local time.',
  faq_h='Frequently asked questions', faq=[
   ('Do I need a VPN to watch Ukrainian TV in {country}?', 'No. The site opens from any country without a VPN and without registration.'),
   ('Is Ukrainian TV free in {country}?', 'Yes. Watching all channels on the site is free, no subscription needed.'),
   ('Can I watch on iPhone or Android?', 'Yes. Open the site in Safari (iPhone) or Chrome (Android), or use the Telegram app — the stream starts right away.'),
   ('What channels are available in {country}?', '{cn} are available: news, movies and series, music, kids, regional and themed. The full list is on the home page.'),
   ('What is the time difference between {country} and Kyiv?', 'Local time in {country}: {tz}.')],
  others_h='Ukrainian TV in other countries', hub_title='Ukrainian TV Abroad — Watch Free Online in {n} Countries', hub_h1='Ukrainian TV abroad',
  hub_desc='Ukrainian TV channels online for Ukrainians abroad: Germany, Poland, the UK, the USA, Canada and more. Free, no VPN, 24/7.',
  hub_lead='Pick a country — each page has a selection of channels, viewing tips and the time difference with Kyiv.', card_p='Watch Ukrainian channels in {country}'),
 'ru': dict(
  title='Украинское ТВ {in_} онлайн бесплатно — без VPN', h1='Украинское ТВ {in_} — бесплатно онлайн',
  desc='Смотрите украинские телеканалы {in_} онлайн бесплатно: новости, кино, сериалы, музыка и детские каналы. Без VPN и регистрации, на телефоне и компьютере, 24/7.',
  lead='Украинцы {in_} могут смотреть родные телеканалы прямо в браузере — бесплатно, без регистрации и VPN. {cn} в прямом эфире.',
  breadcrumb_hub='Украинское ТВ за рубежом', watch_h='Смотреть сейчас', popular_h='Популярные каналы {in_}', all_cats='Все категории каналов',
  how_h='Как смотреть украинское ТВ {in_}', steps=['Откройте эту страницу или главную {site} в браузере на компьютере, телефоне или планшете.', 'Выберите канал из подборки выше и нажмите ▶ — трансляция запустится автоматически.', 'При желании воспользуйтесь Telegram-приложением @UkraineTVHub_bot: те же каналы, удобно на смартфоне.'],
  tz_h='Разница во времени с Киевом', tz_p='Местное время {in_}: {tz}. На страницах каналов блок «Программа на сегодня» показывает время по часам вашего устройства.',
  faq_h='Частые вопросы', faq=[
   ('Нужен ли VPN, чтобы смотреть украинское ТВ {in_}?', 'Нет. Сайт открывается из любой страны без VPN и без регистрации.'),
   ('Бесплатно ли украинское ТВ {in_}?', 'Да. Просмотр всех каналов на сайте бесплатный, подписка не нужна.'),
   ('Можно ли смотреть на iPhone и Android?', 'Да. Откройте сайт в Safari (iPhone) или Chrome (Android) либо используйте Telegram-приложение — трансляция запустится сразу.'),
   ('Какие каналы доступны {in_}?', 'Доступно {cn}: новости, кино и сериалы, музыка, детские, региональные и тематические. Полный список — на главной странице.'),
   ('Какая разница во времени с Киевом {in_}?', 'Местное время {in_}: {tz}.')],
  others_h='Украинское ТВ в других странах', hub_title='Украинское ТВ за рубежом — онлайн бесплатно в {n} странах', hub_h1='Украинское ТВ за рубежом',
  hub_desc='Украинские телеканалы онлайн для украинцев за рубежом: Германия, Польша, Великобритания, США, Канада и другие страны. Бесплатно, без VPN, 24/7.',
  hub_lead='Выберите страну — на странице подборка каналов, советы по просмотру и разница во времени с Киевом.', card_p='Смотреть украинские каналы {in_}'),
}
