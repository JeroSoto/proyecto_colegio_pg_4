document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  
  // Función para aplicar el tema
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      if (toggleBtn) toggleBtn.innerText = '☀️ Modo Claro';
    } else {
      document.body.classList.remove('dark-mode');
      if (toggleBtn) toggleBtn.innerText = '🌙 Modo Oscuro';
    }
  };

  // Cargar preferencia guardada
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      const newTheme = isDark ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
      
      // Micro-animación al pulsar
      toggleBtn.style.transform = 'scale(0.95)';
      setTimeout(() => toggleBtn.style.transform = 'scale(1)', 100);
    });
  }
});
