document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (!token) window.location.href = '/html/index.html';

  // Navegación
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;
      if (!target) return;
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sections.forEach(s => s.classList.add('hidden'));
      document.getElementById(`${target}-section`).classList.remove('hidden');
      document.getElementById('section-title').innerText = btn.innerText.replace(/[^\w\s]/gi, '').trim();
    });
  });

  // Perfil
  try {
    const res = await fetch(`/api/students/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const student = await res.json();
    document.getElementById('student-name-side').innerText = `${student.firstName} ${student.lastName}`;
    document.getElementById('student-meta').innerText = `Grado ${student.grade} - ${student.gradeCategory}`;

    fetchGrades(userId, token);
    fetchDocuments(userId, token);
    fetchCourses(student.grade, token);
    fetchSchedule(student.grade, token, 'student');
  } catch (err) {
    console.error(err);
  }

  // Asistente IA
  const assistantForm = document.getElementById('assistant-form');
  assistantForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('assistant-input');
    const chat = document.getElementById('assistant-chat');
    const question = input.value;
    
    chat.innerHTML += `<div class="chat-bubble bubble-user">${question}</div>`;
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    try {
        const res = await fetch('/api/assistant/ask', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ question })
          });
          const data = await res.json();
          chat.innerHTML += `<div class="chat-bubble bubble-ai">${data.answer || data.error}</div>`;
    } catch (err) {
        chat.innerHTML += `<div class="chat-bubble bubble-ai">Error de conexión con el servicio de IA.</div>`;
    }
    chat.scrollTop = chat.scrollHeight;
  });
});

async function fetchGrades(studentId, token) {
  const res = await fetch(`/api/grades/student/${studentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const grades = await res.json();
  const tbody = document.getElementById('grades-table-body');
  
  if (grades.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay calificaciones registradas.</td></tr>';
    return;
  }

  tbody.innerHTML = grades.map(g => `
    <tr>
      <td><strong>${g.subject}</strong></td>
      <td>${g.teacher ? g.teacher.firstName + ' ' + g.teacher.lastName : '---'}</td>
      <td style="text-align:center;">${g.quarter}</td>
      <td>
        <span style="font-weight: 800; color: ${g.score >= 3 ? 'var(--secondary)' : 'var(--danger)'};">
          ${g.score}
        </span>
      </td>
      <td><small>${g.observations || 'Sin observaciones'}</small></td>
    </tr>
  `).join('');

  // Calcular Reporte Académico detallado
  calculateDetailedReport(grades);
}

function calculateDetailedReport(grades) {
    // 1. Agrupar notas por materia para sacar el promedio de cada materia
    const subjectStats = {};
    
    grades.forEach(g => {
        if (!subjectStats[g.subject]) {
            subjectStats[g.subject] = { total: 0, count: 0 };
        }
        subjectStats[g.subject].total += parseFloat(g.score);
        subjectStats[g.subject].count += 1;
    });

    const subjects = Object.keys(subjectStats);
    let failedSubjectsCount = 0;
    let semesterSum = 0;

    subjects.forEach(subjectName => {
        const avg = subjectStats[subjectName].total / subjectStats[subjectName].count;
        semesterSum += avg;
        if (avg < 3.0) {
            failedSubjectsCount++;
        }
    });

    const semesterAverage = subjects.length > 0 ? (semesterSum / subjects.length).toFixed(2) : "0.0";

    // Actualizar UI
    document.getElementById('overall-average').innerText = semesterAverage;
    document.getElementById('total-subjects').innerText = subjects.length;

    const statusEl = document.getElementById('academic-status');
    const statusTextEl = document.getElementById('average-status');

    // Lógica de aprobación/reprobación
    if (failedSubjectsCount >= 2) {
        statusEl.innerText = 'REPROBADO';
        statusEl.style.color = 'var(--danger)';
        statusTextEl.innerHTML = `<strong style="color: var(--danger);">AÑO PERDIDO:</strong> Has perdido ${failedSubjectsCount} materias.`;
    } else {
        if (semesterAverage >= 4.5) {
            statusEl.innerText = 'EXCELENTE';
            statusEl.style.color = 'var(--secondary)';
        } else if (semesterAverage >= 3.0) {
            statusEl.innerText = 'APROBADO';
            statusEl.style.color = 'var(--primary)';
        } else {
            statusEl.innerText = 'EN RIESGO';
            statusEl.style.color = 'var(--accent)';
        }
        
        statusTextEl.innerHTML = failedSubjectsCount > 0 
            ? `Vas ganando el año, pero tienes ${failedSubjectsCount} materia(s) pérdida(s). ¡Cuidado!`
            : `¡Excelente! No tienes materias perdidas este semestre.`;
    }
}

async function fetchCourses(grade, token) {
    const res = await fetch(`/api/courses/grade/${grade}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const courses = await res.json();
    const container = document.getElementById('courses-list');
    container.innerHTML = courses.map(c => `
        <div class="stat-card">
            <h4>${c.name}</h4>
            <p class="text-muted" style="font-size: 0.8rem;">${c.schedule}</p>
        </div>
    `).join('');
}

async function fetchDocuments(studentId, token) {
  const res = await fetch(`/api/documents/student/${studentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const docs = await res.json();
  const container = document.getElementById('documents-list');
  
  if (docs.length === 0) {
    container.innerHTML = '<p class="text-muted">No tienes documentos asignados todavía.</p>';
    return;
  }

  container.innerHTML = docs.map(d => `
    <div class="card" style="padding: 1.25rem; margin-bottom: 0; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h4 style="margin:0; color: var(--primary);">${d.title}</h4>
        <p style="font-size: 0.8rem; margin: 0.25rem 0 0; color: var(--text-muted);">
          De: ${d.teacher ? d.teacher.firstName + ' ' + d.teacher.lastName : 'Profesor'}
        </p>
      </div>
      <a href="${d.url}" target="_blank" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem; text-decoration: none;">Abrir Recurso</a>
    </div>
  `).join('');
}

async function fetchSchedule(id, token, type) {
    const endpoint = type === 'student' ? `/api/schedules/grade/${id}` : `/api/schedules/teacher/${id}`;
    const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const schedule = await res.json();
    const tbody = document.getElementById('schedule-body');
    if (!tbody) return;

    // Organizar por slots de tiempo
    const slots = ['07:00', '08:30', '10:30', '12:00'];
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    let html = '';
    slots.forEach(slot => {
        html += `<tr><td><strong>${slot}</strong></td>`;
        days.forEach(day => {
            const entry = schedule.find(s => s.day === day && s.startTime === slot);
            if (entry) {
                html += `<td style="background: rgba(99, 102, 241, 0.05); text-align: center;">
                    <div style="font-weight: 700; color: var(--primary);">${entry.subject}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${type === 'student' ? 'Aula ' + entry.grade + '°' : 'Grado ' + entry.grade + '°'}</div>
                </td>`;
            } else {
                html += `<td></td>`;
            }
        });
        html += `</tr>`;
    });
    tbody.innerHTML = html;
}

function logout() {
  localStorage.clear();
  window.location.href = '/html/index.html';
}
