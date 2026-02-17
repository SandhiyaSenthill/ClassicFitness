// ==========================================
//  CLASSIC FITNESS GYM - ENHANCED JAVASCRIPT
// ==========================================

(function () {
  'use strict';

  // ===== Set Current Year =====
  function setYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ===== Mobile Navigation Toggle =====
  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (!navToggle || !navLinks) return;

    // Toggle menu
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      
      // Animate hamburger icon
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
      } else {
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });

    // Handle dropdown toggle on mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        // Only handle this on mobile (when nav-links is in mobile mode)
        if (window.innerWidth <= 820) {
          e.preventDefault(); // Prevent default anchor behavior
          const dropdown = toggle.closest('.nav-dropdown');
          dropdown.classList.toggle('open');
        }
      });
    });

    // Close menu when clicking a link
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && !e.target.classList.contains('dropdown-toggle')) {
        navLinks.classList.remove('show');
        
        // Reset hamburger icon
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('show')) return;
      
      const clickedInside = navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInside) {
        navLinks.classList.remove('show');
        
        // Reset hamburger icon
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
        
        // Close all dropdowns
        document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }
    });
  }

  // ===== WhatsApp & Directions Links =====
  function setupLinks() {
    const phone = '8668007901';
    const message = encodeURIComponent(
      'Hello Classic Fitness Gym, I want to enquire about membership and timings.'
    );
    const waUrl = `https://wa.me/91${phone}?text=${message}`;

    // Set WhatsApp links
    const waButtons = ['waBtn', 'waBtn2', 'waBtn3', 'waFloat'];
    waButtons.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.href = waUrl;
    });

    // Set Directions link
    const address = encodeURIComponent(
      'No 19/10, Pillayar Kovil Street, Griblispet, Arakkonam 631002'
    );
    const dirUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    const dirBtn = document.getElementById('dirBtn');
    if (dirBtn) dirBtn.href = dirUrl;
  }

  // ===== Back to Top Button =====
  function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ===== Navbar Background on Scroll =====
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      // Add shadow on scroll
      if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)';
      }
      
      // Hide/show navbar on scroll (optional)
      /*
      if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      */
      
      lastScroll = currentScroll;
    });
  }

  // ===== Animate Elements on Scroll =====
  // ===== Animate Elements on Scroll =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards, sections, etc.
  const elementsToAnimate = document.querySelectorAll('.card, .service-card, .testimonial-card, .price-card, .contact-card');
  elementsToAnimate.forEach(el => {
    // ✅ DON'T set opacity to 0 - let elements be visible by default
    observer.observe(el);
  });
}

  // ===== Active Navigation Link =====
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ===== Typing Effect for Hero (Optional Enhancement) =====
  function initTypingEffect() {
    const typingElement = document.querySelector('.hero-sub');
    if (!typingElement) return;

    const originalText = typingElement.textContent;
    typingElement.textContent = '';
    
    let i = 0;
    function type() {
      if (i < originalText.length) {
        typingElement.textContent += originalText.charAt(i);
        i++;
        setTimeout(type, 50);
      }
    }
    
    // Start typing after a short delay
    setTimeout(type, 500);
  }

  // ===== Counter Animation for Stats =====
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-num');
    
    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const text = target.textContent;
          
          // Only animate numbers
          if (/^\d+\+?$/.test(text)) {
            const finalNumber = parseInt(text.replace('+', ''));
            animateCounter(target, finalNumber, text.includes('+'));
          }
          
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element, target, hasPlus) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + (hasPlus ? '+' : '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
      }
    }, stepTime);
  }

  // ===== Form Validation (If you add a contact form) =====
  function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Add your form validation logic here
      const name = form.querySelector('input[name="name"]');
      const phone = form.querySelector('input[name="phone"]');
      
      if (!name.value || !phone.value) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Submit form or send to backend
      alert('Thank you! We will contact you soon.');
      form.reset();
    });
  }

  // ===== Lazy Loading for Images =====
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.setAttribute('src', src);
              img.removeAttribute('data-src');
              img.classList.add('loaded');
            }
            
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ===== Price Card Hover Effect Enhancement =====
  function enhancePriceCards() {
    const priceCards = document.querySelectorAll('.price-card');
    
    priceCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        // Dim other cards
        priceCards.forEach(c => {
          if (c !== this) {
            c.style.opacity = '0.6';
          }
        });
      });
      
      card.addEventListener('mouseleave', function() {
        // Reset all cards
        priceCards.forEach(c => {
          c.style.opacity = '1';
        });
      });
    });
  }

  // ===== Testimonial Slider (Optional) =====
  function initTestimonialSlider() {
    // This is a placeholder for a testimonial slider
    // You can implement a full slider using libraries like Swiper.js
    // or build a custom one
  }

  // ===== Copy Phone Number to Clipboard =====
  function initCopyPhone() {
    const phoneLinks = document.querySelectorAll('.contact-link');
    
    phoneLinks.forEach(link => {
      link.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const phone = link.textContent;
        
        navigator.clipboard.writeText(phone).then(() => {
          // Show a temporary tooltip
          const tooltip = document.createElement('span');
          tooltip.textContent = 'Copied!';
          tooltip.style.cssText = `
            position: absolute;
            background: var(--green);
            color: white;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
          `;
          
          link.style.position = 'relative';
          link.appendChild(tooltip);
          
          setTimeout(() => {
            tooltip.remove();
          }, 1500);
        });
      });
    });
  }

  // ===== Page Load Performance =====
  function optimizePageLoad() {
    // Remove loading class after page load
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      // Preload hero image
      const heroImg = new Image();
      heroImg.src = 'assets/img/hero.jpg';
    });
  }

  // ===== Initialize All Functions =====
  function init() {
    setYear();
    setupLinks();
    initMobileNav();
    initBackToTop();
    initSmoothScroll();
    initNavbarScroll();
    // initScrollAnimations();
    initActiveNav();
    initCounterAnimation();
    initFormValidation();
    initLazyLoading();
    enhancePriceCards();
    initCopyPhone();
    optimizePageLoad();
    initCustomSelects();  
    initJoinModal();
    initDietModal();
    initBMICalculator();

    
    // Optional: Enable typing effect
    // initTypingEffect();
  }

  // ===== Run on DOM Ready =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===== Expose useful functions globally (optional) =====
  window.ClassicFitness = {
    init,
    setupLinks,
    initBackToTop,
    initSmoothScroll
  };

  
