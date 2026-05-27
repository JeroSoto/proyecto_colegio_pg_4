const express = require('express');

module.exports = (models, bcrypt, jwt) => {
  const router = express.Router();
  const { Student, Teacher, Parent } = models;
  const { Op } = require('sequelize');
  const JWT_SECRET = String(process.env.JWT_SECRET || 'secret123');

  // LOGIN UNIFICADO (Detección automática de rol)
  router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    console.log(`Intento de login unificado para: ${identifier}`);

    try {
      // 1. Buscar en Profesores (por email o número de documento)
      let user = await Teacher.findOne({ where: { [Op.or]: [{ email: identifier }, { documentNumber: identifier }] } });
      let type = 'teacher';

      // 2. Si no es profesor, buscar en Padres (por email o documento)
      if (!user) {
        user = await Parent.findOne({ where: { [Op.or]: [{ email: identifier }, { documentNumber: identifier }] } });
        type = 'parent';
      }

      // 3. Si no es padre, buscar en Estudiantes (por documento o email)
      if (!user) {
        user = await Student.findOne({ where: { [Op.or]: [{ documentNumber: identifier }, { email: identifier }] } });
        type = 'student';
      }

      if (!user) {
        console.log('Usuario no encontrado en ninguna tabla');
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      // Verificación de contraseña robusta
      const storedPassword = (user.password || '').trim();
      const providedPassword = (password || '').trim();
      let validPassword = false;

      console.log(`Comparando para ${identifier}: Provista[${providedPassword}] vs Guardada[${storedPassword.startsWith('$') ? 'HASHED' : storedPassword}]`);

      if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2y$')) {
        validPassword = await bcrypt.compare(providedPassword, storedPassword);
      } else {
        validPassword = (providedPassword === storedPassword);
      }

      if (!validPassword) {
        console.log(`❌ Contraseña incorrecta para ${identifier}`);
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      // Generar token según el tipo
      const payload = { id: user.id, type: type };
      if (type === 'teacher') {
        payload.email = user.email;
        payload.role = user.role;
        payload.grade = user.gradeAssigned;
      } else if (type === 'parent') {
        payload.email = user.email;
      } else {
        payload.documentNumber = user.documentNumber;
        payload.grade = user.grade;
      }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

      console.log(`Login exitoso: ${user.firstName} (${type})`);
      
      return res.json({
        token,
        type,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          documentNumber: user.documentNumber,
          role: user.role,
          subject: user.subject,
          grade: user.grade || user.gradeAssigned
        }
      });

    } catch (err) {
      console.error('Error en login unificado:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.post('/teacher/register', async (req, res) => {
    const { firstName, lastName, email, documentNumber, password, gradeAssigned, subject } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const teacher = await Teacher.create({
        firstName, lastName, email, documentNumber, password: hashedPassword, gradeAssigned, subject
      });
      res.status(201).json({ id: teacher.id, email: teacher.email });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/student/register', async (req, res) => {
    const { firstName, lastName, grade, documentNumber, email, phone, documentType, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const student = await Student.create({
        firstName, lastName, grade, gradeCategory: Student.getGradeCategory(grade),
        documentType, documentNumber, email, phone, password: hashedPassword
      });
      res.status(201).json({ id: student.id, documentNumber: student.documentNumber });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
