const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:'/var/www/empresas-app/proyecto_colegio_pg_4/.env'});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

// Importar modelos de Sequelize
const models = require('./models');

// Importar rutas
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const gradeRoutes = require('./routes/grades');
const authRoutes = require('./routes/auth');
const assistantRoutes = require('./routes/assistant');
const documentRoutes = require('./routes/documents');
const courseRoutes = require('./routes/courses');
const parentRoutes = require('./routes/parents');


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de Logs
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no encontrado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Pasar modelos a cada request si es necesario
app.use((req, res, next) => {
  req.models = models;
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor activo con Sequelize' });
});

// Registrar rutas inyectando los modelos
const scheduleRoutes = require('./routes/schedules');

app.use('/api/auth', authRoutes(models, bcrypt, jwt));
app.use('/api/students', authMiddleware, studentRoutes(models));
app.use('/api/teachers', authMiddleware, teacherRoutes(models));
app.use('/api/grades', authMiddleware, gradeRoutes(models));
app.use('/api/documents', authMiddleware, documentRoutes(models));
app.use('/api/assistant', assistantRoutes()); // Público para que todos puedan usarlo
app.use('/api/courses', authMiddleware, courseRoutes(models));
app.use('/api/parents', authMiddleware, parentRoutes(models));
app.use('/api/schedules', authMiddleware, scheduleRoutes(models));

// Manejador de errores global para la API
app.use((err, req, res, next) => {
  console.error('🔥 Error detectado:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'html', 'index.html'));
});

// Sincronización de Base de Datos e inicio del servidor
models.sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
    console.log('Asegúrate de que el archivo database.sqlite se pueda crear.');
  });
