const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  schedule: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true
});

module.exports = Course;
