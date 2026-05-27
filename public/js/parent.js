const token = localStorage.getItem('token');
const parentData = JSON.parse(localStorage.getItem('parent'));

if (!token || !parentData) {
    window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Info del sidebar
    document.getElementById('parent-name-side').textContent = `${parentData.firstName} ${parentData.lastName}`;
    document.getElementById('parent-email-side').textContent = parentData.email;

    loadChildren();
    
    // Asistente IA
    const assistantForm = document.getElementById('assistant-form');
    if (assistantForm) {
        assistantForm.addEventListener('submit', handleAssistant);
    }
});

async function loadChildren() {
    try {
        const response = await fetch('/api/parents/my-children', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const children = await response.json();
        
        const list = document.getElementById('children-list');
        const reportsList = document.getElementById('reports-children-list');
        
        list.innerHTML = '';
        reportsList.innerHTML = '';

        children.forEach(child => {
            // Card para Dashboard
            const card = document.createElement('div');
            card.className = 'child-card';
            card.innerHTML = `
                <div class="child-header">
                    <div class="child-avatar">${child.firstName[0]}${child.lastName[0]}</div>
                    <div>
                        <h4 style="margin:0;">${child.firstName} ${child.lastName}</h4>
                        <span class="grade-badge">Grado ${child.grade}°</span>
                    </div>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    <p><strong>Documento:</strong> ${child.documentNumber}</p>
                    <p><strong>Correo:</strong> ${child.email || 'N/A'}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-primary" style="flex:1;" onclick="viewReport(${child.id})">
                        Reporte
                    </button>
                    <button class="btn-primary" style="flex:1; background: var(--secondary);" onclick="showSection('schedule')">
                        Horario
                    </button>
                </div>
            `;
            list.appendChild(card);

            // Card similar para sección de Reportes
            const reportCard = card.cloneNode(true);
            reportsList.appendChild(reportCard);
        });

        // Cargar horarios en el contenedor oculto
        loadAllSchedules(children);
    } catch (err) {
        console.error(err);
    }
}

async function loadAllSchedules(children) {
    const container = document.getElementById('schedules-container');
    container.innerHTML = '';

    for (const child of children) {
        const res = await fetch(`/api/schedules/grade/${child.grade}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const schedule = await res.json();

        const section = document.createElement('div');
        section.className = 'card';
        section.style.marginBottom = '2rem';
        section.innerHTML = `
            <h4 style="color: var(--primary); margin-bottom: 1rem;">Horario de ${child.firstName} (${child.grade}°)</h4>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Lunes</th>
                            <th>Martes</th>
                            <th>Miércoles</th>
                            <th>Jueves</th>
                            <th>Viernes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateScheduleRows(schedule)}
                    </tbody>
                </table>
            </div>
        `;
        container.appendChild(section);
    }
}

function generateScheduleRows(schedule) {
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
                </td>`;
            } else {
                html += `<td></td>`;
            }
        });
        html += `</tr>`;
    });
    return html;
}

function showSection(sectionId) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    // Encontrar el botón que corresponde a la sección
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick')?.includes(sectionId));
    if (activeBtn) activeBtn.classList.add('active');
    
    const titles = {
        'dashboard': 'Mi Familia',
        'reports': 'Centro de Reportes',
        'schedule': 'Horarios de Clases'
    };
    document.getElementById('section-title').textContent = titles[sectionId] || 'Mi Familia';
}

function viewReport(studentId) {
    window.location.href = `report.html?studentId=${studentId}`;
}

async function handleAssistant(e) {
    e.preventDefault();
    const input = document.getElementById('assistant-input');
    const chat = document.getElementById('assistant-chat');
    const question = input.value;

    // Mensaje usuario
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble bubble-user';
    userBubble.textContent = question;
    chat.appendChild(userBubble);
    input.value = '';

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
        
        const aiBubble = document.createElement('div');
        aiBubble.className = 'chat-bubble bubble-ai';
        aiBubble.textContent = data.answer || data.error;
        chat.appendChild(aiBubble);
        chat.scrollTop = chat.scrollHeight;
    } catch (err) {
        console.error(err);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/index.html';
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
