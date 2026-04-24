# Ejemplo de Uso Completo de la API

Este archivo muestra un flujo completo de uso de la API.

## 1. Registro de Profesor

```bash
curl -X POST http://localhost:3000/api/auth/teacher/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@colegio.com",
    "documentNumber": "1122334455",
    "password": "password123",
    "gradeAssigned": 6,
    "subject": "Matemáticas"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@colegio.com",
  "gradeAssigned": 6,
  "subject": "Matemáticas"
}
```

## 2. Login de Profesor

```bash
curl -X POST http://localhost:3000/api/auth/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@colegio.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "teacher": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@colegio.com",
    "gradeAssigned": 6,
    "subject": "Matemáticas"
  }
}
```

**Guarda el token para usar en futuras peticiones:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 3. Registro de Estudiante

```bash
curl -X POST http://localhost:3000/api/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Carlos",
    "lastName": "López",
    "grade": 6,
    "documentNumber": "1234567890",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "firstName": "Carlos",
  "lastName": "López",
  "grade": 6,
  "gradeCategory": "secundaria",
  "documentNumber": "1234567890"
}
```

## 4. Login de Estudiante

```bash
curl -X POST http://localhost:3000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "documentNumber": "1234567890",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

## 5. Obtener Todos los Estudiantes (Como Profesor)

```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "firstName": "Carlos",
    "lastName": "López",
    "grade": 6,
    "gradeCategory": "secundaria",
    "documentNumber": "1234567890",
    "email": null,
    "phone": null,
    "createdAt": "2026-04-23T10:30:00Z"
  }
]
```

## 6. Obtener Estudiantes del Grado del Profesor

```bash
curl -X GET http://localhost:3000/api/grades/teacher/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
[
  {
    "studentId": 1,
    "studentFirstName": "Carlos",
    "studentLastName": "López",
    "grade": 6,
    "documentNumber": "1234567890",
    "id": null,
    "subject": null,
    "score": null,
    "quarter": null,
    "period": null
  }
]
```

## 7. Crear una Calificación

```bash
curl -X POST http://localhost:3000/api/grades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "studentId": 1,
    "teacherId": 1,
    "subject": "Matemáticas",
    "score": 4.5,
    "quarter": 1,
    "period": 2026
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "studentId": 1,
  "teacherId": 1,
  "subject": "Matemáticas",
  "score": 4.5,
  "quarter": 1,
  "period": 2026
}
```

## 8. Obtener Calificaciones del Estudiante

```bash
curl -X GET http://localhost:3000/api/grades/student/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "teacherId": 1,
    "subject": "Matemáticas",
    "score": 4.5,
    "quarter": 1,
    "period": 2026,
    "createdAt": "2026-04-23T10:35:00Z",
    "updatedAt": "2026-04-23T10:35:00Z",
    "teacherFirstName": "Juan",
    "teacherLastName": "Pérez"
  }
]
```

## 9. Actualizar una Calificación

```bash
curl -X PUT http://localhost:3000/api/grades/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "score": 4.8,
    "quarter": 1
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "score": 4.8,
  "quarter": 1
}
```

## 10. Consultar el Asistente IA

```bash
curl -X POST http://localhost:3000/api/assistant/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "question": "¿Cuál es la mejor forma de enseñar fracciones en sexto grado?"
  }'
```

**Respuesta:**
```json
{
  "answer": "Las fracciones se enseñan mejor usando materiales visuales como pizza, pasteles divididos, barras fraccionarias, etc. Es importante que los estudiantes vean y manipulen objetos reales para entender el concepto de división de un todo en partes iguales..."
}
```

## 11. Eliminar Estudiante (Borrado Pasivo)

```bash
curl -X DELETE http://localhost:3000/api/students/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
{
  "message": "Estudiante eliminado de forma pasiva y movido a removed_students"
}
```

## 12. Obtener Estudiantes Eliminados

```bash
curl -X GET http://localhost:3000/api/students/removed \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "firstName": "Carlos",
    "lastName": "López",
    "grade": 6,
    "gradeCategory": "secundaria",
    "documentNumber": "1234567890",
    "email": null,
    "phone": null,
    "removedAt": "2026-04-23T10:40:00Z"
  }
]
```

## Códigos de Respuesta

- **200 OK** - Solicitud exitosa
- **201 Created** - Recurso creado
- **400 Bad Request** - Datos inválidos
- **401 Unauthorized** - Token inválido o no proporcionado
- **404 Not Found** - Recurso no encontrado
- **500 Server Error** - Error en el servidor

## Notas Importantes

1. **Token JWT**: Todos los endpoints protegidos requieren el token en el header `Authorization: Bearer <token>`
2. **Contraseña**: Las contraseñas se encriptan automáticamente con bcrypt
3. **Grados**: Deben estar entre 0 (Transición) y 11 (Once)
4. **Notas**: Deben estar entre 0 y 5
5. **Trimestre**: Debe estar entre 1 y 4
6. **Período**: Generalmente es el año académico (2026, etc.)

