// ==========================================
//  CLASSIC FITNESS GYM — BMI PAGE JS
//  Standalone script for bmi.html
// ==========================================

(function () {
  'use strict';

  // ===== Set Current Year =====
  function setYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ===== WhatsApp Float Link =====
  function setupLinks() {
    const phone = '8668007901';
    const message = encodeURIComponent(
      'Hello Classic Fitness Gym, I want to enquire about membership and timings.'
    );
    const waUrl = `https://wa.me/91${phone}?text=${message}`;
    const waFloat = document.getElementById('waFloat');
    if (waFloat) waFloat.href = waUrl;
  }

  // ===== Mobile Navigation Toggle =====
  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Dropdown toggle on mobile
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 820) {
          e.preventDefault();
          toggle.closest('.nav-dropdown').classList.toggle('open');
        }
      });
    });

    // Close on link click
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && !e.target.classList.contains('dropdown-toggle')) {
        navLinks.classList.remove('show');
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('show')) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
  }

  // ===== Navbar scroll shadow =====
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.08)'
        : '0 2px 12px rgba(0,0,0,0.03)';
    });
  }

  // ===== Back to Top =====
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===== Diet Announce Bar =====
  function initDietBar() {
    const bar      = document.getElementById('dietAnnounceBar');
    const closeBtn = document.getElementById('dietBarClose');
    const grabBtn  = document.getElementById('dietBarBtn');
    if (!bar) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => bar.classList.add('hidden'));
    }
    if (grabBtn) {
      grabBtn.addEventListener('click', () => {
        window.open('https://wa.me/918668007901?text=' + encodeURIComponent(
          'Hi! I want my FREE Personalized Diet Plan from Classic Fitness Gym!'
        ), '_blank');
      });
    }
  }

  // ===== Join Modal =====
  function initJoinModal() {
    const joinBtn  = document.getElementById('joinNowBtn');
    const modal    = document.getElementById('joinModal');
    const overlay  = document.getElementById('joinModalOverlay');
    const closeBtn = document.getElementById('joinModalClose');
    const form     = document.getElementById('joinForm');
    if (!modal) return;

    const openModal = () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (joinBtn)  joinBtn.addEventListener('click', openModal);
    if (overlay)  overlay.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name   = document.getElementById('joinName').value.trim();
        const mobile = document.getElementById('joinMobile').value.trim();
        const goal   = document.getElementById('joinGoal').value.trim();
        const time   = document.getElementById('joinTime').value.trim();
        const msg    = document.getElementById('joinMessage').value.trim();

        if (!name || !mobile || !goal) {
          showToast('Please fill Name, Mobile and Goal.', true);
          return;
        }

        const text = encodeURIComponent(
`🏋️ New Membership Enquiry — Classic Fitness

👤 Name     : ${name}
📱 Mobile   : ${mobile}
🎯 Goal     : ${goal}
⏰ Time     : ${time || 'Flexible'}
💬 Message  : ${msg || 'None'}

Please contact me regarding joining Classic Fitness Gym!`
        );
        window.open(`https://wa.me/918668007901?text=${text}`, '_blank');
        closeModal();
        form.reset();
        showToast('WhatsApp opened! Please tap Send.');
      });
    }

    // Custom selects
    initCustomSelects();
  }

  // ===== Custom Select Dropdowns =====
  function initCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(function(select) {
      const trigger     = select.querySelector('.custom-select-trigger');
      const options     = select.querySelectorAll('.custom-option');
      const hiddenInput = select.closest('.custom-select-wrapper').querySelector('input[type="hidden"]');

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelectorAll('.custom-select.open').forEach(s => { if (s !== select) s.classList.remove('open'); });
        select.classList.toggle('open');
      });

      options.forEach(function(option) {
        option.addEventListener('click', function() {
          trigger.childNodes[0].textContent = this.textContent + ' ';
          if (hiddenInput) hiddenInput.value = this.getAttribute('data-value');
          select.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
          this.classList.add('selected');
          select.classList.remove('open');
        });
      });
    });

    document.addEventListener('click', function() {
      document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
    });
  }

  // ===== Toast =====
  function showToast(message, isError = false) {
    const toast = document.getElementById('toastMessage');
    if (!toast) return;
    toast.querySelector('.toast-text').innerHTML = message;
    toast.style.borderLeftColor = isError ? '#e11d48' : 'var(--green)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ===== BMI & CALORIE CALCULATOR =====
  function initBMICalculator() {
    const calcBtn    = document.getElementById('bmiCalcBtn');
    const resetBtn   = document.getElementById('bmiResetBtn');
    const formCard   = document.getElementById('bmiFormCard');
    const resultCard = document.getElementById('bmiResultCard');
    const getPlanBtn = document.getElementById('bmiGetPlanBtn');

    if (!calcBtn) return;

    // ---- Enable/Disable Calculate button based on required fields ----
    function updateCalcBtnState() {
      const age      = document.getElementById('bmiAge').value.trim();
      const heightCm = document.getElementById('bmiHeight').value.trim();
      const weightKg = document.getElementById('bmiWeight').value.trim();
      const allFilled = age !== '' && heightCm !== '' && weightKg !== '';
      calcBtn.disabled = !allFilled;
      calcBtn.style.opacity = allFilled ? '1' : '0.5';
      calcBtn.style.cursor  = allFilled ? 'pointer' : 'not-allowed';
    }

    document.getElementById('bmiAge').addEventListener('input', updateCalcBtnState);
    document.getElementById('bmiHeight').addEventListener('input', updateCalcBtnState);
    document.getElementById('bmiWeight').addEventListener('input', updateCalcBtnState);

    // Run once on load to set initial disabled state
    updateCalcBtnState();
    // ---- End enable/disable logic ----

    // Gender
    let selectedGender = 'male';
    const genderMaleBtn   = document.getElementById('bmiGenderMale');
    const genderFemaleBtn = document.getElementById('bmiGenderFemale');

    genderMaleBtn.addEventListener('click', () => {
      selectedGender = 'male';
      genderMaleBtn.classList.add('active');
      genderFemaleBtn.classList.remove('active');
    });
    genderFemaleBtn.addEventListener('click', () => {
      selectedGender = 'female';
      genderFemaleBtn.classList.add('active');
      genderMaleBtn.classList.remove('active');
    });

    // Goal
    let selectedGoal = 'maintain';
    document.querySelectorAll('.bmi-goal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bmi-goal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGoal = btn.getAttribute('data-goal');
      });
    });

    // Body Type
    let selectedBodyType = 'mesomorph';
    document.querySelectorAll('.bmi-bodytype-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bmi-bodytype-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedBodyType = btn.getAttribute('data-bodytype');
      });
    });

    // Calculate
    calcBtn.addEventListener('click', () => {
      const age      = parseFloat(document.getElementById('bmiAge').value);
      const heightCm = parseFloat(document.getElementById('bmiHeight').value);
      const weightKg = parseFloat(document.getElementById('bmiWeight').value);
      const activity = parseFloat(document.getElementById('bmiActivity').value);
      const bmiName      = document.getElementById('bmiName').value.trim();
      const bmiMemberId  = document.getElementById('bmiMemberId').value.trim();
      const bmiMedical   = document.getElementById('bmiMedical').value.trim();
      const bmiExperience = document.getElementById('bmiExperience').value;
      const bmiEquipment  = document.getElementById('bmiEquipment').value;

      const bmiWaist = parseFloat(document.getElementById('bmiWaist').value) || 0;

      // Specific validation with clear messages for each field
      if (!age || isNaN(age)) {
        showToast('⚠️ Please enter your Age (e.g. 25)', true); return;
      }
      if (age < 10 || age > 100) {
        showToast('⚠️ Age must be between 10 and 100 years.', true); return;
      }
      if (!heightCm || isNaN(heightCm)) {
        showToast('⚠️ Please enter your Height in cm (e.g. 165)', true); return;
      }
      if (heightCm < 100 || heightCm > 250) {
        showToast('⚠️ Height must be between 100 cm and 250 cm.', true); return;
      }
      if (!weightKg || isNaN(weightKg)) {
        showToast('⚠️ Please enter your Weight in kg (e.g. 68)', true); return;
      }
      if (weightKg < 20 || weightKg > 300) {
        showToast('⚠️ Weight must be between 20 kg and 300 kg.', true); return;
      }

      // BMI
      const heightM   = heightCm / 100;
      const bmi       = weightKg / (heightM * heightM);
      const bmiRounded = Math.round(bmi * 10) / 10;

      // Category
      let category, catClass, catColor;
      if (bmi < 18.5)      { category = 'Underweight';  catClass = 'bmi-cat-underweight'; catColor = '#3b82f6'; }
      else if (bmi < 25)   { category = 'Normal Weight'; catClass = 'bmi-cat-normal';      catColor = '#22c55e'; }
      else if (bmi < 30)   { category = 'Overweight';   catClass = 'bmi-cat-overweight';  catColor = '#f59e0b'; }
      else                 { category = 'Obese';         catClass = 'bmi-cat-obese';        catColor = '#ef4444'; }

      // Ideal weight
      const idealMin = Math.round(18.5 * heightM * heightM);
      const idealMax = Math.round(24.9 * heightM * heightM);


      // Waist-to-Height Ratio & Skinny Fat Warning
      let whrValue = 0;
      let whrLabel = '';
      let whrWarning = '';
      if (bmiWaist > 0) {
        whrValue = Math.round((bmiWaist / heightCm) * 100) / 100;
        if (whrValue < 0.43)       { whrLabel = 'Slim'; }
        else if (whrValue <= 0.52) { whrLabel = 'Healthy'; }
        else if (whrValue <= 0.57) { whrLabel = 'Overweight'; }
        else if (whrValue <= 0.62) { whrLabel = 'High Risk'; }
        else                       { whrLabel = 'Very High Risk'; }
      }

      // Skinny Fat warning — Normal BMI but Endomorph body type or high waist ratio
      if (bmi >= 18.5 && bmi < 25) {
        if (selectedBodyType === 'endomorph') {
          whrWarning = '⚠️ Your BMI is in the Normal range, but your Endomorph body type suggests you may carry more body fat than the number shows. Consider a body composition check with our trainer.';
        } else if (bmiWaist > 0 && whrValue > 0.52) {
          whrWarning = '⚠️ Your BMI looks Normal, but your waist-to-height ratio (' + whrValue + ') shows excess belly fat. This is called "Skinny Fat" — common in Indian body types. Please consult our trainer.';
        }
      }
      if (bmi >= 18.5 && bmi < 25 && bmiWaist === 0 && selectedBodyType !== 'endomorph') {
        whrWarning = 'ℹ️ BMI has limits — it cannot measure body fat directly. If you visually carry excess weight, enter your waist size above for a more accurate check.';
      }

      let diffText = '';
      if (bmi < 18.5)     diffText = `Gain ${(idealMin - weightKg).toFixed(1)} kg to reach ideal weight`;
      else if (bmi >= 25) diffText = `Lose ${(weightKg - idealMax).toFixed(1)} kg to reach ideal weight`;
      else {
        if (bmiWaist > 0 && whrValue > 0.52) {
          diffText = 'BMI is healthy ✅ — but your waist suggests excess belly fat ⚠️';
        } else {
          diffText = 'You are at a healthy weight! 🎉';
        }
      }

      
      // Calories — Mifflin-St Jeor
      let bmr;
      if (selectedGender === 'male') bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
      else                           bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
      const tdee = Math.round(bmr * activity);

      // Goal calories
      let goalCal, goalIcon, goalLabel, goalMsg;
      if (selectedGoal === 'lose') {
        goalCal = tdee - 500; goalIcon = '🔥'; goalLabel = 'To Lose Weight';
        goalMsg = `Eat ${goalCal} kcal/day (500 kcal deficit). You can expect to lose ~0.5 kg per week. Combine with cardio for best results.`;
      } else if (selectedGoal === 'gain') {
        goalCal = tdee + 250; goalIcon = '💪'; goalLabel = 'To Gain Muscle';
        goalMsg = `Eat ${goalCal} kcal/day (250 kcal surplus). Focus on strength training and ensure high protein intake for muscle growth.`;
      } else {
        goalCal = tdee; goalIcon = '⚖️'; goalLabel = 'To Maintain';
        goalMsg = `Eat ${goalCal} kcal/day to maintain your current weight. Stay consistent with balanced meals and regular activity.`;
      }

      // Protein
      const protein = Math.round(weightKg * 1.8);

      // Carbs & Fats — based on goal calories
      // Carbs, Fats & Fibre — based on goal calories
      const proteinCals = protein * 4;
      const fatCals     = Math.round(goalCal * 0.25);       // 25% of calories from fat
      const carbCals    = goalCal - proteinCals - fatCals;
      const fats        = Math.round(fatCals / 9);
      const carbs       = Math.round(carbCals / 4);

      // Fibre — WHO recommends 14g per 1000 kcal, adjusted slightly by goal
      const fibreBase   = Math.round((goalCal / 1000) * 14);
      const fibre       = selectedGoal === 'lose' ? fibreBase + 5 : selectedGoal === 'gain' ? fibreBase + 3 : fibreBase;

      // Water
      let waterMultiplier = 35;
      if (activity >= 1.725)      waterMultiplier = 45;
      else if (activity >= 1.55)  waterMultiplier = 40;
      else if (activity >= 1.375) waterMultiplier = 38;
      const waterBase   = (weightKg * waterMultiplier) / 1000;
      const waterExtra  = (selectedGoal === 'lose' || selectedGoal === 'gain') ? 0.5 : 0;
      const waterLitres = Math.round((waterBase + waterExtra) * 10) / 10;

      // Update DOM
     // Update DOM
     document.getElementById('bmiNum').textContent       = bmiRounded;
     const nameGreeting = document.getElementById('bmiNameGreeting');
     if (nameGreeting) nameGreeting.textContent = bmiName ? `Hi ${bmiName}! Here are your results 👋` : '';
      document.getElementById('bmiCatBadge').textContent  = category;
      document.getElementById('bmiCatBadge').className    = 'bmi-cat-badge ' + catClass;
      document.getElementById('bmiIdealText').textContent = `Ideal weight: ${idealMin}–${idealMax} kg`;
      const idealWaistEl = document.getElementById('bmiIdealWaist');
        if (idealWaistEl) {
          const idealWaistMax = selectedGender === 'male'
            ? Math.round(heightCm * 0.50)
            : Math.round(heightCm * 0.48);
          idealWaistEl.textContent = `Ideal waist: under ${idealWaistMax} cm (for your height)`;
          idealWaistEl.style.display = bmiWaist > 0 ? '' : 'none';
        }

      document.getElementById('bmiDiffText').textContent  = diffText;
      // document.getElementById('calMaintain').textContent  = tdee.toLocaleString();
      document.getElementById('calGoal').textContent      = goalCal.toLocaleString();
      document.getElementById('calProtein').textContent   = protein;
      document.getElementById('calWater').textContent     = waterLitres;
      document.getElementById('goalIcon').textContent     = goalIcon;
      document.getElementById('goalLabel').textContent    = goalLabel;
      document.getElementById('bmiGoalMsg').textContent   = goalMsg;

      document.getElementById('calCarbs').textContent  = carbs;
      document.getElementById('calFats').textContent   = fats;
      document.getElementById('calFibre').textContent  = fibre;

      // Waist-to-Height ratio display
      const whrBox = document.getElementById('whrBox');
      if (bmiWaist > 0 && whrBox) {
        document.getElementById('calWHR').textContent = whrValue;
        document.getElementById('calWHRLabel').textContent = whrLabel;

        if (whrValue > 0.52) {
          document.getElementById('calWHRLabel').style.color = whrValue > 0.57 ? '#ef4444' : '#f59e0b';
          document.getElementById('calWHRLabel').style.fontWeight = '700';
        }


        whrBox.style.display = '';
        whrBox.style.background = whrValue > 0.57 ? '#fef2f2' : whrValue > 0.52 ? '#fff7ed' : '#f0fdf4';
        whrBox.style.borderColor = whrValue > 0.57 ? '#fca5a5' : whrValue > 0.52 ? '#fdba74' : '#86efac';
      } else if (whrBox) {
        whrBox.style.display = 'none';
      }

      // BMI limitation warning
      const limitWarn = document.getElementById('bmiLimitationWarning');
      if (limitWarn) {
        limitWarn.textContent = whrWarning;
        limitWarn.style.display = whrWarning ? '' : 'none';
      }

      // Circle animation
      const progress    = document.getElementById('bmiCircleProgress');
      const circumference = 314;
      const pct    = Math.min(Math.max((bmi - 10) / 30, 0), 1);
      const offset = circumference - (pct * circumference);
      progress.style.strokeDashoffset = offset;
      progress.style.stroke           = catColor;

      // Scale pin
      const pinPct = Math.min(Math.max((bmi - 16) / 24, 0), 1) * 100;
      document.getElementById('bmiScalePin').style.left = pinPct + '%';

      // Show result
      formCard.style.display = 'none';
      resultCard.classList.add('visible');
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Activity label for WhatsApp message
      const activityLabels = {
        '1.2': 'Sedentary', '1.375': 'Light', '1.55': 'Moderate',
        '1.725': 'Active', '1.9': 'Very Active'
      };
      const activityLabel = activityLabels[String(activity)] || 'Moderate';

      // Trigger expert analysis panel
      loadExpertAnalysis({
        gender: selectedGender,
        age, heightCm, weightKg,
        bmi: bmiRounded,
        category,
        goal: selectedGoal === 'lose' ? 'Lose Weight' : selectedGoal === 'gain' ? 'Gain Muscle' : 'Maintain Weight',
        activityLabel,
        tdee,
        goalCal,
        carbs,
        fats,
        fibre,
        experience: bmiExperience,
        equipment: bmiEquipment,
        name: bmiName,
        medical: bmiMedical,
        bodyType: selectedBodyType,
        waist: bmiWaist || 0,
        whr: whrValue || 0,
        whrLabel: whrLabel || 'Not measured'
      });
      // WhatsApp plan button
      getPlanBtn.onclick = () => {
        const text = encodeURIComponent(
          `⚖️ BMI Calculator Result — Classic Fitness
          
          👤 Name          : ${bmiName || 'Not provided'}
          🏋️ Body Type     : ${selectedBodyType.charAt(0).toUpperCase() + selectedBodyType.slice(1)}
          📊 My BMI        : ${bmiRounded} (${category})
          ⚖️ Ideal Weight  : ${idealMin}–${idealMax} kg
          👤 Gender        : ${selectedGender === 'male' ? 'Male' : 'Female'}
          🔢 Age           : ${age} years
          🪪 Member ID     : ${bmiMemberId || 'Non-Member'}
          📏 Height        : ${heightCm} cm
          ⚖️ Weight        : ${weightKg} kg
          
          🎯 Daily Calories (${goalLabel})  : ${goalCal} kcal
          🥩 Daily Protein                  : ${protein} g
          🍚 Daily Carbs                    : ${carbs} g
          🥑 Daily Fats                     : ${fats} g
          🌾 Daily Fibre                    : ${fibre} g
          💧 Daily Water                    : ${waterLitres} L
          🏥 Medical Conditions             : ${bmiMedical || 'None'}
          
          🙏 Please create a FREE personalized diet + workout plan for me based on these details.`
          );
        window.open(`https://wa.me/918668007901?text=${text}`, '_blank');
      };
    });

    // Reset
    resetBtn.addEventListener('click', () => {
      resultCard.classList.remove('visible');
      formCard.style.display = '';
      document.getElementById('bmiAge').value    = '';
      document.getElementById('bmiHeight').value = '';
      document.getElementById('bmiWeight').value = '';
      // Hide expert panel on reset
      const ep = document.getElementById('expertPanel');
      if (ep) ep.style.display = 'none';

      updateCalcBtnState();
    });
  }

