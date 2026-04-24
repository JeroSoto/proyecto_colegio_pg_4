const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/student/:studentId', (req, res) => {
    const { studentId } = req.params;
    const sql = `SELECT d.id, d.title, d.description, d.url, d.createdAt,
                        t.firstName as teacherFirstName, t.lastName as teacherLastName
                 FROM documents d
                 JOIN teachers t ON d.teacherId = t.id
                 WHERE d.studentId = ?
                 ORDER BY d.createdAt DESC`;

    db.all(sql, [studentId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
  });

  router.get('/teacher/:teacherId', (req, res) => {
    const { teacherId } = req.params;
    const sql = `SELECT d.id, d.title, d.description, d.url, d.createdAt,
                        s.firstName as studentFirstName, s.lastName as studentLastName
                 FROM documents d
                 JOIN students s ON d.studentId = s.id
                 WHERE d.teacherId = ?
                 ORDER BY d.createdAt DESC`;

    db.all(sql, [teacherId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
  });

  router.post('/', (req, res) => {
    const { studentId, teacherId, title, description, url } = req.body;
    if (!studentId || !teacherId || !title) {
      return res.status(400).json({ error: 'studentId, teacherId y title son requeridos' });
    }

    const sql = `INSERT INTO documents (studentId, teacherId, title, description, url)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [studentId, teacherId, title, description || '', url || ''];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, studentId, teacherId, title, description, url });
    });
  });

  return router;
};