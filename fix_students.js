const { Student, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function fix() {
  console.log('🚀 Actualizando base de datos de estudiantes...');
  try {
    await sequelize.sync();
    
    // 1. Agregar 10 estudiantes de secundaria
    const newStudentsData = [
      { firstName: 'Valentina', lastName: 'Mora', grade: 6 },
      { firstName: 'Sebastian', lastName: 'Rios', grade: 7 },
      { firstName: 'Mariana', lastName: 'Daza', grade: 8 },
      { firstName: 'Alejandro', lastName: 'Sosa', grade: 9 },
      { firstName: 'Camila', lastName: 'Vega', grade: 10 },
      { firstName: 'Daniel', lastName: 'Luna', grade: 11 },
      { firstName: 'Ximena', lastName: 'Prado', grade: 6 },
      { firstName: 'Jorge', lastName: 'Arias', grade: 7 },
      { firstName: 'Natalia', lastName: 'Bello', grade: 8 },
      { firstName: 'Ricardo', lastName: 'Cano', grade: 9 }
    ];

    for (let data of newStudentsData) {
      const doc = `104050${Math.floor(Math.random() * 900) + 100}`;
      const last3 = doc.slice(-3);
      const pass = `Estu${last3}`;
      const hash = await bcrypt.hash(pass, 10);

      await Student.create({
        ...data,
        gradeCategory: 'secundaria',
        documentType: 'TI',
        documentNumber: doc,
        email: `${data.firstName.toLowerCase()}@colegio.com`,
        password: hash
      });
    }
    console.log('✅ 10 nuevos estudiantes de secundaria agregados.');

    // 2. Actualizar contraseñas de TODOS los estudiantes existentes
    const allStudents = await Student.findAll();
    console.log(`Cambiando contraseñas para ${allStudents.length} estudiantes...`);
    
    for (let student of allStudents) {
      const last3 = String(student.documentNumber).slice(-3);
      const newPass = `Estu${last3}`;
      const newHash = await bcrypt.hash(newPass, 10);
      
      await Student.update(
        { password: newHash },
        { where: { id: student.id } }
      );
    }

    console.log('✅ Todas las contraseñas han sido actualizadas al formato: EstuXXX');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

fix();
