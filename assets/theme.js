'use strict';
const themeButton = document.querySelector('.theme-toggle');
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.textContent = dark ? '☀' : '☾';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#1a1218' : '#fffcf8';
}
let savedTheme;
try { savedTheme = localStorage.getItem('mars-theme'); } catch {}
setTheme(savedTheme === 'dark');
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  setTheme(dark);
  try { localStorage.setItem('mars-theme', dark ? 'dark' : 'light'); } catch {}
});
const progress = document.querySelector('.reading-progress');
function updateProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${range > 0 ? Math.min(100, scrollY / range * 100) : 0}%`;
}
addEventListener('scroll', updateProgress, {passive: true});
addEventListener('resize', updateProgress);
updateProgress();
