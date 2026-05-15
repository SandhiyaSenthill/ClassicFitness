// ============================================================
//  CLASSIC FITNESS — exercises-special.js  (FIXED v2)
//  Special Categories: Mobility, Stretching, Pre-Pregnancy,
//  Post-Pregnancy, Breathing
//
//  Add in exercises.html AFTER exercises.js:
//  <script src="assets/js/exercises-special.js"></script>
// ============================================================

var SPECIAL_DATA_URL = 'assets/data/special_exercises.json';
var SPECIAL_GIF_DIR  = 'assets/exercise-gifs/special';

var SPECIAL_CATEGORIES = {
  'mobility':       { label: '🦵 Mobility',      color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)'   },
  'stretching':     { label: '🤸 Stretching',     color: '#a855f7', bg: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.35)'  },
  'pre_pregnancy':  { label: '🤰 Pre-Pregnancy',  color: '#ec4899', bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.35)'  },
  'post_pregnancy': { label: '🌸 Post-Pregnancy', color: '#f472b6', bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.35)' },
  'breathing':      { label: '🌬️ Breathing',      color: '#34d399', bg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.35)'  },
};

var SPECIAL_ALL      = [];
var currentSpecial   = null;   // null = normal mode

// ── GIF PATH ─────────────────────────────────────────────────
function specialGifPath(ex) {
  return `${SPECIAL_GIF_DIR}/${ex.id}.gif`;
}

// ── LOAD SPECIAL DATA ─────────────────────────────────────────
async function loadSpecialExercises() {
  try {
    const res = await fetch(SPECIAL_DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Cannot load special_exercises.json');
    SPECIAL_ALL = await res.json();
    console.log(`✅ Special exercises loaded: ${SPECIAL_ALL.length}`);
  } catch (e) {
    console.error('❌ Special exercises load failed:', e.message);
    SPECIAL_ALL = [];
  }
}

// ── RENDER SPECIAL GRID ───────────────────────────────────────
function renderSpecialGrid(category) {
  const exercises = SPECIAL_ALL.filter(ex => ex.category === category);
  const cat       = SPECIAL_CATEGORIES[category];

  const grid    = document.getElementById('exGrid');
  const empty   = document.getElementById('exEmpty');
  const lmWrap  = document.getElementById('exLoadMoreWrap');
  const loading = document.getElementById('exLoading');
  const countEl = document.getElementById('exCount');

  // Clear grid
  grid.innerHTML    = '';
  empty.style.display  = 'none';
  lmWrap.style.display = 'none';
  loading.style.display = 'none';

  // Color the count badge
  countEl.textContent        = `${exercises.length} Exercise${exercises.length !== 1 ? 's' : ''}`;
  countEl.style.background   = cat.bg;
  countEl.style.borderColor  = cat.border;
  countEl.style.color        = cat.color;

  if (!exercises.length) {
    empty.style.display = 'block';
    return;
  }

  // Category banner
  const banner = document.createElement('div');
  banner.style.cssText = `
    grid-column:1/-1;
    background:linear-gradient(135deg,${cat.bg},rgba(0,0,0,0));
    border:1px solid ${cat.border};
    border-radius:16px;padding:20px 24px;
    margin-bottom:4px;display:flex;align-items:center;gap:16px;
    animation:cardIn .35s ease both;
  `;
  banner.innerHTML = `
    <div style="font-size:44px;line-height:1">${cat.label.split(' ')[0]}</div>
    <div>
      <div style="font-size:18px;font-weight:800;color:#fff;font-family:'Inter',sans-serif">
        ${cat.label.substring(cat.label.indexOf(' ')+1)}
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;font-family:'Inter',sans-serif">
        ${exercises.length} curated exercises · Tap any card for full instructions
      </div>
    </div>
    ${(category==='pre_pregnancy'||category==='post_pregnancy') ? `
    <div style="margin-left:auto;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);
      border-radius:10px;padding:8px 14px;font-size:11px;color:#fca5a5;
      font-family:'Inter',sans-serif;font-weight:600;max-width:200px;text-align:center;line-height:1.4">
      ⚠️ Consult your doctor before exercising during or after pregnancy
    </div>` : ''}`;
  grid.appendChild(banner);

  exercises.forEach((ex, i) => {
    const card = buildSpecialCard(ex, i, cat);
    grid.appendChild(card);
  });
}

// ── BUILD CARD ────────────────────────────────────────────────
function buildSpecialCard(ex, idx, cat) {
  const gifLocal    = specialGifPath(ex);
  const gifFallback = ex.gifUrl || '';
  const name        = capFirst(ex.name || 'Exercise');
  const diff        = (ex.difficulty || '').toLowerCase();
  const diffLabel   = capFirst(ex.difficulty || '');
  const equip       = capFirst(ex.equipment || '');
  const target      = capFirst(ex.target || '');

  const card = document.createElement('div');
  card.className = 'ex-card';
  card.style.animationDelay = (idx * 0.04) + 's';
  card.style.setProperty('--special-color', cat.color);

  card.innerHTML = `
    <div class="ex-card-thumb">
      <img
        src="${gifLocal}"
        alt="${name}"
        loading="lazy"
        onerror="this.src='${gifFallback}';this.onerror=null"
      >
      ${diff ? `<span class="ex-card-diff-badge ${diff}">${diffLabel}</span>` : ''}
      <span style="position:absolute;top:10px;left:10px;font-size:14px;padding:3px 8px;
        border-radius:999px;border:1px solid ${cat.border};background:${cat.bg};
        color:${cat.color};font-weight:700;backdrop-filter:blur(4px);z-index:2">
        ${cat.label.split(' ')[0]}
      </span>
      <div class="ex-card-overlay"><div class="ex-card-play">▶</div></div>
    </div>
    <div class="ex-card-meta">
      <p class="ex-card-name">${name}</p>
      <p class="ex-card-target">${target}</p>
      <div class="ex-card-chips">
        <span class="ex-card-chip" style="background:${cat.bg};border-color:${cat.border};color:${cat.color}">
          ${equip}
        </span>
      </div>
    </div>`;

  // Save button
  const isSaved = typeof savedPlan !== 'undefined' && savedPlan.some(s => s.id === ex.id);
  const saveBtn = document.createElement('button');
  saveBtn.className = 'ex-card-save-btn' + (isSaved ? ' saved' : '');
  saveBtn.textContent = isSaved ? '✅ Saved' : '+ Add';
  saveBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleSaveSpecial(ex, saveBtn);
  });
  card.querySelector('.ex-card-meta').appendChild(saveBtn);
  card.addEventListener('click', () => openSpecialModal(ex, cat));

  return card;
}

