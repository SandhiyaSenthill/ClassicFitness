// ============================================================
//  CLASSIC FITNESS — exercises.js
//  Reads from assets/data/exercises_raw.json
//  GIFs from assets/exercise-gifs/
// ============================================================

const GIF_DIR  = 'assets/exercise-gifs';
const DATA_URL = 'assets/data/exercises_raw.json';
const PAGE_SIZE = 24;
const WORKER_URL = 'https://classicfitness-api.sandhiyasenthill3.workers.dev';

let ALL = [], filtered = [], page = 0;

let savedPlan = JSON.parse(sessionStorage.getItem('cf_day_plan') || '[]');

let currentPart = 'all', currentDiff = '', currentEquip = '', currentSearch = '', currentStretch = '';

// ── HELPERS ──────────────────────────────────────────────────
function safeSlug(s) {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
function gifPath(ex) {
  const id = ex.id || ex.exerciseId || '';
  if (!id) return null;
  return `${GIF_DIR}/${safeSlug(ex.name)}__${id}.gif`;
}
function capFirst(s) {
  return (s || '').replace(/\b\w/g, c => c.toUpperCase());
}
function diffClass(d) {
  if (!d) return '';
  return d.toLowerCase();
}

// ── ENTRY GATE ───────────────────────────────────────────────
function hasEntryPass() {
  return false;
}

function injectEntryGateStyles() {
  if (document.getElementById('cf-entry-gate-styles')) return;
  const style = document.createElement('style');
  style.id = 'cf-entry-gate-styles';
  style.textContent = `
    #cfEntryGate {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      animation: cfGateFadeIn 0.4s ease;
    }
    @keyframes cfGateFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #cfEntryGateBox {
      background: #141414;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 40px 36px 36px;
      width: 90%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,0.7);
      animation: cfBoxSlideUp 0.45s cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes cfBoxSlideUp {
      from { transform: translateY(40px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #cfEntryGateBox .cf-gate-logo {
      font-size: 44px;
      margin-bottom: 8px;
      display: block;
    }
    #cfEntryGateBox h2 {
      color: #fff;
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 6px;
      letter-spacing: -0.3px;
    }
    #cfEntryGateBox p {
      color: rgba(255,255,255,0.45);
      font-size: 14px;
      margin: 0 0 28px;
      line-height: 1.5;
    }
    #cfEntryGateBox .cf-gate-field {
      position: relative;
      margin-bottom: 14px;
      text-align: left;
    }
    #cfEntryGateBox .cf-gate-field label {
      display: block;
      color: rgba(255,255,255,0.5);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    #cfEntryGateBox .cf-gate-field input {
      width: 100%;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 13px 16px;
      color: #fff;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    #cfEntryGateBox .cf-gate-field input:focus {
      border-color: #f97316;
      background: rgba(249,115,22,0.07);
    }
    #cfEntryGateBox .cf-gate-field input::placeholder {
      color: rgba(255,255,255,0.2);
    }
    #cfEntryGateBox .cf-gate-err {
      color: #f87171;
      font-size: 12px;
      margin: -8px 0 12px;
      display: none;
      text-align: left;
    }
    #cfEntryGateBox .cf-gate-btn {
      width: 100%;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 15px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 6px;
      letter-spacing: 0.2px;
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
      box-shadow: 0 4px 20px rgba(249,115,22,0.4);
    }
    #cfEntryGateBox .cf-gate-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 28px rgba(249,115,22,0.55);
    }
    #cfEntryGateBox .cf-gate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    #cfEntryGateBox .cf-gate-note {
      color: rgba(255,255,255,0.2);
      font-size: 11px;
      margin-top: 14px;
    }
    #cfEntryGateBox .cf-gate-note span {
      color: rgba(255,255,255,0.35);
    }
  `;
  document.head.appendChild(style);
}

function showEntryGate() {
  injectEntryGateStyles();

  const gate = document.createElement('div');
  gate.id = 'cfEntryGate';
  gate.innerHTML = `
    <div id="cfEntryGateBox">
      <span class="cf-gate-logo">🏋️</span>
      <h2>Welcome to Exercise Hub</h2>
      <p>Access 1300+ exercises with step-by-step demos.<br>Enter your details to continue — it's free!</p>

      <div class="cf-gate-field">
        <label>Your Name</label>
        <input type="text" id="cfGateName" placeholder="e.g. Ramesh Kumar" autocomplete="name" />
      </div>
      <div class="cf-gate-err" id="cfGateNameErr">Please enter your name.</div>

      <div class="cf-gate-field">
        <label>Mobile Number</label>
        <input type="tel" id="cfGateMobile" placeholder="e.g. 9876543210" autocomplete="tel" maxlength="10" />
      </div>
      <div class="cf-gate-err" id="cfGateMobileErr">Enter a valid 10-digit mobile number.</div>

      <button class="cf-gate-btn" id="cfGateSubmit">Explore Exercises →</button>
      <p class="cf-gate-note">🔒 We respect your privacy. <span>No spam, ever.</span></p>
    </div>
  `;
  document.body.appendChild(gate);
  document.body.style.overflow = 'hidden';

  // Focus first field
  setTimeout(() => document.getElementById('cfGateName')?.focus(), 300);

  // Only allow digits in mobile
  document.getElementById('cfGateMobile').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });

  document.getElementById('cfGateSubmit').addEventListener('click', handleGateSubmit);

  // Allow Enter key
  gate.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleGateSubmit();
  });
}

