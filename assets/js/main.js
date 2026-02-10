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

})();