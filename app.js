var PROXY = 'https://ukraine-worker.dyaltd.workers.dev';
var TG_URL = 'https://t.me/UkraineTVHub';


// ── State ─────────────────────────────────────────────────────
let currentCh = null, hls = null, overlayTimer = null, userUnmuted = false, _overlayCount = 0;

// ── DOM ───────────────────────────────────────────────────────
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
const tgOverlay    = document.getElementById('tg-overlay');
const overlaySkip  = document.getElementById('overlay-skip');
const statusEl     = document.getElementById('player-status');
const infoCard     = document.getElementById('channel-info-card');
const ciTitle      = document.getElementById('ci-title');
const ciDesc       = document.getElementById('ci-desc');
const ciTags       = document.getElementById('ci-tags');
const searchInput  = document.getElementById('search-input');
const channelGrid  = document.getElementById('channel-grid');

// ── Popular channels (hardcoded) ──────────────────────────────
const POPULAR_IDS = ['pershyi', 'channel5', 'ukraine24', 'oneplusone', 'suspilne'];

// ── Recently viewed (localStorage, top 5) ─────────────────────
const LS_RECENT = 'utv_recent_v1';
function getRecent() {
  try { return JSON.parse(localStorage.getItem(LS_RECENT) || '[]'); } catch(e) { return []; }
}
function saveRecent(id) {
  let arr = getRecent().filter(x => x !== id);
  arr.unshift(id);
  arr = arr.slice(0, 5);
  try { localStorage.setItem(LS_RECENT, JSON.stringify(arr)); } catch(e) {}
}

// ── Find channel object by id ──────────────────────────────────
function findChannel(id) {
  for (const g of CHANNEL_GROUPS) {
    const ch = g.channels.find(c => c.id === id);
    if (ch) return ch;
  }
  return null;
}

// ── Render Popular/Recent in right sidebar ────────────────────
function renderSidebarMini(gridId, blockId, ids) {
  const grid = document.getElementById(gridId);
  const block = document.getElementById(blockId);
  if (!grid || !block) return;
  const channels = ids.map(findChannel).filter(Boolean);
  block.style.display = channels.length ? '' : 'none';
  grid.innerHTML = '';
  channels.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'mini-ch-card' + ((currentCh && currentCh.id === ch.id) ? ' active' : '');
    card.innerHTML = `<span class="mini-ch-dot"></span>${ch.name}`;
    card.onclick = () => openChannel(ch);
    grid.appendChild(card);
  });
}

function renderSidebarBlocks() {
  renderSidebarMini('popular-grid', 'popular-block', POPULAR_IDS);
  const recentIds = getRecent();
  renderSidebarMini('recent-grid', 'recent-block', recentIds);
}

// ── Active filter state ───────────────────────────────────────
let activeFilter = '';

// ── Build channel grid ────────────────────────────────────────
function buildGrid(search) {
  search = search || '';
  channelGrid.innerHTML = '<div id="grid-dbg" style="color:lime;font-size:14px;padding:4px;font-family:monospace">JS OK — buildGrid() запущено</div>';
  const q = search.toLowerCase();

  CHANNEL_GROUPS.forEach(group => {
    // Filter by search query
    const matchingChannels = group.channels.filter(ch =>
      !q || ch.name.toLowerCase().includes(q) || ch.tags.some(t => t.includes(q))
    );
    // Filter by active category tab
    const filtered = activeFilter
      ? matchingChannels.filter(() => group.label === activeFilter)
      : matchingChannels;
    if (!filtered.length) return;

    const label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = group.label;
    channelGrid.appendChild(label);

    const catGroup = document.createElement('div');
    catGroup.className = 'cat-group';
    channelGrid.appendChild(catGroup);

    filtered.forEach(ch => {
      const item = document.createElement('div');
      item.className = 'ch-item' + ((currentCh && currentCh.id === ch.id) ? ' active' : '');
      item.dataset.id = ch.id;
      item.setAttribute('aria-label', `${ch.name} — дивитися онлайн`);
      item.innerHTML = `
        <div class="ch-icon-s" style="background:${ch.iconBg};color:${ch.color}" role="img" aria-label="${ch.name}">${ch.icon}</div>
        <div class="ch-name-s">${ch.name}</div>`;
      item.onclick = () => openChannel(ch);
      catGroup.appendChild(item);
    });
  });
}

// ── Filter tabs logic ─────────────────────────────────────────
document.getElementById('filter-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.filter-tab');
  if (!btn) return;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  buildGrid(searchInput.value);
});

searchInput.addEventListener('input', e => buildGrid(e.target.value));

