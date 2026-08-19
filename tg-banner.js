/* Telegram Banner — ukraine-tv.uk
   Inserts a sticky Telegram promo card:
   - On main/player pages: prepended inside <aside>
   - On country/landing pages: fixed widget on right edge
*/
(function () {
  var LINK = 'https://t.me/UkraineTVHub';
  var HANDLE = '@UkraineTVHub';

  var I18N = {
    uk: {
      title: 'Дивіться без реклами в Telegram',
      sub:   '36 українських каналів наживо прямо в месенджері',
      feats: ['Без реєстрації', 'iOS · Android · Desktop', 'Без VPN з будь-якої країни', 'HD якість 24/7'],
      btn:   'Відкрити Україна ТВ'
    },
    en: {
      title: 'Watch without ads in Telegram',
      sub:   '36 Ukrainian channels live in the messenger',
      feats: ['No registration', 'iOS · Android · Desktop', 'No VPN from any country', 'HD quality 24/7'],
      btn:   'Open Ukraine TV'
    },
    ru: {
      title: 'Смотрите без рекламы в Telegram',
      sub:   '36 украинских каналов в прямом эфире в мессенджере',
      feats: ['Без регистрации', 'iOS · Android · Desktop', 'Без VPN из любой страны', 'HD качество 24/7'],
      btn:   'Открыть Украина ТВ'
    }
  };

  var lang = (document.documentElement.lang || 'uk').slice(0, 2);
  var t = I18N[lang] || I18N['uk'];

  var TG_SVG = '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;display:block;margin:0 auto 14px"><defs><linearGradient id="tgg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38b0e3"/><stop offset="1" stop-color="#1d93d2"/></linearGradient></defs><circle cx="120" cy="120" r="120" fill="url(#tgg)"/><path fill="#fff" d="M98 152l-3 22c4 0 6-2 8-4l19-18 40 29c7 4 12 2 14-7l25-118c2-10-4-14-11-11L32 107c-9 4-9 9-2 11l46 14 107-68c5-3 10-1 6 3z"/></svg>';
  var BTN_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" style="flex-shrink:0"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.9 8.22l-1.97 9.28c-.15.66-.54.82-1.08.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.37-.12l-6.87 4.33-2.96-.93c-.64-.2-.66-.64.14-.95l11.57-4.46c.54-.19 1.01.13.83.93z"/></svg>';

  var css = [
    '#tgb{background:linear-gradient(160deg,#1e2f54 0%,#0e1d3a 100%);border:1px solid #2d4270;border-radius:14px;padding:22px 16px 18px;margin-bottom:16px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.4);}',
    '#tgb h3{color:#fff;font-size:15px;font-weight:700;margin:0 0 8px;line-height:1.35;}',
    '#tgb p.tgb-sub{color:#9badc8;font-size:12.5px;margin:0 0 14px;line-height:1.45;}',
    '#tgb ul{list-style:none;padding:0;margin:0 0 16px;text-align:left;}',
    '#tgb ul li{color:#c2cfe0;font-size:12px;padding:3px 0;display:flex;align-items:center;gap:6px;}',
    '#tgb ul li::before{content:"✓";color:#2AABEE;font-weight:700;}',
    '#tgb .tgb-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#2AABEE;color:#fff;border-radius:10px;padding:11px 16px;text-decoration:none;font-weight:700;font-size:14px;transition:background .2s;margin-bottom:8px;}',
    '#tgb .tgb-btn:hover{background:#229ED9;}',
    '#tgb .tgb-handle{color:#5a6d8a;font-size:11px;margin:0;}',
    /* Floating widget for pages without aside */
    '#tgb-float{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:999;width:220px;transition:right .3s ease;}',
    '#tgb-float.collapsed{right:-185px;}',
    '#tgb-float .tgb-tab{position:absolute;left:-32px;top:50%;transform:translateY(-50%);background:#2AABEE;color:#fff;writing-mode:vertical-rl;text-orientation:mixed;padding:12px 8px;border-radius:8px 0 0 8px;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:.05em;white-space:nowrap;}',
    '#tgb-float #tgb{margin:0;border-radius:14px 0 0 14px;}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function buildCard() {
    var ul = t.feats.map(function(f){ return '<li>' + f + '</li>'; }).join('');
    var html = TG_SVG +
      '<h3>' + t.title + '</h3>' +
      '<p class="tgb-sub">' + t.sub + '</p>' +
      '<ul>' + ul + '</ul>' +
      '<a href="' + LINK + '" target="_blank" rel="noopener" class="tgb-btn">' + BTN_SVG + t.btn + '</a>' +
      '<p class="tgb-handle">' + HANDLE + '</p>';
    var div = document.createElement('div');
    div.id = 'tgb';
    div.innerHTML = html;
    return div;
  }

  function init() {
    if (document.getElementById('tgb') || document.getElementById('tgb-float')) return;

    var aside = document.querySelector('aside');
    if (aside) {
      // Main player page: prepend to sidebar
      aside.insertBefore(buildCard(), aside.firstChild);
    } else {
      // Landing/country page: floating collapsible widget
      var wrap = document.createElement('div');
      wrap.id = 'tgb-float';
      wrap.className = 'collapsed';
      var tab = document.createElement('div');
      tab.className = 'tgb-tab';
      tab.textContent = 'Telegram';
      tab.onclick = function() { wrap.classList.toggle('collapsed'); };
      wrap.appendChild(tab);
      wrap.appendChild(buildCard());
      document.body.appendChild(wrap);

      // Auto-expand after scroll 300px
      window.addEventListener('scroll', function onScroll() {
        if (window.scrollY > 300) {
          wrap.classList.remove('collapsed');
          window.removeEventListener('scroll', onScroll);
        }
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
