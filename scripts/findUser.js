const models = require('../models');

const identifier = process.argv[2];
if (!identifier) {
  console.error('Uso: node scripts/findUser.js <identifier>');
  process.exit(1);
}

(async () => {
  try {
    await models.sequelize.authenticate();
    const { Teacher, Parent, Student } = models;
    const teacher = await Teacher.findOne({ where: { email: identifier } });
    const teacherByDoc = await Teacher.findOne({ where: { documentNumber: identifier } });
    const parent = await Parent.findOne({ where: { email: identifier } });
    const parentByDoc = await Parent.findOne({ where: { documentNumber: identifier } });
    const student = await Student.findOne({ where: { documentNumber: identifier } });
    const studentByEmail = await Student.findOne({ where: { email: identifier } });

    console.log('Buscando:', identifier);
    console.log('Teacher (email):', teacher ? teacher.toJSON() : null);
    console.log('Teacher (documentNumber):', teacherByDoc ? teacherByDoc.toJSON() : null);
    console.log('Parent (email):', parent ? parent.toJSON() : null);
    console.log('Parent (documentNumber):', parentByDoc ? parentByDoc.toJSON() : null);
    console.log('Student (documentNumber):', student ? student.toJSON() : null);
    console.log('Student (email):', studentByEmail ? studentByEmail.toJSON() : null);

    process.exit(0);
  } catch (err) {
    console.error('Error al consultar la DB:', err);
    process.exit(2);
  }
})();