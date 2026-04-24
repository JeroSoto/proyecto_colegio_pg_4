# Índice de Archivos del Proyecto

## 📋 Archivos de Configuración

### `.env`
Variables de entorno para:
- Puerto del servidor
- Ubicación de base de datos
- Claves de IA (Gemini/OpenAI)
- JWT Secret para autenticación

### `package.json`
Gestión de dependencias y scripts:
- express, sqlite3, bcrypt, jsonwebtoken, axios, dotenv

### `app.js`
Servidor principal Express:
- Inicialización de base de datos
- Middleware de autenticación JWT
- Rutas principales
- Configuración de archivos estáticos

---

## 📁 Carpetas y Archivos

### `/models` - Modelos de Datos

**student.js**
- Categorización de grados
- Validación de grados

**teacher.js**
- Validación de grados asignados
- Campos del profesor

**grade.js**
- Validación de notas (0-5)
- Validación de trimestres (1-4)

**removedStudent.js**
- Estructura de estudiantes eliminados (borrado pasivo)

---

### `/routes` - Rutas API

**auth.js**
- POST `/auth/teacher/login` - Login profesor
- POST `/auth/student/login` - Login estudiante
- POST `/auth/teacher/register` - Registro profesor
- POST `/auth/student/register` - Registro estudiante

**students.js**
- GET `/students` - Obtener todos
- GET `/students/:id` - Obtener uno
- GET `/students/removed` - Obtener eliminados
- POST `/students` - Crear
- PUT `/students/:id` - Actualizar
- DELETE `/students/:id` - Eliminar (pasivo)

**teachers.js**
- GET `/teachers` - Obtener todos
- GET `/teachers/:id` - Obtener uno
- POST `/teachers` - Crear
- PUT `/teachers/:id` - Actualizar
- DELETE `/teachers/:id` - Eliminar

**grades.js**
- GET `/grades/student/:studentId` - Notas del estudiante
- GET `/grades/teacher/:teacherId` - Notas del profesor
- POST `/grades` - Crear calificación
- PUT `/grades/:id` - Actualizar calificación
- DELETE `/grades/:id` - Eliminar calificación
- POST `/grades/bulk-update` - Actualizar múltiples

**assistant.js**
- POST `/assistant/ask` - Consultar IA

---

### `/public` - Frontend

#### `/html`

**login.html**
- Página principal de autenticación
- Tabs para profesor/estudiante
- Formulario de login y registro
- Validación de contraseñas

**teacher-portal.html**
- Panel del profesor
- Información personal
- Tabla de estudiantes y notas
- Selector de trimestre
- Banner de asistente IA

**student-portal.html**
- Panel del estudiante
- Información personal
- Tabla de calificaciones
- Formulario para asistente IA

#### `/css`

**styles.css** (~450 líneas)
- Estilos login responsive
- Estilos portal profesor
- Estilos portal estudiante
- Navbar y cards
- Tablas y formularios
- Media queries para móvil

#### `/js`

**login.js**
- Gestión de tabs
- Lógica de login/registro
- Validación de contraseñas
- Almacenamiento de token

**teacher.js**
- Carga de información del profesor
- Obtención de estudiantes y notas
- Renderizado de tabla de calificaciones
- Guardado de calificaciones
- Consulta al asistente IA
- Logout

**student.js**
- Carga de información del estudiante
- Obtención de calificaciones
- Visualización de notas
- Consulta al asistente IA
- Logout

---

### `/docs` - Documentación

**README.md**
- Descripción general del proyecto
- Estructura de grados
- Estructura del proyecto
- Base de datos
- Tecnologías
- Roles y accesos

**REQUISITOS.md**
- Requisitos funcionales (RF1-RF8)
- Requisitos no funcionales (RNF1-RNF6)
- Matriz de trazabilidad

**API.md**
- Documentación completa de endpoints
- Ejemplos de requests/responses
- Headers requeridos
- Códigos de error

**THUNDER_CLIENT.json**
- Colección de pruebas para Thunder Client
- Rutas agrupadas por funcionalidad
- Ejemplos de payloads

---

## 📄 Archivos Raíz

**README.md**
- Descripción corta
- Instrucciones de inicio rápido
- Enlaces a documentación
- Características principales

**INSTALACION.md**
- Guía paso a paso de instalación
- Requisitos previos
- Configuración de .env
- Solución de problemas
- Testing con Thunder Client

**EJEMPLO_USO.md**
- 12 ejemplos de uso de la API con curl
- Flujo completo de usuario
- Ejemplos de respuestas
- Códigos HTTP
- Notas importantes

**DATOS_EJEMPLO.sql**
- Script SQL para poblar datos de prueba
- 3 profesores
- 11 estudiantes distribuidos en grados 2, 6, 7
- Calificaciones de ejemplo

**INDICE.md**
- Este archivo
- Descripción de todos los componentes

---

## 🗄️ Base de Datos

### Tabla `students`
```sql
id INTEGER PRIMARY KEY
firstName, lastName TEXT
grade INTEGER (0-11)
gradeCategory TEXT ('primaria' o 'secundaria')
documentType, documentNumber TEXT
email, phone TEXT
password TEXT (bcrypt)
createdAt DATETIME
```

### Tabla `teachers`
```sql
id INTEGER PRIMARY KEY
firstName, lastName TEXT
email TEXT UNIQUE
documentNumber TEXT
password TEXT (bcrypt)
gradeAssigned INTEGER (0-11)
subject TEXT
createdAt DATETIME
```

### Tabla `grades`
```sql
id INTEGER PRIMARY KEY
studentId, teacherId INTEGER (FK)
subject TEXT
score DECIMAL (0-5)
quarter INTEGER (1-4)
period INTEGER
createdAt, updatedAt DATETIME
```

### Tabla `removed_students`
```sql
id INTEGER PRIMARY KEY
studentId INTEGER
firstName, lastName TEXT
grade INTEGER
gradeCategory TEXT
documentType, documentNumber TEXT
email, phone TEXT
removedAt DATETIME
```

---

## 🔐 Autenticación

- **JWT**: Tokens con expiración de 8 horas
- **Bcrypt**: Encriptación de contraseñas
- **Middleware**: Validación en rutas protegidas

---

## 🚀 Flujo de Ejecución

1. **npm install** - Instala dependencias
2. **npm start** - Inicia servidor en puerto 3000
3. **http://localhost:3000** - Abre login
4. Profesor o estudiante se registra/loguea
5. JWT se almacena en localStorage
6. Token se envía en headers Authorization
7. Acceso a portales respectivos

---

## 📊 Estadísticas

- **Archivos HTML**: 3 (login, teacher, student)
- **Archivos JavaScript**: 4 (app.js + 3 scripts)
- **Archivos CSS**: 1 (~450 líneas)
- **Rutas API**: 5 módulos (auth, students, teachers, grades, assistant)
- **Tablas BD**: 4 (students, teachers, grades, removed_students)
- **Documentación**: 6 archivos

---

## ✅ Funcionalidades Implementadas

✅ Autenticación JWT con contraseñas encriptadas
✅ Login/Registro para profesor y estudiante
✅ CRUD completo de estudiantes
✅ CRUD completo de profesores
✅ Ingreso y gestión de calificaciones
✅ Borrado pasivo de estudiantes
✅ Portal del profesor con tabla de notas
✅ Portal del estudiante con visualización de notas
✅ Integración con asistente IA (Gemini/OpenAI)
✅ Base de datos SQLite con estructura relacional
✅ Validación de datos en entrada
✅ Interfaz responsive
✅ Documentación completa

---

**Última actualización**: Abril 23, 2026
**Versión**: 1.0.0
