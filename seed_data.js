const { Student, Teacher, Grade, Course, sequelize } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('🌱 Iniciando siembra masiva de datos (6 materias por grado)...');
  try {
    await sequelize.sync({ force: true });
    
    const subjects = [
      'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 
      'Ciencias Sociales', 'Inglés', 'Educación Física',
      'Artes', 'Ética y Valores', 'Tecnología', 'Filosofía'
    ];

    const grades = [6, 7, 8, 9, 10, 11];
    const teachers = [];

    // --- 1. Crear Profesores ---
    // Necesitamos suficientes profesores para cubrir las materias por grado.
    // Para simplificar, crearemos un profesor por cada materia-grado o agruparemos.
    // Crearemos un pool de profesores.
    const firstNames = ['Andrés', 'Beatriz', 'Camilo', 'Daniela', 'Esteban', 'Fernanda', 'Gabriel', 'Helena', 'Iván', 'Juliana', 'Kevin', 'Lucía', 'Mateo', 'Nicole', 'Oscar', 'Paula', 'Quique', 'Rosa', 'Santiago', 'Tania'];
    const lastNames = ['Silva', 'Rojas', 'Mendoza', 'Pineda', 'Torres', 'Vargas', 'Castro', 'Ortiz', 'Suarez', 'Peña', 'Gomez', 'Mora', 'Rios', 'Daza', 'Sosa', 'Cruz', 'Leon', 'Maya', 'Soto', 'Polo'];

    let teacherCounter = 0;
    for (let g of grades) {
      // Para cada grado, seleccionamos las primeras 6 materias
      for (let i = 0; i < 6; i++) {
        const subject = subjects[i];
        const doc = `800${g}${i}${teacherCounter++}`;
        const last3 = doc.slice(-3);
        const pass = `Profe${last3}`;
        const hash = await bcrypt.hash(pass, 10);

        teachers.push({
          firstName: firstNames[teacherCounter % firstNames.length],
          lastName: lastNames[teacherCounter % lastNames.length],
          email: `profe.${doc}@colegio.com`,
          documentNumber: doc,
          password: hash,
          gradeAssigned: g,
          subject: subject
        });
      }
    }

    const createdTeachers = await Teacher.bulkCreate(teachers);
    console.log(`✅ ${createdTeachers.length} profesores creados (6 por cada grado).`);

    // --- 2. Crear Estudiantes ---
    const students = [];
    for (let g of grades) {
      for (let i = 0; i < 8; i++) { // 8 estudiantes por grado = 48 en total
        const doc = `${g}0${i}${Math.floor(Math.random() * 100000)}`;
        const last3 = doc.slice(-3);
        const pass = `Estu${last3}`;
        const hash = await bcrypt.hash(pass, 10);

        students.push({
          firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
          lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
          grade: g,
          gradeCategory: 'secundaria',
          documentType: 'TI',
          documentNumber: doc,
          email: `estu.${doc}@colegio.com`,
          password: hash
        });
      }
    }

    const createdStudents = await Student.bulkCreate(students);
    console.log(`✅ ${createdStudents.length} estudiantes creados.`);

    // --- 3. Crear Cursos ---
    const courses = [];
    createdTeachers.forEach(t => {
      courses.push({
        name: t.subject,
        grade: t.gradeAssigned,
        teacherId: t.id,
        schedule: 'Horario Escolar 2026'
      });
    });

    await Course.bulkCreate(courses);
    console.log(`✅ Cursos vinculados con cada profesor.`);

    // --- 4. Calificaciones Iniciales (Sincronización) ---
    const gradesData = [];
    createdStudents.forEach(student => {
      // Encontrar los 6 profesores asignados al grado de este estudiante
      const assignedTeachers = createdTeachers.filter(t => t.gradeAssigned === student.grade);
      assignedTeachers.forEach(t => {
        gradesData.push({
          studentId: student.id,
          teacherId: t.id,
          subject: t.subject,
          score: (Math.random() * 2 + 3).toFixed(1),
          quarter: 1,
          period: 2026,
          observations: 'Buen desempeño en la materia.'
        });
      });
    });

    await Grade.bulkCreate(gradesData);
    console.log(`✅ ${gradesData.length} calificaciones iniciales creadas (${createdStudents.length} alumnos x 6 materias).`);

    console.log('\n--- SISTEMA DE CREDENCIALES ---');
    console.log('Profesores: Profe + últimos 3 dígitos del documento');
    console.log('Estudiantes: Estu + últimos 3 dígitos del documento');
    console.log('-------------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();
