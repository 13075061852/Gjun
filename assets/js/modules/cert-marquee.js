export function initCertMarquee() {
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
