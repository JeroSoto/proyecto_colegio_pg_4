const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  day: {
    type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'),
    allowNull: false
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Schedule;
