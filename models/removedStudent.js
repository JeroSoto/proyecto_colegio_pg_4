// El modelo de estudiante eliminado refleja un borrado pasivo.
// Aquí se guarda un registro para poder consultar estudiantes que ya no siguen en el colegio.

module.exports = {
  fields: [
    'studentId',
    'firstName',
    'lastName',
    'grade',
    'gradeCategory',
    'documentType',
    'documentNumber',
    'email',
    'phone'
  ]
};
