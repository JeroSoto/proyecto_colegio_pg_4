document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(e) {
  e.preventDefault();
  e.stopPropagation();
  const messageDiv = document.getElementById('message');
  messageDiv.style.display = 'block';
  messageDiv.className = 'message';
  messageDiv.innerHTML = 'Verificando credenciales...';

  // Use relative API paths so the client talks to the same server
  const API_BASE = '';

  try {
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    if (!identifier || !password) {
      throw new Error('Ingresa tu usuario y contraseña.');
    }

    const response = await fetch(API_BASE + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Credenciales incorrectas');

    // Guardar sesión y datos del usuario
    localStorage.setItem('token', data.token);
    localStorage.setItem('userType', data.type);
    localStorage.setItem('userId', data.user.id);
    
    // Guardar el objeto de usuario específico según el tipo
    if (data.type === 'teacher') {
        localStorage.setItem('teacher', JSON.stringify(data.user));
    } else if (data.type === 'parent') {
        localStorage.setItem('parent', JSON.stringify(data.user));
    } else {
        localStorage.setItem('student', JSON.stringify(data.user));
    }

    messageDiv.className = 'message success';
    messageDiv.innerHTML = `¡Bienvenido ${data.user.firstName}! Redirigiendo...`;

    setTimeout(() => {
      let targetPath = '/html/student-portal.html';
      if (data.type === 'teacher') {
        targetPath = data.user.role === 'director' ? '/html/director-portal.html' : '/html/teacher-portal.html';
      } else if (data.type === 'parent') {
        targetPath = '/html/parent-portal.html';
      }
      // Redirigir al mismo host/origen donde se sirvió la página
      window.location.href = window.location.origin + targetPath;
    }, 1000);

  } catch (error) {
    messageDiv.className = 'message error';
    messageDiv.innerHTML = `⚠️ ${error.message}`;
  }
}