// ── Open channel ──────────────────────────────────────────────
function openChannel(ch) {
  currentCh = ch;
  saveRecent(ch.id);
  buildGrid(searchInput.value);
  renderSidebarBlocks();

  // Scroll to player (TV-compatible)
  var playerWrap = document.getElementById('player-wrap');
  if (playerWrap) {
    try { playerWrap.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    catch(e) { playerWrap.scrollIntoView(true); }
  }

  // Update info card
  playerEmpty.classList.add('hidden');
  npName.textContent = ch.name;
  npDesc.textContent = ch.desc;
  npBar.classList.add('visible');
  liveBadge.style.setProperty('background', ch.color);
  infoCard.style.display = 'block';
  ciTitle.textContent = ch.name;
  ciDesc.textContent = ch.desc;
  ciTags.innerHTML = ch.tags.map(t => `<span class="ci-tag">${t}</span>`).join('');

  // Scroll active tile into view (TV-compatible)
  var activeItem = channelGrid.querySelector('.ch-item.active');
  if (activeItem) {
    try { activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    catch(e) { activeItem.scrollIntoView(true); }
  }

  // Скидаємо таймер при зміні каналу
  clearTimeout(overlayTimer);
  tgOverlay.classList.remove('show');

  loadStream(ch);
}

// ── Stream ────────────────────────────────────────────────────
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function setStatus(msg, isError = false) {
  statusEl.innerHTML = isError
    ? `⚠️ ${msg}`
    : `<span class="status-dot"></span>${msg}`;
  reloadBtn.style.display = isError ? 'block' : 'none';
}

function stopStream() {
  if (hls) { hls.destroy(); hls = null; }
  video.src = '';
  liveBadge.style.display = 'none';
}

function loadStream(ch) {
  stopStream();
  setStatus('Отримуємо потік...');

  // HLS.js може ще не завантажитись (defer) — чекаємо
  if (typeof Hls === 'undefined') {
    setTimeout(function() { loadStream(ch); }, 300);
    return;
  }

  var streamUrl = PROXY + '/stream?channel=' + ch.id;

  function doPlay() {
    video.muted = true; video.volume = 1;
    userUnmuted = false; unmuteBtn.textContent = '🔊 Увімкнути звук';
    var p = video.play();
    if (p && typeof p.then === 'function') { p.catch(function() {}); }
  }

  if (Hls.isSupported()) {
    hls = new Hls({ liveSyncDurationCount: 3, lowLatencyMode: false, enableWorker: false, backBufferLength: 30 });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    // Викликаємо play() одразу після attachMedia — ще в контексті user gesture (клік).
    // На TV Chrome 53 autoplay без user gesture блокується навіть для muted.
    // hls.attachMedia() синхронно встановлює video.src = MediaSourceURL, тому src вже валідний.
    doPlay();
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      setStatus('Пряма трансляція — ' + ch.name);
      liveBadge.style.display = 'flex';
      doPlay(); // повторний виклик — сегменти вже завантажуються
      clearTimeout(overlayTimer);
      if (_overlayCount < 2) {
        overlayTimer = setTimeout(function() {
          tgOverlay.classList.add('show');
          _overlayCount++;
          video.pause();
        }, 120000);
      }
    });
    hls.on(Hls.Events.ERROR, function(e, data) {
      if (!data.fatal) return;
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) { try { hls.startLoad(); } catch(e) {} return; }
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR)   { try { hls.recoverMediaError(); } catch(e) {} return; }
      setStatus('Помилка підключення. Спробуйте ще раз.', true);
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl;
    function onMeta() {
      video.removeEventListener('loadedmetadata', onMeta);
      setStatus('Пряма трансляція — ' + ch.name);
      liveBadge.style.display = 'flex';
      doPlay();
    }
    video.addEventListener('loadedmetadata', onMeta);
  } else {
    setStatus('Ваш браузер не підтримує HLS потоки', true);
  }
}

// ── Unmute ────────────────────────────────────────────────────
unmuteBtn.addEventListener('click', () => {
  if (video.muted) {
    video.muted = false; video.volume = 1; userUnmuted = true;
    unmuteBtn.textContent = '🔇 Вимкнути звук';
  } else {
    video.muted = true; userUnmuted = false;
    unmuteBtn.textContent = '🔊 Увімкнути звук';
  }
});

// ── Reload ────────────────────────────────────────────────────
reloadBtn.addEventListener('click', () => { if (currentCh) loadStream(currentCh); });

