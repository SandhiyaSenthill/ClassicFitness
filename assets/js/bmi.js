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
  
      // Calculate
      calcBtn.addEventListener('click', () => {
        const age      = parseFloat(document.getElementById('bmiAge').value);
        const heightCm = parseFloat(document.getElementById('bmiHeight').value);
        const weightKg = parseFloat(document.getElementById('bmiWeight').value);
        const activity = parseFloat(document.getElementById('bmiActivity').value);
        const bmiMemberId = document.getElementById('bmiMemberId').value.trim();
  
        if (!age || !heightCm || !weightKg || age < 10 || age > 100 || heightCm < 100 || heightCm > 250 || weightKg < 20 || weightKg > 300) {
          showToast('Please enter valid Age, Height and Weight.', true);
          return;
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
  
        let diffText = '';
        if (bmi < 18.5)     diffText = `Gain ${(idealMin - weightKg).toFixed(1)} kg to reach ideal weight`;
        else if (bmi >= 25) diffText = `Lose ${(weightKg - idealMax).toFixed(1)} kg to reach ideal weight`;
        else                diffText = 'You are at a healthy weight! 🎉';
  
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
  
        // Water
        let waterMultiplier = 35;
        if (activity >= 1.725)      waterMultiplier = 45;
        else if (activity >= 1.55)  waterMultiplier = 40;
        else if (activity >= 1.375) waterMultiplier = 38;
        const waterBase   = (weightKg * waterMultiplier) / 1000;
        const waterExtra  = (selectedGoal === 'lose' || selectedGoal === 'gain') ? 0.5 : 0;
        const waterLitres = Math.round((waterBase + waterExtra) * 10) / 10;
  
        // Update DOM
        document.getElementById('bmiNum').textContent       = bmiRounded;
        document.getElementById('bmiCatBadge').textContent  = category;
        document.getElementById('bmiCatBadge').className    = 'bmi-cat-badge ' + catClass;
        document.getElementById('bmiIdealText').textContent = `Ideal weight: ${idealMin}–${idealMax} kg`;
        document.getElementById('bmiDiffText').textContent  = diffText;
        document.getElementById('calMaintain').textContent  = tdee.toLocaleString();
        document.getElementById('calGoal').textContent      = goalCal.toLocaleString();
        document.getElementById('calProtein').textContent   = protein;
        document.getElementById('calWater').textContent     = waterLitres;
        document.getElementById('goalIcon').textContent     = goalIcon;
        document.getElementById('goalLabel').textContent    = goalLabel;
        document.getElementById('bmiGoalMsg').textContent   = goalMsg;
  
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
  
        // WhatsApp plan button
        getPlanBtn.onclick = () => {
          const text = encodeURIComponent(
  `⚖️ BMI Calculator Result — Classic Fitness
  
  📊 My BMI        : ${bmiRounded} (${category})
  ⚖️ Ideal Weight  : ${idealMin}–${idealMax} kg
  👤 Gender        : ${selectedGender === 'male' ? 'Male' : 'Female'}
  🔢 Age           : ${age} years
  🪪 Member ID     : ${bmiMemberId || 'Non-Member'}
  📏 Height        : ${heightCm} cm
  ⚖️ Weight        : ${weightKg} kg
  
  🔥 Daily Calories to Maintain  : ${tdee} kcal
  🎯 Daily Calories for My Goal  : ${goalCal} kcal (${goalLabel})
  🥩 Daily Protein Needed        : ${protein} g
  💧 Daily Water Intake          : ${waterLitres} L
  
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
      });
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
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  
  })();