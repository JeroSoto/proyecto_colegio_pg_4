const { Student, sequelize } = require('./models');
const { Op } = require('sequelize');

async function fixHijos() {
  console.log('Buscando y renombrando estudiantes con nombre "Hijo"...');
  try {
    await sequelize.sync();
    
    // Buscar todos los que tengan "Hijo" en el nombre
    const students = await Student.findAll({
      where: {
        firstName: {
          [Op.like]: 'Hijo%'
        }
      }
    });

    console.log(`Se encontraron ${students.length} estudiantes para renombrar.`);

    const boomieNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];

    for (let i = 0; i < students.length; i++) {
      const newFirstName = boomieNames[i % boomieNames.length] || 'Boomie';
      const newLastName = 'Boomies';
      const clean = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.');
      const newEmail = `${clean(newFirstName)}.${clean(newLastName)}@colegio.com`;

      await students[i].update({
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail
      });
    }

    console.log('✅ Estudiantes actualizados a la familia "Boomies".');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en actualización:', err);
    process.exit(1);
  }
}

fixHijos();
