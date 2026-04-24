# Requisitos Funcionales y No Funcionales

## Requisitos Funcionales

### RF1: Gestión de Estudiantes
- **RF1.1**: El sistema debe permitir registrar un nuevo estudiante con: nombres, apellidos, grado, tipo y número de documento, correo y teléfono
- **RF1.2**: El sistema debe validar que el grado esté en el rango 0-11 (Transición a Once)
- **RF1.3**: El sistema debe clasificar automáticamente el estudiante en "primaria" (0-5) o "secundaria" (6-11)
- **RF1.4**: El sistema debe permitir actualizar datos del estudiante
- **RF1.5**: El sistema debe implementar eliminación pasiva de estudiantes (registra en tabla aparte, no borra físicamente)
- **RF1.6**: El sistema debe permitir ver lista de estudiantes eliminados

### RF2: Gestión de Profesores
- **RF2.1**: El sistema debe permitir registrar un profesor con: nombres, apellidos, email, documento, contraseña y grado asignado
- **RF2.2**: El sistema debe permitir actualizar datos del profesor
- **RF2.3**: El sistema debe permitir ver lista de profesores
- **RF2.4**: El sistema debe permitir eliminar un profesor

### RF3: Gestión de Calificaciones
- **RF3.1**: El sistema debe permitir al profesor ingresar calificaciones para estudiantes de su grado
- **RF3.2**: Las calificaciones deben incluir: estudiante, materia, calificación numérica (0-5), trimestre (1-4)
- **RF3.3**: El profesor solo puede ver/modificar estudiantes asignados a su grado
- **RF3.4**: El sistema debe permitir actualizar calificaciones ya ingresadas
- **RF3.5**: El sistema debe permitir eliminar una calificación

### RF4: Autenticación y Autorización
- **RF4.1**: El sistema debe tener login para profesores
- **RF4.2**: El sistema debe tener login para estudiantes
- **RF4.3**: El sistema debe usar JWT para mantener sesión
- **RF4.4**: El profesor solo puede ver estudiantes y calificaciones de su grado
- **RF4.5**: El estudiante solo puede ver sus propias calificaciones
- **RF4.6**: El administrador puede acceder a todo

### RF5: Portal del Estudiante
- **RF5.1**: El estudiante puede ingresar con su número de documento y contraseña
- **RF5.2**: El estudiante puede ver sus calificaciones de todos sus profesores
- **RF5.3**: El estudiante puede consultar el asistente IA

### RF6: Portal del Profesor
- **RF6.1**: El profesor puede ingresar con su email y contraseña
- **RF6.2**: El profesor ve una tabla con los estudiantes de su grado
- **RF6.3**: El profesor puede ingresar notas en un campo de entrada en la tabla
- **RF6.4**: El profesor puede guardar todas las notas con un botón
- **RF6.5**: El profesor ve un banner con el asistente IA al lado de la tabla
- **RF6.6**: El profesor puede consultar el asistente IA sobre la clase

### RF7: Asistente IA
- **RF7.1**: El sistema debe permitir hacer preguntas al asistente IA
- **RF7.2**: El asistente puede usar OpenAI o Gemini según configuración
- **RF7.3**: El asistente responde consultas sobre pedagogía y educación

### RF8: Panel de Administración
- **RF8.1**: El administrador ve un dashboard con opción de gestionar estudiantes
- **RF8.2**: El administrador puede crear, leer, actualizar y eliminar estudiantes
- **RF8.3**: El administrador puede ver estudiantes activos y eliminados

## Requisitos No Funcionales

### RNF1: Rendimiento
- **RNF1.1**: Las consultas deben responder en menos de 2 segundos
- **RNF1.2**: La base de datos debe soportar mínimo 1000 estudiantes
- **RNF1.3**: Las consultas al asistente IA deben responder en menos de 5 segundos

### RNF2: Seguridad
- **RNF2.1**: Las contraseñas deben estar hasheadas en la base de datos
- **RNF2.2**: Los tokens JWT deben expirar en 8 horas
- **RNF2.3**: El acceso a datos sensibles requiere autenticación
- **RNF2.4**: Las contraseñas deben tener mínimo 8 caracteres

### RNF3: Usabilidad
- **RNF3.1**: La interfaz debe ser responsive (funcionar en móvil y desktop)
- **RNF3.2**: Los mensajes de error deben ser claros y en español
- **RNF3.3**: La navegación debe ser intuitiva

### RNF4: Mantenibilidad
- **RNF4.1**: El código debe ser modular y fácil de extender
- **RNF4.2**: Debe haber documentación clara de API
- **RNF4.3**: Las rutas deben estar organizadas por funcionalidad

### RNF5: Disponibilidad
- **RNF5.1**: El sistema debe estar disponible 24/7
- **RNF5.2**: Los datos deben tener backup regular

### RNF6: Compatibilidad
- **RNF6.1**: El sistema debe funcionar en Chrome, Firefox y Safari recientes
- **RNF6.2**: El backend debe funcionar en Windows, Mac y Linux

## Matriz de Trazabilidad

| Requisito | Archivo/Ruta | Estado |
|-----------|-------------|--------|
| RF1.1-1.6 | routes/students.js | Implementado |
| RF2.1-2.4 | routes/teachers.js | Por implementar |
| RF3.1-3.5 | routes/grades.js | Por implementar |
| RF4.1-4.6 | routes/auth.js | Por implementar |
| RF5.1-5.3 | student-portal.html, student.js | Por implementar |
| RF6.1-6.6 | teacher-portal.html, teacher.js | Por implementar |
| RF7.1-7.3 | routes/assistant.js | Parcialmente implementado |
| RF8.1-8.3 | index.html, main.js | Implementado |
