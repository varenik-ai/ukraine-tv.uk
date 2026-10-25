/* Согласие на аналитику и рекламу: блокирующее окно по центру. «Согласен» — GA4, Clarity и реклама (assets/ads.js) загружаются;
   «Не согласен» — доступ к сайту закрыт (экран-заглушка, с возможностью передумать). Выбор: localStorage utv_consent (granted | denied).
   Ссылка «Налаштування cookie» в футере открывает окно снова. Поисковые роботы окно не видят. */
(function () {
  var GA = 'G-ZPMY00Q91E', CL = 'xkacwjmx12', KEY = 'utv_consent';
  var LG = (document.documentElement.lang || 'uk').toLowerCase().slice(0, 2);
  var T = {
    uk: { h: 'Згода на cookie', t: 'Ми використовуємо cookie для аналітики та реклами — вони допомагають підтримувати сайт безкоштовним. Для користування сайтом потрібна ваша згода.', ok: 'Погоджуюсь', no: 'Не погоджуюсь', more: 'Детальніше',
          lockH: 'Доступ до сайту закрито', lockT: 'Без згоди на cookie ми не можемо показувати сайт. Ви можете передумати в будь-який момент.', back: 'Передумав — погоджуюсь' },
    en: { h: 'Cookie consent', t: 'We use cookies for analytics and advertising — they help keep the site free. Your consent is required to use the site.', ok: 'I agree', no: 'I do not agree', more: 'Learn more',
          lockH: 'Access to the site is closed', lockT: 'Without cookie consent we cannot show the site. You can change your mind at any time.', back: 'I changed my mind — I agree' },
    ru: { h: 'Согласие на cookie', t: 'Мы используем cookie для аналитики и рекламы — они помогают поддерживать сайт бесплатным. Для использования сайта нужно ваше согласие.', ok: 'Согласен', no: 'Не согласен', more: 'Подробнее',
          lockH: 'Доступ к сайту закрыт', lockT: 'Без согласия на cookie мы не можем показывать сайт. Вы можете передумать в любой момент.', back: 'Передумал — согласен' }
  }[LG] || null;
  var PRIV = { uk: '/privacy/', en: '/en/privacy/', ru: '/ru/privacy/' }[LG] || '/privacy/';
  var BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|lighthouse|pagespeed|google-inspectiontool|yandex|duckduck|baidu|embedly|telegram|whatsapp/i.test(navigator.userAgent || '');
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  window.utvConsentGranted = function () { return get() === 'granted'; };
  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA);
    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', CL);
    try { window.dispatchEvent(new Event('utv-consent-granted')); } catch (e) {}
  }
  var BTN = 'border-radius:12px;padding:12px 18px;font:700 14px Inter,system-ui,sans-serif;cursor:pointer;flex:1 1 150px';
  function close() { var d = document.getElementById('utv-gate'); if (d) d.remove(); document.documentElement.style.overflow = ''; }
  function accept() { var wasDenied = get() === 'denied'; set('granted'); if (lock.mo) { lock.mo.disconnect(); lock.mo = null; } if (wasDenied) { location.reload(); return; } close(); load(); }
  function lock() {
    set('denied');
    var d = document.getElementById('utv-gate'); if (!d) return;
    // страница закрывается целиком: удаляем весь контент (останавливая видео/звук), остаётся только экран-заглушка
    Array.prototype.forEach.call(document.querySelectorAll('video,audio'), function (m) { try { m.pause(); m.removeAttribute('src'); m.load(); } catch (e) {} });
    Array.prototype.slice.call(document.body.children).forEach(function (n) { if (n !== d) n.remove(); });
    d.style.background = '#080810'; d.style.webkitBackdropFilter = 'none'; d.style.backdropFilter = 'none';
    d.querySelector('[data-box]').innerHTML = '<h2 style="margin:0 0 10px;font:800 20px Inter,system-ui,sans-serif">' + T.lockH + '</h2><p style="margin:0 0 16px;color:#b9b9d0">' + T.lockT + '</p>' +
      '<div style="display:flex"><button type="button" data-v="granted" style="' + BTN + ';background:#2f7de1;border:0;color:#fff">' + T.back + '</button></div>';
    // если оверлей удалили (DevTools, расширения) — возвращаем
    if (window.MutationObserver && !lock.mo) {
      lock.mo = new MutationObserver(function () { if (get() === 'denied' && !document.getElementById('utv-gate')) { lock.mo.disconnect(); lock.mo = null; location.reload(); } });
      lock.mo.observe(document.body, { childList: true });
    }
    try { window.close(); } catch (e) {}
  }
  function banner() {
    if (document.getElementById('utv-gate') || !T) return;
    var d = document.createElement('div'); d.id = 'utv-gate'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', T.h);
    d.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(5,5,12,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#e2e2f0;font:14px/1.55 Inter,system-ui,sans-serif';
    d.innerHTML = '<div data-box style="width:100%;max-width:460px;background:#12121f;border:1px solid #2a2a40;border-radius:18px;padding:24px 22px;box-shadow:0 20px 60px rgba(0,0,0,.7);text-align:center">' +
      '<h2 style="margin:0 0 10px;font:800 20px Inter,system-ui,sans-serif">' + T.h + '</h2>' +
      '<p style="margin:0 0 16px;color:#b9b9d0">' + T.t + ' <a href="' + PRIV + '" style="color:#7db4ff;text-decoration:underline">' + T.more + '</a></p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" data-v="denied" style="' + BTN + ';background:transparent;border:1px solid #3a3a58;color:#e2e2f0">' + T.no + '</button>' +
      '<button type="button" data-v="granted" style="' + BTN + ';background:#2f7de1;border:0;color:#fff">' + T.ok + '</button></div></div>';
    d.addEventListener('click', function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute('data-v'); if (!v) return;
      if (v === 'granted') accept(); else lock();
    });
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(d);
    var b = d.querySelector('[data-v="granted"]'); if (b) try { b.focus(); } catch (e) {}
  }
  function visible(el) {
    if (!el || !document.body.contains(el)) return false;
    var c = window.getComputedStyle(el);
    return c.display !== 'none' && c.visibility !== 'hidden' && parseFloat(c.opacity) > 0.5;
  }
  function hardLock() {
    // окно согласия скрыто чужим кодом (например, фильтрами блокировщика): запасная заглушка со случайным id
    if (document.getElementById('utv-hl') || !T) return;
    Array.prototype.forEach.call(document.querySelectorAll('video,audio'), function (m) { try { m.pause(); m.removeAttribute('src'); m.load(); } catch (e) {} });
    Array.prototype.slice.call(document.body.children).forEach(function (n) { n.remove(); });
    var h = document.createElement('div'); h.id = 'utv-hl';
    h.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;background:#080810;color:#e2e2f0;font:14px/1.55 Inter,system-ui,sans-serif;text-align:center';
    h.innerHTML = '<div style="max-width:460px"><h2 style="margin:0 0 10px;font:800 20px Inter,system-ui,sans-serif">' + T.lockH + '</h2><p style="margin:0 0 16px;color:#b9b9d0">' + T.lockT + '</p>' +
      '<button type="button" style="' + BTN + ';background:#2f7de1;border:0;color:#fff">' + T.back + '</button></div>';
    h.querySelector('button').addEventListener('click', function () { set('granted'); location.reload(); });
    document.body.appendChild(h);
  }
  function guard() {
    if (get() === 'granted' || BOT) return;
    var d = document.getElementById('utv-gate');
    if (!visible(d)) hardLock();
  }
  function init() {
    var v = get();
    if (v === 'granted') load();
    else if (v === 'denied' && !BOT) { banner(); lock(); }
    else if (!v && !BOT) banner();
    setTimeout(guard, 700); setInterval(guard, 3000);
    document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-utv-prefs]'); if (a) { e.preventDefault(); banner(); } });
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
