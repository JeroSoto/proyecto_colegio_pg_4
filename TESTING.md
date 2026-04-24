# Guía de Testing - Proyecto Colegio

## ✅ Checklist de Pruebas Funcionales

### 1️⃣ AUTENTICACIÓN

#### Profesor - Registro ✓
- [ ] Ir a http://localhost:3000
- [ ] Seleccionar pestaña "Profesor"
- [ ] Clic en "Registrarse"
- [ ] Llenar formulario:
  - Nombres: Juan
  - Apellidos: Pérez
  - Correo: juan@colegio.com
  - Documento: 1122334455
  - Grado: 6
  - Materia: Matemáticas
  - Contraseña: password123
  - Confirmar: password123
- [ ] Debe mostrar "Profesor registrado exitosamente"
- [ ] Volver al login

#### Profesor - Login ✓
- [ ] Ingresar correo: juan@colegio.com
- [ ] Ingresar contraseña: password123
- [ ] Clic en "Ingresar como Profesor"
- [ ] Debe redirigir al portal del profesor

#### Estudiante - Registro ✓
- [ ] Ir a http://localhost:3000
- [ ] Seleccionar pestaña "Estudiante"
- [ ] Clic en "Registrarse"
- [ ] Llenar formulario:
  - Nombres: Carlos
  - Apellidos: López
  - Documento: 1234567890
  - Grado: 6
  - Contraseña: password123
  - Confirmar: password123
- [ ] Debe mostrar "Estudiante registrado exitosamente"
- [ ] Volver al login

#### Estudiante - Login ✓
- [ ] Ingresar documento: 1234567890
- [ ] Ingresar contraseña: password123
- [ ] Clic en "Ingresar como Estudiante"
- [ ] Debe redirigir al portal del estudiante

---

### 2️⃣ PORTAL DEL PROFESOR

#### Información del Profesor ✓
- [ ] Debe mostrar nombre: "Juan Pérez"
- [ ] Debe mostrar grado asignado: "Grado 6"
- [ ] Debe mostrar materia: "Matemáticas"

#### Tabla de Calificaciones ✓
- [ ] Debe mostrar tabla vacía (sin estudiantes de grado 6 aún)
- [ ] Debe tener columnas: Nombre, Apellido, Documento, Nota
- [ ] Selector de trimestre (1, 2, 3, 4)

#### Ingresar Notas ✓
(Primero registra otro estudiante de grado 6)
- [ ] La tabla debe mostrar el nuevo estudiante
- [ ] Ingresar nota: 4.5
- [ ] Seleccionar trimestre: 1
- [ ] Clic en "Guardar Todas las Calificaciones"
- [ ] Debe mostrar: "¡Calificaciones guardadas exitosamente!"

#### Cambiar Trimestre ✓
- [ ] Cambiar a trimestre 2
- [ ] Tabla debe mostrar notas del trimestre 2 (vacía inicialmente)
- [ ] Ingresar nuevas notas
- [ ] Guardar nuevamente

#### Asistente IA ✓
- [ ] En el banner de IA, escribir pregunta: "¿Cómo enseñar geometría?"
- [ ] Clic en "Enviar"
- [ ] Debe aparecer respuesta (si tiene clave de IA configurada)
- [ ] Si no tiene clave, mostrará error

#### Logout ✓
- [ ] Clic en "Cerrar Sesión"
- [ ] Debe redirigir al login

---

### 3️⃣ PORTAL DEL ESTUDIANTE

#### Información del Estudiante ✓
- [ ] Debe mostrar nombre: "Carlos López"
- [ ] Debe mostrar grado: "Grado 6"
- [ ] Debe mostrar categoría: "Secundaria"

#### Tabla de Calificaciones ✓
- [ ] Inicialmente "Aún no tienes calificaciones registradas"
- [ ] Después de que profesor ingrese notas, debe mostrar:
  - Materia: Matemáticas
  - Profesor: Juan Pérez
  - Nota: 4.5
  - Trimestre: 1
  - Período: 2026

#### Actualizar Calificaciones ✓
- [ ] Login como profesor
- [ ] Cambiar nota de estudiante a 4.8
- [ ] Guardar
- [ ] Login como estudiante
- [ ] La nota debe actualizar a 4.8

#### Asistente IA ✓
- [ ] Escribir pregunta: "¿Cuál es la fórmula de Pitágoras?"
- [ ] Debe recibir respuesta (si IA está configurada)

#### Logout ✓
- [ ] Clic en "Cerrar Sesión"
- [ ] Debe redirigir al login

---

### 4️⃣ VALIDACIONES

#### Contraseñas ✓
- [ ] Registrarse con contraseña < 8 caracteres
- [ ] Debe mostrar error: "La contraseña debe tener mínimo 8 caracteres"
- [ ] Registrarse con contraseñas diferentes
- [ ] Debe mostrar error: "Las contraseñas no coinciden"

#### Grados ✓
- [ ] Registrar estudiante con grado -1
- [ ] El servidor debe rechazar la solicitud
- [ ] Registrar estudiante con grado 12
- [ ] El servidor debe rechazar la solicitud
- [ ] Registrar con grado 0-11: ✓ Debe funcionar

