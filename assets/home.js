
var H = window.UTV_HOME, T = H.t;
// воркеры: список обновляется без деплоя через /proxy.json (s.ukraine-tv.uk + три независимых *.workers.dev)
var PROXIES = ['https://ukraine-stream-a.dyaltd.workers.dev', 'https://ukraine-stream-b.dyaltd.workers.dev', 'https://ukraine-stream-c.dyaltd.workers.dev'];
var _proxyIdx = 0;
var _proxyRetries = 0;
var _fullCycles = 0; // сколько полных кругов по всем прокси прошли без успеха подряд — источник может оборвать сессию независимо от прокси; вместо разовой сдачи продолжаем переподключаться с растущей паузой между кругами.
var _netErrorCount = 0; // счётчик подряд идущих фатальных сетевых ошибок без успешной загрузки фрагмента
var _sessionStart = Date.now(); // время последнего (пере)подключения — для профилактического реконнекта
// Загружаем актуальный список прокси из proxy.json (обновляется без деплоя)
fetch('/proxy.json')
  .then(function(r){ return r.json(); })
  .then(function(d){ if (d && d.urls && d.urls.length) PROXIES = d.urls; })
  .catch(function(){});
function _currentProxy(){ return PROXIES[_proxyIdx % PROXIES.length]; }
var _proxyFailedAt = {};
function _markProxyFailed(){ _proxyFailedAt[_proxyIdx % PROXIES.length] = Date.now(); }
function _nextProxy(){
  // Пропускаем прокси, которые сломались недавно (90 сек), если есть куда —
  // иначе профилактическая ротация периодически сама заводит зрителя обратно
  // на прокси, который прямо сейчас не работает.
  var advanced = false;
  for (var i = 1; i <= PROXIES.length; i++) {
    var idx = (_proxyIdx + i) % PROXIES.length;
    var failedAt = _proxyFailedAt[idx];
    if (!failedAt || Date.now() - failedAt > 90000) { _proxyIdx += i; advanced = true; break; }
  }
  if (!advanced) _proxyIdx++;
  _proxyRetries++;
  return PROXIES[_proxyIdx % PROXIES.length];
}
const PROXY  = ''; // deprecated — используется _currentProxy()
window._currentProxy = _currentProxy; // для cast.js

const CHANNEL_GROUPS = H.groups;


// ── State ──────────────────────────────────────────────────
let currentCh = null, hls = null, userUnmuted = false;
const video        = document.getElementById('video');
const playerEmpty  = document.getElementById('player-empty');
const liveBadge    = document.getElementById('live-badge');
const npBar        = document.getElementById('now-playing-bar');
const npName       = document.getElementById('np-name');
const npDesc       = document.getElementById('np-desc');
const reloadBtn    = document.getElementById('reload-btn');
const fsBtn        = document.getElementById('fullscreen-btn');
const unmuteBtn    = document.getElementById('unmute-btn');
const unmuteBanner = document.getElementById('unmute-banner');
const statusEl     = document.getElementById('player-status');
const infoCard     = document.getElementById('channel-info-card');
const ciTitle      = document.getElementById('ci-title');
const ciDesc       = document.getElementById('ci-desc');
const ciTags       = document.getElementById('ci-tags');
const searchInput  = document.getElementById('search-input');
const sidebar      = document.getElementById('channel-sidebar');

