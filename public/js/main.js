const studentForm = document.getElementById('student-form');
const assistantForm = document.getElementById('assistant-form');
const studentsList = document.getElementById('students-list');
const removedList = document.getElementById('removed-list');
const assistantAnswer = document.getElementById('assistant-answer');

async function fetchStudents() {
  const response = await fetch('/api/students');
  const students = await response.json();
  studentsList.innerHTML = students.length
    ? students.map(renderStudent).join('')
    : '<p>No hay estudiantes registrados aún.</p>';
}

async function fetchRemoved() {
  const response = await fetch('/api/students/removed');
  const removed = await response.json();
  removedList.innerHTML = removed.length
    ? removed.map(renderRemovedStudent).join('')
    : '<p>No hay estudiantes removidos.</p>';
}

function renderStudent(student) {
  return `
    <div class="student-item">
      <strong>${student.firstName} ${student.lastName}</strong>
      <p>Grado: ${student.grade} (${student.gradeCategory})</p>
      <p>Documento: ${student.documentType || '-'} ${student.documentNumber || ''}</p>
      <p>Correo: ${student.email || '-'} | Teléfono: ${student.phone || '-'} </p>
      <div class="student-actions">
        <button class="small-button" onclick="editStudent(${student.id})">Editar</button>
        <button class="small-button" onclick="removeStudent(${student.id})">Remover</button>
      </div>
    </div>
  `;
}

function renderRemovedStudent(student) {
  return `
    <div class="removed-item">
      <strong>${student.firstName} ${student.lastName}</strong>
      <p>Grado: ${student.grade} (${student.gradeCategory})</p>
      <p>Removido en: ${new Date(student.removedAt).toLocaleString()}</p>
    </div>
  `;
}

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(studentForm);
  const payload = Object.fromEntries(formData.entries());

  await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  studentForm.reset();
  fetchStudents();
});

assistantForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(assistantForm);
  const question = formData.get('question');

  const response = await fetch('/api/assistant/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  const data = await response.json();
  assistantAnswer.innerHTML = `<div class="answer-box"><strong>Respuesta:</strong><p>${data.answer || data.error}</p></div>`;
});

window.editStudent = async (id) => {
  const firstName = prompt('Nuevo nombre:');
  if (firstName === null) return;
  const lastName = prompt('Nuevos apellidos:');
  if (lastName === null) return;
  const grade = prompt('Nuevo grado (0-11):');
  if (grade === null) return;

  await fetch(`/api/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, grade })
  });
  fetchStudents();
};

window.removeStudent = async (id) => {
  if (!confirm('¿Deseas remover este estudiante? Esto hará un borrado pasivo.')) return;
  await fetch(`/api/students/${id}`, { method: 'DELETE' });
  fetchStudents();
  fetchRemoved();
};

fetchStudents();
fetchRemoved();
