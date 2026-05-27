const { Student, Teacher, Parent, sequelize } = require('./models');

async function resetAllPasswords() {
  console.log('Restableciendo contraseñas a formato plano solicitado...');
  try {
    await sequelize.sync();

    // 1. Estudiantes: Estu + últimos 4 del documento
    const students = await Student.findAll();
    for (const student of students) {
      const doc = student.documentNumber || '0000';
      const last4 = doc.slice(-4);
      await student.update({ password: `Estu${last4}` });
    }
    console.log(`✅ ${students.length} estudiantes actualizados.`);

    // 2. Profesores: Profe + últimos 4 del documento
    const teachers = await Teacher.findAll();
    for (const teacher of teachers) {
      const doc = teacher.documentNumber || '0000';
      const last4 = doc.slice(-4);
      await teacher.update({ password: `Profe${last4}` });
    }
    console.log(`✅ ${teachers.length} profesores actualizados.`);

    // 3. Padres: Padre + últimos 4 del documento
    const parents = await Parent.findAll();
    for (const parent of parents) {
      const doc = parent.documentNumber || '0000';
      const last4 = doc.slice(-4);
      await parent.update({ password: `Padre${last4}` });
    }
    console.log(`✅ ${parents.length} padres actualizados.`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

resetAllPasswords();
