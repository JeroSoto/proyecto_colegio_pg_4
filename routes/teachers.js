const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (models) => {
  const router = express.Router();
  const { Teacher } = models;

  router.get('/', async (req, res) => {
    try {
      const rows = await Teacher.findAll({
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const row = await Teacher.findByPk(id);
      if (!row) return res.status(404).json({ error: 'Profesor no encontrado' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    const { firstName, lastName, email, documentNumber, password, gradeAssigned, subject } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const teacher = await Teacher.create({
        firstName,
        lastName,
        email,
        documentNumber,
        password: hashedPassword,
        gradeAssigned,
        subject
      });
      res.status(201).json(teacher);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, gradeAssigned, subject } = req.body;

    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) return res.status(404).json({ error: 'Profesor no encontrado' });

      await teacher.update({
        firstName,
        lastName,
        email,
        gradeAssigned,
        subject
      });
      res.json(teacher);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) return res.status(404).json({ error: 'Profesor no encontrado' });

      await teacher.destroy();
      res.json({ message: 'Profesor eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
