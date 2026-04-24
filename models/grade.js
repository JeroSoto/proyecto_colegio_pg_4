module.exports = {
  fields: [
    'id',
    'studentId',
    'teacherId',
    'subject',
    'score',
    'quarter',
    'period',
    'createdAt',
    'updatedAt'
  ],
  
  validateScore(score) {
    const parsed = Number(score);
    return parsed >= 0 && parsed <= 5;
  },
  
  validateQuarter(quarter) {
    const parsed = Number(quarter);
    return parsed >= 1 && parsed <= 4;
  }
};
