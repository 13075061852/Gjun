export function initNav() {
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
    if (window.innerWidth >= 768 && navOpen) closeNav();
  });

  return {
    isOpen: () => navOpen,
    close: closeNav
  };
}
