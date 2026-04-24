let currentRole = 'student';

document.addEventListener('DOMContentLoaded', () => {
  const roleButtons = document.querySelectorAll('.role-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      roleButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentRole = e.target.dataset.role;
      document.querySelectorAll('.role-fields').forEach(section => section.classList.remove('active'));
      document.getElementById(`${currentRole}-fields`).classList.add('active');
    });
  });

  document.getElementById('login-form').addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = '';

  try {
    if (currentRole === 'teacher') {
      const email = document.getElementById('teacher-email').value.trim();
      const password = document.getElementById('teacher-password').value;

      const response = await fetch('/api/auth/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', 'teacher');
      localStorage.setItem('userId', data.teacher.id);
      window.location.href = '/teacher-portal.html';
    } else {
      const documentNumber = document.getElementById('student-document').value.trim();
      const password = document.getElementById('student-password').value;

      const response = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNumber, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', 'student');
      localStorage.setItem('userId', data.student.id);
      window.location.href = '/student-portal.html';
    }
  } catch (error) {
    messageDiv.innerHTML = `<p class="error">${error.message}</p>`;
  }
}
