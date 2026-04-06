import { initThemeToggle } from "./modules/theme.js";
import { initParticles } from "./modules/particles.js";
import { initNav } from "./modules/nav.js";
import { initReveal, initCounters, initSmoothScroll, initScrollTopButton } from "./modules/interactions.js";
import { initCertMarquee } from "./modules/cert-marquee.js";

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