// ── EPG (программа передач текущего канала) ─────────────────
(function() {
  var epgData = null;
  function fmtTime(iso) {
    var d = new Date(iso);
    return d.toLocaleTimeString(H.locale, {hour:'2-digit', minute:'2-digit'});
  }
  function fmtLeft(ms) {
    var mins = Math.max(0, Math.round(ms / 60000));
    var h = Math.floor(mins / 60), m = mins % 60;
    if (h > 0) return h + 'h ' + m + 'm';
    return m + 'm';
  }
  function renderEpg() {
    var box = document.getElementById('epg-box');
    if (!box) return;
    if (!epgData || !epgData.channels || !currentCh || !epgData.channels[currentCh.id]) {
      box.classList.remove('epg-ready');
      return;
    }
    var items = epgData.channels[currentCh.id];
    var now = new Date();
    var listEl = document.getElementById('epg-list');
    var curEl = document.getElementById('epg-current');
    var current = null;
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var p = items[i];
      var start = new Date(p.start), stop = new Date(p.stop);
      var isNow = now >= start && now < stop;
      if (isNow) current = p;
      html += '<div class="epg-item' + (isNow ? ' epg-item-now' : '') + '"><div class="epg-item-time">' + fmtTime(p.start) + '</div><div class="epg-item-title">' + p.title.replace(/</g,'&lt;') + '</div></div>';
    }
    listEl.innerHTML = html;
    if (current) {
      var start = new Date(current.start), stop = new Date(current.stop);
      var pct = Math.min(100, Math.max(0, (now - start) / (stop - start) * 100));
      document.getElementById('epg-current-label').textContent = T.epg_now;
      document.getElementById('epg-current-title').textContent = current.title;
      document.getElementById('epg-progress-bar').style.width = pct + '%';
      document.getElementById('epg-time-start').textContent = fmtTime(current.start);
      document.getElementById('epg-time-stop').textContent = fmtTime(current.stop);
      document.getElementById('epg-time-left').textContent = T.epg_left + fmtLeft(stop - now);
      curEl.style.display = '';
    } else {
      curEl.style.display = 'none';
    }
    box.classList.add('epg-ready');
  }
  fetch('/epg.json').then(function(r) { return r.json(); }).then(function(d) {
    epgData = d;
    var upd = document.getElementById('epg-updated');
    if (upd && d.generated_at) {
      var g = new Date(d.generated_at);
      upd.textContent = T.epg_upd + g.toLocaleTimeString(H.locale, {hour:'2-digit', minute:'2-digit'});
    }
    renderEpg();
    setInterval(renderEpg, 30000);
  }).catch(function(){});
  window._renderEpg = renderEpg;
})();


// ── Popular channels ───────────────────────────────────────
const POPULAR_IDS = H.popular;
function allChannels() { return CHANNEL_GROUPS.flatMap(g => g.channels); }
function findCh(id) { return allChannels().find(c => c.id === id); }

function buildPopular() {
  const list = document.getElementById('pop-list');
  if (!list) return;
  list.innerHTML = '';
  POPULAR_IDS.forEach(function(id) {
    const ch = findCh(id);
    if (!ch) return;
    const el = document.createElement('div');
    el.className = 'pop-item';
    el.innerHTML = '<div class="pop-icon" style="background:' + ch.iconBg + ';color:' + ch.color + '">' + ch.icon + '</div>'
      + '<span class="pop-name">' + ch.name + '</span><span class="pop-live">LIVE</span>';
    el.onclick = function() { openChannel(ch); };
    list.appendChild(el);
  });
}

// ── Recently viewed ────────────────────────────────────────
const LS_RECENT = 'recentChannels';
function getRecent() {
  try { return JSON.parse(localStorage.getItem(LS_RECENT) || '[]'); } catch(e) { return []; }
}
function addRecent(ch) {
  var ids = getRecent().filter(function(id) { return id !== ch.id; });
  ids.unshift(ch.id);
  if (ids.length > 5) ids = ids.slice(0, 5);
  localStorage.setItem(LS_RECENT, JSON.stringify(ids));
  buildRecent();
}
function buildRecent() {
  var ids = getRecent();
  var box = document.getElementById('recent-box');
  var list = document.getElementById('recent-list');
  if (!box || !list) return;
  if (!ids.length) { box.style.display = 'none'; return; }
  box.style.display = '';
  list.innerHTML = '';
  ids.forEach(function(id) {
    var ch = findCh(id);
    if (!ch) return;
    var el = document.createElement('div');
    el.className = 'recent-item';
    el.innerHTML = '<div class="rec-icon" style="background:' + ch.iconBg + ';color:' + ch.color + '">' + ch.icon + '</div>'
      + '<span class="rec-name">' + ch.name + '</span><span class="rec-live">▶</span>';
    el.onclick = function() { openChannel(ch); };
    list.appendChild(el);
  });
}

// ── Filter tabs ────────────────────────────────────────────
let activeCat = '';
document.getElementById('filter-tabs').addEventListener('click', function(e) {
  var btn = e.target.closest('.filter-tab');
  if (!btn) return;
  document.querySelectorAll('.filter-tab').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  activeCat = btn.dataset.cat;
  buildSidebar(searchInput.value);
});

