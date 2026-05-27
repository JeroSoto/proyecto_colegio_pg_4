const { Student, sequelize } = require('./models');

async function updateDocType() {
  console.log('Actualizando todos los estudiantes a tipo de documento TI...');
  try {
    await sequelize.sync();
    
    const [updatedCount] = await Student.update(
      { documentType: 'TI' },
      { where: {} } // Actualiza todos
    );

    console.log(`✅ Se actualizaron ${updatedCount} estudiantes a tipo TI.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en actualización:', err);
    process.exit(1);
  }
}

updateDocType();