async function handleGateSubmit() {
  const nameEl   = document.getElementById('cfGateName');
  const mobileEl = document.getElementById('cfGateMobile');
  const nameErr  = document.getElementById('cfGateNameErr');
  const mobErr   = document.getElementById('cfGateMobileErr');
  const btn      = document.getElementById('cfGateSubmit');

  const name   = nameEl.value.trim();
  const mobile = mobileEl.value.trim();

  // Validate
  let valid = true;
  nameErr.style.display  = 'none';
  mobErr.style.display   = 'none';

  if (!name) {
    nameErr.style.display = 'block';
    nameEl.focus();
    valid = false;
  }
  if (!mobile || mobile.length < 10) {
    mobErr.style.display = 'block';
    if (valid) mobileEl.focus();
    valid = false;
  }
  if (!valid) return;

  // Submit
  btn.disabled = true;
  btn.textContent = 'Processing...';

  try {
    await fetch(`${WORKER_URL}/save-exercise-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile })
    });
  } catch (e) {
    // Silently continue even if save fails — don't block the user
    console.warn('Lead save failed:', e);
  }

  // Grant access
  sessionStorage.setItem('cf_ex_pass', '1');
  sessionStorage.setItem('cf_ex_name', name);

  // Animate out
  const gate = document.getElementById('cfEntryGate');
  gate.style.transition = 'opacity 0.35s ease';
  gate.style.opacity = '0';
  setTimeout(() => {
    gate.remove();
    document.body.style.overflow = '';
  }, 380);
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  initFooterYear();
  initFloats();

  // Show entry gate if user hasn't passed yet this session
  if (!hasEntryPass()) {
    showEntryGate();
  }
  initDayPlan();
  await loadExercises();
  initFilters();
  initModal();
});

async function loadExercises() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Cannot load exercises_raw.json');
    const data = await res.json();
    ALL = Array.isArray(data) ? data : (data.data || []);
    applyFilters();
  } catch (e) {
    console.error(e);
    document.getElementById('exLoading').style.display = 'none';
    document.getElementById('exEmpty').style.display = 'block';
    document.getElementById('exEmpty').innerHTML = `
      <div class="ex-empty-icon">⚠️</div>
      <h3>Could not load exercises</h3>
      <p>Make sure <code>assets/data/exercises_raw.json</code> exists.</p>`;
  }
}

// ── FILTERS ──────────────────────────────────────────────────
function initFilters() {
  const searchEl = document.getElementById('exSearch');
  const clearEl  = document.getElementById('exSearchClear');
  const diffEl   = document.getElementById('diffFilter');
  const equipEl  = document.getElementById('equipFilter');
  const clearAll = document.getElementById('exClearAll');

  searchEl.addEventListener('input', () => {
    currentSearch = searchEl.value.trim().toLowerCase();
    clearEl.style.display = currentSearch ? 'block' : 'none';
    resetAndFilter();
  });
  clearEl.addEventListener('click', () => {
    searchEl.value = ''; currentSearch = '';
    clearEl.style.display = 'none';
    resetAndFilter();
  });
  diffEl.addEventListener('change',  () => { currentDiff  = diffEl.value;  resetAndFilter(); });
  equipEl.addEventListener('change', () => { currentEquip = equipEl.value; resetAndFilter(); });

  const stretchEl = document.getElementById('stretchFilter');
  if (stretchEl) stretchEl.addEventListener('change', () => { currentStretch = stretchEl.value; resetAndFilter(); });

  document.querySelectorAll('.ex-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ex-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPart = btn.dataset.part;
      resetAndFilter();
    });
  });

  if (clearAll) clearAll.addEventListener('click', clearAllFilters);

  document.getElementById('exLoadMore').addEventListener('click', () => {
    page++;
    renderPage();
  });
}

function resetAndFilter() { page = 0; applyFilters(); }

function clearAllFilters() {
  currentPart = 'all'; currentDiff = ''; currentEquip = ''; currentSearch = ''; currentStretch = '';
  document.getElementById('exSearch').value = '';
  document.getElementById('exSearchClear').style.display = 'none';
  document.getElementById('diffFilter').value = '';
  document.getElementById('equipFilter').value = '';
  const stretchEl = document.getElementById('stretchFilter');
  if (stretchEl) stretchEl.value = '';
  document.querySelectorAll('.ex-tab').forEach(b => b.classList.remove('active'));
  document.querySelector('.ex-tab[data-part="all"]').classList.add('active');
  resetAndFilter();
}

function applyFilters() {
  filtered = ALL.filter(ex => {
    const part  = (ex.bodyPart || '').toLowerCase();
    const diff  = (ex.difficulty || '').toLowerCase();
    const equip = (ex.equipment || '').toLowerCase();
    const name  = (ex.name || '').toLowerCase();
    const target= (ex.target || '').toLowerCase();
    const sec   = (ex.secondaryMuscles || []).join(' ').toLowerCase();

    if (currentPart !== 'all' && part !== currentPart) return false;
    if (currentDiff  && diff  !== currentDiff)  return false;
    if (currentEquip && equip !== currentEquip) return false;

    if (currentStretch) {
      const stretchName = (ex.name || '').toLowerCase();
      const stretchTarget = (ex.target || '').toLowerCase();
      const warmupKeywords = ['warm', 'dynamic', 'swing', 'rotation', 'circle', 'march', 'skip', 'jog', 'jump', 'lunge walk', 'hip circle', 'arm circle', 'leg swing', 'butt kick', 'high knee', 'inchworm', 'world greatest'];
      const cooldownKeywords = ['stretch', 'hold', 'static', 'pigeon', 'cobra', 'child', 'seated', 'lying', 'supine', 'reclined', 'figure', 'cross body', 'doorway', 'wall stretch', 'hamstring stretch', 'quad stretch', 'calf stretch', 'hip flexor', 'butterfly', 'cat cow', 'thread the needle', 'chest opener', 'neck stretch', 'shoulder stretch', 'spinal twist', 'forward fold'];
      const isWarmup   = warmupKeywords.some(k => stretchName.includes(k) || stretchTarget.includes(k));
      const isCooldown = cooldownKeywords.some(k => stretchName.includes(k) || stretchTarget.includes(k));
      if (currentStretch === 'warmup'   && !isWarmup)   return false;
      if (currentStretch === 'cooldown' && !isCooldown) return false;
    }

    if (currentSearch) {
      const q = currentSearch;
      if (!name.includes(q) && !target.includes(q) && !equip.includes(q) && !part.includes(q) && !sec.includes(q)) return false;
    }
    return true;
  });

  const countEl = document.getElementById('exCount');
  countEl.textContent = `${filtered.length} Exercise${filtered.length !== 1 ? 's' : ''}`;

  const grid  = document.getElementById('exGrid');
  const empty = document.getElementById('exEmpty');
  const lmWrap= document.getElementById('exLoadMoreWrap');

  grid.innerHTML = '';
  empty.style.display = 'none';

  if (!filtered.length) {
    document.getElementById('exLoading').style.display = 'none';
    empty.style.display = 'block';
    lmWrap.style.display = 'none';
    return;
  }

  renderPage();
}

function renderPage() {
  document.getElementById('exLoading').style.display = 'none';
  const grid   = document.getElementById('exGrid');
  const lmWrap = document.getElementById('exLoadMoreWrap');
  const start  = page * PAGE_SIZE;
  const slice  = filtered.slice(start, start + PAGE_SIZE);

  slice.forEach((ex, i) => {
    const card = buildCard(ex, start + i);
    grid.appendChild(card);
  });

  const shown = (page + 1) * PAGE_SIZE;
  lmWrap.style.display = shown < filtered.length ? 'block' : 'none';
}

// ── CARD ─────────────────────────────────────────────────────
function buildCard(ex, idx) {
  const gif  = gifPath(ex);
  const name = capFirst(ex.name || 'Exercise');
  const diff = diffClass(ex.difficulty);
  const diffLabel = capFirst(ex.difficulty || '');
  const equip = capFirst(ex.equipment || '');
  const target = capFirst(ex.target || ex.bodyPart || '');

  const card = document.createElement('div');
  card.className = 'ex-card';
  card.style.animationDelay = (idx % PAGE_SIZE) * 0.03 + 's';

  card.innerHTML = `
    <div class="ex-card-thumb">
      ${gif
        ? `<img src="${gif}" alt="${name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=ex-card-no-gif><span class=ex-card-no-gif-icon>💪</span><small>Demo soon</small></div>'">`
        : `<div class="ex-card-no-gif"><span class="ex-card-no-gif-icon">💪</span><small>Demo soon</small></div>`
      }
      ${diff ? `<span class="ex-card-diff-badge ${diff}">${diffLabel}</span>` : ''}
      <div class="ex-card-overlay"><div class="ex-card-play">▶</div></div>
    </div>
    <div class="ex-card-meta">
      <p class="ex-card-name">${name}</p>
      <p class="ex-card-target">${target}</p>
      <div class="ex-card-chips">
        ${equip ? `<span class="ex-card-chip">${equip}</span>` : ''}
      </div>
    </div>`;

    // Save button on card
    const saveBtn = document.createElement('button');
    saveBtn.className = 'ex-card-save-btn' + (savedPlan.some(s => s.id === (ex.id || ex.exerciseId)) ? ' saved' : '');
    saveBtn.textContent = savedPlan.some(s => s.id === (ex.id || ex.exerciseId)) ? '✅ Saved' : '+ Add';
    saveBtn.addEventListener('click', e => {
      e.stopPropagation(); // don't open modal
      toggleSavePlan(ex, saveBtn, true);
    });
    card.querySelector('.ex-card-meta').appendChild(saveBtn);

    card.addEventListener('click', () => openModal(ex));
    return card;
}

// ── MODAL ─────────────────────────────────────────────────────
function initModal() {
  document.getElementById('exModalClose').addEventListener('click', closeModal);
  document.getElementById('exModalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('exModalOverlay')) closeModal();
  });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(ex) {
  const gif      = gifPath(ex);
  const name     = capFirst(ex.name || 'Exercise');
  const diff     = diffClass(ex.difficulty);
  const diffLbl  = capFirst(ex.difficulty || '');
  const target   = capFirst(ex.target || '');
  const bodyPart = capFirst(ex.bodyPart || '');
  const equip    = capFirst(ex.equipment || '');
  const desc     = ex.description || '';
  const steps    = ex.instructions || [];
  const secMus   = ex.secondaryMuscles || [];

  const stepsHTML = steps.length
    ? `<ul class="ex-modal-steps">${steps.map((s, i) =>
        `<li><span class="ex-modal-step-num">${i+1}</span><span>${s}</span></li>`
      ).join('')}</ul>`
    : '<p style="color:rgba(255,255,255,0.45);font-size:14px">Instructions coming soon.</p>';

  const secHTML = secMus.length
    ? `<div class="ex-modal-secondary"><strong style="color:rgba(255,255,255,0.6)">Also works:</strong> ${secMus.map(m => `<span class="ex-modal-chip secondary">${capFirst(m)}</span>`).join(' ')}</div>`
    : '';

  document.getElementById('exModalBody').innerHTML = `
    <div class="ex-modal-layout">
      <div class="ex-modal-left">
        <div class="ex-modal-gif-wrap">
          ${gif
            ? `<img src="${gif}" alt="${name}" onerror="this.parentElement.innerHTML='<div class=ex-modal-gif-placeholder><span>💪</span><small style=color:rgba(255,255,255,0.3)>GIF downloading…</small></div>'">`
            : `<div class="ex-modal-gif-placeholder"><span>💪</span><small style="color:rgba(255,255,255,0.3)">GIF downloading…</small></div>`
          }
        </div>
        <div class="ex-modal-muscles">
          <div class="ex-modal-muscles-title">🎯 Muscles Targeted</div>
          <div class="ex-modal-muscle-chips">
            ${target ? `<span class="ex-modal-chip primary">${target}</span>` : ''}
            ${secMus.slice(0,4).map(m => `<span class="ex-modal-chip secondary">${capFirst(m)}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="ex-modal-right">
        ${diff ? `<div class="ex-modal-diff ${diff}">${diffLbl}</div>` : ''}
        <h2 class="ex-modal-name">${name}</h2>
        <p class="ex-modal-target">🎯 ${target} &nbsp;·&nbsp; 🏋️ ${equip} &nbsp;·&nbsp; 📍 ${bodyPart}</p>
        ${desc ? `<p class="ex-modal-desc">${desc}</p>` : ''}
        <div class="ex-modal-section-title">How to Perform</div>
        ${stepsHTML}
        ${secHTML}
        <div class="ex-modal-cta">
          <p>Want a personalised workout plan for these exercises?</p>
          <a href="index.html#diet-plan">Get Free Plan from Classic Fitness →</a>
        </div>
      </div>
    </div>`;
  // Save to plan button
  const isSaved = savedPlan.some(s => s.id === (ex.id || ex.exerciseId));
  const saveBtn = document.createElement('button');
  saveBtn.className = 'ex-modal-save-btn' + (isSaved ? ' saved' : '');
  saveBtn.textContent = isSaved ? '✅ Saved to Day Plan' : '+ Add to Today\'s Plan';
  saveBtn.addEventListener('click', () => toggleSavePlan(ex, saveBtn));
  document.getElementById('exModalBody').appendChild(saveBtn);

  const overlay = document.getElementById('exModalOverlay');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}

function closeModal() {
  document.getElementById('exModalOverlay').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

}

function toggleSavePlan(ex, btn) {
  const id = ex.id || ex.exerciseId || ex.name;
  const idx = savedPlan.findIndex(s => s.id === id);
  if (idx === -1) {
    savedPlan.push({ id, name: capFirst(ex.name), target: capFirst(ex.target || ''), equipment: capFirst(ex.equipment || ''), gif: gifPath(ex), done: false });
    btn.textContent = '✅ Saved to Day Plan';
    btn.classList.add('saved');
  } else {
    savedPlan.splice(idx, 1);
    btn.textContent = '+ Add to Today\'s Plan';
    btn.classList.remove('saved');
  }
  sessionStorage.setItem('cf_day_plan', JSON.stringify(savedPlan));
  updateDayPlanBadge();
  renderDayPlan();
  refreshCardSaveButtons();
}

function updateDayPlanBadge() {
  const badge = document.getElementById('dayPlanBadge');
  if (!badge) return;
  if (savedPlan.length > 0) {
    badge.textContent = savedPlan.length;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderDayPlan() {
  const list  = document.getElementById('dayPlanList');
  const empty = document.getElementById('dayPlanEmpty');
  if (!list) return;
  list.innerHTML = '';
  if (!savedPlan.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  savedPlan.forEach((ex, index) => {
    const gif = ex.gif || null;
    const item = document.createElement('div');
    item.className = 'day-plan-item' + (ex.done ? ' done' : '');
    item.innerHTML = `
      <div class="day-plan-item-num">${index + 1}</div>
      ${gif ? `<img class="day-plan-item-gif" src="${gif}" alt="${ex.name}" onerror="this.style.display='none'">` : `<div class="day-plan-item-gif-placeholder">💪</div>`}
      <div class="day-plan-item-info">
        <div class="day-plan-item-name">${ex.name}</div>
        <div class="day-plan-item-meta">${ex.target} · ${ex.equipment}</div>
        <button class="day-plan-item-done-btn${ex.done ? ' is-done' : ''}" data-id="${ex.id}">
          ${ex.done ? '✅ Done!' : 'Mark Done'}
        </button>
      </div>
      <button class="day-plan-item-remove" data-id="${ex.id}">✕</button>`;


      // Click GIF or name to open focus view
      const clickable = item.querySelector('.day-plan-item-gif') || item.querySelector('.day-plan-item-gif-placeholder');
      if (clickable) clickable.addEventListener('click', () => openFocusView(index));
      const nameEl2 = item.querySelector('.day-plan-item-name');
      if (nameEl2) nameEl2.addEventListener('click', () => openFocusView(index));
      nameEl2 && (nameEl2.style.cursor = 'pointer');


    item.querySelector('.day-plan-item-done-btn').addEventListener('click', () => {
      const found = savedPlan.find(s => s.id === ex.id);
      if (found) found.done = !found.done;
      sessionStorage.setItem('cf_day_plan', JSON.stringify(savedPlan));
      renderDayPlan();
    });
    item.querySelector('.day-plan-item-remove').addEventListener('click', () => {
      savedPlan = savedPlan.filter(s => s.id !== ex.id);
      sessionStorage.setItem('cf_day_plan', JSON.stringify(savedPlan));
      updateDayPlanBadge();
      renderDayPlan();
      refreshCardSaveButtons();
    });
    list.appendChild(item);
  });
}

function refreshCardSaveButtons() {
  document.querySelectorAll('.ex-card').forEach(card => {
    const btn = card.querySelector('.ex-card-save-btn');
    if (!btn) return;
    const nameEl = card.querySelector('.ex-card-name');
    if (!nameEl) return;
    const cardName = nameEl.textContent.trim().toLowerCase();
    const isSaved = savedPlan.some(s => s.name.toLowerCase() === cardName);
    btn.textContent = isSaved ? '✅ Saved' : '+ Add';
    btn.className = 'ex-card-save-btn' + (isSaved ? ' saved' : '');
    btn.disabled = isSaved;
  });
}
function openFocusView(index) {
  const existing = document.getElementById('exFocusOverlay');
  if (existing) existing.remove();

  function render(i) {
    const ex = savedPlan[i];
    if (!ex) return;
    const overlay = document.getElementById('exFocusOverlay');
    overlay.innerHTML = `
      <div class="ex-focus-topbar">
        <span class="ex-focus-counter">Exercise ${i + 1} of ${savedPlan.length}</span>
        <button class="ex-focus-close" id="exFocusClose">✕</button>
      </div>
      <div class="ex-focus-gif-wrap">
        ${ex.gif
          ? `<img src="${ex.gif}" alt="${ex.name}" onerror="this.parentElement.innerHTML='<div class=ex-focus-gif-placeholder>💪</div>'">`
          : `<div class="ex-focus-gif-placeholder">💪</div>`}
      </div>
      <div class="ex-focus-info">
        <div class="ex-focus-name">${ex.name}</div>
        <div class="ex-focus-meta">${ex.target} · ${ex.equipment}</div>
      </div>
      <button class="ex-focus-done-btn ${ex.done ? 'is-done' : ''}" id="exFocusDoneBtn">
        ${ex.done ? '✅ Done! Tap to undo' : '✅ Mark as Done'}
      </button>
      <div class="ex-focus-nav">
        <button class="ex-focus-nav-btn" id="exFocusPrev" ${i === 0 ? 'disabled' : ''}>← Previous</button>
        <button class="ex-focus-nav-btn" id="exFocusNext" ${i === savedPlan.length - 1 ? 'disabled' : ''}>Next →</button>
      </div>`;

    document.getElementById('exFocusClose').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
      renderDayPlan();
    });
    document.getElementById('exFocusDoneBtn').addEventListener('click', () => {
      savedPlan[i].done = !savedPlan[i].done;
      sessionStorage.setItem('cf_day_plan', JSON.stringify(savedPlan));
      render(i);
    });
    document.getElementById('exFocusPrev').addEventListener('click', () => render(i - 1));
    document.getElementById('exFocusNext').addEventListener('click', () => render(i + 1));
  }

  const overlay = document.createElement('div');
  overlay.id = 'exFocusOverlay';
  overlay.className = 'ex-focus-overlay';
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  render(index);
}

function initDayPlan() {
  const toggle   = document.getElementById('dayPlanToggle');
  const panel    = document.getElementById('dayPlanPanel');
  const backdrop = document.getElementById('dayPlanBackdrop');
  const closeBtn = document.getElementById('dayPlanClose');
  const resetBtn = document.getElementById('dayPlanReset');

  function openPanel()  { panel.classList.add('open'); backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closePanel() { panel.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; }

  toggle.addEventListener('click', () => panel.classList.contains('open') ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
  resetBtn.addEventListener('click', () => {
    savedPlan = [];
    sessionStorage.removeItem('cf_day_plan');
    updateDayPlanBadge();
    renderDayPlan();
    refreshCardSaveButtons();
  });

  updateDayPlanBadge();
  renderDayPlan();
}

// ── NAVBAR / FOOTER / FLOATS ──────────────────────────────────
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) links.classList.remove('open');
    });
  }

  const dietBarBtn   = document.getElementById('dietBarBtn');
  const dietBarClose = document.getElementById('dietBarClose');
  const dietBar      = document.getElementById('dietAnnounceBar');
  if (dietBarBtn)   dietBarBtn.addEventListener('click', () => { window.location.href = 'index.html#diet-plan'; });
  if (dietBarClose && dietBar) dietBarClose.addEventListener('click', () => { dietBar.style.display = 'none'; });

  const joinNowBtn = document.getElementById('joinNowBtn');
  const joinModal  = document.getElementById('joinModal');
  const joinClose  = document.getElementById('joinModalClose');
  const joinOverlay= document.getElementById('joinModalOverlay');
  if (joinNowBtn && joinModal) {
    joinNowBtn.addEventListener('click', () => { joinModal.classList.add('active'); document.body.style.overflow = 'hidden'; });
    if (joinClose)   joinClose.addEventListener('click',   () => { joinModal.classList.remove('active'); document.body.style.overflow = ''; });
    if (joinOverlay) joinOverlay.addEventListener('click', () => { joinModal.classList.remove('active'); document.body.style.overflow = ''; });
  }

  const joinForm = document.getElementById('joinForm');
  if (joinForm) {
    joinForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('joinName')?.value || '';
      const mobile= document.getElementById('joinMobile')?.value || '';
      const goal  = document.getElementById('joinGoal')?.value || 'Fitness';
      const msg   = `Hi Classic Fitness! I want to join.%0AName: ${encodeURIComponent(name)}%0AMobile: ${encodeURIComponent(mobile)}%0AGoal: ${encodeURIComponent(goal)}`;
      window.open(`https://wa.me/918668007901?text=${msg}`, '_blank');
    });
  }
}

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function initFloats() {
  const waFloat  = document.getElementById('waFloat');
  const backToTop= document.getElementById('backToTop');
  if (waFloat) waFloat.href = 'https://wa.me/918668007901';
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
  });
}