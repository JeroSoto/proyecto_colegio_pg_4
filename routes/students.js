const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (models) => {
  const router = express.Router();
  const { Student, RemovedStudent } = models;

  router.get('/', async (req, res) => {
    try {
      const { grade } = req.query;
      const whereClause = {};
      if (grade !== undefined && grade !== '') {
        whereClause.grade = grade;
      }

      const rows = await Student.findAll({
        where: whereClause,
        order: [['grade', 'ASC'], ['lastName', 'ASC'], ['firstName', 'ASC']]
      });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const row = await Student.findByPk(id);
      if (!row) return res.status(404).json({ error: 'Estudiante no encontrado' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/removed', async (req, res) => {
    try {
      const rows = await RemovedStudent.findAll({
        order: [['removedAt', 'DESC']]
      });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    const { firstName, lastName, grade, documentType, documentNumber, email, phone, password } = req.body;
    const gradeCategory = Student.getGradeCategory(grade);

    if (grade < 0 || grade > 11) {
      return res.status(400).json({ error: 'El grado debe estar entre 0 y 11' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password || documentNumber, 10);
      const student = await Student.create({
        firstName,
        lastName,
        grade,
        gradeCategory,
        documentType,
        documentNumber,
        email,
        phone,
        password: hashedPassword
      });
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, grade, documentType, documentNumber, email, phone } = req.body;
    const gradeCategory = Student.getGradeCategory(grade);

    if (grade < 0 || grade > 11) {
      return res.status(400).json({ error: 'El grado debe estar entre 0 y 11' });
    }

    try {
      const student = await Student.findByPk(id);
      if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

      await student.update({
        firstName,
        lastName,
        grade,
        gradeCategory,
        documentType,
        documentNumber,
        email,
        phone
      });
      res.json(student);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const student = await Student.findByPk(id);
      if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

      // Mover a removed_students
      await RemovedStudent.create({
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        grade: student.grade,
        gradeCategory: student.gradeCategory,
        documentType: student.documentType,
        documentNumber: student.documentNumber,
        email: student.email,
        phone: student.phone
      });

      await student.destroy();
      res.json({ message: 'Estudiante eliminado de forma pasiva y movido a la base de datos de removed_students' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
