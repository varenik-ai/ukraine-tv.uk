// app.js — ES5 only (Chrome 47+ / Samsung Tizen 3+ / LG WebOS 3+)

// DEBUG STEP 1
(function(){var f=document.getElementById('js-flag');if(f)f.textContent='1:APP.JS OK';})();

var PROXY = 'https://ukraine-worker.dyaltd.workers.dev';
var TG_URL = 'https://t.me/UkraineTVHub';

// ── State ─────────────────────────────────────────────────────
var currentCh = null, hls = null, overlayTimer = null, userUnmuted = false, _overlayCount = 0;

// ── DOM ───────────────────────────────────────────────────────
var video        = document.getElementById('video');
var playerEmpty  = document.getElementById('player-empty');
var liveBadge    = document.getElementById('live-badge');
var npBar        = document.getElementById('now-playing-bar');
var npName       = document.getElementById('np-name');
var npDesc       = document.getElementById('np-desc');
var reloadBtn    = document.getElementById('reload-btn');
var fsBtn        = document.getElementById('fullscreen-btn');
var unmuteBtn    = document.getElementById('unmute-btn');
var unmuteBanner = document.getElementById('unmute-banner');
var tgOverlay    = document.getElementById('tg-overlay');
var overlaySkip  = document.getElementById('overlay-skip');
var statusEl     = document.getElementById('player-status');
var infoCard     = document.getElementById('channel-info-card');
var ciTitle      = document.getElementById('ci-title');
var ciDesc       = document.getElementById('ci-desc');
var ciTags       = document.getElementById('ci-tags');
var searchInput  = document.getElementById('search-input');
var channelGrid  = document.getElementById('channel-grid');

// DEBUG STEP 2
(function(){var f=document.getElementById('js-flag');if(f)f.textContent='2:DOM OK ch='+(typeof CHANNEL_GROUPS!=='undefined'?CHANNEL_GROUPS.length:'?');})();

// ── Popular channels ──────────────────────────────────────────
var POPULAR_IDS = ['pershyi', 'channel5', 'ukraine24', 'oneplusone', 'suspilne'];

// ── Recently viewed (localStorage) ───────────────────────────
var LS_RECENT = 'utv_recent_v1';
function getRecent() {
  try { return JSON.parse(localStorage.getItem(LS_RECENT) || '[]'); } catch(e) { return []; }
}
function saveRecent(id) {
  var arr = getRecent().filter(function(x) { return x !== id; });
  arr.unshift(id);
  arr = arr.slice(0, 5);
  try { localStorage.setItem(LS_RECENT, JSON.stringify(arr)); } catch(e) {}
}

// ── Find channel by id ────────────────────────────────────────
function findChannel(id) {
  for (var gi = 0; gi < CHANNEL_GROUPS.length; gi++) {
    var g = CHANNEL_GROUPS[gi];
    for (var ci = 0; ci < g.channels.length; ci++) {
      if (g.channels[ci].id === id) return g.channels[ci];
    }
  }
  return null;
}

// ── Render Popular/Recent sidebar ─────────────────────────────
function renderSidebarMini(gridId, blockId, ids) {
  var grid = document.getElementById(gridId);
  var block = document.getElementById(blockId);
  if (!grid || !block) return;
  var channels = [];
  for (var i = 0; i < ids.length; i++) {
    var ch = findChannel(ids[i]);
    if (ch) channels.push(ch);
  }
  block.style.display = channels.length ? '' : 'none';
  grid.innerHTML = '';
  for (var j = 0; j < channels.length; j++) {
    (function(ch) {
      var card = document.createElement('div');
      card.className = 'mini-ch-card' + ((currentCh && currentCh.id === ch.id) ? ' active' : '');
      card.innerHTML = '<span class="mini-ch-dot"></span>' + ch.name;
      card.onclick = function() { openChannel(ch); };
      grid.appendChild(card);
    })(channels[j]);
  }
}

function renderSidebarBlocks() {
  renderSidebarMini('popular-grid', 'popular-block', POPULAR_IDS);
  var recentIds = getRecent();
  renderSidebarMini('recent-grid', 'recent-block', recentIds);
}

// ── Active filter ─────────────────────────────────────────────
var activeFilter = '';

