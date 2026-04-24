const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const storedTheme = localStorage.getItem('theme') || 'light';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeLabel) {
    themeLabel.textContent = theme === 'dark' ? 'Modo oscuro' : 'Modo claro';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

applyTheme(storedTheme);
