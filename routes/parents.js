const express = require('express');

module.exports = (models) => {
  const router = express.Router();
  const { Parent, Student, Grade } = models;

  // Obtener hijos del padre logueado
  router.get('/my-children', async (req, res) => {
    try {
      if (req.user.type !== 'parent') {
        return res.status(403).json({ error: 'Solo los padres pueden acceder a esta sección' });
      }

      const children = await Student.findAll({
        where: { parentId: req.user.id },
        include: [{ model: Grade, as: 'grades' }]
      });

      res.json(children);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Obtener reporte detallado de un hijo
  router.get('/report/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
      if (req.user.type !== 'parent') {
        return res.status(403).json({ error: 'Acceso denegado' });
      }

      const student = await Student.findOne({
        where: { id: studentId, parentId: req.user.id },
        include: [{ model: Grade, as: 'grades' }]
      });

      if (!student) {
        return res.status(404).json({ error: 'Estudiante no encontrado o no está vinculado a este padre' });
      }

      res.json(student);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
