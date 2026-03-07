// ============================================================
//  CLASSIC FITNESS — exercises.js
//  Reads from assets/data/exercises_raw.json
//  GIFs from assets/exercise-gifs/
// ============================================================

const GIF_DIR  = 'assets/exercise-gifs';
const DATA_URL = 'assets/data/exercises_raw.json';
const PAGE_SIZE = 24;

let ALL = [], filtered = [], page = 0;
let currentPart = 'all', currentDiff = '', currentEquip = '', currentSearch = '';

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

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  initFooterYear();
  initFloats();
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
  currentPart = 'all'; currentDiff = ''; currentEquip = ''; currentSearch = '';
  document.getElementById('exSearch').value = '';
  document.getElementById('exSearchClear').style.display = 'none';
  document.getElementById('diffFilter').value = '';
  document.getElementById('equipFilter').value = '';
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

  const overlay = document.getElementById('exModalOverlay');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}

function closeModal() {
  document.getElementById('exModalOverlay').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
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