const { Parent, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function resetPadre1() {
  try {
    await sequelize.sync();
    const passHash = await bcrypt.hash('123456', 10);
    
    const [updated] = await Parent.update(
      { password: passHash },
      { where: { email: 'padre1@correo.com' } }
    );

    if (updated > 0) {
      console.log('✅ Contraseña de padre1@correo.com restablecida a 123456');
    } else {
      console.log('❌ No se encontró el padre1@correo.com');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetPadre1();
