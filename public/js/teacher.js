let teacherData = null;
let studentsGrades = [];
let teacherDocuments = [];

function switchSection(section) {
  document.querySelectorAll('.panel-section').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.menu-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`${section}-section`).classList.add('active');
  document.querySelector(`.menu-button[data-section="${section}"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) window.location.href = '/login.html';

  document.querySelectorAll('.menu-button').forEach(button => {
    button.addEventListener('click', () => switchSection(button.dataset.section));
  });

  loadTeacherData();
  loadStudentsAndGrades();
  loadTeacherDocuments();

  document.getElementById('quarter-select').addEventListener('change', loadStudentsAndGrades);
  document.getElementById('assistant-form').addEventListener('submit', handleAssistantQuery);
  document.getElementById('document-form').addEventListener('submit', handleDocumentUpload);
});

async function loadTeacherData() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/api/teachers/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    teacherData = data;

    const fullName = `${data.firstName} ${data.lastName}`;
    document.getElementById('teacher-name').textContent = fullName;
    document.getElementById('teacher-name-side').textContent = fullName;
    document.getElementById('assigned-grade').textContent = data.gradeAssigned;
    document.getElementById('assigned-subject').textContent = data.subject;
    document.getElementById('assigned-grade-card').textContent = `Grado ${data.gradeAssigned}`;
    document.getElementById('assigned-subject-card').textContent = data.subject;
  } catch (error) {
    console.error('Error cargando datos del profesor:', error);
  }
}

async function loadStudentsAndGrades() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const quarter = parseInt(document.getElementById('quarter-select').value, 10);

  try {
    const response = await fetch(`/api/grades/teacher/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const grades = await response.json();
    studentsGrades = Array.isArray(grades) ? grades.filter(g => g.quarter === quarter) : [];
    renderGradesTable();
    renderSummary();
  } catch (error) {
    console.error('Error cargando calificaciones:', error);
  }
}

async function loadTeacherDocuments() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/api/documents/teacher/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    teacherDocuments = await response.json();
    renderDocuments();
    document.getElementById('docs-count').textContent = teacherDocuments.length;
    renderSummary();
  } catch (error) {
    console.error('Error cargando documentos:', error);
  }
}

function renderGradesTable() {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';

  if (!Array.isArray(studentsGrades) || studentsGrades.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3">No hay calificaciones registradas para este trimestre.</td></tr>';
    return;
  }

  const grouped = {};
  studentsGrades.forEach(record => {
    if (!grouped[record.studentId]) {
      grouped[record.studentId] = record;
    }
  });

  Object.values(grouped).forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.studentFirstName} ${student.studentLastName}</td>
      <td>${student.documentNumber || '-'}</td>
      <td>
        <input type="number" 
               class="grade-input" 
               data-grade-id="${student.id || ''}" 
               data-student-id="${student.studentId}" 
               min="0" 
               max="5" 
               step="0.1"
               value="${typeof student.score === 'number' ? student.score : ''}" 
               placeholder="0.0" />
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function renderSummary() {
  const uniqueStudentIds = new Set(studentsGrades.map(item => item.studentId));
  document.getElementById('students-count').textContent = uniqueStudentIds.size;
}

function renderDocuments() {
  const container = document.getElementById('documents-list');
  if (!Array.isArray(teacherDocuments) || teacherDocuments.length === 0) {
    container.innerHTML = '<p>No hay documentos publicados todavía.</p>';
    return;
  }

  container.innerHTML = teacherDocuments.map(doc => `
    <div class="document-item">
      <div>
        <h4>${doc.title}</h4>
        <p>${doc.description || 'Sin descripción'}</p>
        <p class="meta">Para: ${doc.studentFirstName} ${doc.studentLastName} • ${new Date(doc.createdAt).toLocaleDateString()}</p>
      </div>
      ${doc.url ? `<a href="${doc.url}" target="_blank">Ver enlace</a>` : ''}
    </div>
  `).join('');
}

async function handleDocumentUpload(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const studentId = document.getElementById('doc-student-id').value.trim();
  const title = document.getElementById('doc-title').value.trim();
  const description = document.getElementById('doc-description').value.trim();
  const url = document.getElementById('doc-url').value.trim();

  if (!studentId || !title) {
    alert('Ingrese el ID del estudiante y el título del documento.');
    return;
  }

  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ studentId: parseInt(studentId, 10), teacherId: parseInt(userId, 10), title, description, url })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'No se pudo subir el documento');
    }

    document.getElementById('document-form').reset();
    loadTeacherDocuments();
    alert('Documento enviado correctamente.');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function saveAllGrades() {
  const token = localStorage.getItem('token');
  const quarter = parseInt(document.getElementById('quarter-select').value, 10);
  const gradeInputs = document.querySelectorAll('.grade-input');
  const gradesToUpdate = [];
  const gradesToCreate = [];

  gradeInputs.forEach(input => {
    const score = parseFloat(input.value);
    const gradeId = input.dataset.gradeId;
    const studentId = input.dataset.studentId;

    if (!Number.isFinite(score) || score < 0 || score > 5) return;

    if (gradeId) {
      gradesToUpdate.push({ id: parseInt(gradeId, 10), score, quarter });
    } else {
      gradesToCreate.push({ studentId: parseInt(studentId, 10), teacherId: parseInt(localStorage.getItem('userId'), 10), subject: teacherData?.subject || 'General', score, quarter, period: new Date().getFullYear() });
    }
  });

  try {
    for (const grade of gradesToCreate) {
      await fetch('/api/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(grade)
      });
    }

    for (const grade of gradesToUpdate) {
      await fetch(`/api/grades/${grade.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score: grade.score, quarter: grade.quarter })
      });
    }

    alert('Calificaciones guardadas exitosamente.');
    loadStudentsAndGrades();
  } catch (error) {
    console.error('Error guardando calificaciones:', error);
    alert('Error al guardar calificaciones.');
  }
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
