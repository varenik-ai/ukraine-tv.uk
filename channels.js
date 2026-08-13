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
      { id:'marafon',    name:'1+1 Марафон',    desc:'Марафон новин 24/7',        icon:'МАР',  color:'#FFD500', iconBg:'#1a1400', tags:['новини','марафон'] },
      { id:'kvartal',    name:'Квартал ТВ',     desc:'Гумор та розваги',          icon:'КВ',   color:'#ff6d00', iconBg:'#1a1000', tags:['гумор','розваги'] },
      { id:'interplus',  name:'Інтер+',         desc:'Серіали та кіно',           icon:'INT+', color:'#7b1fa2', iconBg:'#140a18', tags:['серіали','кіно'] },
      { id:'mega',       name:'Мега',           desc:'Кіно та серіали',           icon:'МГ',   color:'#d81b60', iconBg:'#180810', tags:['кіно','серіали'] },
      { id:'k2',         name:'К2',             desc:'Кіно та розваги',           icon:'К2',   color:'#6a1b9a', iconBg:'#130a18', tags:['кіно','розваги'] },
      { id:'filmualive', name:'FilmUA Live',    desc:'Українське кіно 24/7',      icon:'FUA',  color:'#e65100', iconBg:'#1a0e00', tags:['кіно'] },
      { id:'filmua_drama',name:'FilmUA Drama',  desc:'Серіали та драми',          icon:'FUAD', color:'#4a148c', iconBg:'#0e0a18', tags:['серіали','драми'] }
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
      { id:'nashemus',  name:'NASHE Music',    desc:'Українська музика',          icon:'НШМ',  color:'#005BBB', iconBg:'#08101a', tags:['музика','українська'] }
    ]
  },
  {
    label: '🎯 Тематичні',
    channels: [
      { id:'rybalka',   name:'Rybalka TV',     desc:'Риболовля та природа',       icon:'РИБ',  color:'#0277bd', iconBg:'#081218', tags:['риболовля','природа'] }
    ]
  }
];
