const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'documents',
  timestamps: true
});

module.exports = Document;