// ── Build sidebar ──────────────────────────────────────────
function buildSidebar(filter) {
  filter = filter || '';
  const q = filter.toLowerCase();
  [...sidebar.children].forEach(el => { if (!el.classList.contains('sidebar-search')) el.remove(); });
  CHANNEL_GROUPS.forEach(group => {
    if (activeCat && group.label !== activeCat) return;
    const chs = group.channels.filter(ch => !q || ch.name.toLowerCase().includes(q) || ch.tags.some(t => t.includes(q)));
    if (!chs.length) return;
    const lbl = document.createElement('div');
    lbl.className = 'cat-label'; lbl.textContent = group.label;
    sidebar.appendChild(lbl);
    const grp = document.createElement('div');
    grp.className = 'cat-group'; sidebar.appendChild(grp);
    chs.forEach(ch => {
      const item = document.createElement('div');
      item.className = 'ch-item' + (currentCh && currentCh.id === ch.id ? ' active' : '');
      item.setAttribute('aria-label', ch.name + T.watch_suffix);
      item.innerHTML = (ch.logo
          ? '<div class="ch-icon-s ch-logo-s"><img src="' + ch.logo + '" alt="' + ch.icon + '" loading="lazy"></div>'
          : '<div class="ch-icon-s" style="background:' + ch.iconBg + ';color:' + ch.color + '">' + ch.icon + '</div>')
        + '<div><div class="ch-name-s">' + ch.name + '</div><div class="ch-desc-s">' + ch.desc + '</div></div>'
        + '<div class="live-indicator"></div>';
      item.onclick = () => openChannel(ch);
      grp.appendChild(item);
    });
  });
}
searchInput.addEventListener('input', function(e) { buildSidebar(e.target.value); });

// ── Build tile grid (shown before a channel is selected) ────
function buildTileGrid() {
  const gridEl = document.getElementById('tile-grid');
  if (!gridEl) return;
  gridEl.innerHTML = '';
  CHANNEL_GROUPS.forEach(group => {
    group.channels.forEach(ch => {
      const tile = document.createElement('div');
      tile.className = 'ch-tile';
      tile.setAttribute('aria-label', ch.name + T.watch_suffix);
      tile.innerHTML = (ch.logo
          ? '<div class="ch-tile-icon ch-logo-s"><img src="' + ch.logo + '" alt="' + ch.icon + '" loading="lazy"></div>'
          : '<div class="ch-tile-icon" style="background:' + ch.iconBg + ';color:' + ch.color + '">' + ch.icon + '</div>')
        + '<div class="ch-tile-name">' + ch.name + '</div>';
      tile.onclick = () => openChannel(ch);
      gridEl.appendChild(tile);
    });
  });
}
buildTileGrid();

