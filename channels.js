var CHANNEL_GROUPS = [
  {
    label: '📡 Новини та загальні',
    channels: [
      { id:'pershyi',    name:'Перший канал',   desc:'Головний канал України',    icon:'1',    color:'#005BBB', iconBg:'#08101a', tags:['новини','загальний'] },
      { id:'channel5',   name:'5 Канал',        desc:'Новини та аналітика',       icon:'5',    color:'#1565c0', iconBg:'#0a0f1a', tags:['новини','аналітика'] },
      { id:'espreso',    name:'Еспресо ТВ',     desc:'Новини 24/7',               icon:'ЕСП',  color:'#005BBB', iconBg:'#08101a', tags:['новини'] },
      { id:'ukraine24',  name:'Україна 24',     desc:'Новини 24/7',               icon:'У24',  color:'#1565c0', iconBg:'#0a0f1a', tags:['новини'] },
      { id:'kyiv24',     name:'Київ 24',        desc:'Новини столиці',            icon:'К24',  color:'#0277bd', iconBg:'#081218', tags:['новини','Київ'] },
      { id:'news24',     name:'24 Канал',       desc:'Новини та репортажі',       icon:'24',   color:'#c62828', iconBg:'#180808', tags:['новини'] },
      { id:'rada',       name:'Рада ТВ',        desc:'Парламентський канал',      icon:'РД',   color:'#2e7d32', iconBg:'#081208', tags:['парламент','суспільний'] }
    ]
  },
  {
    label: '🎬 Розваги та кіно',
    channels: [
      { id:'ntn',        name:'НТН',            desc:'Кіно та серіали',           icon:'НТН',  color:'#e53935', iconBg:'#1a0808', tags:['кіно','серіали'] },
      { id:'oneplusone', name:'1+1 Міжнар.',    desc:'Розваги та шоу',            icon:'1+1',  color:'#FFD500', iconBg:'#1a1400', tags:['розваги','шоу'] },
      { id:'kvartal',    name:'Квартал ТВ',     desc:'Гумор та розваги',          icon:'КВ',   color:'#ff6d00', iconBg:'#1a1000', tags:['гумор','розваги'] },
      { id:'interplus',  name:'Інтер+',         desc:'Серіали та кіно',           icon:'INT+', color:'#7b1fa2', iconBg:'#140a18', tags:['серіали','кіно'] },
      { id:'mega',       name:'Мега',           desc:'Кіно та серіали',           icon:'МГ',   color:'#d81b60', iconBg:'#180810', tags:['кіно','серіали'] },
      { id:'k2',         name:'К2',             desc:'Кіно та розваги',           icon:'К2',   color:'#6a1b9a', iconBg:'#130a18', tags:['кіно','розваги'] },
      { id:'cinema4ever',name:'4ever Cinema',   desc:'Кіно 24/7',                 icon:'4CIN', color:'#e65100', iconBg:'#1a0e00', tags:['кіно'] },
      { id:'drama4ever', name:'4ever Drama',    desc:'Серіали та драми',          icon:'4DRM', color:'#4a148c', iconBg:'#0e0a18', tags:['серіали','драми'] }
    ]
  },
  {
    label: '📺 Суспільне та громадські',
    channels: [
      { id:'suspilne',  name:'Суспільне Київ', desc:'Суспільне мовлення',        icon:'СУС',  color:'#2e7d32', iconBg:'#081208', tags:['суспільний'] },
      { id:'irt',       name:'IRT',            desc:'Громадський канал',          icon:'IRT',  color:'#00838f', iconBg:'#081214', tags:['громадський'] },
      { id:'armytv',    name:'Армія ТВ',       desc:'Телеканал Збройних Сил',    icon:'АРМ',  color:'#33691e', iconBg:'#0a1408', tags:['армія','збройні сили'] }
    ]
  },
  {
    label: '🏙️ Регіональні',
    channels: [
      { id:'rai',       name:'RAI',            desc:'Розваги та музика',          icon:'RAI',  color:'#ad1457', iconBg:'#180810', tags:['регіональний'] },
      { id:'tva',       name:'TVA',            desc:'Регіональне ТВ',             icon:'TVA',  color:'#37474f', iconBg:'#0a0f12', tags:['регіональний'] },
      { id:'ntk',       name:'NTK TV',         desc:'Телеканал Кременчука',       icon:'NTK',  color:'#0277bd', iconBg:'#081218', tags:['регіональний','Кременчук'] },
      { id:'dnipro',    name:'Дніпро TV',      desc:'Регіональний Дніпро',        icon:'ДНП',  color:'#1565c0', iconBg:'#0a0f1a', tags:['регіональний','Дніпро'] },
      { id:'ch7',       name:'7 Канал',        desc:'Регіональний Одеса',         icon:'7К',   color:'#00838f', iconBg:'#081214', tags:['регіональний','Одеса'] },
      { id:'rivne1',    name:'Рівне 1',        desc:'Регіональне Рівне',          icon:'РВ1',  color:'#558b2f', iconBg:'#0a1408', tags:['регіональний','Рівне'] },
      { id:'itv',       name:'ITV',            desc:'Регіональне ТВ',             icon:'ITV',  color:'#f57f17', iconBg:'#181000', tags:['регіональний'] }
    ]
  },
  {
    label: '🎵 Музика',
    channels: [
      { id:'muzvar',    name:'Мюзвар',         desc:'Українська музика 24/7',     icon:'МЗВ',  color:'#FFD500', iconBg:'#1a1400', tags:['музика','українська'] },
      { id:'nashemus',  name:'NASHE Music',    desc:'Українська музика',          icon:'НШМ',  color:'#005BBB', iconBg:'#08101a', tags:['музика','українська'] },
      { id:'m1',        name:'М1',             desc:'Музика та кліпи',            icon:'М1',   color:'#c62828', iconBg:'#180808', tags:['музика','кліпи'] },
      { id:'music4ever',name:'4ever Music',    desc:'Музика 24/7',                icon:'4MUS', color:'#1565c0', iconBg:'#0a0f1a', tags:['музика'] },
      { id:'uamusic',   name:'UA Music',       desc:'Українська музика',          icon:'UAM',  color:'#2e7d32', iconBg:'#081208', tags:['музика','українська'] }
    ]
  },
  {
    label: '👶 Дитячі',
    channels: [
      { id:'nikikids',  name:'Niki Kids',      desc:'Мультфільми та шоу',         icon:'NIK',  color:'#f57f17', iconBg:'#181000', tags:['дитячий','мультфільми'] },
      { id:'nikijunior',name:'Niki Junior',    desc:'Для найменших',              icon:'NIKJ', color:'#e91e63', iconBg:'#180810', tags:['дитячий'] }
    ]
  },
  {
    label: '🎯 Тематичні',
    channels: [
      { id:'rybalka',   name:'Rybalka TV',     desc:'Риболовля та природа',       icon:'РИБ',  color:'#0277bd', iconBg:'#081218', tags:['риболовля','природа'] },
      { id:'uafashion', name:'UA Fashion TV',  desc:'Мода та стиль',              icon:'МОД',  color:'#e91e63', iconBg:'#180810', tags:['мода','стиль'] },
      { id:'svarozhychy',name:'Svarozhychy',  desc:'Традиції та культура',       icon:'СВР',  color:'#5d4037', iconBg:'#120a08', tags:['культура','традиції'] },
      { id:'equalympic',name:'Equalympic',     desc:'Спорт для всіх',             icon:'EQL',  color:'#2e7d32', iconBg:'#081208', tags:['спорт'] }
    ]
  }
];