// ── Build channel grid ────────────────────────────────────────
function buildGrid(search) {
  search = search || '';
  channelGrid.innerHTML = '<div style="color:lime;font-size:14px;padding:4px;font-family:monospace">buildGrid() OK</div>';
  var q = search.toLowerCase();

  for (var gi = 0; gi < CHANNEL_GROUPS.length; gi++) {
    var group = CHANNEL_GROUPS[gi];

    var matchingChannels = [];
    for (var ci = 0; ci < group.channels.length; ci++) {
      var ch = group.channels[ci];
      if (!q) {
        matchingChannels.push(ch);
      } else {
        var nameMatch = ch.name.toLowerCase().indexOf(q) >= 0;
        var tagMatch = false;
        for (var ti = 0; ti < ch.tags.length; ti++) {
          if (ch.tags[ti].indexOf(q) >= 0) { tagMatch = true; break; }
        }
        if (nameMatch || tagMatch) matchingChannels.push(ch);
      }
    }

    var filtered = activeFilter
      ? (group.label === activeFilter ? matchingChannels : [])
      : matchingChannels;
    if (!filtered.length) continue;

    var label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = group.label;
    channelGrid.appendChild(label);

    var catGroup = document.createElement('div');
    catGroup.className = 'cat-group';
    channelGrid.appendChild(catGroup);

    for (var fi = 0; fi < filtered.length; fi++) {
      (function(ch) {
        var item = document.createElement('div');
        item.className = 'ch-item' + ((currentCh && currentCh.id === ch.id) ? ' active' : '');
        item.dataset.id = ch.id;
        item.setAttribute('aria-label', ch.name + ' — дивитися онлайн');
        item.innerHTML =
          '<div class="ch-icon-s" style="background:' + ch.iconBg + ';color:' + ch.color + '" role="img" aria-label="' + ch.name + '">' + ch.icon + '</div>' +
          '<div class="ch-name-s">' + ch.name + '</div>';
        item.onclick = function() { openChannel(ch); };
        catGroup.appendChild(item);
      })(filtered[fi]);
    }
  }
}

