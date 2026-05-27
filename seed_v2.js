const { Student, Teacher, Parent, Grade, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Iniciando seed masivo de primaria (8 estudiantes por grado)...');
  try {
    await sequelize.sync({ alter: true });
    
    const hash = async (p) => await bcrypt.hash(p, 10);
    const pass = '123456';
    const passHash = await hash(pass);

    // 1. Crear Director
    await Teacher.upsert({
      email: 'director@colegio.com',
      firstName: 'Rector',
      lastName: 'Principal',
      documentNumber: '999999',
      password: passHash,
      gradeAssigned: 0,
      subject: 'Dirección',
      role: 'director'
    });

    // 2. Crear un par de Padres de ejemplo
    const parents = [];
    for(let i=1; i<=5; i++) {
        const [p] = await Parent.findOrCreate({
            where: { email: `padre${i}@correo.com` },
            defaults: {
                firstName: ['Carlos', 'Andrés', 'Martha', 'Lucía', 'Roberto'][i-1],
                lastName: ['Gomez', 'Rodriguez', 'Martinez', 'Soto', 'Perez'][i-1],
                password: passHash,
                phone: `300${i}234567`,
                documentNumber: `101010${i}`
            }
        });
        parents.push(p);
    }

    const firstNames = ['Santiago', 'Valentina', 'Mateo', 'Isabella', 'Sebastián', 'Mariana', 'Nicolás', 'Sofía', 'Daniel', 'Camila', 'Alejandro', 'Luciana', 'Samuel', 'Gabriela', 'Diego', 'Victoria', 'Joaquín', 'Martina', 'Tomás', 'Emma', 'Emiliano', 'Antonella', 'Lucas', 'Ximena', 'Benjamín', 'Sara', 'Felipe', 'Elena', 'Jerónimo', 'Maia', 'Iker', 'Paula', 'Juan', 'Renata', 'Andrés', 'Catalina', 'Miguel', 'Daniela', 'Bastian', 'Mia'];
    const lastNames = ['García', 'López', 'Martínez', 'González', 'Rodríguez', 'Pérez', 'Sánchez', 'Ramírez', 'Cruz', 'Flores', 'Gómez', 'Morales', 'Vázquez', 'Jiménez', 'Reyes', 'Hernández', 'Díaz', 'Torres', 'Gutiérrez', 'Ruiz'];

    let studentCount = 0;
    // 3. Crear 8 estudiantes por grado (1 a 5)
    for (let grade = 1; grade <= 5; grade++) {
      for (let i = 1; i <= 8; i++) {
        const fName = firstNames[(grade - 1) * 8 + (i - 1)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const docNum = `2026${grade}${i}`;
        
        // Asignar a uno de los padres de forma rotativa
        const parentId = parents[Math.floor(Math.random() * parents.length)].id;

        const [student] = await Student.findOrCreate({
          where: { documentNumber: docNum },
          defaults: {
            firstName: fName,
            lastName: lName,
            grade: grade,
            gradeCategory: 'primaria',
            password: passHash,
            parentId: parentId
          }
        });

        // Añadir algunas notas si no tiene
        const countGrades = await Grade.count({ where: { studentId: student.id } });
        if (countGrades === 0) {
          const subjects = ['Matemáticas', 'Español', 'Ciencias', 'Sociales', 'Inglés', 'Artes'];
          for (const sub of subjects) {
            await Grade.create({
              studentId: student.id,
              teacherId: 1, 
              subject: sub,
              score: (Math.random() * 2 + 3).toFixed(1),
              quarter: 1,
              period: 2026,
              observations: 'Excelente participación en clase.'
            });
          }
        }
        studentCount++;
      }
    }

    console.log(`✅ Seed masivo completado: ${studentCount} estudiantes creados.`);
    console.log('--- Director: director@colegio.com / 123456');
    console.log('--- Padres: padre1@correo.com al padre5@correo.com / 123456');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
}

seed();
