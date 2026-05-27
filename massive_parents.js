const { Student, Parent, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function massiveParentCreation() {
  console.log('Iniciando creación masiva de padres correlacionados con los estudiantes...');
  try {
    await sequelize.sync();
    const passHash = await bcrypt.hash('123456', 10);
    
    const students = await Student.findAll();
    console.log(`Procesando ${students.length} estudiantes...`);

    let parentCount = 0;
    for (const student of students) {
      const parentEmail = `padre.${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@correo.com`;
      
      // Crear un padre único para este estudiante (o buscar si ya existe por email)
      const [parent] = await Parent.findOrCreate({
        where: { email: parentEmail },
        defaults: {
          firstName: 'Padre ' + student.firstName,
          lastName: student.lastName,
          password: passHash,
          phone: '310' + Math.floor(Math.random() * 9000000 + 1000000),
          documentType: 'CC',
          documentNumber: '10' + student.documentNumber, // Derivado del hijo para unicidad
          grade: student.grade,
          gradeCategory: student.gradeCategory
        }
      });

      // Vincular estudiante al padre
      await student.update({ parentId: parent.id });
      parentCount++;
    }

    console.log(`✅ Sincronización completada: ${parentCount} padres vinculados a sus hijos.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en creación masiva:', err);
    process.exit(1);
  }
}

massiveParentCreation();
