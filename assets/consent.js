/* Согласие на аналитику: GA4 и Microsoft Clarity загружаются только после «Принять».
   Выбор хранится в localStorage (utv_consent: granted | denied). Ссылка «Налаштування cookie» в футере открывает баннер снова. */
(function () {
  var GA = 'G-ZPMY00Q91E', CL = 'xkacwjmx12', KEY = 'utv_consent';
  var LG = (document.documentElement.lang || 'uk').toLowerCase().slice(0, 2);
  var T = {
    uk: { t: 'Ми використовуємо cookie для аналітики (Google Analytics, Microsoft Clarity), щоб покращувати сайт. Ви можете погодитися або відмовитися.', ok: 'Прийняти', no: 'Відхилити', more: 'Детальніше' },
    en: { t: 'We use cookies for analytics (Google Analytics, Microsoft Clarity) to improve the site. You can accept or decline.', ok: 'Accept', no: 'Decline', more: 'Learn more' },
    ru: { t: 'Мы используем cookie для аналитики (Google Analytics, Microsoft Clarity), чтобы улучшать сайт. Вы можете согласиться или отказаться.', ok: 'Принять', no: 'Отклонить', more: 'Подробнее' }
  }[LG] || null;
  T = T || { t: '', ok: 'OK', no: 'No', more: '' };
  var PRIV = { uk: '/privacy/', en: '/en/privacy/', ru: '/ru/privacy/' }[LG] || '/privacy/';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA);
    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', CL);
  }
  function banner() {
    if (document.getElementById('utv-cookie')) return;
    var d = document.createElement('div'); d.id = 'utv-cookie'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookie');
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:620px;margin:0 auto;background:#12121f;border:1px solid #2a2a40;border-radius:14px;padding:14px 16px;color:#e2e2f0;font:13px/1.5 Inter,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.6)';
    d.innerHTML = '<div style="margin-bottom:10px">' + T.t + ' <a href="' + PRIV + '" style="color:#7db4ff;text-decoration:underline">' + T.more + '</a></div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" data-v="denied" style="background:transparent;border:1px solid #3a3a58;color:#e2e2f0;border-radius:10px;padding:8px 14px;font:600 13px inherit;cursor:pointer">' + T.no + '</button>' +
      '<button type="button" data-v="granted" style="background:#2f7de1;border:0;color:#fff;border-radius:10px;padding:8px 16px;font:700 13px inherit;cursor:pointer">' + T.ok + '</button></div>';
    d.addEventListener('click', function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute('data-v'); if (!v) return;
      set(v); d.remove(); if (v === 'granted') load();
    });
    document.body.appendChild(d);
  }
  function init() {
    var v = get();
    if (v === 'granted') load(); else if (!v && T.t) banner();
    document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-cookie-settings]'); if (a) { e.preventDefault(); banner(); } });
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
