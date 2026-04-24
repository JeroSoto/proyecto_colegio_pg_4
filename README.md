# 📚 Sistema de Administración Académica - Colegio

Sistema web completo para administración de estudiantes, calificaciones y acceso a portales de profesor y estudiante con integración de IA.

## 🚀 Inicio Rápido

```bash
npm install
npm start
```

Abre http://localhost:3000 en tu navegador.

## 📋 Documentación

- **[INSTALACION.md](INSTALACION.md)** - Guía paso a paso de instalación
- **[docs/README.md](docs/README.md)** - Descripción detallada del proyecto
- **[docs/REQUISITOS.md](docs/REQUISITOS.md)** - Requisitos funcionales y no funcionales
- **[docs/API.md](docs/API.md)** - Documentación de endpoints API
- **[docs/THUNDER_CLIENT.json](docs/THUNDER_CLIENT.json)** - Colección de pruebas

## ✨ Características Principales

✅ **Autenticación** - Login para profesor y estudiante con JWT
✅ **Gestión de Estudiantes** - CRUD completo con borrado pasivo
✅ **Calificaciones** - Profesores ingresan notas por trimestre
✅ **Portales** - Acceso específico para profesor y estudiante
✅ **Asistente IA** - Integración con Gemini y OpenAI
✅ **Base de Datos** - SQLite con tablas estructuradas
✅ **Responsive** - Funciona en desktop y móvil

## 🎓 Estructura de Grados

- **Primaria** (0-5): Transición a Quinto
- **Secundaria** (6-11): Sexto a Once

## 🔧 Requisitos

- Node.js v14+
- npm
- Clave de API (Gemini o OpenAI) - opcional

## 📁 Carpetas Principales

```
├── app.js              Servidor Express
├── routes/             Rutas API
├── models/             Modelos de datos
├── public/             Frontend (HTML, CSS, JS)
├── data/               Base de datos SQLite
└── docs/               Documentación
```

## 💡 Ejemplo de Uso

### Registrar un Profesor
```bash
POST /api/auth/teacher/register
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@colegio.com",
  "documentNumber": "1234567890",
  "password": "password123",
  "gradeAssigned": 6,
  "subject": "Matemáticas"
}
```

### Login y Obtener Token
```bash
POST /api/auth/teacher/login
{
  "email": "juan@colegio.com",
  "password": "password123"
}
```

### Ingresar una Calificación
```bash
POST /api/grades
{
  "studentId": 1,
  "teacherId": 5,
  "subject": "Matemáticas",
  "score": 4.5,
  "quarter": 1,
  "period": 2026
}
```

## 🤖 Integración con IA

Soporta **Gemini** y **OpenAI**. Configura en `.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=tu_clave_aqui
```

O para OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=tu_clave_aqui
```

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT con expiración de 8 horas
- Autenticación en todas las rutas protegidas
- Validación de datos en entrada

## 📞 Soporte

Revisa la documentación en `docs/` o `INSTALACION.md` para más detalles.

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026
