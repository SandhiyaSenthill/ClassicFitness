// ==========================================
//  CLASSIC FITNESS GYM — MEAL PLANNER JS
//  Library + AI Plan (Cloudflare Worker)
// ==========================================

(function () {
  'use strict';

  // ===== Config =====
  const WORKER_URL = 'https://classicfitness-api.sandhiyasenthill3.workers.dev';

  // ===== Silent Analytics Tracker =====
  function track(action, detail) {
    try {
      fetch(WORKER_URL + '/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:   state.name   || null,
          mobile: state.mobile || null,
          action: action,
          detail: detail || null
        })
      }).catch(function() {});
    } catch(e) {}
  }

  // ===== State =====
  const state = {
    // Library
    allMeals:    [],
    filtered:    [],
    slot:        '',
    goal:        '',
    foodType:    '',
    cuisine:     '',
    search:      '',
    // AI Planner
    aiGoal:      null,
    foodPref:    'Vegetarian',
    meals:       4,
    calories:    null,
    aiCuisine:   'South Indian',
    allergies:   '',
    name:        '',
    mobile:      '',
    currentStep: 1,
    lastPlan:    null,
    // Lead gate
    gateUnlocked: false,
    // My Day
    myDay: []
  };

  // ===== Goal Metadata (used across AI planner + library) =====
  const GOAL_META = {
    'Fat Loss':        { emoji:'🔥', color:'#dc2626', bg:'#fef2f2', border:'#fca5a5', db:'fat_loss' },
    'Muscle Gain':     { emoji:'💪', color:'#2563eb', bg:'#eff6ff', border:'#93c5fd', db:'muscle_gain' },
    'Maintain Weight': { emoji:'⚖️', color:'#16a34a', bg:'#f0fdf4', border:'#86efac', db:'maintain' },
    'Pre-Pregnancy':   { emoji:'🤰', color:'#d97706', bg:'#fffbeb', border:'#fcd34d', db:'pre_pregnancy' },
    'Post-Pregnancy':  { emoji:'🌸', color:'#db2777', bg:'#fdf2f8', border:'#f9a8d4', db:'post_pregnancy' },
    'PCOS Support':    { emoji:'💜', color:'#7c3aed', bg:'#f5f3ff', border:'#c4b5fd', db:'pcos' },
    "Women's Toning":  { emoji:'💃', color:'#0891b2', bg:'#ecfeff', border:'#67e8f9', db:'womens_toning' }
  };

  // ==========================================
  //  INIT
  // ==========================================
  function init() {
    setYear();
    setupLinks();
    initMobileNav();
    initBackToTop();
    initDietBar();
    initJoinModal();
    initLeadGate();
    initMyDay();
    initLibrary();
    initAIPlanner();
  }

  // ===== Helpers =====
  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function setupLinks() {
    const phone = '8668007901';
    const msg   = encodeURIComponent('Hello Classic Fitness Gym, I want to enquire about membership and timings.');
    const wa    = document.getElementById('waFloat');
    if (wa) wa.href = `https://wa.me/91${phone}?text=${msg}`;
  }

  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links  = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      links.classList.toggle('show');
      const spans = toggle.querySelectorAll('span');
      if (links.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    document.querySelectorAll('.dropdown-toggle').forEach(t => {
      t.addEventListener('click', (e) => {
        if (window.innerWidth <= 820) {
          e.preventDefault();
          t.closest('.nav-dropdown').classList.toggle('open');
        }
      });
    });
    document.addEventListener('click', (e) => {
      if (!links.classList.contains('show')) return;
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('show');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initDietBar() {
    const bar   = document.getElementById('dietAnnounceBar');
    const close = document.getElementById('dietBarClose');
    const grab  = document.getElementById('dietBarBtn');
    if (!bar) return;
    if (close) close.addEventListener('click', () => bar.style.display = 'none');
    if (grab)  grab.addEventListener('click',  () => { window.location.href = 'index.html#diet-plan'; });
  }

  function initJoinModal() {
    const btn     = document.getElementById('joinNowBtn');
    const modal   = document.getElementById('joinModal');
    const overlay = document.getElementById('joinModalOverlay');
    const close   = document.getElementById('joinModalClose');
    if (!btn || !modal) return;
    const open   = () => modal.classList.add('show');
    const closeM = () => modal.classList.remove('show');
    btn.addEventListener('click', open);
    if (overlay) overlay.addEventListener('click', closeM);
    if (close)   close.addEventListener('click', closeM);

    const form = document.getElementById('joinForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name   = document.getElementById('joinName')?.value.trim() || '';
      const mobile = document.getElementById('joinMobile')?.value.trim() || '';
      const goal   = document.getElementById('joinGoal')?.value || '';
      const time   = document.getElementById('joinTime')?.value || '';
      const msg    = document.getElementById('joinMessage')?.value.trim() || '';
      if (!name || !mobile || !goal) return;
      const text = encodeURIComponent(
        `Hi Classic Fitness Gym! 🏋️\n\nName: ${name}\nMobile: ${mobile}\nGoal: ${goal}\nPreferred Time: ${time}\n${msg ? 'Message: ' + msg : ''}\n\nPlease contact me about membership.`
      );
      window.open(`https://wa.me/918668007901?text=${text}`, '_blank');
      closeM();
    });
    document.querySelectorAll('.custom-select').forEach(sel => {
      const trigger  = sel.querySelector('.custom-select-trigger');
      const options  = sel.querySelectorAll('.custom-option');
      const hiddenId = sel.id === 'joinGoalSelect' ? 'joinGoal' : 'joinTime';
      sel.addEventListener('click', () => sel.classList.toggle('open'));
      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          trigger.firstChild.textContent = opt.textContent + ' ';
          const hidden = document.getElementById(hiddenId);
          if (hidden) hidden.value = opt.dataset.value;
          sel.classList.remove('open');
        });
      });
      document.addEventListener('click', (e) => {
        if (!sel.contains(e.target)) sel.classList.remove('open');
      });
    });
  }

  // ==========================================
  //  LEAD GATE — Meal Planner Entry Capture
  // ==========================================
  function initLeadGate() {
    // Check if already submitted on this device
    const saved = localStorage.getItem('cf_meal_lead');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state.gateUnlocked = true;
        state.name   = parsed.name   || '';
        state.mobile = parsed.mobile || '';
        setTimeout(function(){ track('opened', 'returning-visit'); }, 200);
      } catch(e) {}
    }

    // Inject gate modal HTML into body
    const gateHTML = `
      <div id="leadGateOverlay" style="
        display:none;position:fixed;inset:0;z-index:9999;
        background:rgba(6,13,26,0.82);backdrop-filter:blur(6px);
        align-items:center;justify-content:center;padding:16px;">
        <div id="leadGateModal" style="
          background:#fff;border-radius:24px;width:100%;max-width:400px;
          box-shadow:0 32px 80px rgba(0,0,0,0.35);
          overflow:hidden;position:relative;
          animation:gateSlideUp 0.35s cubic-bezier(.34,1.56,.64,1) both;">

          <!-- Green top bar -->
          <div style="background:linear-gradient(135deg,#059669,#10b981);padding:28px 28px 24px;text-align:center;">
            <div style="font-size:44px;margin-bottom:8px;">🥗</div>
            <div style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.3px;line-height:1.2;">
              Access 200+ Nutrition Meals
            </div>
            <div style="color:#a7f3d0;font-size:13px;margin-top:6px;font-weight:500;">
              Free · Curated by fitness experts
            </div>
          </div>

          <!-- Form body -->
          <div style="padding:24px 24px 28px;">
            <div style="font-size:13px;color:#64748b;text-align:center;margin-bottom:20px;">
              Enter your details to unlock the full meal library
            </div>

            <div style="margin-bottom:14px;">
              <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Your Name</label>
              <input id="gateNameInput" type="text" placeholder="e.g. Ravi Kumar"
                autocomplete="name" style="
                width:100%;padding:13px 16px;border:2px solid #e5e7eb;border-radius:12px;
                font-size:15px;font-weight:600;color:#0f172a;outline:none;
                box-sizing:border-box;transition:border-color 0.2s;
                font-family:inherit;" />
            </div>

            <div style="margin-bottom:20px;">
              <label style="font-size:12px;font-weight:700;color:#374151;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Mobile Number</label>
              <input id="gateMobileInput" type="tel" placeholder="10-digit mobile number"
                maxlength="10" autocomplete="tel" style="
                width:100%;padding:13px 16px;border:2px solid #e5e7eb;border-radius:12px;
                font-size:15px;font-weight:600;color:#0f172a;outline:none;
                box-sizing:border-box;transition:border-color 0.2s;
                font-family:inherit;" />
            </div>

            <div id="gateError" style="display:none;background:#fef2f2;border:1px solid #fca5a5;
              color:#dc2626;font-size:13px;font-weight:600;padding:10px 14px;
              border-radius:10px;margin-bottom:14px;text-align:center;"></div>

            <button id="gateSubmitBtn" style="
              width:100%;padding:15px;border-radius:14px;border:none;cursor:pointer;
              background:linear-gradient(135deg,#059669,#10b981);color:#fff;
              font-size:16px;font-weight:800;letter-spacing:0.2px;
              box-shadow:0 4px 16px rgba(16,185,129,0.35);
              transition:transform 0.15s,box-shadow 0.15s;font-family:inherit;">
              Unlock Meal Plans 🚀
            </button>

            <div style="text-align:center;margin-top:14px;font-size:11px;color:#94a3b8;line-height:1.5;">
              🔒 No spam. We only share personalised fitness tips.<br>
              Classic Fitness Gym, Arakkonam · 8668007901
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes gateSlideUp {
          from { opacity:0; transform:translateY(40px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        #gateNameInput:focus, #gateMobileInput:focus {
          border-color:#10b981 !important;
          box-shadow:0 0 0 3px rgba(16,185,129,0.15);
        }
        #gateSubmitBtn:hover {
          transform:translateY(-1px);
          box-shadow:0 6px 20px rgba(16,185,129,0.45) !important;
        }
        #gateSubmitBtn:active { transform:translateY(0); }
      </style>`;

    document.body.insertAdjacentHTML('beforeend', gateHTML);

    // Wire up submit
    const submitBtn = document.getElementById('gateSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', handleGateSubmit);
    }
    ['gateNameInput','gateMobileInput'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleGateSubmit();
      });
    });

    // Tab switching — show gate when Library tab clicked (if not unlocked)
    document.querySelectorAll('.meal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tab === 'library' && !state.gateUnlocked) {
          showGate();
        }
      });
    });

    // If page loads on library tab and not unlocked, show gate
    if (!state.gateUnlocked) {
      const activeTab = document.querySelector('.meal-tab-btn.active');
      if (activeTab && activeTab.dataset.tab === 'library') {
        setTimeout(showGate, 400);
      } else {
        // Show on any first visit regardless of tab
        setTimeout(showGate, 600);
      }
    }
  }

  function showGate() {
    const overlay = document.getElementById('leadGateOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const input = document.getElementById('gateNameInput');
        if (input) input.focus();
      }, 350);
    }
  }

  function hideGate() {
    const overlay = document.getElementById('leadGateOverlay');
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  async function handleGateSubmit() {
    const nameEl   = document.getElementById('gateNameInput');
    const mobileEl = document.getElementById('gateMobileInput');
    const errorEl  = document.getElementById('gateError');
    const submitBtn = document.getElementById('gateSubmitBtn');

    const name   = (nameEl?.value || '').trim();
    const mobile = (mobileEl?.value || '').trim();

    // Validate
    if (!name) {
      showGateError('Please enter your name'); nameEl?.focus(); return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showGateError('Enter a valid 10-digit mobile number'); mobileEl?.focus(); return;
    }
    if (errorEl) errorEl.style.display = 'none';

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
    }

    // Save to bmi_leads via worker
    try {
      await fetch(`${WORKER_URL}/save-bmi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, mobile, source: 'meal-planner',
          goal: '', gender: '', age: null,
          height: null, weight: null, category: '',
          calories: null, protein: null, carbs: null, fats: null
        })
      });
    } catch(e) {
      console.warn('Lead save failed (non-blocking):', e);
    }

    // Save to localStorage so we never ask again
    localStorage.setItem('cf_meal_lead', JSON.stringify({ name, mobile }));
    state.gateUnlocked = true;
    state.name   = name;
    state.mobile = mobile;

    // Success animation then close
    if (submitBtn) {
      submitBtn.textContent = '✅ Unlocked!';
      submitBtn.style.background = 'linear-gradient(135deg,#065f46,#059669)';
    }
    setTimeout(() => {
      track('opened', 'first-visit');
      hideGate();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Unlock Meal Plans 🚀';
        submitBtn.style.background = '';
      }
    }, 700);
  }

  function showGateError(msg) {
    const el = document.getElementById('gateError');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  // ==========================================
  //  LIBRARY — FETCH & FILTER
  // ==========================================
  function initLibrary() {
    fetchMeals();
    initLibraryFilters();
    initSearch();
    initModal();
  }

  async function fetchMeals() {
    const loading = document.getElementById('libLoading');
    const grid    = document.getElementById('libGrid');
    const empty   = document.getElementById('libEmpty');
    if (loading) loading.style.display = 'flex';
    if (grid)    grid.style.display    = 'none';
    if (empty)   empty.style.display   = 'none';

    try {
      // Build query params
      const params = new URLSearchParams();
      if (state.slot)     params.set('slot',      state.slot);
      if (state.goal)     params.set('goal',      state.goal);
      if (state.foodType) params.set('food_type', state.foodType);
      if (state.cuisine)  params.set('cuisine',   state.cuisine);

      const res  = await fetch(`${WORKER_URL}/meals?${params.toString()}`);
      const data = await res.json();
      state.allMeals = data.meals || [];
      applySearch();
    } catch (err) {
      console.error('Meal fetch error:', err);
      if (loading) loading.style.display = 'none';
      if (grid) grid.innerHTML = `
        <div style="text-align:center;padding:40px;grid-column:1/-1;">
          <div style="font-size:40px;margin-bottom:12px">⚠️</div>
          <div style="font-size:16px;font-weight:800;color:#0f172a">Could not load meals</div>
          <div style="font-size:13px;color:#64748b;margin-bottom:16px">Check your connection and try again</div>
          <button onclick="location.reload()" style="padding:10px 24px;border-radius:10px;background:#10b981;color:#fff;border:none;font-weight:800;cursor:pointer;font-size:14px">Retry</button>
        </div>`;
      grid.style.display = 'grid';
    }
  }

  function applySearch() {
    const q = state.search.toLowerCase().trim();
    state.filtered = q
      ? state.allMeals.filter(m =>
          m.name.toLowerCase().includes(q) ||
          (m.tags || []).some(t => t.toLowerCase().includes(q)) ||
          (m.ingredients || []).some(i => i.toLowerCase().includes(q))
        )
      : [...state.allMeals];

    renderGrid();
  }

  function renderGrid() {
    const loading = document.getElementById('libLoading');
    const grid    = document.getElementById('libGrid');
    const empty   = document.getElementById('libEmpty');
    const count   = document.getElementById('libCount');

    if (loading) loading.style.display = 'none';

    const meals = state.filtered;
    if (count) count.textContent = meals.length
      ? `${meals.length} meal${meals.length !== 1 ? 's' : ''} found`
      : '';

    if (!meals.length) {
      if (grid)  grid.style.display  = 'none';
      if (empty) empty.style.display = 'flex';
      return;
    }

    if (empty) empty.style.display = 'none';
    if (grid)  grid.style.display  = 'grid';

    const typeColors = {
      vegetarian:     { bg:'#f0fdf4', border:'#86efac', color:'#16a34a', label:'🥦 Veg' },
      non_vegetarian: { bg:'#fff1f2', border:'#fca5a5', color:'#dc2626', label:'🍗 Non-Veg' },
      eggetarian:     { bg:'#fefce8', border:'#fde047', color:'#ca8a04', label:'🥚 Egg' },
      vegan:          { bg:'#f0fdf4', border:'#4ade80', color:'#15803d', label:'🌱 Vegan' }
    };
    const slotColors = {
      breakfast: '#f59e0b',
      lunch:     '#10b981',
      snack:     '#8b5cf6',
      dinner:    '#3b82f6'
    };
    const slotLabels = {
      breakfast: '🌅 Breakfast',
      lunch:     '🍽️ Lunch',
      snack:     '🍎 Snack',
      dinner:    '🌙 Dinner'
    };

    grid.innerHTML = meals.map((meal, idx) => {
      const tc = typeColors[meal.food_type] || typeColors.vegetarian;
      const sc = slotColors[meal.slot]      || '#10b981';
      const sl = slotLabels[meal.slot]      || meal.slot;
      return `
        <div class="lib-meal-card" onclick="openMealModal(${idx})" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')openMealModal(${idx})">
          <div class="lib-meal-top">
            <span class="lib-slot-badge" style="background:${sc}20;color:${sc};border-color:${sc}40;">${sl}</span>
            <span class="lib-type-badge" style="background:${tc.bg};color:${tc.color};border-color:${tc.border};">${tc.label}</span>
          </div>
          <div class="lib-meal-name">${meal.name}</div>
          <div class="lib-meal-prep">⏱ ${meal.prep_time}</div>
          <div class="lib-meal-macros">
            <div class="lib-macro"><span class="lib-macro-val" style="color:#f59e0b">${meal.calories}</span><span class="lib-macro-lbl">kcal</span></div>
            <div class="lib-macro"><span class="lib-macro-val" style="color:#34d399">${meal.protein}g</span><span class="lib-macro-lbl">protein</span></div>
            <div class="lib-macro"><span class="lib-macro-val" style="color:#60a5fa">${meal.carbs}g</span><span class="lib-macro-lbl">carbs</span></div>
            <div class="lib-macro"><span class="lib-macro-val" style="color:#f472b6">${meal.fat}g</span><span class="lib-macro-lbl">fat</span></div>
          </div>
          <div class="lib-meal-tags">
            ${(meal.tags || []).slice(0,3).map(t => `<span class="lib-tag">${t}</span>`).join('')}
          </div>
          ${meal.why ? `<div class="lib-meal-why">💡 ${meal.why}</div>` : ''}
          <div class="lib-meal-footer">
            <span class="lib-view-btn">View Recipe →</span>
            <button class="lib-add-day-btn" onclick="event.stopPropagation();addToMyDay(${idx})" title="Add to My Day">＋ My Day</button>
          </div>
        </div>`;
    }).join('');
  }

  // ===== Library Filters =====
  function initLibraryFilters() {
    // Slot tabs
    document.querySelectorAll('.lib-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lib-slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.slot = btn.dataset.slot;
        track('filter_slot', state.slot);
        fetchMeals();
      });
    });

    // Goal toggle
    document.querySelectorAll('[data-goal]').forEach(btn => {
      if (!btn.closest('.lib-filter-bar')) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-goal]').forEach(b => {
          if (b.closest('.lib-filter-bar')) b.classList.remove('active');
        });
        btn.classList.add('active');
        state.goal = btn.dataset.goal;
        track('filter_goal', state.goal);
        fetchMeals();
      });
    });

    // Food type toggle
    document.querySelectorAll('[data-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.foodType = btn.dataset.type;
        track('filter_type', state.foodType);
        fetchMeals();
      });
    });

    // Cuisine toggle
    document.querySelectorAll('[data-cuisine]').forEach(btn => {
      if (!btn.closest('.lib-filter-bar')) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-cuisine]').forEach(b => {
          if (b.closest('.lib-filter-bar')) b.classList.remove('active');
        });
        btn.classList.add('active');
        state.cuisine = btn.dataset.cuisine;
        track('filter_cuisine', state.cuisine);
        fetchMeals();
      });
    });
  }

  // ===== Search =====
  function initSearch() {
    const input = document.getElementById('libSearch');
    if (!input) return;
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.search = input.value;
        applySearch();
      }, 300);
    });
  }

  // ===== Modal =====
  function initModal() {
    const modal   = document.getElementById('mealModal');
    const overlay = document.getElementById('mealModalOverlay');
    const close   = document.getElementById('mealModalClose');
    if (!modal) return;
    const closeModal = () => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    };
    if (overlay) overlay.addEventListener('click', closeModal);
    if (close)   close.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  window.openMealModal = function(idx) {
    const meal  = state.filtered[idx];
    if (meal) track('view_meal', meal.name);
    const modal = document.getElementById('mealModal');
    const body  = document.getElementById('mealModalBody');
    if (!meal || !modal || !body) return;

    const slotLabels = { breakfast:'🌅 Breakfast', lunch:'🍽️ Lunch', snack:'🍎 Snack', dinner:'🌙 Dinner' };
    const typeLabels = { vegetarian:'🥦 Vegetarian', non_vegetarian:'🍗 Non-Vegetarian', eggetarian:'🥚 Eggetarian', vegan:'🌱 Vegan' };
    const cuisineLabels = { south_indian:'🌴 South Indian', north_indian:'🫓 North Indian', mixed:'🍲 Mixed' };

    const ingredientTags = (meal.ingredients || []).map(i => `<span class="meal-ingredient-tag">${i}</span>`).join('');
    const prepSteps = (meal.steps || []).map((s, i) => `
      <div class="meal-prep-step">
        <div class="meal-prep-num">${i+1}</div>
        <div class="meal-prep-text">${s}</div>
      </div>`).join('');
    const tagHtml = (meal.tags || []).map(t => `<span class="lib-tag">${t}</span>`).join('');

    // WhatsApp share text
    const waText = encodeURIComponent(
      `🍱 *${meal.name}* — Classic Fitness Gym\n\n` +
      `⏱ Prep: ${meal.prep_time} | 🔥 ${meal.calories} kcal | 💪 ${meal.protein}g protein\n\n` +
      `📝 *Ingredients:*\n${(meal.ingredients||[]).join(', ')}\n\n` +
      `👨‍🍳 *Preparation:*\n${(meal.steps||[]).map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n` +
      `_Classic Fitness Gym, Arakkonam — 📞 8668007901_`
    );

    body.innerHTML = `
      <div class="modal-meal-header">
        <div class="modal-meal-badges">
          <span class="lib-slot-badge">${slotLabels[meal.slot] || meal.slot}</span>
          <span class="lib-type-badge">${typeLabels[meal.food_type] || meal.food_type}</span>
          <span class="lib-type-badge">${cuisineLabels[meal.cuisine] || meal.cuisine}</span>
        </div>
        <h2 class="modal-meal-name">${meal.name}</h2>
        <div class="modal-meal-meta">⏱ ${meal.prep_time}</div>
      </div>

      <div class="modal-macro-row">
        <div class="modal-macro-item"><div class="modal-macro-val" style="color:#f59e0b">${meal.calories}</div><div class="modal-macro-lbl">Calories</div></div>
        <div class="modal-macro-item"><div class="modal-macro-val" style="color:#34d399">${meal.protein}g</div><div class="modal-macro-lbl">Protein</div></div>
        <div class="modal-macro-item"><div class="modal-macro-val" style="color:#60a5fa">${meal.carbs}g</div><div class="modal-macro-lbl">Carbs</div></div>
        <div class="modal-macro-item"><div class="modal-macro-val" style="color:#f472b6">${meal.fat}g</div><div class="modal-macro-lbl">Fat</div></div>
      </div>

      <div class="meal-section-label">🥗 Ingredients</div>
      <div class="meal-ingredients">${ingredientTags}</div>

      <div class="meal-section-label">👨‍🍳 Preparation Steps</div>
      <div class="meal-prep-steps">${prepSteps}</div>

      ${tagHtml ? `<div class="meal-section-label">🏷️ Tags</div><div class="lib-meal-tags" style="margin-top:8px">${tagHtml}</div>` : ''}

      ${meal.why ? `<div class="meal-why-box"><span class="meal-why-icon">💡</span><div><strong>Why this meal?</strong><br>${meal.why}</div></div>` : ''}

      <div class="modal-meal-actions">
        <a href="https://wa.me/?text=${waText}" target="_blank" class="modal-wa-btn">📲 Share on WhatsApp</a>
        <a href="index.html#diet-plan" class="modal-diet-btn">🥗 Get Custom Diet Plan</a>
      </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  // ==========================================
  //  AI PLANNER (existing logic — unchanged)
  // ==========================================
  function initAIPlanner() {
    initStep1();
    initStep2();
    initRegenerate();
    initShare();
  }

  function goToStep(n) {
    state.currentStep = n;
    document.getElementById('mealStep1').style.display = n === 1 ? '' : 'none';
    document.getElementById('mealStep2').style.display = n === 2 ? '' : 'none';
    document.getElementById('mealStep3').style.display = n === 3 ? '' : 'none';
    [1,2,3].forEach(i => {
      const el = document.getElementById('stepInd' + i);
      if (!el) return;
      el.classList.remove('active','done');
      if (i < n) el.classList.add('done');
      else if (i === n) el.classList.add('active');
    });
    document.querySelectorAll('.meal-step-line').forEach((line, idx) => {
      line.classList.toggle('done', idx + 1 < n);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initStep1() {
    const nextBtn = document.getElementById('step1Next');
    document.querySelectorAll('.meal-goal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.meal-goal-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.aiGoal = btn.dataset.goal;
        if (nextBtn) nextBtn.disabled = false;
      });
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (!state.aiGoal) return;
      goToStep(2);
    });
  }

  // ===== Goal-specific prompt extras for women's health goals =====
  function getGoalPromptExtras(goal) {
    const extras = {
      'Pre-Pregnancy': `
SPECIAL GOAL — PRE-PREGNANCY NUTRITION:
- Focus on folate-rich foods (methi, spinach, lentils, broccoli)
- Include iron-rich foods (rajma, chickpeas, sesame, jaggery, green leafy vegetables)
- Add omega-3 sources (walnuts, flaxseed, fish if non-veg)
- Include vitamin C alongside iron sources to improve absorption
- Include zinc-rich foods (pumpkin seeds, chickpeas)
- Avoid: excess caffeine, processed foods, raw papaya
- Calorie target: ~2000-2200 kcal — body preparation phase`,
      'Post-Pregnancy': `
SPECIAL GOAL — POST-PREGNANCY RECOVERY AND LACTATION:
- Must include galactagogues (lactation boosters): methi, garlic, moringa, dill leaves, sesame, saunf
- Focus on iron recovery (green leafy vegetables, jaggery, drumstick leaves)
- Include calcium-rich foods (ragi, sesame, milk, paneer) for bone recovery
- Use easy-to-digest foods (khichdi, daliya, moong dal) wherever possible
- Include collagen-boosting foods (bone broth if non-veg, vitamin C rich fruits)
- Add hydration foods: soups, warm liquids, coconut water
- Avoid: gas-causing foods, raw salads, aerated drinks
- Calorie target: ~2000-2300 kcal — higher if breastfeeding`,
      'PCOS Support': `
SPECIAL GOAL — PCOS MANAGEMENT THROUGH NUTRITION:
- Use ONLY low glycaemic index (low-GI) foods — absolutely NO white rice, white bread or maida
- Include anti-inflammatory foods: turmeric, ginger, cinnamon, leafy greens
- Hormone-balancing foods: flaxseed (lignans), spearmint tea, tofu in moderation
- Insulin-sensitising foods: bitter gourd, cinnamon, fenugreek
- High dietary fibre at every meal to slow glucose absorption
- Include zinc-rich foods (pumpkin seeds) for hormonal health
- Omega-3 sources (walnuts, flaxseed, fatty fish) to reduce inflammation
- Avoid: sugar, refined carbs, processed foods, excess dairy
- Calorie target: ~1600-1800 kcal — modest deficit for weight management`,
      "Women's Toning": `
SPECIAL GOAL — WOMEN'S BODY TONING:
- High protein at every meal (minimum 25-30g per meal) to build lean muscle
- Include leucine-rich proteins at each meal (eggs, paneer, chicken, fish)
- Moderate carbohydrates from whole grains — enough for energy, not excess
- Healthy fats from nuts, seeds for hormonal support
- Calcium-rich foods for bone density (critical for women)
- Iron-rich foods to support energy during training
- Magnesium-rich foods (dark chocolate, nuts, seeds) for muscle recovery
- Calorie target: ~1700-1900 kcal — slight deficit with high protein`
    };
    return extras[goal] || '';
  }

  function initStep2() {
    const vegBtn    = document.getElementById('prefVeg');
    const nonVegBtn = document.getElementById('prefNonVeg');
    if (vegBtn) vegBtn.addEventListener('click', () => {
      state.foodPref = 'Vegetarian';
      vegBtn.classList.add('active');
      nonVegBtn.classList.remove('active');
    });
    if (nonVegBtn) nonVegBtn.addEventListener('click', () => {
      state.foodPref = 'Non-Vegetarian';
      nonVegBtn.classList.add('active');
      vegBtn.classList.remove('active');
    });

    [3,4,5].forEach(n => {
      const btn = document.getElementById('meals' + n);
      if (!btn) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-meals]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.meals = n;
      });
    });

    ['South','North','Mixed'].forEach(c => {
      const btn = document.getElementById('cuisine' + c);
      if (!btn) return;
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-cuisine]').forEach(b => {
          if (b.closest('#mealStep2')) b.classList.remove('active');
        });
        btn.classList.add('active');
        state.aiCuisine = btn.dataset.cuisine;
      });
    });

    const back = document.getElementById('step2Back');
    if (back) back.addEventListener('click', () => goToStep(1));

    const next = document.getElementById('step2Next');
    if (next) next.addEventListener('click', () => {
      state.calories  = parseInt(document.getElementById('mealCalories')?.value) || null;
      state.allergies = document.getElementById('mealAllergies')?.value.trim() || '';
      goToStep(3);
      generateMealPlan();
    });
  }

  function animateLoadingSteps() {
    const steps  = ['mls1','mls2','mls3','mls4'];
    const labels = ['Reading your preferences...','Selecting meals for your goal...','Calculating macros...','Writing preparation steps...'];
    steps.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('done'); el.textContent = '⏳ ' + labels[steps.indexOf(id)]; }
    });
    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) { clearInterval(interval); return; }
      const el = document.getElementById(steps[i]);
      if (el) { el.textContent = '✅ ' + labels[i]; el.classList.add('done'); }
      i++;
    }, 800);
    return interval;
  }

  async function generateMealPlan() {
    const loadingEl = document.getElementById('mealLoading');
    const resultsEl = document.getElementById('mealResults');
    if (loadingEl) loadingEl.style.display = 'flex';
    if (resultsEl) resultsEl.style.display = 'none';

    const loaderInterval = animateLoadingSteps();

    const calText     = state.calories ? `Target calories: ${state.calories} kcal/day.` : `Auto-calculate appropriate calories for the goal.`;
    const allergyText = state.allergies ? `Avoid these foods/allergens: ${state.allergies}.` : 'No specific allergies.';
    const goalExtras  = getGoalPromptExtras(state.aiGoal);

    const prompt = `You are a professional sports nutritionist and women's health expert at Classic Fitness Gym, Arakkonam, Tamil Nadu, India.

Create a detailed ${state.meals}-meal fitness meal plan for the following person:
- Name: ${state.name}
- Goal: ${state.aiGoal}
- Food Preference: ${state.foodPref}
- Cuisine Style: ${state.aiCuisine}
- ${calText}
- ${allergyText}
${goalExtras}

GENERAL RULES (apply to all goals):
1. Use realistic Indian foods — idli, dosa, chapati, dal, rice, sambar, paneer, chicken, eggs, oats, poha, upma, curd, fruits, ragi, millets.
2. All meals must be practical and easy to prepare at home in Tamil Nadu.
3. If Non-Vegetarian, include eggs and/or chicken in some meals.
4. Prioritise South Indian foods if cuisine is South Indian.
5. Every meal must have clear preparation steps for home cooking.

Return ONLY a valid JSON object in this exact format — no markdown, no explanation, no backticks:

{
  "totalCalories": 1800,
  "totalProtein": 120,
  "totalCarbs": 180,
  "totalFat": 55,
  "meals": [
    {
      "slot": "breakfast",
      "time": "7:00 AM",
      "name": "Oats Upma with Boiled Eggs",
      "description": "High-protein morning start",
      "calories": 420,
      "protein": 28,
      "carbs": 45,
      "fat": 12,
      "prepTime": "15 min",
      "ingredients": ["1 cup rolled oats", "2 boiled eggs", "1 tsp ghee", "vegetables", "salt & spices"],
      "steps": [
        "Dry roast oats in a pan for 2 minutes until light golden.",
        "Heat ghee in the same pan, add mustard seeds and let them splutter.",
        "Add chopped onion, tomato and vegetables, saute for 3 minutes.",
        "Add 1.5 cups water, salt and spices, bring to boil.",
        "Add oats and stir well. Cook on low flame for 5 minutes until thick.",
        "Serve hot with boiled eggs on the side."
      ]
    }
  ]
}

Slot names must be exactly: "breakfast", "snack1" (if meals >= 4), "lunch", "snack2" (if meals >= 5), "dinner".
For 3 meals: breakfast, lunch, dinner only.
For 4 meals: breakfast, snack1, lunch, dinner.
For 5 meals: breakfast, snack1, lunch, snack2, dinner.`;

    try {
      const response = await fetch(`${WORKER_URL}/generate-meal-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name, mobile: state.mobile, goal: state.aiGoal,
          foodPref: state.foodPref, meals: state.meals, calories: state.calories,
          cuisine: state.aiCuisine, allergies: state.allergies, prompt
        })
      });

      clearInterval(loaderInterval);
      ['mls1','mls2','mls3','mls4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('done');
      });

      if (!response.ok) throw new Error('API error: ' + response.status);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      state.lastPlan = data.plan;
      await new Promise(r => setTimeout(r, 400));
      if (loadingEl) loadingEl.style.display = 'none';
      if (resultsEl) resultsEl.style.display = '';
      track('ai_plan_generated', state.aiGoal);
      renderResults(data.plan);

    } catch (err) {
      clearInterval(loaderInterval);
      if (loadingEl) loadingEl.style.display = 'none';
      if (resultsEl) {
        resultsEl.style.display = '';
        resultsEl.innerHTML = `
          <div style="text-align:center;padding:40px 20px;">
            <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
            <div style="font-size:18px;font-weight:800;color:#0f172a;margin-bottom:8px;">Could not generate meal plan</div>
            <div style="font-size:14px;color:#64748b;margin-bottom:24px;">Please check your internet connection and try again.</div>
            <button onclick="location.reload()" style="padding:12px 28px;border-radius:12px;background:#10b981;color:#fff;border:none;font-size:15px;font-weight:800;cursor:pointer;">Try Again</button>
          </div>`;
      }
    }
  }

  function renderResults(plan) {
    const nameEl = document.getElementById('resultName');
    const subEl  = document.getElementById('resultSubtitle');
    const badges = document.getElementById('resultBadges');
    if (nameEl) nameEl.textContent = `${state.name}'s Meal Plan`;
    if (subEl)  subEl.textContent  = `${state.aiGoal} · ${state.foodPref} · ${state.aiCuisine} · ${state.meals} Meals/Day · Classic Fitness`;
    if (badges) {
      const goalM = GOAL_META[state.aiGoal] || GOAL_META['Maintain Weight'];
      const gc = { bg: goalM.bg, color: goalM.color, border: goalM.border };
      badges.innerHTML = `
        <span class="meal-result-badge" style="background:${gc.bg};color:${gc.color};border-color:${gc.border};">${state.aiGoal}</span>
        <span class="meal-result-badge" style="background:#f8fafc;color:#475569;border-color:#e2e8f0;">${state.foodPref}</span>
        <span class="meal-result-badge" style="background:#fefce8;color:#854d0e;border-color:#fde047;">${plan.totalCalories} kcal</span>`;
    }
    const macroEl = document.getElementById('mealMacroSummary');
    if (macroEl) {
      macroEl.innerHTML = `
        <div class="meal-macro-item"><div class="meal-macro-val" style="color:#fbbf24;">${plan.totalCalories}</div><div class="meal-macro-lbl">Calories</div></div>
        <div class="meal-macro-item"><div class="meal-macro-val" style="color:#34d399;">${plan.totalProtein}g</div><div class="meal-macro-lbl">Protein</div></div>
        <div class="meal-macro-item"><div class="meal-macro-val" style="color:#60a5fa;">${plan.totalCarbs}g</div><div class="meal-macro-lbl">Carbs</div></div>
        <div class="meal-macro-item"><div class="meal-macro-val" style="color:#f472b6;">${plan.totalFat}g</div><div class="meal-macro-lbl">Fat</div></div>`;
    }
    renderTimeline(plan.meals);
  }

  function renderTimeline(meals) {
    const timeline = document.getElementById('mealTimeline');
    if (!timeline) return;
    const slotMeta = {
      breakfast: { label:'Breakfast',     emoji:'🌅', cssClass:'meal-breakfast' },
      snack1:    { label:'Morning Snack', emoji:'🍎', cssClass:'meal-snack1' },
      lunch:     { label:'Lunch',         emoji:'🍽️', cssClass:'meal-lunch' },
      snack2:    { label:'Evening Snack', emoji:'🥜', cssClass:'meal-snack2' },
      dinner:    { label:'Dinner',        emoji:'🌙', cssClass:'meal-dinner' }
    };
    timeline.innerHTML = meals.map((meal, idx) => {
      const meta = slotMeta[meal.slot] || { label: meal.slot, emoji:'🍴', cssClass:'meal-lunch' };
      const ingredientTags = (meal.ingredients || []).map(ing => `<span class="meal-ingredient-tag">${ing}</span>`).join('');
      const macroChips = `
        <div class="meal-macro-chip">${meal.calories} <span>kcal</span></div>
        <div class="meal-macro-chip">${meal.protein}g <span>protein</span></div>
        <div class="meal-macro-chip">${meal.carbs}g <span>carbs</span></div>
        <div class="meal-macro-chip">${meal.fat}g <span>fat</span></div>`;
      const prepSteps = (meal.steps || []).map((step, i) => `
        <div class="meal-prep-step">
          <div class="meal-prep-num">${i+1}</div>
          <div class="meal-prep-text">${step}</div>
        </div>`).join('');
      return `
        <div class="meal-tl-card ${meta.cssClass}" id="mealCard${idx}">
          <div class="meal-tl-dot"><div class="meal-tl-dot-circle"></div></div>
          <div class="meal-tl-body">
            <div class="meal-tl-header" onclick="toggleMealCard(${idx})">
              <div class="meal-tl-top-row">
                <span class="meal-tl-time-badge">${meta.emoji} ${meal.time}</span>
                <div class="meal-tl-top-right">
                  <span class="meal-tl-cal-pill">🔥 ${meal.calories} kcal</span>
                  <span class="meal-tl-prep-badge">⏱ ${meal.prepTime}</span>
                  <span class="meal-tl-toggle">▼</span>
                </div>
              </div>
              <div class="meal-tl-name-row">
                <div class="meal-tl-meal-name">${meal.name}</div>
                <div class="meal-tl-meal-sub">${meal.description}</div>
              </div>
            </div>
            <div class="meal-tl-content">
              <div class="meal-section-label">🥗 Ingredients</div>
              <div class="meal-ingredients">${ingredientTags}</div>
              <div class="meal-section-label">📊 Macros</div>
              <div class="meal-macros-row">${macroChips}</div>
              <div class="meal-section-label">👨‍🍳 Preparation Steps</div>
              <div class="meal-prep-steps">${prepSteps}</div>
            </div>
          </div>
        </div>`;
    }).join('');
    const firstCard = document.getElementById('mealCard0');
    if (firstCard) firstCard.classList.add('open');
  }

  window.toggleMealCard = function(idx) {
    const card = document.getElementById('mealCard' + idx);
    if (card) card.classList.toggle('open');
  };

  function initRegenerate() {
    const btn = document.getElementById('mealRegen');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const resultsEl = document.getElementById('mealResults');
      const loadingEl = document.getElementById('mealLoading');
      if (resultsEl) resultsEl.style.display = 'none';
      if (loadingEl) loadingEl.style.display = 'flex';
      generateMealPlan();
    });
  }

  function initShare() {
    const btn = document.getElementById('mealShare');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!state.lastPlan) return;
      const plan = state.lastPlan;
      let text = `🍱 *${state.name}'s Classic Fitness Meal Plan*\n`;
      text += `*Goal:* ${state.aiGoal} | *${state.foodPref}* | *${state.aiCuisine}*\n`;
      text += `*Total:* ${plan.totalCalories} kcal | Protein: ${plan.totalProtein}g | Carbs: ${plan.totalCarbs}g | Fat: ${plan.totalFat}g\n\n`;
      plan.meals.forEach(m => {
        text += `*${m.time} — ${m.name}*\n`;
        text += `Calories: ${m.calories} kcal | Protein: ${m.protein}g\n`;
        text += `Ingredients: ${(m.ingredients||[]).join(', ')}\n\n`;
      });
      text += `_Classic Fitness Gym, Arakkonam_\n_classicfitness.org/meal.html_\n\n📞 8668007901 — Book a FREE consultation!`;
      track('whatsapp_shared', 'ai-plan:' + (state.aiGoal || ''));
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    });
  }


  // ==========================================
  //  FEATURE 1 — ADD TO MY DAY
  // ==========================================
  window.addToMyDay = function(idx) {
    const meal = state.filtered[idx];
    if (!meal) return;
    // Prevent duplicate slots
    const exists = state.myDay.find(m => m.slot === meal.slot && m.name === meal.name);
    if (exists) {
      showMyDayToast('Already in your day!', '⚠️');
      return;
    }
    state.myDay.push(meal);
    renderMyDay();
    showMyDayToast(meal.name + ' added!', '✅');
    track('add_to_my_day', meal.name);
  };

  window.removeFromMyDay = function(idx) {
    state.myDay.splice(idx, 1);
    renderMyDay();
  };

  function showMyDayToast(msg, icon) {
    const t = document.getElementById('myDayToast');
    if (!t) return;
    t.querySelector('.mdt-text').textContent = msg;
    t.querySelector('.mdt-icon').textContent = icon;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }

  function renderMyDay() {
    const panel  = document.getElementById('myDayPanel');
    const list   = document.getElementById('myDayList');
    const count  = document.getElementById('myDayCount');
    const countInner = document.getElementById('myDayCountInner');
    const totals = document.getElementById('myDayTotals');
    if (!panel) return;

    if (count)      count.textContent      = state.myDay.length;
    if (countInner) countInner.textContent = state.myDay.length;

    if (!state.myDay.length) {
      panel.classList.remove('has-meals');
      if (list) list.innerHTML = '<div class="myd-empty">No meals added yet.<br>Tap <strong>＋ My Day</strong> on any meal card.</div>';
      if (totals) totals.style.display = 'none';
      return;
    }

    panel.classList.add('has-meals');

    const slotOrder = { breakfast:0, snack:1, lunch:2, dinner:3 };
    const sorted = [...state.myDay].sort((a,b) => (slotOrder[a.slot]||9) - (slotOrder[b.slot]||9));

    const totalCal  = sorted.reduce((s,m) => s + (m.calories||0), 0);
    const totalProt = sorted.reduce((s,m) => s + (m.protein||0), 0);
    const totalCarb = sorted.reduce((s,m) => s + (m.carbs||0), 0);
    const totalFat  = sorted.reduce((s,m) => s + (m.fat||0), 0);

    if (totals) {
      totals.style.display = '';
      totals.innerHTML = `
        <div class="myd-total-item"><span style="color:#f59e0b;font-weight:800">${totalCal}</span><span>kcal</span></div>
        <div class="myd-total-item"><span style="color:#34d399;font-weight:800">${totalProt}g</span><span>protein</span></div>
        <div class="myd-total-item"><span style="color:#60a5fa;font-weight:800">${totalCarb}g</span><span>carbs</span></div>
        <div class="myd-total-item"><span style="color:#f472b6;font-weight:800">${totalFat}g</span><span>fat</span></div>`;
    }

    if (list) list.innerHTML = sorted.map((meal, i) => {
      const realIdx = state.myDay.indexOf(meal);
      const slotLabels = { breakfast:'🌅 Breakfast', lunch:'🍽️ Lunch', snack:'🍎 Snack', dinner:'🌙 Dinner' };
      return `<div class="myd-item">
        <div class="myd-item-top">
          <span class="myd-slot">${slotLabels[meal.slot] || meal.slot}</span>
          <button class="myd-remove" onclick="removeFromMyDay(${realIdx})">✕</button>
        </div>
        <div class="myd-name">${meal.name}</div>
        <div class="myd-macros">${meal.calories} kcal · ${meal.protein}g protein</div>
      </div>`;
    }).join('');
  }

  function initMyDay() {
    // Inject My Day panel HTML — collapsed by default
    const panelHTML = `
      <!-- My Day Tab (always visible on left) -->
      <div id="myDayTab" class="myd-tab" onclick="toggleMyDayPanel()">
        <span class="myd-tab-icon">📅</span>
        <span class="myd-tab-label">My Day</span>
        <span id="myDayCount" class="myd-count">0</span>
      </div>

      <!-- My Day Slide-out Panel -->
      <div id="myDayPanel" class="my-day-panel collapsed">
        <div class="myd-header">
          <div class="myd-title">
            <span class="myd-title-icon">📅</span>
            My Day
            <span class="myd-count-inner" id="myDayCountInner">0</span>
          </div>
          <div class="myd-header-actions">
            <button class="myd-share-btn" onclick="shareMyDay()" title="Share on WhatsApp">📲 Share</button>
            <button class="myd-clear-btn" onclick="clearMyDay()" title="Clear all">🗑️</button>
            <button class="myd-close-btn" onclick="toggleMyDayPanel()" title="Close">✕</button>
          </div>
        </div>
        <div class="myd-body" id="myDayBody">
          <div id="myDayTotals" class="myd-totals" style="display:none"></div>
          <div id="myDayList" class="myd-list">
            <div class="myd-empty">No meals added yet.<br>Tap <strong>＋ My Day</strong> on any meal card.</div>
          </div>
        </div>
      </div>

      <!-- Backdrop -->
      <div id="myDayBackdrop" class="myd-backdrop" onclick="toggleMyDayPanel()"></div>

      <div id="myDayToast" class="my-day-toast">
        <span class="mdt-icon">✅</span>
        <span class="mdt-text"></span>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', panelHTML);
  }

  function getTopOffset() {
    // Dynamically measure all fixed/sticky bars above content
    let top = 0;
    const datetimeBar   = document.querySelector('.datetime-bar');
    const dietBar       = document.getElementById('dietAnnounceBar');
    const navbar        = document.querySelector('.navbar');
    const modeTabs      = document.querySelector('.meal-mode-tabs');
    if (datetimeBar && datetimeBar.offsetParent !== null) top += datetimeBar.offsetHeight;
    if (dietBar     && dietBar.style.display !== 'none' && dietBar.offsetParent !== null) top += dietBar.offsetHeight;
    if (navbar      && navbar.offsetParent !== null) top += navbar.offsetHeight;
    return top;
  }

  window.toggleMyDayPanel = function() {
    const panel    = document.getElementById('myDayPanel');
    const tab      = document.getElementById('myDayTab');
    const backdrop = document.getElementById('myDayBackdrop');
    if (!panel) return;
    const isOpen = !panel.classList.contains('collapsed');
    if (isOpen) {
      panel.classList.add('collapsed');
      if (backdrop) backdrop.classList.remove('show');
      if (tab)      tab.classList.remove('hidden');
      document.body.style.overflow = '';
    } else {
      // Set top offset before opening
      const top = getTopOffset();
      panel.style.top      = top + 'px';
      tab.style.top        = '50%'; // keep tab centered
      if (backdrop) {
        backdrop.style.top = top + 'px';
      }
      panel.classList.remove('collapsed');
      if (backdrop) backdrop.classList.add('show');
      if (tab)      tab.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  window.clearMyDay = function() {
    state.myDay = [];
    renderMyDay();
  };

  window.shareMyDay = function() {
    if (!state.myDay.length) { showMyDayToast('Add meals first!', '⚠️'); return; }
    const slotOrder = { breakfast:0, snack:1, lunch:2, dinner:3 };
    const sorted = [...state.myDay].sort((a,b) => (slotOrder[a.slot]||9) - (slotOrder[b.slot]||9));
    const totalCal  = sorted.reduce((s,m) => s + (m.calories||0), 0);
    const totalProt = sorted.reduce((s,m) => s + (m.protein||0), 0);
    let text = `🍱 *My Day Meal Plan* — Classic Fitness Gym\n`;
    text += `📊 Total: ${totalCal} kcal · ${totalProt}g protein\n\n`;
    sorted.forEach(m => {
      const slotLabels = { breakfast:'🌅 Breakfast', lunch:'🍽️ Lunch', snack:'🍎 Snack', dinner:'🌙 Dinner' };
      text += `*${slotLabels[m.slot] || m.slot}: ${m.name}*\n`;
      text += `${m.calories} kcal · ${m.protein}g protein\n\n`;
    });
    text += `_Classic Fitness Gym, Arakkonam — 📞 8668007901_`;
    track('whatsapp_shared', 'my-day');
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  };



  // ==========================================
  //  FEATURE 4 — DAILY FEATURED MEALS
  //  One per slot, rotates daily — zero API cost
  // ==========================================
  function initDailyFeatured() {
    const container = document.getElementById('dailyFeaturedSection');
    if (!container) return;

    const tryRender = () => {
      if (!state.allMeals.length) { setTimeout(tryRender, 500); return; }
      renderDailyFeatured();
    };
    tryRender();
  }


  document.addEventListener('DOMContentLoaded', init);

})();