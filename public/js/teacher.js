document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (!token) window.location.href = '/html/index.html';

  let currentTeacher = null;

  // Navegación de secciones
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;
      if (!target) return;
      
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      sections.forEach(s => s.classList.add('hidden'));
      const targetSection = document.getElementById(`${target}-section`);
      if (targetSection) targetSection.classList.remove('hidden');
      
      document.getElementById('section-title').innerText = btn.innerText.replace(/[^\w\s]/gi, '').trim();

      if (target === 'removed') fetchRemovedStudents(token);
    });
  });

  // Cargar perfil
  try {
    const res = await fetch(`/api/teachers/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
        currentTeacher = await res.json();
    } else {
        // Fallback al objeto guardado en login
        currentTeacher = JSON.parse(localStorage.getItem('teacher'));
    }
    
    if (currentTeacher) {
        document.getElementById('teacher-name-side').innerText = `${currentTeacher.firstName} ${currentTeacher.lastName}`;
        document.getElementById('teacher-meta').innerText = `${currentTeacher.subject} | Grado ${currentTeacher.gradeAssigned}`;
        
        document.getElementById('assigned-grade-card').innerText = currentTeacher.gradeAssigned || '--';
        document.getElementById('assigned-subject-card').innerText = currentTeacher.subject || '--';
        if (document.getElementById('assistant-grade-hint')) {
            document.getElementById('assistant-grade-hint').innerText = currentTeacher.gradeAssigned;
        }

        fetchStudents(currentTeacher.gradeAssigned, token);
        fetchDocuments(currentTeacher.id, token);
        fetchSchedule(currentTeacher.id, token, 'teacher');
    }
  } catch (err) {
    console.error('Error cargando perfil:', err);
    // Re-intento con localstorage
    currentTeacher = JSON.parse(localStorage.getItem('teacher'));
    if (currentTeacher) {
        document.getElementById('teacher-name-side').innerText = `${currentTeacher.firstName} ${currentTeacher.lastName}`;
    }
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
            body: JSON.stringify({ question, context: `Soy profesor de ${currentTeacher.subject} en grado ${currentTeacher.gradeAssigned}` })
          });
          const data = await res.json();
          chat.innerHTML += `<div class="chat-bubble bubble-ai">${data.answer || data.error || 'Lo siento, no pude procesar tu consulta.'}</div>`;
    } catch (err) {
        chat.innerHTML += `<div class="chat-bubble bubble-ai">Error de conexión con el servicio de IA.</div>`;
    }
    chat.scrollTop = chat.scrollHeight;
  });
});

async function fetchStudents(grade, token) {
  const res = await fetch(`/api/students?grade=${grade}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const students = await res.json();
  document.getElementById('students-count').innerText = students.length;
  
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = students.map(s => `
    <tr>
      <td><strong>${s.firstName} ${s.lastName}</strong></td>
      <td><code style="font-size: 0.8rem;">${s.documentNumber}</code></td>
      <td>
        <input type="number" class="grade-input" step="0.1" min="0" max="5" 
               data-student-id="${s.id}" 
               placeholder="0.0"
               style="width: 80px;">
      </td>
      <td>
        <input type="text" class="obs-input" 
               data-student-id="${s.id}" 
               placeholder="Comentario..."
               style="width: 100%;">
      </td>
      <td>
        <button onclick="deleteStudent(${s.id})" class="btn-logout" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; border-width: 1px;">Borrar</button>
      </td>
    </tr>
  `).join('');
}

async function deleteStudent(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar a este estudiante? Se moverá a la papelera.')) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        alert('Estudiante eliminado correctamente.');
        location.reload();
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchRemovedStudents(token) {
    try {
        const res = await fetch('/api/students/removed', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const students = await res.json();
        const tbody = document.getElementById('removed-table-body');
        tbody.innerHTML = students.map(s => `
            <tr>
                <td>${s.firstName} ${s.lastName}</td>
                <td>${s.documentNumber}</td>
                <td>${s.grade}</td>
                <td>${new Date(s.removedAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

async function saveAllGrades() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const quarter = document.getElementById('quarter-select').value;
  const gradeInputs = document.querySelectorAll('.grade-input');
  const obsInputs = document.querySelectorAll('.obs-input');
  
  const results = [];
  const teacherProfile = await (await fetch(`/api/teachers/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })).json();

  for (let i = 0; i < gradeInputs.length; i++) {
    const score = gradeInputs[i].value;
    const studentId = gradeInputs[i].dataset.studentId;
    const observations = obsInputs[i].value;

    if (!score) continue;

    results.push(fetch('/api/grades', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        studentId,
        teacherId: userId,
        subject: teacherProfile.subject,
        score,
        quarter,
        period: new Date().getFullYear(),
        observations
      })
    }));
  }

  try {
    await Promise.all(results);
    alert('✅ Calificaciones y observaciones guardadas exitosamente.');
  } catch (err) {
    alert('❌ Error al guardar algunas calificaciones.');
  }
}

async function fetchDocuments(teacherId, token) {
  const res = await fetch(`/api/documents/teacher/${teacherId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const docs = await res.json();
  const container = document.getElementById('documents-list');
  
  if (docs.length === 0) {
    container.innerHTML = '<p class="text-muted">No has publicado documentos aún.</p>';
    return;
  }

  container.innerHTML = docs.map(d => `
    <div class="card" style="padding: 1rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: var(--primary);">${d.title}</strong>
        <p style="font-size: 0.8rem; margin: 0; color: var(--text-muted);">Para: ${d.studentId ? 'Estudiante ID ' + d.studentId : 'Todo el curso'}</p>
      </div>
      <a href="${d.url}" target="_blank" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem; text-decoration: none;">Ver</a>
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
                html += `<td style="background: rgba(16, 185, 129, 0.05); text-align: center;">
                    <div style="font-weight: 700; color: var(--secondary);">${entry.subject}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">Grado ${entry.grade}°</div>
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
