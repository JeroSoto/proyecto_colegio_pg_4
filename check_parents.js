const { Parent, sequelize } = require('./models');

async function checkParents() {
  try {
    await sequelize.sync();
    const parents = await Parent.findAll({ limit: 10 });
    console.log('--- Listado de Padres (Primeros 10) ---');
    parents.forEach(p => {
      console.log(`Email: ${p.email} | PassHash: ${p.password.substring(0, 10)}...`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkParents();
