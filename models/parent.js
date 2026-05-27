const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parent = sequelize.define('Parent', {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  documentType: {
    type: DataTypes.STRING,
    defaultValue: 'CC'
  },
  documentNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: true // Opcional para padres, pero incluido por paridad
  },
  gradeCategory: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'parents',
  timestamps: true
});

module.exports = Parent;
