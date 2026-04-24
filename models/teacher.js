module.exports = {
  fields: [
    'id',
    'firstName',
    'lastName',
    'email',
    'documentNumber',
    'password',
    'gradeAssigned',
    'subject',
    'createdAt'
  ],
  
  validateGrade(grade) {
    const parsed = Number(grade);
    return parsed >= 0 && parsed <= 11;
  }
};
