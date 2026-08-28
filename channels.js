var CHANNEL_GROUPS = [
  {
    label: '📡 Новини та загальні',
    channels: [
      { id:'pershyi', slug:'pershyi-live', name:'Перший канал', desc:'Головний канал України', icon:'1', color:'#005BBB', iconBg:'#08101a', tags:['новини','загальний'] },
      { id:'channel5', slug:'channel5-live', name:'5 Канал', desc:'Новини та аналітика', icon:'5', color:'#1565c0', iconBg:'#0a0f1a', tags:['новини','аналітика'] },
      { id:'espreso', slug:'espreso-live', name:'Еспресо ТВ', desc:'Новини 24/7', icon:'ЕСП', color:'#005BBB', iconBg:'#08101a', tags:['новини'] },
      { id:'kyiv24', slug:'kyiv24-live', name:'Київ 24', desc:'Новини столиці', icon:'К24', color:'#0277bd', iconBg:'#081218', tags:['новини','Київ'] },
      { id:'news24', slug:'24kanal-live', name:'24 Канал', desc:'Новини та репортажі', icon:'24', color:'#c62828', iconBg:'#180808', tags:['новини'] },
      { id:'rada', slug:'rada-tv-live', name:'Рада ТВ', desc:'Парламентський канал', icon:'РД', color:'#2e7d32', iconBg:'#081208', tags:['парламент','суспільний'] },
    ]
  },
  {
    label: '🎬 Розваги та кіно',
    channels: [
      { id:'ntn', slug:'ntn-live', name:'НТН', desc:'Кіно та серіали', icon:'НТН', color:'#e53935', iconBg:'#1a0808', tags:['кіно','серіали'] },
      { id:'inter', slug:'inter-live', name:'Інтер', desc:'Серіали та кіно', icon:'ІНТ', color:'#00897b', iconBg:'#081412', tags:['серіали','кіно'] },
      { id:'oneplusone', slug:'1plus1-live', name:'1+1 Міжнар.', desc:'Розваги та шоу', icon:'1+1', color:'#FFD500', iconBg:'#1a1400', tags:['розваги','шоу'] },
      { id:'marafon', slug:'', name:'1+1 Марафон', desc:'Марафон новин 24/7', icon:'МАР', color:'#FFD500', iconBg:'#1a1400', tags:['новини','марафон'] },
      { id:'kvartal', slug:'kvartal-tv-live', name:'Квартал ТВ', desc:'Гумор та розваги', icon:'КВ', color:'#ff6d00', iconBg:'#1a1000', tags:['гумор','розваги'] },
      { id:'interplus', slug:'inter-plus-live', name:'Інтер+', desc:'Серіали та кіно', icon:'INT+', color:'#7b1fa2', iconBg:'#140a18', tags:['серіали','кіно'] },
      { id:'mega', slug:'mega-live', name:'Мега', desc:'Кіно та серіали', icon:'МГ', color:'#d81b60', iconBg:'#180810', tags:['кіно','серіали'] },
      { id:'k2', slug:'k2-live', name:'К2', desc:'Кіно та розваги', icon:'К2', color:'#6a1b9a', iconBg:'#130a18', tags:['кіно','розваги'] },
      { id:'filmualive', slug:'4ever-cinema-live', name:'FilmUA Live', desc:'Українське кіно 24/7', icon:'FUA', color:'#e65100', iconBg:'#1a0e00', tags:['кіно'] },
      { id:'filmua_drama', slug:'4ever-drama-live', name:'FilmUA Drama', desc:'Серіали та драми', icon:'FUAD', color:'#4a148c', iconBg:'#0e0a18', tags:['серіали','драми'] },
    ]
  },
  {
    label: '📺 Суспільне та громадські',
    channels: [
      { id:'suspilne', slug:'suspilne-live', name:'Суспільне Київ', desc:'Суспільне мовлення', icon:'СУС', color:'#2e7d32', iconBg:'#081208', tags:['суспільний'] },
      { id:'irt', slug:'irt-live', name:'IRT', desc:'Громадський канал', icon:'IRT', color:'#00838f', iconBg:'#081214', tags:['громадський'] },
      { id:'armytv', slug:'armiya-tv-live', name:'Армія ТВ', desc:'Телеканал Збройних Сил', icon:'АРМ', color:'#33691e', iconBg:'#0a1408', tags:['армія','збройні сили'] },
    ]
  },
  {
    label: '🏙️ Регіональні',
    channels: [
      { id:'rai', slug:'rai-live', name:'RAI', desc:'Розваги та музика', icon:'RAI', color:'#ad1457', iconBg:'#180810', tags:['регіональний'] },
      { id:'tva', slug:'tva-live', name:'TVA', desc:'Регіональне ТВ', icon:'TVA', color:'#37474f', iconBg:'#0a0f12', tags:['регіональний'] },
      { id:'ntk', slug:'ntk-tv-live', name:'NTK TV', desc:'Телеканал Кременчука', icon:'NTK', color:'#0277bd', iconBg:'#081218', tags:['регіональний','Кременчук'] },
      { id:'dnipro', slug:'dnipro-tv-live', name:'Дніпро TV', desc:'Регіональний Дніпро', icon:'ДНП', color:'#1565c0', iconBg:'#0a0f1a', tags:['регіональний','Дніпро'] },
      { id:'ch7', slug:'7kanal-live', name:'7 Канал', desc:'Регіональний Одеса', icon:'7К', color:'#00838f', iconBg:'#081214', tags:['регіональний','Одеса'] },
      { id:'rivne1', slug:'rivne1-live', name:'Рівне 1', desc:'Регіональне Рівне', icon:'РВ1', color:'#558b2f', iconBg:'#0a1408', tags:['регіональний','Рівне'] },
      { id:'itv', slug:'itv-live', name:'ITV', desc:'Регіональне ТВ', icon:'ITV', color:'#f57f17', iconBg:'#181000', tags:['регіональний'] },
    ]
  },
  {
    label: '🎵 Музика',
    channels: [
      { id:'muzvar', slug:'muzvar-live', name:'Мюзвар', desc:'Українська музика 24/7', icon:'МЗВ', color:'#FFD500', iconBg:'#1a1400', tags:['музика','українська'] },
      { id:'nashemus', slug:'nashe-music-live', name:'NASHE Music', desc:'Українська музика', icon:'НШМ', color:'#005BBB', iconBg:'#08101a', tags:['музика','українська'] },
      { id:'m1', slug:'m1-live', name:'М1', desc:'Музика та кліпи', icon:'М1', color:'#8e24aa', iconBg:'#140a18', tags:['музика'] },
      { id:'music4ever', slug:'4ever-music-live', name:'4ever Music', desc:'Музика без зупинок 24/7', icon:'4MUS', color:'#fb8c00', iconBg:'#1a1200', tags:['музика'] },
      { id:'uamusic', slug:'ua-music-live', name:'UA Music', desc:'Українська музика — підтримуємо своїх', icon:'UAM', color:'#43a047', iconBg:'#0a1408', tags:['музика','українська'] },
    ]
  },
  {
    label: '👶 Дитячі',
    channels: [
      { id:'nikikids', slug:'niki-kids-live', name:'Niki Kids', desc:'Мультфільми та шоу для дітей', icon:'NIK', color:'#29b6f6', iconBg:'#081418', tags:['діти','мультфільми'] },
      { id:'nikijunior', slug:'niki-junior-live', name:'Niki Junior', desc:'Для найменших — розвивальний контент', icon:'NIKJ', color:'#ec407a', iconBg:'#180810', tags:['діти','розвиток'] },
    ]
  },
  {
    label: '🎯 Тематичні',
    channels: [
      { id:'rybalka', slug:'rybalka-tv-live', name:'Rybalka TV', desc:'Риболовля та природа', icon:'РИБ', color:'#0277bd', iconBg:'#081218', tags:['риболовля','природа'] },
      { id:'uafashion', slug:'ua-fashion-tv-live', name:'UA Fashion TV', desc:'Мода, стиль та краса', icon:'МОД', color:'#d81b60', iconBg:'#1a0812', tags:['мода','стиль'] },
      { id:'svarozhychy', slug:'svarozhychy-live', name:'Svarozhychy', desc:'Традиції, культура та спадщина', icon:'СВР', color:'#6d4c41', iconBg:'#140e0a', tags:['культура','традиції'] },
      { id:'equalympic', slug:'equalympic-live', name:'Equalympic', desc:'Спорт для всіх — адаптивний спорт', icon:'EQL', color:'#1e88e5', iconBg:'#0a1220', tags:['спорт'] },
    ]
  },
];
