const { Student, Teacher, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Generando credenciales alfanuméricas de 8 caracteres...');
  try {
    await sequelize.sync({ alter: true });
    
    // Contraseñas alfanuméricas de 8 caracteres
    const adminPass = 'Admin123';
    const teacherPass = 'Profe123';
    const studentPass = 'Estu1234';

    // Hashearlas para la DB (aunque el login ahora soporta plano, es mejor tenerlas bien)
    const adminHash = await bcrypt.hash(adminPass, 10);
    const teacherHash = await bcrypt.hash(teacherPass, 10);
    const studentHash = await bcrypt.hash(studentPass, 10);

    // Upsert Admin
    await Teacher.upsert({
      email: 'admin@colegio.com',
      firstName: 'Admin',
      lastName: 'Soporte',
      documentNumber: '12345678',
      password: adminHash,
      gradeAssigned: 0,
      subject: 'General'
    });

    // Upsert Teacher
    await Teacher.upsert({
      email: 'juan.perez@colegio.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      documentNumber: '1122334455',
      password: teacherHash,
      gradeAssigned: 6,
      subject: 'Matemáticas'
    });

    // Upsert Student
    await Student.upsert({
      documentNumber: '12345',
      firstName: 'Estudiante',
      lastName: 'Prueba',
      grade: 6,
      gradeCategory: 'secundaria',
      password: studentHash
    });

    console.log('✅ Credenciales actualizadas:');
    console.log('--- Admin: admin@colegio.com / Admin123');
    console.log('--- Profesor: juan.perez@colegio.com / Profe123');
    console.log('--- Estudiante: 12345 / Estu1234');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
}

seed();