// ===== EXPERT ANALYSIS PANEL =====
function initExpertPanel() {
  const tabBtns = document.querySelectorAll('.expert-tab');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      document.querySelectorAll('.expert-tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('tab-' + target).classList.add('active');
    });
  });
}

// Build supplement HTML from API response
function buildSupplements(data) {
  const list = document.getElementById('supplementsList');
  if (!list || !data.supplements) return;
  let html = '<div class="supplement-grid">';
  data.supplements.forEach(s => {
    const priorityClass = s.priority === 'High' ? 'priority-high' : s.priority === 'Medium' ? 'priority-medium' : 'priority-low';
    html += `
      <div class="supplement-card">
        <div class="supplement-card-icon">${s.icon}</div>
        <span class="supplement-card-priority ${priorityClass}">${s.priority} Priority</span>
        <div class="supplement-card-name">${s.name}</div>
        <div class="supplement-card-benefit">${s.benefit}</div>
        <span class="supplement-card-dose">📋 ${s.dose}</span>
      </div>`;
  });
  html += '</div>';
  list.innerHTML = html;
}

// Build workout HTML from API response
function buildWorkout(data) {
  const plan = document.getElementById('workoutPlan');
  if (!plan || !data.workout) return;
  let html = '<div class="workout-week">';
  data.workout.days.forEach((d, dayIndex) => {
    const isRest = d.type.toLowerCase().includes('rest');
    const restClass = isRest ? 'rest' : '';
    html += `
      <div class="workout-day-block">
        <div class="workout-day-header">
          <span class="workout-day-label ${restClass}">${d.day}</span>
          <div class="workout-day-header-info">
            <span class="workout-day-type">${d.focus || ''} ${d.type}</span>
            <span class="workout-day-muscle-note">Tap any exercise to see the tip</span>
          </div>
        </div>`;

    if (!isRest && d.cardio) {
      html += `
        <div class="workout-cardio-row">
          <span class="workout-cardio-icon">🏃</span>
          <div class="workout-cardio-details">
            <span class="workout-cardio-label">CARDIO</span>
            <span class="workout-cardio-name">${d.cardio.name}</span>
          </div>
          <div class="workout-cardio-tags">
            <span class="workout-cardio-tag">⏱ ${d.cardio.duration}</span>
            <span class="workout-cardio-tag">🔥 ${d.cardio.intensity}</span>
          </div>
        </div>`;
    }

    if (!isRest && d.exercises && d.exercises.length > 0) {
      html += `<div class="workout-exercises">`;
      d.exercises.forEach((ex, i) => {
        const tipId = `tip-${dayIndex}-${i}`;
        const showId = `show-${dayIndex}-${i}`;
        html += `
          <div class="workout-exercise-row">
            <div class="workout-ex-num">${i + 1}</div>
            <div class="workout-ex-details">
              <div class="workout-ex-name">${ex.name}</div>
              <div class="workout-ex-meta">
                <span class="workout-ex-tag">🔁 ${ex.sets} sets</span>
                <span class="workout-ex-tag">📊 ${ex.reps} reps</span>
                <span class="workout-ex-tag">⏱ ${ex.rest} rest</span>
              </div>
              <div class="workout-ex-tip" style="display:none" onclick="this.style.display='none';document.getElementById('${showId}').style.display='block'" id="${tipId}">💡 ${ex.tip}</div>
              <div class="workout-ex-show-tip" id="${showId}" onclick="document.getElementById('${tipId}').style.display='block';this.style.display='none'">💡 Show tip</div>
            </div>
          </div>`;
      });
      html += `</div>`;
    } else if (isRest) {
      html += `<div class="workout-rest-msg">🛌 Rest, recover and rehydrate. Light stretching optional.</div>`;
    }
    html += `</div>`;
  });
  html += `</div>
    <div class="workout-tip">💡 ${data.workout.tip}</div>`;
  plan.innerHTML = html;
}

