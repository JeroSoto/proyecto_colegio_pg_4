const express = require('express');
const { getGradeCategory } = require('../models/student');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.all('SELECT * FROM students ORDER BY grade, lastName, firstName', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Estudiante no encontrado' });
      res.json(row);
    });
  });

  router.get('/removed', (req, res) => {
    db.all('SELECT * FROM removed_students ORDER BY removedAt DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.post('/', async (req, res) => {
    const { firstName, lastName, grade, documentType, documentNumber, email, phone, password } = req.body;
    const bcrypt = require('bcrypt');
    const gradeCategory = getGradeCategory(grade);

    if (grade < 0 || grade > 11) {
      return res.status(400).json({ error: 'El grado debe estar entre 0 y 11' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password || documentNumber, 10);
      const sql = `INSERT INTO students (firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, password)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, hashedPassword];

      db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, grade, documentType, documentNumber, email, phone } = req.body;
    const gradeCategory = getGradeCategory(grade);

    if (grade < 0 || grade > 11) {
      return res.status(400).json({ error: 'El grado debe estar entre 0 y 11' });
    }

    const sql = `UPDATE students SET firstName = ?, lastName = ?, grade = ?, gradeCategory = ?, documentType = ?, documentNumber = ?, email = ?, phone = ? WHERE id = ?`;
    const params = [firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, id];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
      res.json({ id: Number(id), firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone });
    });
  });

  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM students WHERE id = ?', [id], (err, student) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

      const insertSql = `INSERT INTO removed_students (studentId, firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [student.id, student.firstName, student.lastName, student.grade, student.gradeCategory, student.documentType, student.documentNumber, student.email, student.phone];

      db.run(insertSql, params, function (insertErr) {
        if (insertErr) return res.status(500).json({ error: insertErr.message });

        db.run('DELETE FROM students WHERE id = ?', [id], function (deleteErr) {
          if (deleteErr) return res.status(500).json({ error: deleteErr.message });
          res.json({ message: 'Estudiante eliminado de forma pasiva y movido a la base de datos de removed_students' });
        });
      });
    });
  });

  return router;
};