// ===== Custom Select Dropdowns =====
function initCustomSelects() {
  const selects = document.querySelectorAll('.custom-select');

  selects.forEach(function(select) {
    const trigger = select.querySelector('.custom-select-trigger');
    const options = select.querySelectorAll('.custom-option');
    const hiddenInput = select.closest('.custom-select-wrapper').querySelector('input[type="hidden"]');

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      // Close all other open selects
      document.querySelectorAll('.custom-select.open').forEach(function(s) {
        if (s !== select) s.classList.remove('open');
      });
      select.classList.toggle('open');
    });

    options.forEach(function(option) {
      option.addEventListener('click', function() {
        trigger.childNodes[0].textContent = this.textContent + ' ';
        if (hiddenInput) hiddenInput.value = this.getAttribute('data-value');
        select.querySelectorAll('.custom-option').forEach(function(o) {
          o.classList.remove('selected');
        });
        this.classList.add('selected');
        select.classList.remove('open');
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.custom-select.open').forEach(function(s) {
      s.classList.remove('open');
    });
  });
}

  // ===== Join Modal Logic =====
  function initJoinModal() {
    const joinBtn = document.getElementById('joinNowBtn');
    const modal = document.getElementById('joinModal');
    const overlay = document.getElementById('joinModalOverlay');
    const closeBtn = document.getElementById('joinModalClose');
    const form = document.getElementById('joinForm');
  
    if (!modal) return;
  
    // Open modal
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = "hidden";
      });
    }
  
    // Close modal (X button)
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = "auto";
      });
    }
  
    // Close when clicking overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = "auto";
      });
    }
  
    // Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const name = document.getElementById('joinName').value.trim();
        const mobile = document.getElementById('joinMobile').value.trim();
        const goal = document.getElementById('joinGoal').value;
        const time = document.getElementById('joinTime').value;
        const exp = document.getElementById('joinExperience').value;
        const message = document.getElementById('joinMessage').value.trim();
  
        if (!name || !mobile || !goal) {
          showToast("Please fill all required fields.", true);
          return;
        }
  
        const text = encodeURIComponent(
  `Hello Classic Fitness,
  
  New Membership Enquiry:
  
  Name: ${name}
  Mobile: ${mobile}
  Goal: ${goal}
  Preferred Time: ${time}
  Experience Level: ${exp}
  Message: ${message || "N/A"}
  
  Please contact me.`
        );
  
        const phone = "918668007901";
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  
        modal.classList.remove('active');
        document.body.style.overflow = "auto";
        form.reset();
  
        // ===== Show Confirmation Screen =====
        // Re-open modal to show confirmation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        form.style.display = 'none';
        document.querySelector('#joinModal h2').style.display = 'none';
        document.querySelector('#joinModal .join-modal-sub').style.display = 'none';
        const joinConfirmScreen = document.getElementById('joinConfirmScreen');
        joinConfirmScreen.classList.add('show');

        // Wire close button
        document.getElementById('joinConfirmClose').onclick = () => {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
          form.style.display = '';
          document.querySelector('#joinModal h2').style.display = '';
          document.querySelector('#joinModal .join-modal-sub').style.display = '';
          joinConfirmScreen.classList.remove('show');
        };
      });
    }
  }
  

