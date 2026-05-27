const { Student, sequelize } = require('./models');

async function updateEmails() {
  console.log('Generando correos institucionales para todos los estudiantes...');
  try {
    await sequelize.sync();
    
    const students = await Student.findAll();
    let count = 0;

    for (const student of students) {
      // Limpiar nombres para el correo (quitar tildes y espacios)
      const clean = (str) => str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '.');
      
      const email = `${clean(student.firstName)}.${clean(student.lastName)}@colegio.com`;
      
      await student.update({ email });
      count++;
    }

    console.log(`✅ Se generaron ${count} correos institucionales.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en generación de correos:', err);
    process.exit(1);
  }
}

updateEmails();
