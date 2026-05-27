const express = require('express');

module.exports = (models) => {
  const router = express.Router();
  const { Schedule } = models;

  // Obtener horario por grado (Para estudiantes)
  router.get('/grade/:grade', async (req, res) => {
    try {
      const { grade } = req.params;
      const schedule = await Schedule.findAll({
        where: { grade },
        order: [['day', 'ASC'], ['startTime', 'ASC']]
      });
      res.json(schedule);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Obtener horario por profesor
  router.get('/teacher/:teacherId', async (req, res) => {
    try {
      const { teacherId } = req.params;
      const schedule = await Schedule.findAll({
        where: { teacherId },
        order: [['day', 'ASC'], ['startTime', 'ASC']]
      });
      res.json(schedule);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