// Build health risk HTML from API response
function buildHealthRisk(data) {
  const risk = document.getElementById('healthRisk');
  if (!risk || !data.health) return;
  const colorMap = { green: 'green', yellow: 'yellow', orange: 'orange', red: 'red' };
  const col = colorMap[data.health.color] || 'green';
  let html = `
    <div class="health-risk-banner ${col}">
      <div class="health-risk-icon">${data.health.icon}</div>
      <div>
        <div class="health-risk-title">${data.health.title}</div>
        <div class="health-risk-desc">${data.health.description}</div>
      </div>
    </div>
    <div class="health-risk-list">`;
  data.health.risks.forEach(r => {
    html += `
      <div class="health-risk-item">
        <span class="health-risk-item-icon">${r.icon}</span>
        <span>${r.text}</span>
      </div>`;
  });
  html += `</div>
    <div class="health-focus-box">
      <div class="health-focus-title">🎯 Focus Areas for You</div>
      <div class="health-focus-items">`;
  data.health.focus.forEach(f => {
    html += `<span class="health-focus-tag">${f}</span>`;
  });
  html += '</div></div>';
  risk.innerHTML = html;
}

// Main function to call API and populate panel
async function loadExpertAnalysis(userData) {
  const panel   = document.getElementById('expertPanel');
  const loading = document.getElementById('expertLoading');
  const content = document.getElementById('expertContent');
  const waBtn   = document.getElementById('expertWaBtn');

  if (!panel) return;

  // Show panel and loading state
  panel.style.display = 'block';
  loading.style.display = 'flex';
  content.style.display = 'none';

  waBtn.disabled = true;
  waBtn.style.opacity = '0.5';

  // Scroll to panel
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);

  const expLabel = { beginner: 'Beginner (0–6 months)', intermediate: 'Intermediate (6 months–2 years)', advanced: 'Advanced (2+ years)' };
  const eqLabel  = { gym: 'Full Gym with machines and free weights', dumbbells: 'Dumbbells only', home: 'Home with no equipment' };

  const prompt = `You are a certified fitness and nutrition expert at Classic Fitness Gym, Arakkonam. Based on this person's data, give a highly personalised plan. Always address the person by their name if provided.

PERSON DATA:
- Name: ${userData.name || 'Not provided'}
- Gender: ${userData.gender}
- Age: ${userData.age} years
- Height: ${userData.heightCm} cm
- Weight: ${userData.weightKg} kg
- BMI: ${userData.bmi} (${userData.category})
- Goal: ${userData.goal}
- Activity Level: ${userData.activityLabel}
- Experience Level: ${expLabel[userData.experience] || userData.experience}
- Equipment Available: ${eqLabel[userData.equipment] || userData.equipment}
- Daily Calories Needed: ${userData.tdee} kcal
- Goal Calories: ${userData.goalCal} kcal
- Daily Nutrition: ${userData.carbs ? userData.carbs : ''}g Carbs, ${userData.fats ? userData.fats : ''}g Fats, ${userData.fibre ? userData.fibre : ''}g Fibre
- Body Type: ${userData.bodyType ? userData.bodyType.charAt(0).toUpperCase() + userData.bodyType.slice(1) : 'Not specified'}
- Medical Conditions / Injuries: ${userData.medical || 'None reported'}
- Waist Circumference: ${userData.waist ? userData.waist + ' cm (Waist-to-Height Ratio: ' + userData.whr + ' — classified as: ' + userData.whrLabel + ')' : 'Not provided'}
- Body Composition Note: ${userData.waist && userData.whr > 0.52 && userData.bmi < 25 ? 'IMPORTANT: This person has NORMAL BMI but HIGH waist-to-height ratio. This is called Normal Weight Obesity or Skinny Fat — common in Indian body types. The supplements, workout, and health risk MUST address belly fat reduction, visceral fat, and body recomposition — not just weight maintenance.' : 'No special body composition conflict detected.'}


Respond ONLY with a valid JSON object, no extra text, no markdown, no backticks. Use this exact structure:
{
"supplements": [
  { "icon": "emoji", "name": "Supplement Name", "benefit": "One line benefit specific to this person", "dose": "Timing and dosage", "priority": "High/Medium/Low" },
  { "icon": "emoji", "name": "Supplement Name", "benefit": "One line benefit specific to this person", "dose": "Timing and dosage", "priority": "High/Medium/Low" },
  { "icon": "emoji", "name": "Supplement Name", "benefit": "One line benefit specific to this person", "dose": "Timing and dosage", "priority": "High/Medium/Low" },
  { "icon": "emoji", "name": "Supplement Name", "benefit": "One line benefit specific to this person", "dose": "Timing and dosage", "priority": "High/Medium/Low" }
],
"workout": {
  "days": [
    {
      "day": "MON",
      "type": "Workout type e.g. Chest & Triceps",
      "focus": "💪",
      "cardio": { "name": "Cardio exercise e.g. Treadmill", "duration": "20 min", "intensity": "Moderate" },
      "exercises": [
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "Short form tip" },
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "Short form tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "Short form tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "Short form tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "Short form tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "Short form tip" }
      ]
    },
    {
      "day": "TUE",
      "type": "Workout type e.g. Back & Biceps",
      "focus": "🏋️",
      "cardio": { "name": "Cardio exercise", "duration": "20 min", "intensity": "Moderate" },
      "exercises": [
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "tip" }
      ]
    },
    {
      "day": "WED",
      "type": "Workout type e.g. Shoulders & Core",
      "focus": "🔥",
      "cardio": { "name": "Cardio exercise", "duration": "25 min", "intensity": "Moderate to High" },
      "exercises": [
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "15–20", "rest": "45 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "15–20", "rest": "45 sec", "tip": "tip" }
      ]
    },
    {
      "day": "THU",
      "type": "Workout type e.g. Legs & Glutes",
      "focus": "🦵",
      "cardio": { "name": "Cardio exercise", "duration": "20 min", "intensity": "Moderate" },
      "exercises": [
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "90 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "90 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "15–20", "rest": "45 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "15–20", "rest": "45 sec", "tip": "tip" }
      ]
    },
    {
      "day": "FRI",
      "type": "Workout type e.g. Full Body or Arms",
      "focus": "💥",
      "cardio": { "name": "Cardio exercise", "duration": "20 min", "intensity": "Moderate" },
      "exercises": [
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "tip" }
      ]
    },
    {
      "day": "SAT",
      "type": "Workout type e.g. Weak Muscle Focus",
      "focus": "⚡",
      "cardio": { "name": "Cardio exercise", "duration": "30 min", "intensity": "High" },
      "exercises": [
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 4, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "12–15", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "tip" },
        { "name": "Exercise name", "sets": 3, "reps": "10–12", "rest": "60 sec", "tip": "tip" }
      ]
    },
    {
      "day": "SUN",
      "type": "Rest Day",
      "focus": "😴",
      "cardio": null,
      "exercises": []
    }
  ],
  "tip": "One specific training tip based on their BMI, body type, experience level and goal"
},
"health": {
  "color": "green/yellow/orange/red based on BMI",
  "icon": "emoji",
  "title": "Short risk level title",
  "description": "2 sentences about their specific health status",
  "risks": [
    { "icon": "emoji", "text": "Specific risk or observation for this person" },
    { "icon": "emoji", "text": "Specific risk or observation for this person" },
    { "icon": "emoji", "text": "Specific risk or observation for this person" }
  ],
  "focus": ["Focus area 1", "Focus area 2", "Focus area 3", "Focus area 4"]
}
}`;

  try {
      // const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': 'Bearer API'
      //     },
      //     body: JSON.stringify({
      //       model: 'gpt-4o-mini',
      //       max_tokens: 4000,
      //       messages: [{ role: 'user', content: prompt }]
      //     })
      //   });


      // For Production
      const response = await fetch('https://classicfitness-api.sandhiyasenthill3.workers.dev', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });
      
        
        const raw  = await response.json();

        // Check if API returned a valid response
        if (!raw || !raw.choices || !raw.choices[0] || !raw.choices[0].message) {
          const apiErr = (raw && raw.error && raw.error.message) ? raw.error.message : 'Server returned an unexpected response.';
          throw new Error('API_INVALID: ' + apiErr);
        }

        const text = raw.choices[0].message.content.trim();

        if (!text) {
          throw new Error('API_EMPTY');
        }

    // Strip any accidental backticks
    const clean = text.replace(/```json|```/g, '').trim();

    let data;
    try {
      data = JSON.parse(clean);
    } catch (parseErr) {
      throw new Error('API_PARSE');
    }

    // Populate all tabs
    buildSupplements(data);
    buildWorkout(data);
    buildHealthRisk(data);

    // Wire WhatsApp button with full analysis
    waBtn.onclick = () => {
      const supp  = data.supplements.map(s => `• ${s.name} — ${s.dose}`).join('\n');
      const work  = data.workout.days.map(d => {
        if (!d.exercises || d.exercises.length === 0) return `${d.day}: ${d.type}`;
        const exList = d.exercises.map(e => `   • ${e.name} — ${e.sets}×${e.reps}`).join('\n');
        return `${d.day}: ${d.type}\n${exList}`;
      }).join('\n');
      const risks = data.health.risks.map(r => `• ${r.text}`).join('\n');
      const focus = data.health.focus.join(', ');

      const waText = encodeURIComponent(
`⚖️ BMI Analysis — Classic Fitness

👤 ${userData.name ? userData.name + ' | ' : ''}${userData.gender === 'male' ? 'Male' : 'Female'}, ${userData.age} yrs | ${userData.heightCm}cm | ${userData.weightKg}kg
📊 BMI: ${userData.bmi} (${userData.category}) | Goal: ${userData.goal}
🏥 Medical: ${userData.medical || 'None'}
🍚 Carbs: ${userData.carbs}g | 🥑 Fats: ${userData.fats}g | 🌾 Fibre: ${userData.fibre}g

💊 RECOMMENDED SUPPLEMENTS:
${supp}

🏋️ WEEKLY WORKOUT PLAN:
${work}
💡 Tip: ${data.workout.tip}

⚠️ HEALTH STATUS: ${data.health.title}
${risks}
🎯 Focus: ${focus}

🙏 Please help me with a full personalised plan!`
      );
      window.open(`https://wa.me/918668007901?text=${waText}`, '_blank');
    };

    // Show content
    loading.style.display = 'none';
    content.style.display = 'block';

    waBtn.disabled = false;
    waBtn.style.opacity = '1';

  } catch (err) {
    console.error('Expert analysis error:', err);

    // Pick a clear user-friendly message based on error type
    let userMsg = '';
    let userTip = '';

    const errStr = err && err.message ? err.message : '';

    if (!navigator.onLine) {
      userMsg = '📵 No Internet Connection';
      userTip = 'Please check your Wi-Fi or mobile data and try again.';
    } else if (errStr.includes('API_INVALID')) {
      userMsg = '⚠️ Server Error';
      userTip = 'Our analysis server returned an unexpected response. Please wait a moment and try recalculating.';
    } else if (errStr.includes('API_EMPTY')) {
      userMsg = '⚠️ Empty Response';
      userTip = 'The AI returned no result. This can happen with unusual inputs. Please check your details and try again.';
    } else if (errStr.includes('API_PARSE')) {
      userMsg = '⚠️ Response Error';
      userTip = 'The analysis could not be read correctly. Please try again in a moment.';
    } else if (errStr.includes('Failed to fetch') || errStr.includes('NetworkError') || errStr.includes('net::')) {
      userMsg = '🌐 Connection Failed';
      userTip = 'Could not reach our server. Please check your internet connection and try again.';
    } else {
      userMsg = '⚠️ Analysis Failed';
      userTip = 'Something went wrong while loading your analysis. Please try recalculating.';
    }

    loading.innerHTML = `
      <div style="
        padding: 24px 20px;
        text-align: center;
        background: rgba(239,68,68,0.08);
        border: 1px solid rgba(239,68,68,0.25);
        border-radius: 14px;
        margin: 8px;
      ">
        <div style="font-size: 32px; margin-bottom: 10px;">😕</div>
        <div style="
          font-size: 16px;
          font-weight: 800;
          color: #fca5a5;
          margin-bottom: 8px;
        ">${userMsg}</div>
        <div style="
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 18px;
        ">${userTip}</div>
        <button onclick="location.reload()" style="
          background: rgba(239,68,68,0.2);
          border: 1px solid rgba(239,68,68,0.4);
          border-radius: 10px;
          color: #fca5a5;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 20px;
          cursor: pointer;
          font-family: inherit;
        ">🔄 Try Again</button>
      </div>`;

    waBtn.style.opacity = '0.5';
  }
}

  // ===== INIT =====
  function init() {
    setYear();
    setupLinks();
    initMobileNav();
    initNavbarScroll();
    initBackToTop();
    initDietBar();
    initJoinModal();
    initBMICalculator();
    initExpertPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();