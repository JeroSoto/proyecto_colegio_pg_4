const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const gradeRoutes = require('./routes/grades');
const authRoutes = require('./routes/auth');
const assistantRoutes = require('./routes/assistant');
const documentRoutes = require('./routes/documents');

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_FILE = process.env.DATABASE_FILE || './data/school.db';

const dataDir = path.dirname(DATABASE_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DATABASE_FILE, (err) => {
  if (err) {
    console.error('Error al conectar la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite en', DATABASE_FILE);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

app.use((req, res, next) => {
  req.db = db;
  next();
});

const initTables = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        grade INTEGER NOT NULL,
        gradeCategory TEXT NOT NULL,
        documentType TEXT,
        documentNumber TEXT NOT NULL UNIQUE,
        email TEXT,
        phone TEXT,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        documentNumber TEXT,
        password TEXT NOT NULL,
        gradeAssigned INTEGER NOT NULL,
        subject TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        teacherId INTEGER NOT NULL,
        subject TEXT NOT NULL,
        score DECIMAL(3,1) NOT NULL,
        quarter INTEGER NOT NULL,
        period INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(studentId) REFERENCES students(id),
        FOREIGN KEY(teacherId) REFERENCES teachers(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS removed_students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        grade INTEGER NOT NULL,
        gradeCategory TEXT NOT NULL,
        documentType TEXT,
        documentNumber TEXT,
        email TEXT,
        phone TEXT,
        removedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        teacherId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(studentId) REFERENCES students(id),
        FOREIGN KEY(teacherId) REFERENCES teachers(id)
      )
    `);
  });
};

initTables();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor activo' });
});

app.use('/api/auth', authRoutes(db, bcrypt, jwt));
app.use('/api/students', authMiddleware, studentRoutes(db));
app.use('/api/teachers', authMiddleware, teacherRoutes(db));
app.use('/api/grades', authMiddleware, gradeRoutes(db));
app.use('/api/documents', authMiddleware, documentRoutes(db));
app.use('/api/assistant', authMiddleware, assistantRoutes());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