// ===== Diet Plan Modal Logic =====
function initDietModal() {
  const dietBtn = document.getElementById('dietPlanBtn');
  const dietBarBtn = document.getElementById('dietBarBtn');
  const heroDietBtn = document.getElementById('heroDietBtn');
  const dietBarClose = document.getElementById('dietBarClose');
  const modal = document.getElementById('dietModal');
  const overlay = document.getElementById('dietModalOverlay');
  const closeBtn = document.getElementById('dietModalClose');
  const form = document.getElementById('dietForm');
  const announceBar = document.getElementById('dietAnnounceBar');

  if (!modal) return;

  // Helper to open diet modal
  function openDietModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Open modal from announcement section button (existing)
  if (dietBtn) {
    dietBtn.addEventListener('click', openDietModal);
  }

  // Open modal from sticky announcement BAR button (new - Option 3)
  if (dietBarBtn) {
    dietBarBtn.addEventListener('click', openDietModal);
  }

  // Open modal from hero strip button (new - Option 1)
  if (heroDietBtn) {
    heroDietBtn.addEventListener('click', openDietModal);
  }

  // Close the sticky bar permanently (dismiss)
  if (dietBarClose && announceBar) {
    dietBarClose.addEventListener('click', () => {
      announceBar.classList.add('hidden');
    });
  }

  // Close modal X button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // Close when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // Form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('dietName').value.trim();
      const mobile  = document.getElementById('dietMobile').value.trim();
      const address = document.getElementById('dietAddress').value.trim();
      const height  = document.getElementById('dietHeight').value.trim();
      const weight  = document.getElementById('dietWeight').value.trim();
      const neck    = document.getElementById('dietNeck').value.trim();
      const hip     = document.getElementById('dietHip').value.trim();
      const thigh   = document.getElementById('dietThigh').value.trim();
      const medical = document.getElementById('dietMedical').value.trim();
      const chest   = document.getElementById('dietChest').value.trim();
      const arm     = document.getElementById('dietArm').value.trim();
      const memberId = document.getElementById('dietMemberId').value.trim();

      if (!name || !mobile || !height || !weight) {
        showToast('Please fill Name, Mobile, Height and Weight.', true);
        return;
      }

      const text = encodeURIComponent(
`🥗 FREE Diet Plan Request — Classic Fitness

👤 Name        : ${name}
📱 Mobile      : ${mobile}
📍 Address     : ${address || 'Not provided'}
🪪 Member ID   : ${memberId || 'Non-Member'}

📏 Height      : ${height}
⚖️ Weight      : ${weight}
📐 Neck        : ${neck || 'Not provided'}
📐 Hip         : ${hip || 'Not provided'}
📐 Thigh       : ${thigh || 'Not provided'}
📐 Chest       : ${chest || 'Not provided'}
💪 Arm         : ${arm || 'Not provided'}}

🏥 Medical     : ${medical || 'None'}

📸 Please send your full body photo here for an accurate and personalized diet plan!`
      );

      const phone = '918668007901';
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');

      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      form.reset();

      // ===== Show Confirmation Screen =====
      // Re-open modal to show confirmation
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      form.style.display = 'none';
      const dietModalHeader = document.querySelector('.diet-modal-header');
      if (dietModalHeader) dietModalHeader.style.display = 'none';
      const dietConfirmScreen = document.getElementById('dietConfirmScreen');
      dietConfirmScreen.classList.add('show');

      // Wire close button
      document.getElementById('dietConfirmClose').onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        form.style.display = '';
        if (dietModalHeader) dietModalHeader.style.display = '';
        dietConfirmScreen.classList.remove('show');
      };
    });
  }
}