// ── Open channel ───────────────────────────────────────────
function openChannel(ch) {
  currentCh = ch;
  window.UTV = { id: ch.id, name: ch.name, slug: ch.slug };
  buildSidebar(searchInput.value);
  playerEmpty.classList.add('hidden');
  var pw0 = document.getElementById('player-wrap');
  if (pw0) pw0.classList.remove('grid-mode');
  setTimeout(function() {
    var el = document.getElementById('player-wrap');
    var headerH = (document.querySelector('header') || {}).offsetHeight || 60;
    var y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, 80);
  npName.textContent = ch.name; npDesc.textContent = ch.desc;
  npBar.classList.add('visible');
  liveBadge.style.setProperty('background', ch.color);
  infoCard.style.display = 'block';
  ciTitle.textContent = ch.name; ciDesc.textContent = ch.desc;
  ciTags.innerHTML = ch.tags.map(function(t) { return '<span class="ci-tag">' + t + '</span>'; }).join('');
  const activeItem = sidebar.querySelector('.ch-item.active');
  if (activeItem) activeItem.scrollIntoView({ behavior:'smooth', block:'nearest' });
  // Overlay: 1st show — 2min after stream start
  addRecent(ch);
  loadStream(ch);
  if (window._renderEpg) window._renderEpg();
}

// ── Stream ─────────────────────────────────────────────────
function setStatus(msg, isError) {
  statusEl.innerHTML = isError ? '⚠️ ' + msg : '<span class="status-dot"></span>' + msg;
  reloadBtn.style.display = isError ? 'block' : 'none';
}
function stopStream() {
  if (hls) { hls.destroy(); hls = null; }
  try { video.removeAttribute('src'); video.load(); } catch(e) {}
  liveBadge.style.display = 'none';
}
var _lastLoadStreamAt = 0;
async function loadStream(ch, isRetry) {
  var _nowTs = Date.now();
  if (isRetry && _nowTs - _lastLoadStreamAt < 1500) return; // защита от шторма повторных пересозданий подряд
  _lastLoadStreamAt = _nowTs;
  stopStream();
  _sessionStart = _nowTs; // отсчёт до профилактического реконнекта — заново с каждого (пере)подключения
  _lastFrameCount = 0; _lastFrameProgressTime = _nowTs; // сброс счётчика кадров — video.load() обнуляет totalVideoFrames браузера
  if (!isRetry) { _proxyRetries = 0; _fullCycles = 0; } // сброс счётчиков при ручном переключении канала
  _netErrorCount = 0; // сброс счётчика сетевых ошибок при (пере)загрузке потока
  var proxyUrl = _currentProxy();
  setStatus(T.st_connect + (_proxyRetries > 0 ? ' ('+T.st_backup_short+' ' + (_proxyIdx % PROXIES.length + 1) + '/' + PROXIES.length + ')' : ''));
  const streamUrl = proxyUrl + '/stream?channel=' + ch.id;

  async function tryPlay() {
    video.muted = false; video.volume = 1;
    try {
      await video.play();
      userUnmuted = true; unmuteBtn.textContent = T.mute;
    } catch(e) {
      video.muted = true; userUnmuted = false; unmuteBtn.textContent = T.unmute;
      try { await video.play(); } catch(e2) { setStatus(T.press_play); }
    }
  }

  function onFatalError() {
    // Циклически пробуем следующий прокси. Раньше после исчерпания всех прокси
    // (PROXIES.length попыток) трансляция останавливалась навсегда с сообщением
    // «недоступна» — если источник сам обрывает сессию
    // просмотра примерно через 10-12 минут независимо от прокси, зритель терял канал
    // без возможности восстановления без ручной перезагрузки страницы. Теперь после
    // полного круга начинаем заново с первого прокси (он к тому времени уже мог
    // «остыть»), с растущей паузой между кругами, чтобы не долбить источник впустую.
    _markProxyFailed();
    _nextProxy();
    if (_proxyIdx % PROXIES.length === 0) _fullCycles++;
    var delay = _fullCycles > 0 ? Math.min(5000 + (_fullCycles - 1) * 3000, 15000) : 800;
    setStatus(_fullCycles > 0 ? T.st_reconnect : T.st_connect, _fullCycles > 0);
    setTimeout(function() { loadStream(ch, true); }, delay);
  }

    if (Hls.isSupported()) {
    hls = new Hls({ startLevel:0, liveSyncDurationCount:3, enableWorker:true, backBufferLength:30, manifestLoadingMaxRetry:2, fragLoadingMaxRetry:3, levelLoadingMaxRetry:2 });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    try { window.rtvQuality && rtvQuality.attach(hls, video); } catch (e) {}
    hls.on(Hls.Events.MANIFEST_PARSED, async function() {
      _fullCycles = 0; // успешное переподключение — сбрасываем нарастающую паузу
      setStatus(T.st_live + ch.name);
      liveBadge.style.display = 'flex';
      await tryPlay();
    });
    // Успешная загрузка фрагмента — доказательство, что поток жив: сбрасываем счётчик ошибок
    hls.on(Hls.Events.FRAG_LOADED, function() { _netErrorCount = 0; });
    var _nonFatalErrCount = 0, _nonFatalErrWinStart = Date.now();
    hls.on(Hls.Events.ERROR, function(e, data) {
      if (!data.fatal) {
        // Шквал некритичных ошибок подряд — признак реально сломанного
        // подключения, даже если ни одна из них не помечена как fatal.
        var _now2 = Date.now();
        if (_now2 - _nonFatalErrWinStart > 5000) { _nonFatalErrWinStart = _now2; _nonFatalErrCount = 0; }
        _nonFatalErrCount++;
        if (_nonFatalErrCount > 15) { _nonFatalErrCount = 0; onFatalError(); }
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        // Ошибка на уровне плейлиста (не отдельного сегмента) — источник/прокси
        // сломан целиком, ждать 3 сетевые ошибки подряд бессмысленно, сразу
        // переключаем прокси.
        if (data.details === 'manifestLoadError' || data.details === 'manifestLoadTimeOut'
          || data.details === 'levelLoadError' || data.details === 'levelLoadTimeOut') {
          onFatalError();
          return;
        }
        _netErrorCount++;
        try { hls.startLoad(); } catch(e) {}
        // Переключаем прокси только если несколько сетевых ошибок подряд НЕ были
        // перекрыты успешной загрузкой фрагмента (FRAG_LOADED сбрасывает счётчик выше).
        // Раньше здесь проверялось устаревшее значение data.fatal, которое всегда true —
        // из-за этого один-единственный кратковременный сбой сети гарантированно рвал
        // трансляцию через 3 секунды, даже если startLoad() уже всё восстановил.
        setTimeout(function() {
          if (hls && _netErrorCount >= 3) onFatalError();
        }, 3000);
        return;
      }
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) { try { hls.recoverMediaError(); } catch(e) {} return; }
      onFatalError();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl;
    try { window.rtvQuality && rtvQuality.attachNative(video, streamUrl); } catch (e) {}
    video.addEventListener('loadedmetadata', async function() {
      setStatus(T.st_live + ch.name);
      liveBadge.style.display = 'flex';
      await tryPlay();
    }, { once:true });
    video.addEventListener('error', function() { onFatalError(); }, { once:true });
  } else {
    setStatus(T.st_nosupport, true);
  }
}

// ── Сторож зависания + профилактический реконнект ───────────
// На страницах отдельных каналов такая защита уже была, но на главной
// странице (где реально смотрит большинство пользователей — через плитки
// каналов) её не было вовсе. Если источник молча
// переставал отдавать новые сегменты без fatal-ошибки HLS.js, трансляция
// зависала навсегда без возможности восстановления без ручной перезагрузки —
// а перезагрузка не помогала, если источник ещё не отошёл сам.
// Дополнительно: часть источников обрывает сессию через 10-15 минут
// независимо от прокси — вместо ожидания видимого зависания
// профилактически пересоздаём подключение заранее, пока поток ещё идёт
// нормально, чтобы разрыв прошёл незаметно, одной короткой буферизацией.
var _lastProgressTime = Date.now();
var _lastVideoTime = 0;
var _lastFrameCount = 0;
var _lastFrameProgressTime = Date.now();
var PREEMPTIVE_REFRESH_MS = 6 * 60 * 1000; // с запасом ниже типичного обрыва сессии источником
video.addEventListener('timeupdate', function() {
  if (video.currentTime !== _lastVideoTime) {
    _lastVideoTime = video.currentTime;
    _lastProgressTime = Date.now();
  }
});
setInterval(function() {
  if (!hls || !currentCh || video.seeking) return;
  if (video.readyState >= 3 && typeof video.getVideoPlaybackQuality === 'function') {
    var _vpq = video.getVideoPlaybackQuality();
    if (_vpq.totalVideoFrames > _lastFrameCount) {
      _lastFrameCount = _vpq.totalVideoFrames;
      _lastFrameProgressTime = Date.now();
    } else if (!video.paused && Date.now() - _lastFrameProgressTime > 9000) {
      // currentTime может тикать (аудио/системные часы), пока сам видеокадр не
      // обновляется — картинка визуально замирает/чернеет при формально "живом"
      // потоке. Проверка по currentTime это не ловит.
      _lastFrameProgressTime = Date.now();
      _lastProgressTime = Date.now();
      setStatus(T.st_freeze, true);
      loadStream(currentCh, true);
      return;
    }
  }
  if (video.paused && video.readyState < 3) {
    // На главной нет пользовательского контрола паузы — остановка без буфера
    // означает зависание/сбой, а не намеренную паузу зрителя.
    if (Date.now() - _lastProgressTime > 12000) {
      _lastProgressTime = Date.now();
      setStatus(T.st_restore, true);
      loadStream(currentCh, true);
    }
    return;
  }
  if (Date.now() - _lastProgressTime > 18000) {
    _lastProgressTime = Date.now();
    setStatus(T.st_freeze, true);
    loadStream(currentCh, true);
    return;
  }
  if (video.readyState >= 3 && Date.now() - _sessionStart > PREEMPTIVE_REFRESH_MS) {
    // Прокси тоже переключаем: если фриз связан с переиспользуемым сетевым
    // соединением конкретного прокси, новый прокси — это реально другое
    // соединение, а не просто повторный запрос по тому же пути.
    _nextProxy();
    loadStream(currentCh, true);
  }
}, 5000);
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible' && hls && currentCh) {
    if (Date.now() - _lastProgressTime > 15000) {
      _lastProgressTime = Date.now();
      setStatus(T.st_resume, true);
      loadStream(currentCh, true);
    }
  }
});