#### Notas ✓
- [ ] Ingresar nota -1
- [ ] El servidor debe rechazar (nota < 0)
- [ ] Ingresar nota 5.5
- [ ] El servidor debe rechazar (nota > 5)
- [ ] Ingresar nota 0-5: ✓ Debe funcionar

---

### 5️⃣ BORRADO PASIVO DE ESTUDIANTES

(Este feature se prueba desde API, no desde portal actual)

#### API Request ✓
```bash
curl -X DELETE http://localhost:3000/api/students/1 \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Respuesta: "Estudiante eliminado de forma pasiva..."
- [ ] Estudiante desaparece de lista activa
- [ ] Aparece en lista de eliminados

#### Ver Eliminados ✓
```bash
curl -X GET http://localhost:3000/api/students/removed \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Debe mostrar estudiante eliminado con timestamp

---

### 6️⃣ SEGURIDAD

#### Token JWT ✓
- [ ] Abrir DevTools (F12)
- [ ] Ir a Application → Local Storage
- [ ] Debe haber "token" guardado
- [ ] Si se borra el token manualmente, debe redirigir al login

#### Acceso sin Autenticación ✓
- [ ] Ir a http://localhost:3000/teacher-portal.html sin token
- [ ] Debe redirigir al login

#### Profesor vs Estudiante ✓
- [ ] Profesor solo debe ver estudiantes de su grado
- [ ] Si registras profesor de grado 7, no debe ver estudiantes de grado 6

---

### 7️⃣ RESPONSIVIDAD

#### Desktop ✓
- [ ] Abrir en resolución 1920x1080
- [ ] Todos los elementos deben verse correctamente
- [ ] Tabla de notas debe ser legible

#### Tablet ✓
- [ ] Abrir con DevTools en modo iPad (768x1024)
- [ ] Elementos deben adaptarse
- [ ] Tabla debe ser legible o scrolleable

#### Móvil ✓
- [ ] Abrir con DevTools en modo iPhone (375x667)
- [ ] Todos los elementos deben ser usables
- [ ] Formularios deben ser fáciles de llenar

---

### 8️⃣ TESTING CON THUNDER CLIENT

#### Importar Colección ✓
- [ ] Abrir Thunder Client en VS Code
- [ ] Clic en "..." → "Import Collection"
- [ ] Seleccionar: docs/THUNDER_CLIENT.json
- [ ] Debe importar todas las rutas

#### Probar Login ✓
- [ ] Request: POST /api/auth/teacher/login
- [ ] Body: {"email": "juan@colegio.com", "password": "password123"}
- [ ] Debe retornar token y datos del profesor
- [ ] Copiar token para usar en otros requests

#### Probar CRUD ✓
- [ ] GET /api/students (debe listar estudiantes)
- [ ] POST /api/students (crear nuevo)
- [ ] PUT /api/students/:id (actualizar)
- [ ] DELETE /api/students/:id (eliminar)

#### Probar Notas ✓
- [ ] GET /api/grades/teacher/:id (notas del profesor)
- [ ] GET /api/grades/student/:id (notas del estudiante)
- [ ] POST /api/grades (crear calificación)
- [ ] PUT /api/grades/:id (actualizar)

---

### 9️⃣ LOGGING Y CONSOLA

#### Console del Navegador (F12) ✓
- [ ] No debe haber errores rojos
- [ ] Puede haber warnings amarillos (normal)
- [ ] Requests XHR deben tener status 200, 201, 400, 404

#### Terminal del Servidor ✓
- [ ] Debe mostrar mensajes sin errores críticos
- [ ] Cada request debe registrarse

---

## 🎯 PRUEBAS RECOMENDADAS EN ORDEN

1. Instalar dependencias (`npm install`)
2. Iniciar servidor (`npm start`)
3. Prueba 1: Registrar profesor
4. Prueba 2: Login profesor
5. Prueba 3: Registrar estudiante (grado 6)
6. Prueba 4: Registrar otro estudiante (grado 6)
7. Prueba 5: Login profesor → Ingresar notas
8. Prueba 6: Login estudiante → Ver notas
9. Prueba 7: Validaciones (contraseñas, grados, notas)
10. Prueba 8: Thunder Client (API)
11. Prueba 9: Responsividad (redimensionar navegador)
12. Prueba 10: Logout y volver a login

---

## 🐛 SI ENCUENTRA ERRORES

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Port already in use"
Cambiar en `.env`:
```
PORT=3001
```

### Error de base de datos
```bash
rmdir /s data
npm start
```

### Token expirado
Volver a loguearse (JWT expira cada 8 horas)

---

## 📊 CASOS DE PRUEBA ESPECIALES

### Múltiples Trimestres
1. Profesor ingresa notas trimestre 1
2. Cambia a trimestre 2 e ingresa notas diferentes
3. Estudiante debe ver todas las notas de todos los trimestres

### Múltiples Profesores
1. Registrar profesor de grado 6 (Matemáticas)
2. Registrar profesor de grado 6 (Lenguaje)
3. Ambos deben ver los mismos estudiantes
4. Cada uno ingresa notas de su materia
5. Estudiante debe ver notas de ambos

### Profesor Cambia Grado
(Requiere API directa o panel admin)
1. Profesor de grado 6
2. Cambiar a grado 7
3. Ya no debe ver estudiantes de grado 6
4. Debe ver estudiantes de grado 7

---

**¡Listo! Sigue este checklist para validar que todo funciona correctamente.**
