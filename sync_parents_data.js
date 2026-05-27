const { Parent, Student, sequelize } = require('./models');

async function syncParentData() {
  console.log('Sincronizando datos de padres con los de sus hijos...');
  try {
    await sequelize.sync();
    
    const parents = await Parent.findAll({
      include: [{ model: Student, as: 'children' }]
    });

    for (const parent of parents) {
      if (parent.children && parent.children.length > 0) {
        // Tomar el grado del primer hijo como referencia para el padre
        const firstChild = parent.children[0];
        await parent.update({
          grade: firstChild.grade,
          gradeCategory: firstChild.gradeCategory,
          documentType: 'CC' // Cédula de Ciudadanía por defecto para padres
        });
      }
    }

    console.log(`✅ Se actualizaron ${parents.length} padres con datos de referencia.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en actualización:', err);
    process.exit(1);
  }
}

syncParentData();
