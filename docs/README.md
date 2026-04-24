# Administración de Colegio - Documentación

## Descripción General

Sistema web de administración académica para un colegio de transición hasta grado 11 que permite:

- **Administración de Estudiantes**: Registrar, actualizar y gestionar eliminación pasiva de estudiantes
- **Gestión de Calificaciones**: Profesores pueden ingresar y actualizar notas de estudiantes
- **Portales de Acceso**: Profesor y estudiante con autenticación
- **Asistente IA**: Integración con Gemini o OpenAI para consultas

## Estructura de Grados

### Primaria (Transición - Grado 5)
- Transición (Grado 0)
- Primero (Grado 1)
- Segundo (Grado 2)
- Tercero (Grado 3)
- Cuarto (Grado 4)
- Quinto (Grado 5)

### Secundaria (Grado 6 - 11)
- Sexto (Grado 6)
- Séptimo (Grado 7)
- Octavo (Grado 8)
- Noveno (Grado 9)
- Décimo (Grado 10)
- Once (Grado 11)

## Estructura del Proyecto

```
PROYECTO_COLEGIO/
├── app.js                    # Servidor Express principal
├── package.json              # Dependencias
├── .env                       # Variables de entorno
├── models/                    # Modelos de datos
│   ├── student.js            # Estudiantes
│   ├── teacher.js            # Profesores
│   ├── grade.js              # Calificaciones
│   └── removedStudent.js      # Registro de eliminados
├── routes/                    # Rutas API
│   ├── students.js           # CRUD estudiantes
│   ├── teachers.js           # CRUD profesores
│   ├── grades.js             # CRUD calificaciones
│   ├── auth.js               # Autenticación
│   └── assistant.js          # Asistente IA
├── public/                    # Archivos estáticos
│   ├── html/
│   │   ├── index.html        # Panel de administración
│   │   ├── login.html        # Login
│   │   ├── teacher-portal.html # Portal del profesor
│   │   └── student-portal.html # Portal del estudiante
│   ├── css/
│   │   └── styles.css        # Estilos globales
│   └── js/
│       ├── main.js           # Script principal
│       ├── teacher.js        # Script portal profesor
│       └── student.js        # Script portal estudiante
├── data/                      # Base de datos
│   └── school.db             # SQLite
└── docs/                      # Documentación
    ├── README.md             # Este archivo
    ├── REQUISITOS.md         # Requisitos funcionales y no funcionales
    ├── API.md                # Documentación de API
    └── THUNDER_CLIENT.json   # Rutas para Thunder Client
```

## Base de Datos

### Tablas Principales

#### students
- id (INTEGER PRIMARY KEY)
- firstName (TEXT)
- lastName (TEXT)
- grade (INTEGER)
- gradeCategory (TEXT: 'primaria' o 'secundaria')
- documentType (TEXT)
- documentNumber (TEXT)
- email (TEXT)
- phone (TEXT)
- password (TEXT)
- createdAt (DATETIME)

#### teachers
- id (INTEGER PRIMARY KEY)
- firstName (TEXT)
- lastName (TEXT)
- email (TEXT)
- documentNumber (TEXT)
- password (TEXT)
- gradeAssigned (INTEGER)
- subject (TEXT)
- createdAt (DATETIME)

#### grades
- id (INTEGER PRIMARY KEY)
- studentId (INTEGER, FK)
- teacherId (INTEGER, FK)
- subject (TEXT)
- score (DECIMAL)
- quarter (INTEGER: 1-4)
- period (INTEGER: año académico)
- createdAt (DATETIME)
- updatedAt (DATETIME)

#### removed_students
- id (INTEGER PRIMARY KEY)
- studentId (INTEGER)
- firstName (TEXT)
- lastName (TEXT)
- grade (INTEGER)
- gradeCategory (TEXT)
- documentType (TEXT)
- documentNumber (TEXT)
- email (TEXT)
- phone (TEXT)
- removedAt (DATETIME)

## Tecnologías

- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **IA**: OpenAI API o Gemini API
- **Autenticación**: JWT (JSON Web Tokens)

## Variables de Entorno (.env)

```
PORT=3000
DATABASE_FILE=./data/school.db
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-mini
JWT_SECRET=your_secret_key
```

## Instalación y Ejecución

### Requisitos Previos
- Node.js v14+
- npm

### Pasos

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar .env**
   - Copiar `.env` y completar las claves de IA

3. **Iniciar servidor**
   ```bash
   npm start
   ```

4. **Acceder a la aplicación**
   - http://localhost:3000

## Roles y Accesos

### Administrador
- Ver/crear/editar/eliminar estudiantes
- Ver/crear/editar profesores
- Ver todas las calificaciones

### Profesor
- Ver estudiantes asignados a su grado
- Ingresar y actualizar calificaciones
- Consultar asistente IA

### Estudiante
- Ver sus calificaciones
- Consultar asistente IA

## Contribución

Para contribuir al proyecto, crear una rama, hacer cambios y enviar un pull request.
