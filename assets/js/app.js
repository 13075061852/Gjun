(function () {
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
    window.addEventListener("resize", resizeCanvas);

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

      requestAnimationFrame(animate);
    }

    animate();
  }

  function initNav() {
    const nav = document.getElementById("nav");
    if (nav) {
      window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);
      });
    }

    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    const closeBtn = document.getElementById("mobileMenuClose");
    if (!toggle || !menu) {
      return {
        isOpen: () => false,
        close: () => {}
      };
    }

    let navOpen = false;

    function openNav() {
      navOpen = true;
      menu.classList.add("open");
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeNav() {
      navOpen = false;
      menu.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      navOpen ? closeNav() : openNav();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeNav);
    }

    menu.querySelectorAll("[data-menu-close]").forEach((el) => {
      el.addEventListener("click", closeNav);
    });

    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (navOpen) closeNav();
      });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navOpen) closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && navOpen) closeNav();
    });

    return {
      isOpen: () => navOpen,
      close: closeNav
    };
  }

  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  function initCounters() {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          if (!target) return;
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, 25);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));
  }

  function initSmoothScroll(onNavigate) {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        if (!href || href === "#") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (typeof onNavigate === "function") onNavigate();
      });
    });
  }

  function initScrollTopButton() {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    function updateVisibility() {
      btn.classList.toggle("visible", window.scrollY > 400);
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initCertMarquee() {
    const track = document.querySelector(".qual-certs-track");
    if (!track) return;
    const groups = track.querySelectorAll(".qual-certs-group");
    if (groups.length < 2) return;

    let pos = 0;
    let rafId = null;
    let loopDistance = 0;
    const speed = 0.45;
    const hiddenOffset = 1;
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      track.style.transform = "";
    }

    function shouldRun() {
      return mobileQuery.matches;
    }

    function measureLoopDistance() {
      const currentTransform = track.style.transform;
      track.style.transform = "translate3d(0,0,0)";
      const distance = groups[1].getBoundingClientRect().left - groups[0].getBoundingClientRect().left;
      track.style.transform = currentTransform;
      return distance;
    }

    function render() {
      track.style.transform = `translate3d(${pos}px,0,0)`;
    }

    function tick() {
      if (!shouldRun()) {
        stop();
        return;
      }
      pos -= speed;
      if (loopDistance > 0 && pos <= -(loopDistance + hiddenOffset)) {
        pos = -hiddenOffset;
      }
      render();
      rafId = requestAnimationFrame(tick);
    }

    function init() {
      if (!shouldRun()) {
        stop();
        return;
      }
      loopDistance = measureLoopDistance();
      pos = -hiddenOffset;
      render();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", init);
    window.addEventListener("load", init);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    }

    init();
  }

  initThemeToggle();
  initParticles();
  const nav = initNav();
  initReveal();
  initCounters();
  initSmoothScroll(() => {
    if (nav.isOpen()) nav.close();
  });
  initScrollTopButton();
  initCertMarquee();
})();
