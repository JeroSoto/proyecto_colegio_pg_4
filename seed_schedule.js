const { Schedule, Teacher, sequelize } = require('./models');

async function seedSchedules() {
  try {
    await sequelize.sync();
    
    // Limpiar horarios previos
    await Schedule.destroy({ where: {}, truncate: true });

    const teachers = await Teacher.findAll();
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const timeSlots = [
      { start: '07:00', end: '08:30' },
      { start: '08:30', end: '10:00' },
      { start: '10:30', end: '12:00' },
      { start: '12:00', end: '13:30' }
    ];

    const schedules = [];

    teachers.forEach(teacher => {
      // Cada profesor tiene al menos 2 clases al día en su grado asignado
      days.forEach(day => {
        // Seleccionar 2 slots aleatorios
        const slots = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, 2);
        
        slots.forEach(slot => {
          schedules.push({
            day,
            startTime: slot.start,
            endTime: slot.end,
            subject: teacher.subject || 'Materia General',
            grade: teacher.gradeAssigned || 1,
            teacherId: teacher.id
          });
        });
      });
    });

    await Schedule.bulkCreate(schedules);
    console.log(`✅ ${schedules.length} entradas de horario creadas.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedSchedules();
