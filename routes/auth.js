const express = require('express');

module.exports = (db, bcrypt, jwt) => {
  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

  router.post('/teacher/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM teachers WHERE email = ?', [email], async (err, teacher) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!teacher) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

      const validPassword = await bcrypt.compare(password, teacher.password);
      if (!validPassword) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

      const token = jwt.sign(
        { id: teacher.id, type: 'teacher', email: teacher.email, grade: teacher.gradeAssigned },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        teacher: {
          id: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          gradeAssigned: teacher.gradeAssigned,
          subject: teacher.subject
        }
      });
    });
  });

  router.post('/student/login', (req, res) => {
    const { documentNumber, password } = req.body;

    db.get('SELECT * FROM students WHERE documentNumber = ?', [documentNumber], async (err, student) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!student) return res.status(401).json({ error: 'Documento o contraseña incorrectos' });

      const validPassword = await bcrypt.compare(password, student.password);
      if (!validPassword) return res.status(401).json({ error: 'Documento o contraseña incorrectos' });

      const token = jwt.sign(
        { id: student.id, type: 'student', documentNumber: student.documentNumber, grade: student.grade },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          documentNumber: student.documentNumber,
          grade: student.grade,
          gradeCategory: student.gradeCategory
        }
      });
    });
  });

  router.post('/teacher/register', async (req, res) => {
    const { firstName, lastName, email, documentNumber, password, gradeAssigned, subject } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO teachers (firstName, lastName, email, documentNumber, password, gradeAssigned, subject)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const params = [firstName, lastName, email, documentNumber, hashedPassword, gradeAssigned, subject];

      db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, firstName, lastName, email, gradeAssigned, subject });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/student/register', async (req, res) => {
    const { firstName, lastName, grade, documentNumber, email, phone, documentType, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const gradeCategory = grade <= 5 ? 'primaria' : 'secundaria';
      const sql = `INSERT INTO students (firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, password)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, hashedPassword];

      db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, firstName, lastName, grade, gradeCategory, documentNumber });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
