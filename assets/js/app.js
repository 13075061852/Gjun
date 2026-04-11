/* ============================================
   广俊新材料 - 应用脚本
   ============================================ */

(function() {
  'use strict';

  // Always start from top on refresh/reopen.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('pageshow', () => {
    window.scrollTo(0, 0);
  });

  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 0);
  });

  // ============================================
  // Navigation
  // ============================================
  function initNav() {
    const nav = document.getElementById('nav');
    const heroSection = document.getElementById('hero');
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

    // Switch nav theme when hero or final CTA screen is active.
    function setDarkNavTheme(isOnDarkSection) {
      nav?.classList.toggle('nav-on-cta', Boolean(isOnDarkSection));
    }

    const darkSections = [heroSection, ctaSection].filter(Boolean);

    if (darkSections.length > 0 && 'IntersectionObserver' in window) {
      const activeDarkSections = new Set();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const isActive = entry.isIntersecting && entry.intersectionRatio > 0.45;
          if (isActive) activeDarkSections.add(entry.target.id);
          else activeDarkSections.delete(entry.target.id);
        });

        setDarkNavTheme(activeDarkSections.size > 0);
      }, {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-72px 0px -20% 0px'
      });

      darkSections.forEach((section) => observer.observe(section));
    } else if (darkSections.length > 0) {
      const fallbackSyncTheme = () => {
        const viewportGate = window.innerHeight * 0.45;
        const visible = darkSections.some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= 72 && rect.bottom > viewportGate;
        });
        setDarkNavTheme(visible);
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
  // News Tabs Filter
  // ============================================
  function initNewsTabs() {
    const newsSection = document.getElementById('news');
    if (!newsSection) return;

    const tabs = Array.from(newsSection.querySelectorAll('.news-tag[data-news-filter]'));
    const listCards = Array.from(newsSection.querySelectorAll('.news-list-card[data-news-category]'));
    if (tabs.length === 0 || listCards.length === 0) return;

    function applyFilter(filter) {
      tabs.forEach((tab) => {
        const active = tab.dataset.newsFilter === filter;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      listCards.forEach((card) => {
        const category = card.dataset.newsCategory;
        const visible = filter === '全部' || category === filter;
        card.hidden = !visible;
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        applyFilter(tab.dataset.newsFilter || '全部');
      });
    });

    const initialActive = tabs.find((tab) => tab.classList.contains('active'))?.dataset.newsFilter || '全部';
    applyFilter(initialActive);
  }

  // ============================================
  // Product Detail Overlay
  // ============================================
  function initProductDetails() {
    const page = document.getElementById('productDetailPage');
    const nav = document.getElementById('productDetailNav');
    const content = document.getElementById('productDetailContent');
    const headerTitle = document.getElementById('productDetailHeaderTitle');
    const backBtn = document.getElementById('productDetailBack');
    const cards = Array.from(document.querySelectorAll('.product-card'));
    if (!page || !nav || !content || !headerTitle || cards.length === 0) return;

    const categoryData = {
      pbt: {
        categoryName: '改性PBT工程塑料',
        products: [
          { name: 'PBT-GF30 V0', intro: '适配连接器与线圈骨架，兼顾阻燃与尺寸稳定。', props: [['密度', '1.55 g/cm3'], ['拉伸强度', '125 MPa'], ['弯曲模量', '7800 MPa'], ['热变形温度', '210 C'], ['阻燃等级', 'UL94 V0']], grades: ['GJ-PBT-GF30-V0', 'GJ-PBT-GF30-HF'] },
          { name: 'PBT-GF20 HI', intro: '高冲击等级，适合结构件与卡扣部位。', props: [['密度', '1.46 g/cm3'], ['拉伸强度', '98 MPa'], ['弯曲模量', '6200 MPa'], ['热变形温度', '195 C'], ['阻燃等级', 'UL94 V1']], grades: ['GJ-PBT-GF20-HI', 'GJ-PBT-GF20-FR'] },
          { name: 'PBT-FR15', intro: '无卤阻燃方案，平衡电性能与加工流动性。', props: [['密度', '1.50 g/cm3'], ['拉伸强度', '92 MPa'], ['弯曲模量', '5600 MPa'], ['热变形温度', '188 C'], ['阻燃等级', 'UL94 V0']], grades: ['GJ-PBT-FR15', 'GJ-PBT-FR15-LO'] }
        ]
      },
      pa66: { categoryName: '改性PA66', products: [{ name: 'PA66-GF30', intro: '高刚性结构件常用配方。', props: [['密度', '1.35 g/cm3'], ['拉伸强度', '152 MPa'], ['弯曲模量', '8200 MPa'], ['热变形温度', '235 C'], ['阻燃等级', 'UL94 HB']], grades: ['GJ-PA66-GF30', 'GJ-PA66-GF30-HS'] }, { name: 'PA66-GF45 FR', intro: '高玻纤阻燃，适合高温电器件。', props: [['密度', '1.42 g/cm3'], ['拉伸强度', '178 MPa'], ['弯曲模量', '9800 MPa'], ['热变形温度', '245 C'], ['阻燃等级', 'UL94 V0']], grades: ['GJ-PA66-GF45-FR', 'GJ-PA66-GF45-FR-H'] }, { name: 'PA66-HS', intro: '耐水解版本，适合潮湿环境。', props: [['密度', '1.30 g/cm3'], ['拉伸强度', '128 MPa'], ['弯曲模量', '7100 MPa'], ['热变形温度', '225 C'], ['阻燃等级', 'UL94 HB']], grades: ['GJ-PA66-HS', 'GJ-PA66-HS-UV'] }] },
      pp: { categoryName: '改性PP', products: [{ name: 'PP-T20', intro: '滑石填充，平衡刚性与成本。', props: [['密度', '1.05 g/cm3'], ['拉伸强度', '34 MPa'], ['弯曲模量', '1900 MPa'], ['缺口冲击', '9 kJ/m2'], ['阻燃等级', 'HB']], grades: ['GJ-PP-T20', 'GJ-PP-T20-UV'] }, { name: 'PP-HI', intro: '高冲击等级，适配外壳件。', props: [['密度', '0.98 g/cm3'], ['拉伸强度', '28 MPa'], ['弯曲模量', '1450 MPa'], ['缺口冲击', '28 kJ/m2'], ['阻燃等级', 'HB']], grades: ['GJ-PP-HI', 'GJ-PP-HI-MD'] }, { name: 'PP-FR', intro: '阻燃配方，适合电器结构件。', props: [['密度', '1.10 g/cm3'], ['拉伸强度', '32 MPa'], ['弯曲模量', '2100 MPa'], ['缺口冲击', '12 kJ/m2'], ['阻燃等级', 'V2']], grades: ['GJ-PP-FR', 'GJ-PP-FR-LO'] }] },
      pcabs: { categoryName: 'PC/ABS合金', products: [{ name: 'PCABS-HI', intro: '高冲击合金，车载内饰常用。', props: [['密度', '1.12 g/cm3'], ['拉伸强度', '58 MPa'], ['弯曲模量', '2400 MPa'], ['热变形温度', '105 C'], ['阻燃等级', 'HB']], grades: ['GJ-PCABS-HI', 'GJ-PCABS-HI-UV'] }, { name: 'PCABS-FR', intro: '阻燃外壳配方，适合3C产品。', props: [['密度', '1.18 g/cm3'], ['拉伸强度', '62 MPa'], ['弯曲模量', '2700 MPa'], ['热变形温度', '112 C'], ['阻燃等级', 'V0']], grades: ['GJ-PCABS-FR', 'GJ-PCABS-FR-5VA'] }, { name: 'PCABS-UV', intro: '耐候版本，适合户外可见件。', props: [['密度', '1.14 g/cm3'], ['拉伸强度', '56 MPa'], ['弯曲模量', '2350 MPa'], ['热变形温度', '103 C'], ['阻燃等级', 'HB']], grades: ['GJ-PCABS-UV', 'GJ-PCABS-UV-M'] }] },
      pom: { categoryName: '改性POM', products: [{ name: 'POM-WR', intro: '耐磨等级，适合齿轮和滑轨。', props: [['密度', '1.41 g/cm3'], ['拉伸强度', '72 MPa'], ['弯曲模量', '3000 MPa'], ['摩擦系数', '0.22'], ['长期耐温', '105 C']], grades: ['GJ-POM-WR', 'GJ-POM-WR-LF'] }, { name: 'POM-GF20', intro: '增强型，提升刚性与尺寸稳定。', props: [['密度', '1.47 g/cm3'], ['拉伸强度', '92 MPa'], ['弯曲模量', '4300 MPa'], ['摩擦系数', '0.28'], ['长期耐温', '110 C']], grades: ['GJ-POM-GF20', 'GJ-POM-GF20-H'] }, { name: 'POM-LF', intro: '低摩擦方案，适配静音传动件。', props: [['密度', '1.39 g/cm3'], ['拉伸强度', '68 MPa'], ['弯曲模量', '2850 MPa'], ['摩擦系数', '0.18'], ['长期耐温', '100 C']], grades: ['GJ-POM-LF', 'GJ-POM-LF-W'] }] },
      pa6: { categoryName: '改性PA6', products: [{ name: 'PA6-GF30', intro: '结构增强，适合支架与连接件。', props: [['密度', '1.32 g/cm3'], ['拉伸强度', '138 MPa'], ['弯曲模量', '7600 MPa'], ['热变形温度', '205 C'], ['吸水率', '1.2 %']], grades: ['GJ-PA6-GF30', 'GJ-PA6-GF30-UV'] }, { name: 'PA6-HI', intro: '高韧性方案，抗冲击更稳定。', props: [['密度', '1.18 g/cm3'], ['拉伸强度', '88 MPa'], ['弯曲模量', '4200 MPa'], ['热变形温度', '175 C'], ['吸水率', '1.4 %']], grades: ['GJ-PA6-HI', 'GJ-PA6-HI-LT'] }, { name: 'PA6-FR', intro: '阻燃版本，适配电子电气组件。', props: [['密度', '1.27 g/cm3'], ['拉伸强度', '102 MPa'], ['弯曲模量', '5100 MPa'], ['热变形温度', '188 C'], ['阻燃等级', 'V0']], grades: ['GJ-PA6-FR', 'GJ-PA6-FR-HF'] }] },
      pet: { categoryName: '改性PET', products: [{ name: 'PET-GF30', intro: '高刚性低翘曲，适合精密件。', props: [['密度', '1.50 g/cm3'], ['拉伸强度', '122 MPa'], ['弯曲模量', '7300 MPa'], ['热变形温度', '205 C'], ['阻燃等级', 'HB']], grades: ['GJ-PET-GF30', 'GJ-PET-GF30-LO'] }, { name: 'PET-FR', intro: '阻燃绝缘配方，适合电气壳体。', props: [['密度', '1.53 g/cm3'], ['拉伸强度', '116 MPa'], ['弯曲模量', '6900 MPa'], ['热变形温度', '198 C'], ['阻燃等级', 'V0']], grades: ['GJ-PET-FR', 'GJ-PET-FR-UL'] }, { name: 'PET-LO', intro: '低翘曲版本，尺寸稳定更佳。', props: [['密度', '1.47 g/cm3'], ['拉伸强度', '108 MPa'], ['弯曲模量', '6400 MPa'], ['热变形温度', '190 C'], ['阻燃等级', 'HB']], grades: ['GJ-PET-LO', 'GJ-PET-LO-HI'] }] },
      abs: { categoryName: '改性ABS', products: [{ name: 'ABS-HG', intro: '高光外观，适合可视面板。', props: [['密度', '1.05 g/cm3'], ['拉伸强度', '46 MPa'], ['弯曲模量', '2200 MPa'], ['缺口冲击', '18 kJ/m2'], ['表面效果', '高光']], grades: ['GJ-ABS-HG', 'GJ-ABS-HG-UV'] }, { name: 'ABS-HI', intro: '高冲击级别，结构件更稳。', props: [['密度', '1.04 g/cm3'], ['拉伸强度', '43 MPa'], ['弯曲模量', '2050 MPa'], ['缺口冲击', '30 kJ/m2'], ['表面效果', '哑光/细纹']], grades: ['GJ-ABS-HI', 'GJ-ABS-HI-NT'] }, { name: 'ABS-FR', intro: '阻燃外壳方案，适合电器。', props: [['密度', '1.10 g/cm3'], ['拉伸强度', '48 MPa'], ['弯曲模量', '2400 MPa'], ['缺口冲击', '20 kJ/m2'], ['阻燃等级', 'V0']], grades: ['GJ-ABS-FR', 'GJ-ABS-FR-HF'] }] }
    };

    const detailMeta = {
      pbt: {
        heroImage: 'assets/images/product-pbt.jpg',
        heroBadge: '连接器与绝缘件',
        summary: '兼顾高绝缘、耐热与尺寸稳定性，适合电气连接器、线圈骨架和车载电器部件。',
        tags: ['阻燃等级', '尺寸稳定', '耐热'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '汽车电气件', desc: '连接器、继电器外壳、线束骨架', image: 'assets/images/app-auto.jpg' },
          { title: '电子电器部件', desc: '开关、插座、端子壳体', image: 'assets/images/app-electronics.jpg' },
          { title: '精密结构件', desc: '需要低翘曲和高尺寸稳定的零件', image: 'assets/images/about-workshop.jpg' }
        ],
        note: '更适合对电气安全和热稳定性要求较高的结构件。'
      },
      pa66: {
        heroImage: 'assets/images/product-pa66.jpg',
        heroBadge: '高强度结构件',
        summary: '高刚性、耐磨损、耐热性好，适合汽车零部件与机械结构件。',
        tags: ['高刚性', '耐磨', '耐热'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '汽车结构件', desc: '支架、卡扣、传动与连接部件', image: 'assets/images/case-auto.jpg' },
          { title: '工业机械件', desc: '齿轮、壳体、支撑件', image: 'assets/images/about-factory.jpg' },
          { title: '电气辅助件', desc: '线圈骨架、绝缘支架、接插件', image: 'assets/images/app-electronics.jpg' }
        ],
        note: '适合长期受力和中高温环境下工作的零部件。'
      },
      pp: {
        heroImage: 'assets/images/product-pp.jpg',
        heroBadge: '轻量化外壳',
        summary: '轻量化、低成本、易加工，适用于家电外壳、日用品和薄壁制件。',
        tags: ['轻量化', '低成本', '易加工'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '家电外壳', desc: '微波炉、洗衣机、厨房电器外壳', image: 'assets/images/app-homeappliance.jpg' },
          { title: '日用消费品', desc: '收纳件、容器、功能型外壳', image: 'assets/images/case-energy.jpg' },
          { title: '薄壁制品', desc: '需要快速成型与成本控制的零件', image: 'assets/images/app-energy.jpg' }
        ],
        note: '适合追求重量、成本与加工效率平衡的场景。'
      },
      pcabs: {
        heroImage: 'assets/images/product-pcabs.jpg',
        heroBadge: '消费电子外壳',
        summary: '兼具 PC 强度和 ABS 成型性，适用于电子产品外壳和高冲击部件。',
        tags: ['高冲击', '外观好', '易成型'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '消费电子', desc: '显示器外壳、设备面板、前壳', image: 'assets/images/app-electronics.jpg' },
          { title: '家电面板', desc: '控制面板、装饰件、视窗件', image: 'assets/images/app-homeappliance.jpg' },
          { title: '高强度外壳', desc: '需要兼顾强度和外观的壳体', image: 'assets/images/case-electronics.jpg' }
        ],
        note: '适合外观要求较高，同时需要抗冲击的产品。'
      },
      pom: {
        heroImage: 'assets/images/product-pom.jpg',
        heroBadge: '耐磨传动件',
        summary: '低摩擦、耐磨和尺寸稳定，适合齿轮、滑块和精密传动机构。',
        tags: ['低摩擦', '耐磨', '精密传动'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '齿轮机构', desc: '微型齿轮、传动轮、滑块', image: 'assets/images/tech-rd.jpg' },
          { title: '汽车运动部件', desc: '扣件、卡扣、运动结构件', image: 'assets/images/case-auto.jpg' },
          { title: '精密装配件', desc: '对摩擦和尺寸稳定有要求的零件', image: 'assets/images/about-workshop.jpg' }
        ],
        note: '适合需要稳定摩擦系数和长寿命的运动部件。'
      },
      pa6: {
        heroImage: 'assets/images/app-auto.jpg',
        heroBadge: '韧性与耐热平衡',
        summary: '兼具韧性、耐热与加工稳定性，适合汽车结构件、连接件和工业部件。',
        tags: ['韧性好', '耐热', '加工稳定'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '汽车结构件', desc: '支架、导向件、承载件', image: 'assets/images/case-auto.jpg' },
          { title: '连接与固定件', desc: '卡扣、固定座、连接支架', image: 'assets/images/app-auto.jpg' },
          { title: '工业耐热件', desc: '需要韧性和耐热性的工作零件', image: 'assets/images/about-factory.jpg' }
        ],
        note: '更适合需要强度、韧性和耐热综合表现的工况。'
      },
      pet: {
        heroImage: 'assets/images/app-electronics.jpg',
        heroBadge: '绝缘与稳定性',
        summary: '尺寸稳定、绝缘性能好，适合电子电气部件、线圈骨架和精密壳体。',
        tags: ['尺寸稳定', '绝缘', '低翘曲'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '电子电气部件', desc: '线圈骨架、端子座、绝缘支撑件', image: 'assets/images/app-electronics.jpg' },
          { title: '精密壳体', desc: '对尺寸和外观稳定性要求高的外壳', image: 'assets/images/case-electronics.jpg' },
          { title: '功能性结构件', desc: '需要稳定加工窗口的薄壁零件', image: 'assets/images/app-energy.jpg' }
        ],
        note: '适合对绝缘、尺寸稳定与加工精度要求较高的场景。'
      },
      abs: {
        heroImage: 'assets/images/app-homeappliance.jpg',
        heroBadge: '外观型壳体',
        summary: '外观性好、冲击韧性高，适合家电外壳、消费电子和可视面板。',
        tags: ['外观好', '高冲击', '易喷涂'],
        applicationTitle: '典型应用领域',
        applications: [
          { title: '家电外壳', desc: '小家电、面板、装饰壳体', image: 'assets/images/app-homeappliance.jpg' },
          { title: '消费电子', desc: '可视面板、手持设备壳体', image: 'assets/images/app-electronics.jpg' },
          { title: '展示与装饰件', desc: '对表面效果要求更高的部件', image: 'assets/images/case-electronics.jpg' }
        ],
        note: '适合兼顾外观、冲击与加工性的终端产品。'
      }
    };

    const categoryKeys = Object.keys(categoryData);
    let activeCategoryKey = categoryKeys[0];
    let activeProductIndex = 0;
    let lastFocusedElement = null;

    page.setAttribute('role', 'dialog');
    page.setAttribute('aria-modal', 'true');
    page.setAttribute('aria-labelledby', 'productDetailHeaderTitle');

    function getCurrentState() {
      const current = categoryData[activeCategoryKey];
      const meta = detailMeta[activeCategoryKey] || detailMeta[categoryKeys[0]];
      const item = current?.products?.[activeProductIndex];
      return { current, meta, item };
    }

    function getTestMethod(label) {
      const methodMap = {
        '密度': 'ISO 1183-1',
        '拉伸强度': 'ISO 527-1 / ISO 527-2',
        '弯曲模量': 'ISO 178',
        '热变形温度': 'ISO 75-2',
        '阻燃等级': 'UL 94',
        '缺口冲击': 'ISO 180',
        '摩擦系数': 'ASTM D1894',
        '长期耐温': 'UL 746B (RTI)',
        '吸水率': 'ISO 62',
        '表面效果': '目视评估'
      };

      return methodMap[label] || '按项目评估';
    }

    function getNavCopy(item) {
      const intro = (item?.intro || '').trim();
      const parts = intro.split(/[，,。]/).map((part) => part.trim()).filter(Boolean);
      const focus = parts[0] || item?.name || '重点性能';
      const support = parts.slice(1).join('，') || '查看该等级的典型性能、适配方向与测试参考。';
      return { focus, support };
    }

    function renderNav() {
      const { current } = getCurrentState();
      if (!current) return;

      nav.innerHTML = current.products.map((item, idx) => {
        const active = idx === activeProductIndex ? ' active' : '';
        const { focus, support } = getNavCopy(item);
        return `
          <button
            type="button"
            class="product-detail-nav-item${active}"
            data-product-index="${idx}"
            aria-pressed="${idx === activeProductIndex ? 'true' : 'false'}"
          >
            <span class="product-detail-nav-accent" aria-hidden="true"></span>
            <span class="product-detail-nav-head">
              <span class="product-detail-nav-name">${item.name}</span>
              ${idx === activeProductIndex ? '<span class="product-detail-nav-state">当前</span>' : ''}
            </span>
            <strong class="product-detail-nav-focus">${focus}</strong>
            <small>${support}</small>
          </button>
        `;
      }).join('');
    }

    function renderContent() {
      const { current, meta, item } = getCurrentState();
      if (!current || !item || !meta) return;

      const propRows = item.props.map(([k, v]) => `
        <tr>
          <th>${k}</th>
          <td class="product-props-value">${v}</td>
          <td class="product-props-method">${getTestMethod(k)}</td>
        </tr>
      `).join('');
      const tagMarkup = (meta.tags || []).map((tag) => `
        <span class="product-detail-pill">${tag}</span>
      `).join('');
      const applicationMarkup = (meta.applications || []).map((app, idx) => `
        <article class="product-application-card">
          <div class="product-application-image">
            <img src="${app.image}" alt="${app.title}">
          </div>
          <div class="product-application-body">
            <div class="product-application-meta">
              <span class="product-application-index">0${idx + 1}</span>
              <span class="product-application-tag">${current.categoryName}</span>
            </div>
            <h4>${app.title}</h4>
            <p>${app.desc}</p>
          </div>
        </article>
      `).join('');

      headerTitle.textContent = `${current.categoryName} · 产品详情`;

      content.innerHTML = `
        <section class="product-detail-overview">
          <article class="product-detail-card product-detail-card--overview">
            <div class="product-detail-card-head">
              <p class="product-detail-kicker">${current.categoryName}</p>
              <h2>${item.name}</h2>
              <p class="product-detail-summary">${meta.summary || item.intro}</p>
              <div class="product-detail-pill-row">${tagMarkup}</div>
              <div class="product-detail-highlight-grid">
                <div class="product-detail-highlight product-detail-highlight--accent">
                  <span>核心卖点</span>
                  <strong>${item.intro}</strong>
                </div>
                <div class="product-detail-highlight">
                  <span>重点提醒</span>
                  <strong>${meta.note || '可结合结构部位、耐热等级和外观要求进一步选型。'}</strong>
                </div>
              </div>
            </div>
            <table class="product-props">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>参考值</th>
                  <th>测试方法</th>
                </tr>
              </thead>
              <tbody>${propRows}</tbody>
            </table>
            <p class="product-props-note">以上数据为典型参考值，实际方案可根据结构、阻燃、外观和加工窗口进行定制。</p>
          </article>
        </section>

        <section class="product-detail-grid product-detail-grid--single">
          <article class="product-detail-card product-detail-card--applications" id="productDetailApplications">
            <div class="product-detail-card-head">
              <h3>${meta.applicationTitle || '应用领域'}</h3>
            </div>
            <div class="product-application-list">${applicationMarkup}</div>
          </article>
        </section>
      `;
    }

    function openDetail(categoryKey) {
      activeCategoryKey = categoryData[categoryKey] ? categoryKey : categoryKeys[0];
      activeProductIndex = 0;
      lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      renderNav();
      renderContent();
      page.classList.add('open');
      page.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      window.__productDetailOpen = true;
      requestAnimationFrame(() => backBtn?.focus());
    }

    function closeDetail() {
      page.classList.remove('open');
      page.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      window.__productDetailOpen = false;
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }

    cards.forEach((card) => {
      const trigger = card.querySelector('.product-detail-trigger[data-product]');
      const productKey = trigger?.dataset.product || card.dataset.product;
      if (!productKey) return;

      card.dataset.product = productKey;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', '查看详情');

      card.addEventListener('click', (e) => {
        e.preventDefault();
        openDetail(card.dataset.product || categoryKeys[0]);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        openDetail(card.dataset.product || categoryKeys[0]);
      });
    });

    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-detail-nav-item[data-product-index]');
      if (!btn) return;
      activeProductIndex = Number(btn.dataset.productIndex || 0);
      renderNav();
      renderContent();
    });

    backBtn?.addEventListener('click', closeDetail);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && page.classList.contains('open')) closeDetail();
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
      if (window.__productDetailOpen) return;
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
      if (window.__productDetailOpen) return;
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
    currentPage = 0;
    window.scrollTo(0, pages[0].offsetTop);
    updateSideNavDots(currentPage);

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
    initNewsTabs();
    initProductDetails();
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
