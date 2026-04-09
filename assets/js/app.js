<<<<<<< HEAD
/* ============================================
   广俊新材料 - 应用脚本
   ============================================ */

(function() {
  'use strict';
=======
(function () {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function runWhenPageIsIdle(callback) {
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(callback, { timeout: 1500 });
      } else {
        window.setTimeout(callback, 300);
      }
    };

    if (document.readyState === "complete") {
      schedule();
      return;
    }

    window.addEventListener("load", schedule, { once: true });
  }

  function initThemeToggle() {
    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const saved = localStorage.getItem("theme");
    if (saved === "light") html.setAttribute("data-theme", "light");

    toggle.addEventListener("click", () => {
      const isLight = html.getAttribute("data-theme") === "light";
      if (isLight) {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
      } else {
        html.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });
  }

  function initParticles() {
    if (reducedMotionQuery.matches || window.innerWidth < 1024) return;

    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const baseColor = isLight ? "0, 180, 140" : "0, 212, 170";
        ctx.fillStyle = `rgba(${baseColor}, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    let rafId = null;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const lineBase = isLight ? "0, 180, 140" : "0, 212, 170";
      const lineOpacity = isLight ? 0.02 : 0.03;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineBase}, ${lineOpacity * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });

    rafId = requestAnimationFrame(animate);
  }
>>>>>>> a1ab6637f98de689bf114f71fd7d9a6cb10f08d6

  // ============================================
  // Navigation
  // ============================================
  function initNav() {
<<<<<<< HEAD
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileLinks = mobileMenu?.querySelectorAll('a');

    // Scroll effect
    function handleScroll() {
      if (window.scrollY > 50) {
        nav?.classList.add('scrolled');
      } else {
        nav?.classList.remove('scrolled');
      }
=======
    const nav = document.getElementById("nav");
    if (nav) {
      window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);
      }, { passive: true });
>>>>>>> a1ab6637f98de689bf114f71fd7d9a6cb10f08d6
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu toggle
    function openMenu() {
      navToggle?.classList.add('active');
      mobileMenu?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navToggle?.classList.remove('active');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    }

    navToggle?.addEventListener('click', () => {
      if (mobileMenu?.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenuClose?.addEventListener('click', closeMenu);

    // Close menu when clicking backdrop
    mobileMenu?.addEventListener('click', (e) => {
      if (e.target === mobileMenu || e.target.classList.contains('mobile-menu-backdrop')) {
        closeMenu();
      }
    });

    // Close menu when clicking links
    mobileLinks?.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
        closeMenu();
      }
    });
<<<<<<< HEAD
=======

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && navOpen) closeNav();
    }, { passive: true });

    return {
      isOpen: () => navOpen,
      close: closeNav
    };
>>>>>>> a1ab6637f98de689bf114f71fd7d9a6cb10f08d6
  }

  // ============================================
  // Smooth Scroll (uses fullpage animation if available)
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        e.preventDefault();

        // Use fullpage scroll if available
        if (window.fullpageScrollTo && window.fullpageGetPages) {
          const pages = window.fullpageGetPages();
          const idx = pages.indexOf(targetElement);
          if (idx >= 0) {
            window.fullpageScrollTo(idx);
            return;
          }
        }

        // Fallback: standard smooth scroll
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });
  }

  // ============================================
  // Scroll Reveal Animation
  // ============================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.section-header, .product-card, .case-card, .news-card, .cert-item, .application-card, .about-feature, .tech-equipment-item, .contact-method'
    );

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ============================================
  // Stats Counter Animation
  // ============================================
  function initStatsCounter() {
    const stats = document.querySelectorAll('.hero-stat-value, .tech-stat-value');

    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent || '';
          const numMatch = text.match(/[\d,]+/);

          if (numMatch) {
            const targetNum = parseInt(numMatch[0].replace(/,/g, ''));
            const suffix = text.replace(numMatch[0], '');
            animateNumber(el, targetNum, suffix);
          }

          observer.unobserve(el);
        }
      });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
  }

  function animateNumber(el, target, suffix) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeProgress);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // Form Handling
  // ============================================
  function initForms() {
    const contactForm = document.getElementById('contactForm');

    contactForm?.addEventListener('submit', function(e) {
      e.preventDefault();

      // Show success message
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = '提交成功！';
      btn.disabled = true;
      btn.style.backgroundColor = '#16a34a';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '';
        this.reset();
      }, 3000);
    });
  }

  // ============================================
  // Side Navigation (Full-screen sections)
  // ============================================
  function initSideNav() {
    const sideNav = document.getElementById('sideNav');
    if (!sideNav) return;

    const dots = sideNav.querySelectorAll('.side-nav-dot');

    dots.forEach((dot, index) => {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.fullpageScrollTo) {
          window.fullpageScrollTo(index);
        }
      });
    });

    // Initial active state
    if (dots[0]) dots[0].classList.add('active');
  }

  // ============================================
  // Full-Page Scroll with Smooth Easing Animation
  // ============================================

  function initFullPageScroll() {
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) return;

    const pages = [];
    let currentPage = 0;
    let isAnimating = false;
    let touchStartY = 0;
    let scrollTimeout = null;

    // Collect all full-screen sections in order
    document.querySelectorAll('.hero, .section, .cta-section').forEach((el, index) => {
      pages.push(el);
      el.dataset.pageIndex = index;
    });

    if (pages.length === 0) return;

    function getPageIndexFromScroll() {
      const scrollY = window.scrollY;
      const halfViewport = window.innerHeight / 2;

      for (let i = 0; i < pages.length; i++) {
        const top = pages[i].offsetTop;
        if (scrollY < top + halfViewport) return i;
      }
      return pages.length - 1;
    }

    // Easing: ease-in-out cubic for natural deceleration feel
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function scrollToPage(targetIndex, duration = 900) {
      if (isAnimating || targetIndex < 0 || targetIndex >= pages.length) return;
      if (targetIndex === currentPage && Math.abs(window.scrollY - pages[currentPage].offsetTop) < 5) return;

      isAnimating = true;
      currentPage = targetIndex;
      const startY = window.scrollY;
      const targetY = pages[targetIndex].offsetTop;
      const distance = targetY - startY;
      const startTime = performance.now();

      function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          // Ensure exact position
          window.scrollTo(0, targetY);
          isAnimating = false;
        }
      }

      requestAnimationFrame(animateScroll);

      // Update side nav dots
      updateSideNavDots(targetIndex);
    }

    function goToNext() {
      scrollToPage(currentPage + 1);
    }

    function goToPrev() {
      scrollToPage(currentPage - 1);
    }

    // Mouse wheel handler with debouncing
    function handleWheel(e) {
      if (isAnimating) { e.preventDefault(); return; }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const delta = e.deltaY;
        if (delta > 0) {
          e.preventDefault();
          goToNext();
        } else if (delta < 0) {
          e.preventDefault();
          goToPrev();
        }
      }, 50); // small debounce to prevent rapid fire
    }

    // Touch handlers for trackpad/mobile
    function handleTouchStart(e) {
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
      if (isAnimating) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) > 60) { // threshold
        if (diff > 0) goToNext();
        else goToPrev();
      }
    }

<<<<<<< HEAD
    // Keyboard navigation
    function handleKeydown(e) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToPage(pages.length - 1);
      }
=======
    window.addEventListener("resize", init, { passive: true });
    window.addEventListener("load", init, { once: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
>>>>>>> a1ab6637f98de689bf114f71fd7d9a6cb10f08d6
    }

    // Update initial page from scroll position on load
    currentPage = getPageIndexFromScroll();
    window.scrollTo(0, pages[currentPage].offsetTop);

    // Event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeydown);

    // Expose scrollToPage for other components (side nav, anchor links)
    window.fullpageScrollTo = scrollToPage;
    window.fullpageGetPageIndex = () => currentPage;
    window.fullpageGetPages = () => pages;
  }

  // Side Nav dot updater (used by fullpage scroll)
  function updateSideNavDots(pageIndex) {
    const sideNav = document.getElementById('sideNav');
    if (!sideNav) return;
    const dots = sideNav.querySelectorAll('.side-nav-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[pageIndex]) dots[pageIndex].classList.add('active');
  }

  // ============================================
  // Initialize
  // ============================================
  function init() {
    initNav();
    initSmoothScroll();
    initFullPageScroll();
    initScrollReveal();
    initStatsCounter();
    initSideNav();
    initForms();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
<<<<<<< HEAD
=======

  initThemeToggle();
  runWhenPageIsIdle(initParticles);
  const nav = initNav();
  initReveal();
  initCounters();
  initSmoothScroll(() => {
    if (nav.isOpen()) nav.close();
  });
  initScrollTopButton();
  initCertMarquee();
>>>>>>> a1ab6637f98de689bf114f71fd7d9a6cb10f08d6
})();
