const { Teacher, Schedule, sequelize } = require('./models');

async function fixAndSeed() {
  try {
    await sequelize.sync();
    
    // 1. Redistribuir profesores para cubrir todos los grados (1-11)
    const teachers = await Teacher.findAll();
    const subjects = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Sociales', 'Inglés', 'Artes', 'Educación Física'];
    
    console.log('Redistribuyendo profesores...');
    for (let i = 0; i < teachers.length; i++) {
        // Asignar grado (1 al 11) de forma cíclica
        const grade = (i % 11) + 1;
        const subject = subjects[i % subjects.length];
        await teachers[i].update({ 
            gradeAssigned: grade,
            subject: subject
        });
    }

    // 2. Limpiar horarios previos
    await Schedule.destroy({ where: {}, truncate: true });

    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const timeSlots = [
      { start: '07:00', end: '08:30' },
      { start: '08:30', end: '10:00' },
      { start: '10:30', end: '12:00' },
      { start: '12:00', end: '13:30' }
    ];

    const schedules = [];
    const updatedTeachers = await Teacher.findAll();

    updatedTeachers.forEach(teacher => {
      days.forEach(day => {
        // Cada profesor da 2 o 3 clases al día
        const slots = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        slots.forEach(slot => {
          schedules.push({
            day,
            startTime: slot.start,
            endTime: slot.end,
            subject: teacher.subject,
            grade: teacher.gradeAssigned,
            teacherId: teacher.id
          });
        });
      });
    });

    await Schedule.bulkCreate(schedules);
    console.log(`✅ ${schedules.length} entradas de horario creadas para todos los grados.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixAndSeed();