// ── OPEN MODAL ────────────────────────────────────────────────
function openSpecialModal(ex, cat) {
  const gifLocal    = specialGifPath(ex);
  const gifFallback = ex.gifUrl || '';
  const name        = capFirst(ex.name || 'Exercise');
  const diff        = (ex.difficulty || '').toLowerCase();
  const diffLbl     = capFirst(ex.difficulty || '');
  const target      = capFirst(ex.target || '');
  const equip       = capFirst(ex.equipment || '');
  const desc        = ex.description || '';
  const steps       = ex.instructions || [];
  const secMus      = ex.secondaryMuscles || [];

  const stepsHTML = steps.length
    ? `<ul class="ex-modal-steps">${steps.map((s, i) =>
        `<li>
          <span class="ex-modal-step-num" style="background:linear-gradient(135deg,${cat.color},${cat.color}aa)">${i+1}</span>
          <span>${s}</span>
        </li>`).join('')}</ul>`
    : '';

  const secHTML = secMus.length
    ? `<div class="ex-modal-secondary">
        <strong style="color:rgba(255,255,255,0.6)">Also works:</strong>
        ${secMus.map(m => `<span class="ex-modal-chip secondary">${capFirst(m)}</span>`).join(' ')}
       </div>` : '';

  const warningHTML = (ex.category==='pre_pregnancy'||ex.category==='post_pregnancy')
    ? `<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);
        border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:12px;
        color:#fca5a5;line-height:1.5;font-family:'Inter',sans-serif;font-weight:600">
        ⚠️ Always consult your doctor before starting this exercise
       </div>` : '';

  document.getElementById('exModalBody').innerHTML = `
    <div class="ex-modal-layout">
      <div class="ex-modal-left">
        <div class="ex-modal-gif-wrap">
          <img src="${gifLocal}" alt="${name}"
            onerror="this.src='${gifFallback}';this.onerror=null">
        </div>
        <div class="ex-modal-muscles">
          <div class="ex-modal-muscles-title">🎯 Muscles Targeted</div>
          <div class="ex-modal-muscle-chips">
            <span class="ex-modal-chip primary" style="background:${cat.bg};color:${cat.color};border-color:${cat.border}">${target}</span>
            ${secMus.slice(0,4).map(m=>`<span class="ex-modal-chip secondary">${capFirst(m)}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="ex-modal-right">
        <div style="display:inline-flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;
          font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;
          border:1px solid ${cat.border};background:${cat.bg};color:${cat.color};
          letter-spacing:0.3px;margin-bottom:10px;text-transform:uppercase">
          ${cat.label}
        </div>
        ${diff ? `<div class="ex-modal-diff ${diff}">${diffLbl}</div>` : ''}
        <h2 class="ex-modal-name">${name}</h2>
        <p class="ex-modal-target" style="color:${cat.color}">🎯 ${target} &nbsp;·&nbsp; 🏋️ ${equip}</p>
        ${warningHTML}
        ${desc ? `<p class="ex-modal-desc">${desc}</p>` : ''}
        <div class="ex-modal-section-title">How to Perform</div>
        ${stepsHTML}
        ${secHTML}
        <div class="ex-modal-cta">
          <p>Want a personalised workout plan from Classic Fitness?</p>
          <a href="index.html#diet-plan">Get Free Plan from Classic Fitness →</a>
        </div>
      </div>
    </div>`;

  // Save button
  const isSaved = typeof savedPlan !== 'undefined' && savedPlan.some(s => s.id === ex.id);
  const saveBtn = document.createElement('button');
  saveBtn.className = 'ex-modal-save-btn' + (isSaved ? ' saved' : '');
  saveBtn.textContent = isSaved ? '✅ Saved to Day Plan' : "+ Add to Today's Plan";
  saveBtn.addEventListener('click', () => toggleSaveSpecial(ex, saveBtn));
  document.getElementById('exModalBody').appendChild(saveBtn);

  const overlay = document.getElementById('exModalOverlay');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}

// ── SAVE TO DAY PLAN ──────────────────────────────────────────
function toggleSaveSpecial(ex, btn) {
  if (typeof savedPlan === 'undefined') return;
  const id  = ex.id;
  const idx = savedPlan.findIndex(s => s.id === id);
  if (idx === -1) {
    savedPlan.push({
      id,
      name:      capFirst(ex.name),
      target:    capFirst(ex.target || ''),
      equipment: capFirst(ex.equipment || ''),
      gif:       specialGifPath(ex),
      done:      false
    });
    btn.textContent = btn.classList.contains('ex-modal-save-btn')
      ? '✅ Saved to Day Plan' : '✅ Saved';
    btn.classList.add('saved');
  } else {
    savedPlan.splice(idx, 1);
    btn.textContent = btn.classList.contains('ex-modal-save-btn')
      ? "+ Add to Today's Plan" : '+ Add';
    btn.classList.remove('saved');
  }
  sessionStorage.setItem('cf_day_plan', JSON.stringify(savedPlan));
  if (typeof updateDayPlanBadge === 'function') updateDayPlanBadge();
  if (typeof renderDayPlan      === 'function') renderDayPlan();
}

// ── INJECT TABS ───────────────────────────────────────────────
function injectSpecialTabs() {
  const tabsEl = document.getElementById('exTabs');
  if (!tabsEl) return;

  // Divider
  const divider = document.createElement('span');
  divider.style.cssText = 'display:flex;align-items:center;padding:0 6px;color:rgba(255,255,255,0.15);font-size:18px;flex-shrink:0;user-select:none';
  divider.textContent = '|';
  tabsEl.appendChild(divider);

  Object.entries(SPECIAL_CATEGORIES).forEach(([key, cat]) => {
    const btn = document.createElement('button');
    btn.className        = 'ex-tab ex-tab-special';
    btn.dataset.special  = key;
    btn.textContent      = cat.label;
    btn.style.cssText    = `
      border-color:${cat.border};
      color:${cat.color};
      background:${cat.bg};
    `;

    btn.addEventListener('click', () => {
      // Remove active from ALL tabs
      document.querySelectorAll('.ex-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.style.background = cat.color;
      btn.style.color      = '#fff';
      btn.style.borderColor = 'transparent';
      btn.style.boxShadow  = `0 4px 16px ${cat.color}66`;

      currentSpecial = key;
      renderSpecialGrid(key);
    });

    tabsEl.appendChild(btn);
  });
}

// ── PATCH NORMAL TABS ─────────────────────────────────────────
// When user clicks a normal tab, reset special mode
function patchNormalTabs() {
  document.querySelectorAll('.ex-tab:not(.ex-tab-special)').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSpecial = null;

      // Reset count badge style
      const countEl = document.getElementById('exCount');
      if (countEl) {
        countEl.style.background  = '';
        countEl.style.borderColor = '';
        countEl.style.color       = '';
      }

      // Reset all special tab styles
      document.querySelectorAll('.ex-tab-special').forEach(sb => {
        const key = sb.dataset.special;
        const c   = SPECIAL_CATEGORIES[key];
        if (c) {
          sb.style.background  = c.bg;
          sb.style.color       = c.color;
          sb.style.borderColor = c.border;
          sb.style.boxShadow   = '';
        }
        sb.classList.remove('active');
      });
    });
  });
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadSpecialExercises();
  injectSpecialTabs();
  patchNormalTabs();
  console.log('✅ Special categories ready — ' + SPECIAL_ALL.length + ' exercises loaded');
});