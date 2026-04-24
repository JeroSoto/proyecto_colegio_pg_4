# Documentación de API

## Base URL
```
http://localhost:3000/api
```

## Headers Requeridos
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

---

## Autenticación

### Login Profesor
**POST** `/auth/teacher/login`

**Body:**
```json
{
  "email": "profesor@colegio.com",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "teacher": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "profesor@colegio.com",
    "gradeAssigned": 6,
    "subject": "Matemáticas"
  }
}
```

### Login Estudiante
**POST** `/auth/student/login`

**Body:**
```json
{
  "documentNumber": "1234567890",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "student": {
    "id": 1,
    "firstName": "Carlos",
    "lastName": "López",
    "documentNumber": "1234567890",
    "grade": 6,
    "gradeCategory": "secundaria"
  }
}
```

---

## Estudiantes

### Obtener todos los estudiantes
**GET** `/students`

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "Carlos",
    "lastName": "López",
    "grade": 6,
    "gradeCategory": "secundaria",
    "documentNumber": "1234567890",
    "email": "carlos@email.com",
    "phone": "3001234567",
    "createdAt": "2026-04-23T10:30:00Z"
  }
]
```

### Crear estudiante
**POST** `/students`

**Body:**
```json
{
  "firstName": "María",
  "lastName": "González",
  "grade": 7,
  "documentType": "CC",
  "documentNumber": "9876543210",
  "email": "maria@email.com",
  "phone": "3007654321",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 2,
  "firstName": "María",
  "lastName": "González",
  "grade": 7,
  "gradeCategory": "secundaria",
  "documentNumber": "9876543210",
  "createdAt": "2026-04-23T10:35:00Z"
}
```

### Actualizar estudiante
**PUT** `/students/:id`

**Body:**
```json
{
  "firstName": "María",
  "lastName": "González",
  "grade": 8,
  "email": "maria.new@email.com",
  "phone": "3007654321"
}
```

### Eliminar estudiante (pasivo)
**DELETE** `/students/:id`

**Response:**
```json
{
  "message": "Estudiante eliminado de forma pasiva y movido a removed_students"
}
```

### Obtener estudiantes eliminados
**GET** `/students/removed`

---

## Profesores

### Obtener todos los profesores
**GET** `/teachers`

### Obtener profesor por ID
**GET** `/teachers/:id`

### Crear profesor
**POST** `/teachers`

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@colegio.com",
  "documentNumber": "1122334455",
  "password": "password123",
  "gradeAssigned": 6,
  "subject": "Matemáticas"
}
```

### Actualizar profesor
**PUT** `/teachers/:id`

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "gradeAssigned": 7,
  "subject": "Física"
}
```

### Eliminar profesor
**DELETE** `/teachers/:id`

---

## Calificaciones

### Obtener calificaciones de un estudiante
**GET** `/grades/student/:studentId`

**Response:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "teacherId": 5,
    "subject": "Matemáticas",
    "score": 4.5,
    "quarter": 1,
    "period": 2026,
    "teacherName": "Juan Pérez"
  }
]
```

### Obtener calificaciones de estudiantes de un profesor
**GET** `/grades/teacher/:teacherId`

**Response:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "studentName": "Carlos López",
    "subject": "Matemáticas",
    "score": 4.5,
    "quarter": 1,
    "period": 2026
  }
]
```

### Crear calificación
**POST** `/grades`

**Body:**
```json
{
  "studentId": 1,
  "teacherId": 5,
  "subject": "Matemáticas",
  "score": 4.5,
  "quarter": 1,
  "period": 2026
}
```

### Actualizar calificación
**PUT** `/grades/:id`

**Body:**
```json
{
  "score": 4.8,
  "quarter": 1
}
```

### Eliminar calificación
**DELETE** `/grades/:id`

---

## Asistente IA

### Hacer pregunta al asistente
**POST** `/assistant/ask`

**Body:**
```json
{
  "question": "¿Cuál es la mejor forma de enseñar fracciones en sexto grado?"
}
```

**Response:**
```json
{
  "answer": "Las fracciones se enseñan mejor usando materiales visuales como..."
}
```

---

## Códigos de Error

| Código | Significado |
|--------|-----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

