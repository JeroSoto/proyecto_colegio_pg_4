const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.all('SELECT * FROM teachers ORDER BY lastName, firstName', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM teachers WHERE id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Profesor no encontrado' });
      res.json(row);
    });
  });

  router.post('/', async (req, res) => {
    const { firstName, lastName, email, documentNumber, password, gradeAssigned, subject } = req.body;
    const bcrypt = require('bcrypt');

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

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, gradeAssigned, subject } = req.body;

    const sql = `UPDATE teachers SET firstName = ?, lastName = ?, email = ?, gradeAssigned = ?, subject = ? WHERE id = ?`;
    const params = [firstName, lastName, email, gradeAssigned, subject, id];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Profesor no encontrado' });
      res.json({ id: Number(id), firstName, lastName, email, gradeAssigned, subject });
    });
  });

  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM teachers WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Profesor no encontrado' });
      res.json({ message: 'Profesor eliminado' });
    });
  });

  return router;
};
