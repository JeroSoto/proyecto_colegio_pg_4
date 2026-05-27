const express = require('express');

module.exports = (models) => {
  const router = express.Router();
  const { Course } = models;

  // Obtener cursos por grado
  router.get('/grade/:gradeId', async (req, res) => {
    try {
      const courses = await Course.findAll({
        where: { grade: req.params.gradeId }
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener cursos por profesor
  router.get('/teacher/:teacherId', async (req, res) => {
    try {
      const courses = await Course.findAll({
        where: { teacherId: req.params.teacherId }
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
