const gradeCategories = {
  primaria: [1, 2, 3, 4, 5],
  secundaria: [6, 7, 8, 9, 10, 11]
};

function getGradeCategory(grade) {
  const parsed = Number(grade);
  if (gradeCategories.primaria.includes(parsed)) return 'primaria';
  if (gradeCategories.secundaria.includes(parsed)) return 'secundaria';
  return 'otro';
}

module.exports = {
  getGradeCategory,
  gradeCategories
};
