const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  documentNumber: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gradeAssigned: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('teacher', 'director'),
    defaultValue: 'teacher'
  }
}, {
  tableName: 'teachers',
  timestamps: true
});

Teacher.validateGrade = function(grade) {
  const parsed = Number(grade);
  return parsed >= 0 && parsed <= 11;
};

module.exports = Teacher;