// ── Unmute ─────────────────────────────────────────────────
unmuteBtn.addEventListener('click', function() {
  if (video.muted) {
    video.muted = false; video.volume = 1; userUnmuted = true;
    unmuteBtn.textContent = T.mute;
  } else {
    video.muted = true; userUnmuted = false;
    unmuteBtn.textContent = T.unmute;
  }
});
reloadBtn.addEventListener('click', function() { if (currentCh) loadStream(currentCh); });

// ── Fullscreen ─────────────────────────────────────────────
const playerWrap = document.getElementById('player-wrap');
fsBtn.addEventListener('click', function() {
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  if (fsEl) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    fsBtn.textContent = T.fs;
  } else {
    if (playerWrap.requestFullscreen) playerWrap.requestFullscreen().catch(function(){});
    else if (playerWrap.webkitRequestFullscreen) playerWrap.webkitRequestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    fsBtn.textContent = T.fs_exit;
  }
});
document.addEventListener('fullscreenchange', function() { if (!document.fullscreenElement) fsBtn.textContent = T.fs; });
document.addEventListener('webkitfullscreenchange', function() { if (!document.webkitFullscreenElement) fsBtn.textContent = T.fs; });
video.addEventListener('webkitbeginfullscreen', function() { fsBtn.textContent = T.fs_exit; });
video.addEventListener('webkitendfullscreen', function() { fsBtn.textContent = T.fs; });