// ── Fullscreen ────────────────────────────────────────────────
const playerWrap = document.getElementById('player-wrap');
fsBtn.addEventListener('click', () => {
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  if (fsEl) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    fsBtn.textContent = '⛶ Повний екран';
  } else {
    if (playerWrap.requestFullscreen) { var fsP = playerWrap.requestFullscreen(); if (fsP && typeof fsP.catch === 'function') { fsP.catch(function(){}); } }
    else if (playerWrap.webkitRequestFullscreen) playerWrap.webkitRequestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iOS Safari
    fsBtn.textContent = '✕ Вийти';
  }
});
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) fsBtn.textContent = '⛶ Повний екран';
});
document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement) fsBtn.textContent = '⛶ Повний екран';
});
video.addEventListener('webkitbeginfullscreen', () => { fsBtn.textContent = '✕ Вийти'; });
video.addEventListener('webkitendfullscreen', () => { fsBtn.textContent = '⛶ Повний екран'; });

// ── Telegram overlay ──────────────────────────────────────────
overlaySkip.addEventListener('click', () => {
  tgOverlay.classList.remove('show');
  clearTimeout(overlayTimer);
  var ovp = video.play(); if (ovp && typeof ovp.catch === 'function') { ovp.catch(function(){}); }
});

// ── Player controls fade on mousemove ────────────────────────
(function initControlsFade() {
  const wrap = document.getElementById('player-wrap');
  let hideTimer = null;

  function showControls() {
    wrap.classList.add('controls-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => wrap.classList.remove('controls-visible'), 3000);
  }

  wrap.addEventListener('mousemove', showControls);
  wrap.addEventListener('mouseenter', showControls);
  wrap.addEventListener('mouseleave', () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => wrap.classList.remove('controls-visible'), 600);
  });

  // Touch support
  wrap.addEventListener('touchstart', () => { showControls(); }, { passive: true });
})();

// ── Init ──────────────────────────────────────────────────────
buildGrid();
renderSidebarBlocks();
// TV DEBUG: JS ran successfully
(function() {
  var b = document.createElement('div');
  b.style.cssText = 'position:fixed;top:44px;left:0;right:0;background:#080;color:#fff;font-size:16px;font-weight:bold;padding:8px;text-align:center;z-index:9999999;font-family:sans-serif';
  b.textContent = 'JS ПРАЦЮЄ — каналів: ' + (typeof CHANNEL_GROUPS !== 'undefined' ? CHANNEL_GROUPS.reduce(function(s,g){return s+g.channels.length;},0) : '?');
  document.body.appendChild(b);
})();


// ── Anti-AdBlock — перевірка через власний player-config.js ─────────────
// AdBlock блокує /player-config.js за списками фільтрів → window._playerReady не стає true
let isAdBlocked = false;
let pendingChannel = null;

function checkAdBlock() {
  // Спосіб 1: player-config.js не завантажився (блокування запиту)
  if (window._playerReady !== true) return true;
  // Спосіб 2: bait-div прихований AdBlock через CSS-фільтри
  var bait = document.getElementById('ad-bait');
  if (bait) {
    var cs = window.getComputedStyle(bait);
    if (bait.offsetHeight === 0 || cs.display === 'none' || cs.visibility === 'hidden') return true;
  }
  return false;
}

function showAdBlockOverlay() {
  document.getElementById('adblock-overlay').style.display = 'flex';
}
function hideAdBlockOverlay() {
  document.getElementById('adblock-overlay').style.display = 'none';
}

// Кнопка перевірки: перезавантажуємо player-config.js і дивимось результат
document.getElementById('adblock-check-btn').addEventListener('click', function() {
  const btn = this;
  btn.textContent = '⏳ Перевірка...';
  window._playerReady = undefined;
  const s = document.createElement('script');
  s.src = '/player-config.js?t=' + Date.now();
  s.onload = () => {
    if (window._playerReady === true) {
      hideAdBlockOverlay();
      isAdBlocked = false;
      if (pendingChannel) { openChannel(pendingChannel); pendingChannel = null; }
    } else {
      btn.textContent = '❌ AdBlock ще активний — спробуйте ще раз';
      setTimeout(() => { btn.textContent = '✅ Я вимкнув AdBlock — перевірити'; }, 2000);
    }
  };
  s.onerror = () => {
    btn.textContent = '❌ AdBlock ще активний — спробуйте ще раз';
    setTimeout(() => { btn.textContent = '✅ Я вимкнув AdBlock — перевірити'; }, 2000);
  };
  document.head.appendChild(s);
});

// Патчим openChannel: перевіряємо перед запуском
const _origOpenChannel = openChannel;
openChannel = function(ch) {
  isAdBlocked = checkAdBlock();
  if (isAdBlocked) {
    pendingChannel = ch;
    showAdBlockOverlay();
    return;
  }
  _origOpenChannel(ch);
};
