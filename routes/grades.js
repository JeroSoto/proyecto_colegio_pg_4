const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/student/:studentId', (req, res) => {
    const { studentId } = req.params;

    const sql = `SELECT g.*, t.firstName as teacherFirstName, t.lastName as teacherLastName 
                 FROM grades g
                 JOIN teachers t ON g.teacherId = t.id
                 WHERE g.studentId = ?
                 ORDER BY g.period DESC, g.quarter DESC`;

    db.all(sql, [studentId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
  });

  router.get('/teacher/:teacherId', (req, res) => {
    const { teacherId } = req.params;

    const sql = `SELECT s.id as studentId, s.firstName as studentFirstName, s.lastName as studentLastName, s.grade, s.documentNumber,
                        g.id, g.subject, g.score, g.quarter, g.period
                 FROM students s
                 LEFT JOIN grades g ON s.id = g.studentId AND g.teacherId = ?
                 WHERE s.grade IN (
                   SELECT gradeAssigned FROM teachers WHERE id = ?
                 )
                 ORDER BY s.lastName, s.firstName`;

    db.all(sql, [teacherId, teacherId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
  });

  router.post('/', (req, res) => {
    const { studentId, teacherId, subject, score, quarter, period } = req.body;

    if (score < 0 || score > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 0 y 5' });
    }

    if (quarter < 1 || quarter > 4) {
      return res.status(400).json({ error: 'El trimestre debe estar entre 1 y 4' });
    }

    const sql = `INSERT INTO grades (studentId, teacherId, subject, score, quarter, period)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [studentId, teacherId, subject, score, quarter, period];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, studentId, teacherId, subject, score, quarter, period });
    });
  });

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { score, quarter } = req.body;

    if (score < 0 || score > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 0 y 5' });
    }

    const sql = `UPDATE grades SET score = ?, quarter = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    const params = [score, quarter, id];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Calificación no encontrada' });
      res.json({ id: Number(id), score, quarter });
    });
  });

  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM grades WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Calificación no encontrada' });
      res.json({ message: 'Calificación eliminada' });
    });
  });

  router.post('/bulk-update', (req, res) => {
    const { grades } = req.body; // Array de {id, score, quarter}

    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de calificaciones' });
    }

    let completed = 0;
    let errors = [];

    grades.forEach((grade, index) => {
      if (grade.score < 0 || grade.score > 5) {
        errors.push(`Calificación ${index + 1}: nota inválida`);
        return;
      }

      const sql = `UPDATE grades SET score = ?, quarter = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
      db.run(sql, [grade.score, grade.quarter, grade.id], function (err) {
        if (err) {
          errors.push(`Calificación ${index + 1}: ${err.message}`);
        }
        completed++;

        if (completed === grades.length) {
          if (errors.length > 0) {
            return res.status(400).json({ message: 'Algunas calificaciones no se pudieron actualizar', errors });
          }
          res.json({ message: 'Todas las calificaciones se actualizaron correctamente' });
        }
      });
    });
  });

  return router;
};
