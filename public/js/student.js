let studentData = null;
let studentGrades = [];
let studentCourses = [];
let studentDocuments = [];

function switchSection(section) {
  document.querySelectorAll('.panel-section').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.menu-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`${section}-section`).classList.add('active');
  document.querySelector(`.menu-button[data-section="${section}"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) window.location.href = '/login.html';

  document.querySelectorAll('.menu-button').forEach(button => {
    button.addEventListener('click', () => switchSection(button.dataset.section));
  });

  await loadStudentData();
  await loadStudentCourses();
  await loadStudentGrades();
  await loadStudentDocuments();
  document.getElementById('assistant-form').addEventListener('submit', handleAssistantQuery);
});

async function loadStudentData() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/api/students/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    studentData = data;
    document.getElementById('student-name').textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById('student-name-side').textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById('student-grade').textContent = data.grade;
    document.getElementById('student-category').textContent = data.gradeCategory === 'primaria' ? 'Primaria' : 'Secundaria';
  } catch (error) {
    console.error('Error cargando datos del estudiante:', error);
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    document.getElementById('student-name').textContent = `Estudiante ${decoded.id}`;
    document.getElementById('student-name-side').textContent = `Estudiante ${decoded.id}`;
    document.getElementById('student-grade').textContent = decoded.grade;
    document.getElementById('student-category').textContent = decoded.grade <= 5 ? 'Primaria' : 'Secundaria';
  }
}

async function loadStudentGrades() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/api/grades/student/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const grades = await response.json();
    studentGrades = Array.isArray(grades) ? grades : [];
    renderGrades(studentGrades);
  } catch (error) {
    console.error('Error cargando calificaciones:', error);
  }
}

async function loadStudentCourses() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('/api/teachers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const teachers = await response.json();
    const grade = studentData?.grade || JSON.parse(atob(localStorage.getItem('token').split('.')[1])).grade;
    studentCourses = Array.isArray(teachers) ? teachers.filter(t => t.gradeAssigned === grade) : [];
    renderCourses();
  } catch (error) {
    console.error('Error cargando cursos:', error);
  }
}

async function loadStudentDocuments() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/api/documents/student/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    studentDocuments = await response.json();
    renderDocuments();
  } catch (error) {
    console.error('Error cargando documentos:', error);
  }
}

function renderGrades(grades) {
  const gradesDisplay = document.getElementById('grades-display');

  if (!Array.isArray(grades) || grades.length === 0) {
    gradesDisplay.innerHTML = '<p>Aún no tienes calificaciones registradas.</p>';
    return;
  }

  let html = '<table class="grades-table"><thead><tr><th>Materia</th><th>Profesor</th><th>Nota</th><th>Trimestre</th><th>Período</th></tr></thead><tbody>';

  grades.forEach(grade => {
    html += `
      <tr>
        <td>${grade.subject}</td>
        <td>${grade.teacherFirstName} ${grade.teacherLastName}</td>
        <td><strong>${Number(grade.score).toFixed(1)}</strong></td>
        <td>${grade.quarter}</td>
        <td>${grade.period}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  gradesDisplay.innerHTML = html;
}

function renderCourses() {
  const container = document.getElementById('courses-list');
  if (!Array.isArray(studentCourses) || studentCourses.length === 0) {
    container.innerHTML = '<p>No hay cursos asignados todavía.</p>';
    return;
  }

  container.innerHTML = studentCourses.map(course => `
    <div class="course-card">
      <h4>${course.subject || 'Sin materia'}</h4>
      <p><strong>Profesor:</strong> ${course.firstName} ${course.lastName}</p>
      <p><strong>Grado:</strong> ${course.gradeAssigned}</p>
    </div>
  `).join('');
}

function renderDocuments() {
  const container = document.getElementById('documents-list');
  if (!Array.isArray(studentDocuments) || studentDocuments.length === 0) {
    container.innerHTML = '<p>No hay documentos publicados para ti.</p>';
    return;
  }

  container.innerHTML = studentDocuments.map(doc => `
    <div class="document-item">
      <div>
        <h4>${doc.title}</h4>
        <p>${doc.description || 'Sin descripción'}</p>
        <p class="meta">Profesor: ${doc.teacherFirstName} ${doc.teacherLastName} • ${new Date(doc.createdAt).toLocaleDateString()}</p>
      </div>
      ${doc.url ? `<a href="${doc.url}" target="_blank">Ver material</a>` : ''}
    </div>
  `).join('');
}

async function handleAssistantQuery(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const question = e.target.querySelector('textarea').value;
  const answerDiv = document.getElementById('assistant-answer');

  try {
    const response = await fetch('/api/assistant/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    answerDiv.innerHTML = `<p><strong>Respuesta:</strong></p><p>${data.answer || data.error}</p>`;
    e.target.reset();
  } catch (error) {
    answerDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  window.location.href = '/login.html';
}
