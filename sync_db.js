const { sequelize } = require('./models');

async function syncDB() {
  console.log('Sincronizando esquema de base de datos para Padres...');
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Esquema actualizado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en sincronización:', err);
    process.exit(1);
  }
}

syncDB();