// ── Filter tabs ───────────────────────────────────────────────
document.getElementById('filter-tabs').addEventListener('click', function(e) {
  var btn = e.target;
  // walk up to find .filter-tab
  while (btn && btn !== this) {
    if (btn.className && btn.className.indexOf('filter-tab') >= 0) break;
    btn = btn.parentNode;
  }
  if (!btn || btn === this) return;
  var tabs = document.querySelectorAll('.filter-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  btn.classList.add('active');
  activeFilter = btn.dataset.filter || btn.getAttribute('data-filter') || '';
  buildGrid(searchInput.value);
});

searchInput.addEventListener('input', function(e) { buildGrid(e.target.value); });

// ── Open channel ──────────────────────────────────────────────
function openChannel(ch) {
  currentCh = ch;
  saveRecent(ch.id);
  buildGrid(searchInput.value);
  renderSidebarBlocks();

  var playerWrap = document.getElementById('player-wrap');
  if (playerWrap) {
    try { playerWrap.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    catch(e) { try { playerWrap.scrollIntoView(true); } catch(e2) {} }
  }

  playerEmpty.classList.add('hidden');
  npName.textContent = ch.name;
  npDesc.textContent = ch.desc;
  npBar.classList.add('visible');
  liveBadge.style.setProperty('background', ch.color);
  infoCard.style.display = 'block';
  ciTitle.textContent = ch.name;
  ciDesc.textContent = ch.desc;
  var tagHtml = '';
  for (var i = 0; i < ch.tags.length; i++) {
    tagHtml += '<span class="ci-tag">' + ch.tags[i] + '</span>';
  }
  ciTags.innerHTML = tagHtml;

  var activeItem = channelGrid.querySelector('.ch-item.active');
  if (activeItem) {
    try { activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    catch(e) { try { activeItem.scrollIntoView(true); } catch(e2) {} }
  }

  clearTimeout(overlayTimer);
  tgOverlay.classList.remove('show');
  loadStream(ch);
}

// ── Stream ────────────────────────────────────────────────────
function setStatus(msg, isError) {
  if (isError === undefined) isError = false;
  statusEl.innerHTML = isError
    ? '⚠️ ' + msg
    : '<span class="status-dot"></span>' + msg;
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
    doPlay();
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      setStatus('Пряма трансляція — ' + ch.name);
      liveBadge.style.display = 'flex';
      doPlay();
      clearTimeout(overlayTimer);
      if (_overlayCount < 2) {
        overlayTimer = setTimeout(function() {
          tgOverlay.classList.add('show');
          _overlayCount++;
          video.pause();
        }, 120000);
      }
    });
    hls.on(Hls.Events.ERROR, function(ev, data) {
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
unmuteBtn.addEventListener('click', function() {
  if (video.muted) {
    video.muted = false; video.volume = 1; userUnmuted = true;
    unmuteBtn.textContent = '🔇 Вимкнути звук';
  } else {
    video.muted = true; userUnmuted = false;
    unmuteBtn.textContent = '🔊 Увімкнути звук';
  }
});

// ── Reload ────────────────────────────────────────────────────
reloadBtn.addEventListener('click', function() { if (currentCh) loadStream(currentCh); });

// ── Fullscreen ────────────────────────────────────────────────
var playerWrap = document.getElementById('player-wrap');
fsBtn.addEventListener('click', function() {
  var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  if (fsEl) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    fsBtn.textContent = '⧶ Повний екран';
  } else {
    if (playerWrap.requestFullscreen) {
      var fsP = playerWrap.requestFullscreen();
      if (fsP && typeof fsP.catch === 'function') { fsP.catch(function(){}); }
    } else if (playerWrap.webkitRequestFullscreen) {
      playerWrap.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
    fsBtn.textContent = '✕ Вийти';
  }
});
document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) fsBtn.textContent = '⧶ Повний екран';
});
document.addEventListener('webkitfullscreenchange', function() {
  if (!document.webkitFullscreenElement) fsBtn.textContent = '⧶ Повний екран';
});
video.addEventListener('webkitbeginfullscreen', function() { fsBtn.textContent = '✕ Вийти'; });
video.addEventListener('webkitendfullscreen', function() { fsBtn.textContent = '⧶ Повний екран'; });

// ── Telegram overlay ──────────────────────────────────────────
overlaySkip.addEventListener('click', function() {
  tgOverlay.classList.remove('show');
  clearTimeout(overlayTimer);
  var ovp = video.play();
  if (ovp && typeof ovp.catch === 'function') { ovp.catch(function(){}); }
});

// ── Player controls fade ──────────────────────────────────────
(function() {
  var wrap = document.getElementById('player-wrap');
  var hideTimer = null;

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
  try {
    wrap.addEventListener('touchstart', function() { showControls(); }, { passive: true });
  } catch(e) {
    wrap.addEventListener('touchstart', function() { showControls(); });
  }
})();

// DEBUG STEP 3
(function(){var f=document.getElementById('js-flag');if(f)f.textContent='3:BEFORE GRID';})();

// ── Init ──────────────────────────────────────────────────────
buildGrid();
renderSidebarBlocks();

// DEBUG STEP 4
(function(){var f=document.getElementById('js-flag');if(f)f.textContent='4:GRID DONE';})();

// Green success banner
(function() {
  var b = document.createElement('div');
  b.style.cssText = 'position:fixed;top:44px;left:0;right:0;background:#080;color:#fff;font-size:16px;font-weight:bold;padding:8px;text-align:center;z-index:9999999;font-family:sans-serif';
  var cnt = 0;
  if (typeof CHANNEL_GROUPS !== 'undefined') {
    for (var i = 0; i < CHANNEL_GROUPS.length; i++) cnt += CHANNEL_GROUPS[i].channels.length;
  }
  b.textContent = 'JS ПРАЦЮЄ — каналів: ' + (cnt || '?');
  document.body.appendChild(b);
})();

// ── Anti-AdBlock ──────────────────────────────────────────────
var isAdBlocked = false;
var pendingChannel = null;

function checkAdBlock() {
  if (window._playerReady !== true) return true;
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

document.getElementById('adblock-check-btn').addEventListener('click', function() {
  var btn = this;
  btn.textContent = '⏳ Перевірка...';
  window._playerReady = undefined;
  var s = document.createElement('script');
  s.src = '/player-config.js?t=' + Date.now();
  s.onload = function() {
    if (window._playerReady === true) {
      hideAdBlockOverlay();
      isAdBlocked = false;
      if (pendingChannel) { openChannel(pendingChannel); pendingChannel = null; }
    } else {
      btn.textContent = '❌ AdBlock ще активний — спробуйте ще раз';
      setTimeout(function() { btn.textContent = '✅ Я вимкнув AdBlock — перевірити'; }, 2000);
    }
  };
  s.onerror = function() {
    btn.textContent = '❌ AdBlock ще активний — спробуйте ще раз';
    setTimeout(function() { btn.textContent = '✅ Я вимкнув AdBlock — перевірити'; }, 2000);
  };
  document.head.appendChild(s);
});

// Patch openChannel with adblock check
var _origOpenChannel = openChannel;
openChannel = function(ch) {
  isAdBlocked = checkAdBlock();
  if (isAdBlocked) {
    pendingChannel = ch;
    showAdBlockOverlay();
    return;
  }
  _origOpenChannel(ch);
};
