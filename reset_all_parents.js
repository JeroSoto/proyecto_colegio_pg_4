const { Parent, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function resetAllParents() {
  console.log('Restableciendo contraseñas de TODOS los padres a 123456...');
  try {
    await sequelize.sync();
    const passHash = await bcrypt.hash('123456', 10);
    
    const [updatedCount] = await Parent.update(
      { password: passHash },
      { where: {} } // Actualiza todos los registros
    );

    console.log(`✅ Se restablecieron las contraseñas de ${updatedCount} padres.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en el proceso:', err);
    process.exit(1);
  }
}

resetAllParents();