// ── Controls fade ──────────────────────────────────────────
(function() {
  const wrap = document.getElementById('player-wrap');
  let hideTimer = null;
  function showControls() {
    wrap.classList.add('controls-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function() { wrap.classList.remove('controls-visible'); }, 3000);
  }
  wrap.addEventListener('mousemove', showControls);
  wrap.addEventListener('mouseenter', showControls);
  wrap.addEventListener('mouseleave', function() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function() { wrap.classList.remove('controls-visible'); }, 600);
  });
  wrap.addEventListener('touchstart', function() { showControls(); }, { passive:true });
})();

// ── Custom scrollbar ───────────────────────────────────────
(function() {
  const sb = document.getElementById('channel-sidebar');
  const track = document.getElementById('scroll-track');
  const thumb = document.getElementById('scroll-thumb');
  if (!sb || !track || !thumb) return;
  function updateThumb() {
    const trackH = track.clientHeight;
    const ratio = sb.clientHeight / sb.scrollHeight;
    const thumbH = Math.max(28, ratio * trackH);
    const maxTop = trackH - thumbH;
    const scrollR = sb.scrollHeight > sb.clientHeight ? sb.scrollTop / (sb.scrollHeight - sb.clientHeight) : 0;
    thumb.style.height = thumbH + 'px'; thumb.style.top = (scrollR * maxTop) + 'px';
  }
  sb.addEventListener('scroll', updateThumb, { passive:true });
  window.addEventListener('resize', updateThumb);
  new MutationObserver(updateThumb).observe(sb, { childList:true, subtree:false });
  let dragging = false, startY = 0, startTop = 0;
  thumb.addEventListener('mousedown', function(e) { dragging = true; startY = e.clientY; startTop = sb.scrollTop; e.preventDefault(); });
  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    const delta = (e.clientY - startY) / (track.clientHeight - thumb.clientHeight);
    sb.scrollTop = startTop + delta * (sb.scrollHeight - sb.clientHeight);
  });
  document.addEventListener('mouseup', function() { dragging = false; });
  track.addEventListener('click', function(e) {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top - thumb.clientHeight / 2) / (track.clientHeight - thumb.clientHeight)));
    sb.scrollTop = ratio * (sb.scrollHeight - sb.clientHeight);
  });
  setTimeout(updateThumb, 150);
})();

buildSidebar();
buildPopular();
buildRecent();

// Авто-открытие канала по хэшу URL (переход со страниц категорий)
(function(){
  var h = location.hash.replace('#','');
  if(!h) return;
  var all = CHANNEL_GROUPS.reduce(function(a,g){return a.concat(g.channels);}, []);
  var ch = all.find(function(c){return c.id===h;});
  if(ch) openChannel(ch);
})();


