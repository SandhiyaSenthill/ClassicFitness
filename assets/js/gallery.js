// ====== Gallery Page JavaScript ======

(function galleryInit() {
    // Set year in footer
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // WhatsApp links setup
    const phone = "8668007901";
    const message = encodeURIComponent(
      "Hello Classic Fitness Gym, I want to enquire about membership and timings."
    );
    const waUrl = `https://wa.me/91${phone}?text=${message}`;
  
    ["waBtn", "waFloat"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.href = waUrl;
    });
  
    // Gallery Filtering
    const filterTabs = document.querySelectorAll(".filter-tab");
    const galleryCards = document.querySelectorAll(".gallery-card");
  
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        filterTabs.forEach((t) => t.classList.remove("active"));
        
        // Add active class to clicked tab
        tab.classList.add("active");
  
        // Get filter value
        const filter = tab.getAttribute("data-filter");
  
        // Filter gallery cards
        galleryCards.forEach((card) => {
          const category = card.getAttribute("data-category");
  
          if (filter === "all" || category === filter) {
            card.classList.remove("hidden");
            // Add fade-in animation
            card.style.animation = "fadeIn 0.6s ease";
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  
    // Load More functionality
    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        // This is a placeholder - in a real site, you'd load more images via AJAX
        alert("Load more functionality coming soon! Add more photos to your gallery.");
      });
    }
  
    // Mobile nav toggle
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
  
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("show");
      });
  
      // Close menu when clicking a link
      navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          navLinks.classList.remove("show");
        }
      });
  
      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!navLinks.classList.contains("show")) return;
        const clickedInside = navLinks.contains(e.target) || navToggle.contains(e.target);
        if (!clickedInside) {
          navLinks.classList.remove("show");
        }
      });
    }
  
    // Lazy loading for images (performance optimization)
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");
            if (src) {
              img.setAttribute("src", src);
              img.removeAttribute("data-src");
            }
            observer.unobserve(img);
          }
        });
      });
  
      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  
    // Video controls
    const videoCards = document.querySelectorAll(".video-card");
    videoCards.forEach((card) => {
      const video = card.querySelector("video");
      const videoIcon = card.querySelector(".video-icon");
  
      if (video && videoIcon) {
        card.addEventListener("click", (e) => {
          if (e.target.tagName !== "VIDEO") {
            if (video.paused) {
              video.play();
              videoIcon.style.opacity = "0";
            } else {
              video.pause();
              videoIcon.style.opacity = "1";
            }
          }
        });
  
        video.addEventListener("play", () => {
          videoIcon.style.opacity = "0";
        });
  
        video.addEventListener("pause", () => {
          videoIcon.style.opacity = "1";
        });
      }
    });
  })();