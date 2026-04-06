export function initThemeToggle() {
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
