const express = require('express');
const { Op } = require('sequelize');

module.exports = (models) => {
  const router = express.Router();
  const { Grade, Teacher, Student } = models;

  router.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
      const rows = await Grade.findAll({
        where: { studentId },
        include: [{
          model: Teacher,
          as: 'teacher',
          attributes: ['firstName', 'lastName']
        }],
        order: [['period', 'DESC'], ['quarter', 'DESC']]
      });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/teacher/:teacherId', async (req, res) => {
    const { teacherId } = req.params;

    try {
      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher) return res.status(404).json({ error: 'Profesor no encontrado' });

      // Obtener estudiantes del grado asignado al profesor
      const students = await Student.findAll({
        where: { grade: teacher.gradeAssigned },
        include: [{
          model: Grade,
          as: 'grades',
          where: { teacherId },
          required: false // LEFT JOIN
        }],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      // Formatear la respuesta para que coincida con el frontend (aplanar si es necesario)
      const results = students.map(student => {
        if (student.grades.length === 0) {
          return {
            studentId: student.id,
            studentFirstName: student.firstName,
            studentLastName: student.lastName,
            grade: student.grade,
            documentNumber: student.documentNumber,
            id: null,
            subject: teacher.subject,
            score: null,
            quarter: null,
            period: null
          };
        }
        return student.grades.map(g => ({
          studentId: student.id,
          studentFirstName: student.firstName,
          studentLastName: student.lastName,
          grade: student.grade,
          documentNumber: student.documentNumber,
          id: g.id,
          subject: g.subject,
          score: g.score,
          quarter: g.quarter,
          period: g.period
        }));
      }).flat();

      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    const { studentId, teacherId, subject, score, quarter, period, observations } = req.body;

    if (score < 0 || score > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 0 y 5' });
    }

    if (quarter < 1 || quarter > 4) {
      return res.status(400).json({ error: 'El trimestre debe estar entre 1 y 4' });
    }

    try {
      // Buscar si ya existe una nota para este estudiante, profesor, materia y trimestre
      let grade = await Grade.findOne({
        where: { studentId, teacherId, subject, quarter, period }
      });

      if (grade) {
        // Si existe, la actualizamos
        await grade.update({ score, observations });
        res.json(grade);
      } else {
        // Si no existe, la creamos
        grade = await Grade.create({
          studentId,
          teacherId,
          subject,
          score,
          quarter,
          period,
          observations
        });
        res.status(201).json(grade);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { score, quarter, observations } = req.body;

    if (score < 0 || score > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 0 y 5' });
    }

    try {
      const grade = await Grade.findByPk(id);
      if (!grade) return res.status(404).json({ error: 'Calificación no encontrada' });

      await grade.update({ score, quarter, observations });
      res.json(grade);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const grade = await Grade.findByPk(id);
      if (!grade) return res.status(404).json({ error: 'Calificación no encontrada' });

      await grade.destroy();
      res.json({ message: 'Calificación eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/bulk-update', async (req, res) => {
    const { grades } = req.body;

    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de calificaciones' });
    }

    try {
      const promises = grades.map(async (g) => {
        if (g.score < 0 || g.score > 5) throw new Error('Nota inválida');
        return Grade.update(
          { score: g.score, quarter: g.quarter },
          { where: { id: g.id } }
        );
      });

      await Promise.all(promises);
      res.json({ message: 'Todas las calificaciones se actualizaron correctamente' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
