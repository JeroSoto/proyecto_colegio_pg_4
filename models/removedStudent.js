const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RemovedStudent = sequelize.define('RemovedStudent', {
  studentId: {
    type: DataTypes.INTEGER
  },
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
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  removedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'removed_students',
  timestamps: false
});

module.exports = RemovedStudent;
