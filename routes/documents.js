const express = require('express');

module.exports = (models) => {
  const router = express.Router();
  const { Document, Student, Teacher } = models;

  router.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
      const rows = await Document.findAll({
        where: { studentId },
        include: [{
          model: Teacher,
          as: 'teacher',
          attributes: ['firstName', 'lastName']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/teacher/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    try {
      const rows = await Document.findAll({
        where: { teacherId },
        include: [{
          model: Student,
          as: 'student',
          attributes: ['firstName', 'lastName']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    const { studentId, teacherId, title, description, url } = req.body;
    if (!studentId || !teacherId || !title) {
      return res.status(400).json({ error: 'studentId, teacherId y title son requeridos' });
    }

    try {
      const doc = await Document.create({
        studentId,
        teacherId,
        title,
        description: description || '',
        url: url || ''
      });
      res.status(201).json(doc);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};