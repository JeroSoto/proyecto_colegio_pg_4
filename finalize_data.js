const { Student, Parent, Grade, Course, Teacher, sequelize } = require('./models');
const { Op } = require('sequelize');

async function finalizeData() {
  console.log('Finalizando datos: Renombrando Boomies y configurando Cursos/Notas para 1°-5°...');
  try {
    await sequelize.sync();

    // 1. Renombrar Boomies a nombres normales
    const newNames = ['Mateo', 'Valeria', 'Nicolás', 'Isabela', 'Andrés'];
    const newLastNames = ['Castro', 'Mendoza', 'Pineda', 'Vargas', 'Ríos'];

    const boomieStudents = await Student.findAll({ where: { lastName: 'Boomies' } });
    for (let i = 0; i < boomieStudents.length; i++) {
      const student = boomieStudents[i];
      const newFName = newNames[i] || 'Estudiante';
      const newLName = newLastNames[i] || 'Ejemplo';
      
      const clean = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.');
      
      // Actualizar Estudiante
      await student.update({
        firstName: newFName,
        lastName: newLName,
        email: `${clean(newFName)}.${clean(newLName)}@colegio.com`
      });

      // Buscar y actualizar su Padre correspondiente
      const parent = await Parent.findByPk(student.parentId);
      if (parent) {
        await parent.update({
          firstName: 'Padre ' + newFName,
          lastName: newLName,
          email: `padre.${clean(newFName)}.${clean(newLName)}@correo.com`
        });
      }
    }
    console.log(`✅ ${boomieStudents.length} "Boomies" renombrados a nombres normales.`);

    // 2. Crear Cursos para 1° a 5° si no existen
    const subjects = ['Matemáticas', 'Español', 'Inglés', 'Ciencias Naturales', 'Sociales'];
    for (let g = 1; g <= 5; g++) {
      for (const sub of subjects) {
        await Course.findOrCreate({
          where: { name: sub, grade: g },
          defaults: {
            teacherId: 1, // Admin o primer docente
            schedule: 'Lunes a Viernes 07:00 - 13:00'
          }
        });
      }
    }
    console.log('✅ Cursos para Primaria (1°-5°) creados/verificados.');

    // 3. Asegurar notas para todos los estudiantes de 1° a 5°
    const studentsPrimaria = await Student.findAll({ where: { grade: { [Op.between]: [1, 5] } } });
    let gradesCreated = 0;
    
    for (const student of studentsPrimaria) {
      for (const sub of subjects) {
        const [gradeRecord, created] = await Grade.findOrCreate({
          where: { studentId: student.id, subject: sub, quarter: 1 },
          defaults: {
            teacherId: 1,
            score: (Math.random() * 1.5 + 3.5).toFixed(1), // Notas entre 3.5 y 5.0
            period: 2026,
            observations: 'Buen desempeño académico y disciplinario.'
          }
        });
        if (created) gradesCreated++;
      }
    }
    console.log(`✅ Notas configuradas: ${gradesCreated} nuevas calificaciones añadidas para primaria.`);

    console.log('--- Proceso de finalización exitoso ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en finalización:', err);
    process.exit(1);
  }
}

finalizeData();