// ===== Toast Function =====
function showToast(message, isError = false) {
  const toast = document.getElementById('toastMessage');
  if (!toast) return;

  const textEl = toast.querySelector('.toast-text');
  textEl.innerHTML = message;

  if (isError) {
    toast.style.borderLeftColor = "#e11d48";
  } else {
    toast.style.borderLeftColor = "var(--green)";
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}


// ===== BMI & CALORIE CALCULATOR =====
function initBMICalculator() {

  // --- Element references ---
  const calcBtn      = document.getElementById('bmiCalcBtn');
  const resetBtn     = document.getElementById('bmiResetBtn');
  const formCard     = document.getElementById('bmiFormCard');
  const resultCard   = document.getElementById('bmiResultCard');
  const getPlanBtn   = document.getElementById('bmiGetPlanBtn');

  if (!calcBtn) return;

  // Gender selection
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

  // Goal selection
  let selectedGoal = 'maintain';
  document.querySelectorAll('.bmi-goal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bmi-goal-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGoal = btn.getAttribute('data-goal');
    });
  });

  // --- Calculate button ---
  calcBtn.addEventListener('click', () => {
    const age      = parseFloat(document.getElementById('bmiAge').value);
    const heightCm = parseFloat(document.getElementById('bmiHeight').value);
    const weightKg = parseFloat(document.getElementById('bmiWeight').value);
    const activity = parseFloat(document.getElementById('bmiActivity').value);
    const bmiMemberId = document.getElementById('bmiMemberId').value.trim();

    // Validation
    if (!age || !heightCm || !weightKg || age < 10 || age > 100 || heightCm < 100 || heightCm > 250 || weightKg < 20 || weightKg > 300) {
      showToast('Please enter valid Age, Height and Weight.', true);
      return;
    }

    // --- BMI Calculation ---
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 10) / 10;

    // BMI category
    let category, catClass, catColor;
    if (bmi < 18.5) {
      category = 'Underweight'; catClass = 'bmi-cat-underweight'; catColor = '#3b82f6';
    } else if (bmi < 25) {
      category = 'Normal Weight'; catClass = 'bmi-cat-normal'; catColor = '#22c55e';
    } else if (bmi < 30) {
      category = 'Overweight'; catClass = 'bmi-cat-overweight'; catColor = '#f59e0b';
    } else {
      category = 'Obese'; catClass = 'bmi-cat-obese'; catColor = '#ef4444';
    }

    // Ideal weight range (BMI 18.5–24.9)
    const idealMin = Math.round(18.5 * heightM * heightM);
    const idealMax = Math.round(24.9 * heightM * heightM);

    // Weight difference
    let diffText = '';
    if (bmi < 18.5) {
      diffText = `Gain ${(idealMin - weightKg).toFixed(1)} kg to reach ideal weight`;
    } else if (bmi >= 25) {
      diffText = `Lose ${(weightKg - idealMax).toFixed(1)} kg to reach ideal weight`;
    } else {
      diffText = 'You are at a healthy weight! 🎉';
    }

    // --- Calorie Calculation (Mifflin-St Jeor + TDEE) ---
    let bmr;
    if (selectedGender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    const tdee = Math.round(bmr * activity);

    // Goal calories
    let goalCal, goalIcon, goalLabel, goalMsg;
    if (selectedGoal === 'lose') {
      goalCal   = tdee - 500;
      goalIcon  = '🔥';
      goalLabel = 'To Lose Weight';
      goalMsg   = `Eat ${goalCal} kcal/day (500 kcal deficit). You can expect to lose ~0.5 kg per week. Combine with cardio for best results.`;
    } else if (selectedGoal === 'gain') {
      goalCal   = tdee + 250;
      goalIcon  = '💪';
      goalLabel = 'To Gain Muscle';
      goalMsg   = `Eat ${goalCal} kcal/day (250 kcal surplus). Focus on strength training and ensure high protein intake for muscle growth.`;
    } else {
      goalCal   = tdee;
      goalIcon  = '⚖️';
      goalLabel = 'To Maintain';
      goalMsg   = `Eat ${goalCal} kcal/day to maintain your current weight. Stay consistent with balanced meals and regular activity.`;
    }

    // Protein (1.8g per kg bodyweight for active people)
    // Protein (1.8g per kg bodyweight for active people)
    const protein = Math.round(weightKg * 1.8);

    // Water intake based on weight + activity multiplier
    // Base: 35ml per kg. Activity 1.2=sedentary, 1.375=light, 1.55=moderate, 1.725=active, 1.9=very active
    let waterMultiplier = 35;
    if (activity >= 1.725) waterMultiplier = 45;
    else if (activity >= 1.55) waterMultiplier = 40;
    else if (activity >= 1.375) waterMultiplier = 38;
    // Extra 500ml if goal is lose weight or gain muscle
    const waterBase = (weightKg * waterMultiplier) / 1000;
    const waterExtra = (selectedGoal === 'lose' || selectedGoal === 'gain') ? 0.5 : 0;
    const waterLitres = Math.round((waterBase + waterExtra) * 10) / 10;



    // --- Update DOM ---
    document.getElementById('bmiNum').textContent        = bmiRounded;
    document.getElementById('bmiCatBadge').textContent   = category;
    document.getElementById('bmiCatBadge').className     = 'bmi-cat-badge ' + catClass;
    document.getElementById('bmiIdealText').textContent  = `Ideal weight: ${idealMin}–${idealMax} kg`;
    document.getElementById('bmiDiffText').textContent   = diffText;
    document.getElementById('calMaintain').textContent   = tdee.toLocaleString();
    document.getElementById('calGoal').textContent       = goalCal.toLocaleString();
    document.getElementById('calProtein').textContent    = protein;
    document.getElementById('calWater').textContent      = waterLitres;
    document.getElementById('goalIcon').textContent      = goalIcon;
    document.getElementById('goalLabel').textContent     = goalLabel;
    document.getElementById('bmiGoalMsg').textContent    = goalMsg;

    // Animate circle progress
    const progress = document.getElementById('bmiCircleProgress');
    const circumference = 314;
    // Map BMI 10–40 → 0%–100% of circle
    const pct = Math.min(Math.max((bmi - 10) / 30, 0), 1);
    const offset = circumference - (pct * circumference);
    progress.style.strokeDashoffset = offset;
    progress.style.stroke = catColor;

    // Move scale pin
    // Scale: BMI 16–40 mapped to 0%–100% of track width
    const pinPct = Math.min(Math.max((bmi - 16) / 24, 0), 1) * 100;
    document.getElementById('bmiScalePin').style.left = pinPct + '%';

    // Show result, hide form
    formCard.style.display = 'none';
    resultCard.classList.add('visible');

    // Scroll result into view
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Wire up "Get My Free Plan" WhatsApp button
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

  // Reset / Recalculate
  resetBtn.addEventListener('click', () => {
    resultCard.classList.remove('visible');
    formCard.style.display = '';
    document.getElementById('bmiAge').value    = '';
    document.getElementById('bmiHeight').value = '';
    document.getElementById('bmiWeight').value = '';
  });
}


})();