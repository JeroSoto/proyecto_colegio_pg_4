const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gradeCategory: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documentType: {
    type: DataTypes.STRING
  },
  documentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'parents',
      key: 'id'
    }
  }
}, {
  tableName: 'students',
  timestamps: true
});

const gradeCategories = {
  primaria: [1, 2, 3, 4, 5],
  secundaria: [6, 7, 8, 9, 10, 11]
};

Student.getGradeCategory = function(grade) {
  const parsed = Number(grade);
  if (gradeCategories.primaria.includes(parsed)) return 'primaria';
  if (gradeCategories.secundaria.includes(parsed)) return 'secundaria';
  return 'otro';
};

module.exports = Student;
