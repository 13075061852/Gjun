/* ============================================
   广俊新材料 - 应用脚本
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // Navigation
  // ============================================
  function initNav() {
    const nav = document.getElementById('nav');
    const ctaSection = document.getElementById('cta');
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
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Switch nav theme when the final CTA screen is active.
    function setCtaNavTheme(isOnCta) {
      nav?.classList.toggle('nav-on-cta', Boolean(isOnCta));
    }

    if (ctaSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setCtaNavTheme(entry.isIntersecting && entry.intersectionRatio > 0.45);
        });
      }, {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-72px 0px -20% 0px'
      });

      observer.observe(ctaSection);
    } else if (ctaSection) {
      const fallbackSyncTheme = () => {
        const rect = ctaSection.getBoundingClientRect();
        const visible = rect.top <= 72 && rect.bottom > window.innerHeight * 0.45;
        setCtaNavTheme(visible);
      };

      window.addEventListener('scroll', fallbackSyncTheme, { passive: true });
      fallbackSyncTheme();
    }

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
  }

  // ============================================
  // Smooth Scroll (uses fullpage animation if available)
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') {
          e.preventDefault();
          return;
        }

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
      '.section-header, .product-card, .case-card, .news-card, '
      + '.cert-card-item, .application-card, .about-capability, .about-process, '
      + '.tech-equipment-item, .contact-method'
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
    const stats = document.querySelectorAll('.tech-stat-value');

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

    dots.forEach((dot) => {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(dot.getAttribute('href'));
        if (!target || !window.fullpageScrollTo || !window.fullpageGetPages) return;

        const pageIndex = window.fullpageGetPages().indexOf(target);
        if (pageIndex >= 0) window.fullpageScrollTo(pageIndex);
      });
    });

    // Initial active state
    if (dots[0]) dots[0].classList.add('active');
  }

  // ============================================
  // Full-Page Scroll with Smooth Easing Animation
  // ============================================

  function clearFullPageApi() {
    delete window.fullpageScrollTo;
    delete window.fullpageGetPageIndex;
    delete window.fullpageGetPages;
  }

  // ============================================
  // AMap (Gaode) Company Location
  // ============================================
  function loadAmapScript(key) {
    if (window.AMap) return Promise.resolve(window.AMap);

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`;
      script.async = true;
      script.onload = () => resolve(window.AMap);
      script.onerror = () => reject(new Error('Failed to load AMap script.'));
      document.head.appendChild(script);
    });
  }

  function initAmap() {
    const mapContainer = document.getElementById('amapContainer');
    if (!mapContainer) return;

    const amapKey = 'cb678c3199d62cf74118060f5be7ac38';
    const companyName = '广俊新材料科技有限公司';
    const companyAddress = '浙江省宁波市慈溪市(横河)万洋众创城A区-北门28栋1-3';
    const exactLngLat = [121.279998, 30.138057];

    loadAmapScript(amapKey)
      .then((AMap) => {
        const map = new AMap.Map('amapContainer', {
          zoom: 15,
          center: exactLngLat,
          resizeEnable: true
        });

        const marker = new AMap.Marker({
          position: exactLngLat,
          title: companyName
        });
        map.add(marker);

        const infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -24),
          content: `<div style="padding:6px 8px;line-height:1.5;"><strong>${companyName}</strong><br>${companyAddress}</div>`
        });

        marker.on('click', () => infoWindow.open(map, marker.getPosition()));
        infoWindow.open(map, exactLngLat);
      })
      .catch(() => {
        mapContainer.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:14px;">地图加载失败，请刷新页面重试。</div>';
      });
  }

  function createFullPageScroll() {
    const pages = [];
    let currentPage = 0;
    let isAnimating = false;
    let wheelDelta = 0;
    let lastWheelAt = 0;
    const wheelThreshold = 70;

    // Collect all full-screen sections in order
    document.querySelectorAll('.hero, .section, .cta-section').forEach((el, index) => {
      pages.push(el);
      el.dataset.pageIndex = index;
    });

    if (pages.length === 0) return null;

    function syncPageOverflowMode() {
      const viewportHeight = window.innerHeight;
      pages.forEach((page) => {
        const isOverflowing = page.scrollHeight > viewportHeight + 4;
        if (isOverflowing) {
          page.style.overflowY = 'auto';
          page.style.overscrollBehavior = 'contain';
          page.style.webkitOverflowScrolling = 'touch';
        } else {
          page.style.overflowY = '';
          page.style.overscrollBehavior = '';
          page.style.webkitOverflowScrolling = '';
          page.scrollTop = 0;
        }
      });
    }

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

    function scrollToPage(targetIndex, duration = 760) {
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

    // Mouse wheel handler with immediate interception to avoid native scroll jitter.
    function handleWheel(e) {
      if (e.ctrlKey) return;
      if (isAnimating) return;

      const activePage = pages[currentPage];
      if (activePage) {
        const canScrollDown = activePage.scrollTop + activePage.clientHeight < activePage.scrollHeight - 1;
        const canScrollUp = activePage.scrollTop > 0;
        const goingDown = e.deltaY > 0;
        const goingUp = e.deltaY < 0;

        // If the current section has its own scroll space, let it consume wheel first.
        if ((goingDown && canScrollDown) || (goingUp && canScrollUp)) {
          return;
        }
      }

      e.preventDefault();

      const now = performance.now();
      if (now - lastWheelAt > 180) wheelDelta = 0;
      lastWheelAt = now;

      wheelDelta += e.deltaY;
      if (Math.abs(wheelDelta) < wheelThreshold) return;

      if (wheelDelta > 0) goToNext();
      else goToPrev();

      wheelDelta = 0;
    }

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
    }

    // Touch swipe is intentionally disabled for fullpage mode.
    // This keeps tablet/phone behavior as natural scrolling.

    // Update initial page from scroll position on load
    syncPageOverflowMode();
    currentPage = getPageIndexFromScroll();
    window.scrollTo(0, pages[currentPage].offsetTop);

    // Event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeydown);

    // Expose scrollToPage for other components (side nav, anchor links)
    window.fullpageScrollTo = scrollToPage;
    window.fullpageGetPageIndex = () => currentPage;
    window.fullpageGetPages = () => pages;
    window.fullpageSyncOverflow = syncPageOverflowMode;

    return function destroy() {
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
      pages.forEach((page) => {
        page.style.overflowY = '';
        page.style.overscrollBehavior = '';
        page.style.webkitOverflowScrolling = '';
        page.scrollTop = 0;
      });
      clearFullPageApi();
    };
  }

  function initFullPageScroll() {
    // Desktop only: large viewport + precise pointer + hover support.
    // Tablets/phones (touch-first devices) always use native scrolling.
    const desktopQuery = window.matchMedia('(min-width: 1200px) and (hover: hover) and (pointer: fine)');
    let destroyFullPage = null;
    let resizeTicking = false;

    function syncMode() {
      if (desktopQuery.matches) {
        if (!destroyFullPage) {
          destroyFullPage = createFullPageScroll();
        } else if (window.fullpageSyncOverflow) {
          window.fullpageSyncOverflow();
        }
      } else if (destroyFullPage) {
        destroyFullPage();
        destroyFullPage = null;
      } else {
        clearFullPageApi();
      }
    }

    function handleResize() {
      if (resizeTicking) return;
      resizeTicking = true;
      requestAnimationFrame(() => {
        syncMode();
        resizeTicking = false;
      });
    }

    syncMode();
    window.addEventListener('resize', handleResize, { passive: true });

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', syncMode);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(syncMode);
    }
  }

  // Side Nav dot updater (used by fullpage scroll)
  function updateSideNavDots(pageIndex) {
    const sideNav = document.getElementById('sideNav');
    const pages = window.fullpageGetPages ? window.fullpageGetPages() : [];
    const activeId = pages[pageIndex]?.id;

    if (sideNav) {
      const dots = sideNav.querySelectorAll('.side-nav-dot');
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[pageIndex]) dots[pageIndex].classList.add('active');
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
      const targetId = link.getAttribute('href')?.slice(1);
      link.classList.toggle('active', Boolean(activeId && targetId === activeId));
    });
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
    initAmap();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
