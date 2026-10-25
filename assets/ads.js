/* Реклама: Monetag (In-Page Push, все страницы) и баннер Adsterra (блоки .ad-slot справа от плеера).
   Загружается ТОЛЬКО после согласия (assets/gate.js). Пустые ключи = реклама выключена.
   Проверка без рекламы: добавьте ?noads=1 к адресу. Аварийный выключатель: ADS_ENABLED = false. */
(function () {
  var ADS_ENABLED = true;
  var MONETAG = { zone: '11258077', src: 'https://nap5k.com/tag.min.js', delayMs: 20000 };  // In-Page Push «Luminous tag», сайт ukraine-tv.uk (Monetag, site 3401185)
  var ADSTERRA = { key: '', src: '', width: 300, height: 250 };  // key и src из кода баннера Adsterra (…/<key>/invoke.js)
  if (!ADS_ENABLED || /[?&]noads=1/.test(location.search)) return;
  var done = false;
  function monetag() {
    if (!MONETAG.zone || !MONETAG.src) return;
    setTimeout(function () {
      try { var s = document.createElement('script'); s.async = true; s.dataset.zone = MONETAG.zone; s.src = MONETAG.src; (document.body || document.documentElement).appendChild(s); } catch (e) {}
    }, MONETAG.delayMs);
  }
  function banners() {
    if (!ADSTERRA.key || !ADSTERRA.src) return;
    Array.prototype.forEach.call(document.querySelectorAll('.ad-slot'), function (slot) {
      if (slot.getAttribute('data-ready')) return; slot.setAttribute('data-ready', '1');
      var f = document.createElement('iframe');
      f.width = ADSTERRA.width; f.height = ADSTERRA.height; f.setAttribute('scrolling', 'no'); f.setAttribute('title', 'Advertisement'); f.setAttribute('loading', 'lazy');
      f.style.cssText = 'border:0;max-width:100%;display:block;margin:0 auto';
      f.srcdoc = '<!doctype html><html><body style="margin:0;background:transparent"><script>atOptions={"key":"' + ADSTERRA.key + '","format":"iframe","height":' + ADSTERRA.height + ',"width":' + ADSTERRA.width + ',"params":{}};<\/script><script src="' + ADSTERRA.src + '"><\/script></body></html>';
      slot.appendChild(f); slot.classList.add('on');
    });
  }
  function run() { if (done) return; done = true; monetag(); banners(); }
  function start() { if (window.utvConsentGranted && window.utvConsentGranted()) run(); else window.addEventListener('utv-consent-granted', run); }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
