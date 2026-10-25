/* Плеер канала ukraine-tv.uk. Конфиг страницы: window.UTV = {id, lang, t:{строки}, tg}.
   Логика (watchdog, ротация прокси, backoff, нативный HLS на iOS) — по образцу russian-tv.com. */
(function () {
  var C = window.UTV || {}, CH_ID = C.id, T = C.t || {};
  var PROXIES = ['https://ukraine-stream-a.dyaltd.workers.dev', 'https://ukraine-stream-b.dyaltd.workers.dev', 'https://ukraine-stream-c.dyaltd.workers.dev'];
  var _proxyIdx = 0, _proxyFailedAt = {};
  // список прокси можно менять без передеплоя сайта — /proxy.json
  fetch('/proxy.json').then(function (r) { return r.json(); }).then(function (d) { if (d && d.urls && d.urls.length) PROXIES = d.urls; }).catch(function () {});
  function _currentProxy() { return PROXIES[_proxyIdx % PROXIES.length]; }
  window._currentProxy = _currentProxy; // для cast.js (ТВ берёт поток по ссылке воркера)
  function _markProxyFailed() { _proxyFailedAt[_proxyIdx % PROXIES.length] = Date.now(); }
  // ротация пропускает прокси, упавшие меньше 90 с назад
  function _advanceProxy() {
    for (var i = 1; i <= PROXIES.length; i++) {
      var idx = (_proxyIdx + i) % PROXIES.length, f = _proxyFailedAt[idx];
      if (!f || Date.now() - f > 90000) { _proxyIdx += i; return; }
    }
    _proxyIdx++;
  }

  // ── EPG (epg.json; блок скрыт, пока для канала нет данных) ──
  (function () {
    var data = null, loc = C.lang === 'en' ? 'en-GB' : C.lang === 'ru' ? 'ru-RU' : 'uk-UA';
    function fmt(iso) { return new Date(iso).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' }); }
    function left(ms) { var m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60); return h > 0 ? h + 'h ' + (m % 60) + 'm' : m + 'm'; }
    function $(id) { return document.getElementById(id); }
    function render() {
      if (!data || !data.channels || !data.channels[CH_ID]) return;
      var items = data.channels[CH_ID], now = new Date(), cur = null, html = '';
      items.forEach(function (p) {
        var isNow = now >= new Date(p.start) && now < new Date(p.stop); if (isNow) cur = p;
        html += '<div class="epg-item' + (isNow ? ' epg-item-now' : '') + '"><div class="epg-item-time">' + fmt(p.start) + '</div><div class="epg-item-title">' + p.title.replace(/</g, '&lt;') + '</div></div>';
      });
      $('epg-list').innerHTML = html;
      if (cur) {
        var s = new Date(cur.start), e = new Date(cur.stop);
        $('epg-current-label').textContent = T.epg_now; $('epg-current-title').textContent = cur.title;
        $('epg-progress-bar').style.width = Math.min(100, Math.max(0, (now - s) / (e - s) * 100)) + '%';
        $('epg-time-start').textContent = fmt(cur.start); $('epg-time-stop').textContent = fmt(cur.stop);
        $('epg-time-left').textContent = T.epg_left + left(e - now); $('epg-current').style.display = '';
      } else $('epg-current').style.display = 'none';
      $('epg-box').classList.add('epg-ready');
    }
    fetch('/epg.json').then(function (r) { return r.json(); }).then(function (d) {
      data = d; if (!d.channels || !d.channels[CH_ID]) return;
      if (d.generated_at && Date.now() - new Date(d.generated_at).getTime() > 36 * 3600 * 1000) return; // устаревший гид не показываем
      if (d.generated_at && $('epg-updated')) $('epg-updated').textContent = T.epg_upd + fmt(d.generated_at);
      render(); setInterval(render, 30000);
    }).catch(function () {});
  })();

  var video = document.getElementById('video'), overlay = document.getElementById('overlay'), statusEl = document.getElementById('status');
  var hls = null;
  function setStatus(msg, isError) { statusEl.innerHTML = isError ? '⚠️ ' + msg : '<span class="status-dot"></span>' + msg; }
  var _retryCount = 0, _retryTimer = null, _maxRetries = 5, _hlsStopped = false, _stableTimer = null, _fullCycles = 0;
  var _sessionStart = Date.now(), _lastProgressTime = Date.now(), _lastVideoTime = 0, _lastFrameCount = 0, _lastFrameProgressTime = Date.now();
  var _lastCreateHlsAt = 0, _playTimeout = null;
  var PREEMPTIVE_REFRESH_MS = 25 * 60 * 1000; // профилактический реконнект с ротацией прокси
  var _IOS_NATIVE = /iPhone|iPad|iPod/.test(navigator.userAgent) && !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl');

  video.addEventListener('timeupdate', function () { if (video.currentTime !== _lastVideoTime) { _lastVideoTime = video.currentTime; _lastProgressTime = Date.now(); } });

  function _tryNudgeGap() { // перескок через микро-разрыв в буфере — дешевле реконнекта
    try {
      if (video.buffered && video.buffered.length) {
        var end = video.buffered.end(video.buffered.length - 1);
        if (end - video.currentTime > 0.5) { video.currentTime = Math.max(end - 0.25, video.currentTime + 0.1); return true; }
      }
    } catch (e) {}
    return false;
  }

  // сторож зависания: кадры не идут / currentTime стоит / плеер на паузе без буфера
  setInterval(function () {
    if (_hlsStopped || !hls || video.seeking) return;
    if (video.readyState >= 3 && typeof video.getVideoPlaybackQuality === 'function') {
      var q = video.getVideoPlaybackQuality();
      if (q.totalVideoFrames > _lastFrameCount) { _lastFrameCount = q.totalVideoFrames; _lastFrameProgressTime = Date.now(); }
      else if (!video.paused && Date.now() - _lastFrameProgressTime > 9000) {
        _lastFrameProgressTime = Date.now(); _lastProgressTime = Date.now(); setStatus(T.st_freeze); _scheduleReconnect(); return;
      }
    }
    if (video.paused && video.readyState < 3) {
      if (Date.now() - _lastProgressTime > 12000) { _lastProgressTime = Date.now(); if (_tryNudgeGap()) { setStatus(T.st_buffer); return; } setStatus(T.st_restore); _scheduleReconnect(); }
      return;
    }
    if (Date.now() - _lastProgressTime > 18000) {
      _lastProgressTime = Date.now(); if (_tryNudgeGap()) { setStatus(T.st_buffer); return; } setStatus(T.st_freeze); _scheduleReconnect(); return;
    }
    if (!_IOS_NATIVE && video.readyState >= 3 && Date.now() - _sessionStart > PREEMPTIVE_REFRESH_MS) { _advanceProxy(); createHls(); }
  }, 5000);

  video.addEventListener('playing', function () { clearTimeout(_playTimeout); setStatus(T.st_playing); _lastProgressTime = Date.now(); _fullCycles = 0; });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && !_hlsStopped && hls && Date.now() - _lastProgressTime > 15000) { _lastProgressTime = Date.now(); setStatus(T.st_resume); _scheduleReconnect(); }
  });

  function _scheduleReconnect(forceRotate) {
    if (_hlsStopped) return;
    if (forceRotate || _retryCount >= _maxRetries) {
      _markProxyFailed(); _advanceProxy();
      if (_proxyIdx % PROXIES.length === 0) _fullCycles++;
      _retryCount = 0;
      var cycleDelay = _fullCycles > 0 ? Math.min(5000 + (_fullCycles - 1) * 3000, 15000) : 1500;
      setStatus(_fullCycles >= 2 ? T.st_unavail : (_fullCycles > 0 ? T.st_reconnect : T.st_backup + ' (' + ((_proxyIdx % PROXIES.length) + 1) + '/' + PROXIES.length + ')'));
      clearTimeout(_retryTimer); _retryTimer = setTimeout(createHls, cycleDelay); return;
    }
    _retryCount++;
    setStatus(T.st_retry + ' (' + _retryCount + '/' + _maxRetries + ')...');
    clearTimeout(_retryTimer); _retryTimer = setTimeout(createHls, Math.min(3000 * _retryCount, 12000));
  }

  function createHls() {
    if (_hlsStopped) return;
    var now = Date.now(); if (now - _lastCreateHlsAt < 1500) return; _lastCreateHlsAt = now;
    _sessionStart = now; _lastFrameCount = 0; _lastFrameProgressTime = now; clearTimeout(_retryTimer);
    var url = _currentProxy() + '/stream?channel=' + CH_ID;
    if (_IOS_NATIVE) { // iPhone/iPad: встроенный плеер Apple, CORS не нужен
      video.src = url;
      try { window.rtvQuality && rtvQuality.attachNative(video, url); } catch (e) {}
      video.play().catch(function () { video.muted = true; video.play().catch(function () {}); }); setStatus(T.st_playing); return;
    }
    if (hls) { try { hls.destroy(); } catch (e) {} hls = null; }
    try { video.removeAttribute('src'); video.load(); } catch (e) {}
    hls = new Hls({ startLevel: 0, capLevelToPlayerSize: true, abrEwmaDefaultEstimate: 500000, manifestLoadingMaxRetry: 2, fragLoadingMaxRetry: 6, levelLoadingMaxRetry: 2, fragLoadingTimeOut: 30000 });
    hls.loadSource(url); hls.attachMedia(video);
    try { window.rtvQuality && rtvQuality.attach(hls, video); } catch (e) {}
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play().catch(function () {}); setStatus(T.st_buffer);
      clearTimeout(_stableTimer); _stableTimer = setTimeout(function () { _retryCount = 0; }, 60000);
      clearTimeout(_playTimeout); // манифест разобран ≠ видео идёт: нет кадра за 8 с — попытка неудачна
      _playTimeout = setTimeout(function () {
        if (_hlsStopped || video.readyState >= 3) return;
        if (_tryNudgeGap()) { _playTimeout = setTimeout(function () { if (!_hlsStopped && video.readyState < 3) _scheduleReconnect(); }, 1500); return; }
        _scheduleReconnect();
      }, 8000);
    });
    var nf = 0, nfStart = Date.now();
    hls.on(Hls.Events.ERROR, function (e, d) {
      if (_hlsStopped) return;
      if (!d.fatal) { var t = Date.now(); if (t - nfStart > 5000) { nfStart = t; nf = 0; } if (++nf > 15) { nf = 0; _scheduleReconnect(); } return; }
      if (d.type === Hls.ErrorTypes.MEDIA_ERROR && _retryCount === 0) { _retryCount++; setStatus(T.st_restore); hls.recoverMediaError(); return; }
      var playlistErr = d.details === 'manifestLoadError' || d.details === 'manifestLoadTimeOut' || d.details === 'levelLoadError' || d.details === 'levelLoadTimeOut';
      _scheduleReconnect(playlistErr); // ошибка плейлиста — сразу на следующий прокси
    });
  }

  function startStream() {
    overlay.style.display = 'none'; setStatus(T.st_connect);
    if (window.Hls && Hls.isSupported() && !_IOS_NATIVE) createHls();
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      var url = _currentProxy() + '/stream?channel=' + CH_ID; video.src = url;
      try { window.rtvQuality && rtvQuality.attachNative(video, url); } catch (e) {}
      video.play().catch(function () {}); setStatus(T.st_playing);
    } else setStatus(T.st_nosupport, true);
  }
  overlay.addEventListener('click', startStream);

  // ── полный экран ──
  var wrap = document.getElementById('player-wrap'), fsBtn = document.getElementById('fs-btn');
  fsBtn.addEventListener('click', function () {
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
    else if (wrap.requestFullscreen) wrap.requestFullscreen().catch(function () {});
    else if (wrap.webkitRequestFullscreen) wrap.webkitRequestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });
  function onFs() { fsBtn.textContent = (document.fullscreenElement || document.webkitFullscreenElement) ? '✕' : '⛶'; }
  document.addEventListener('fullscreenchange', onFs); document.addEventListener('webkitfullscreenchange', onFs);
  video.addEventListener('webkitbeginfullscreen', function () { fsBtn.textContent = '✕'; });
  video.addEventListener('webkitendfullscreen', function () { fsBtn.textContent = '⛶'; });

  // ── поиск по сайдбару ──
  var search = document.getElementById('ch-search');
  if (search) search.addEventListener('input', function () {
    var q = this.value.toLowerCase();
    document.querySelectorAll('.ch-item-s').forEach(function (el) { el.style.display = (!q || el.dataset.name.toLowerCase().includes(q)) ? '' : 'none'; });
    document.querySelectorAll('.cat-label-s').forEach(function (label) {
      var sib = label.nextElementSibling, any = false;
      while (sib && !sib.classList.contains('cat-label-s')) { if (sib.style.display !== 'none') any = true; sib = sib.nextElementSibling; }
      label.style.display = any ? '' : 'none';
    });
  });
  var active = document.querySelector('.ch-item-s.active'); if (active) active.scrollIntoView({ block: 'center', behavior: 'auto' });
})();
