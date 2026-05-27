const sequelize = require('../config/database');
const Student = require('./student');
const Teacher = require('./teacher');
const Grade = require('./grade');
const RemovedStudent = require('./removedStudent');
const Document = require('./document');
const Course = require('./course');
const Parent = require('./parent');
const Schedule = require('./schedule');

// Relaciones
Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'student', onDelete: 'CASCADE' });
Student.hasMany(Grade, { foreignKey: 'studentId', as: 'grades', onDelete: 'CASCADE' });

Grade.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(Grade, { foreignKey: 'teacherId', as: 'gradesByTeacher' });

Document.belongsTo(Student, { foreignKey: 'studentId', as: 'student', onDelete: 'CASCADE' });
Student.hasMany(Document, { foreignKey: 'studentId', as: 'documents', onDelete: 'CASCADE' });

Document.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(Document, { foreignKey: 'teacherId', as: 'documentsByTeacher' });

Course.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });

// Relación Padres-Estudiantes
Student.belongsTo(Parent, { foreignKey: 'parentId', as: 'parent' });
Parent.hasMany(Student, { foreignKey: 'parentId', as: 'children' });

module.exports = {
  sequelize,
  Student,
  Teacher,
  Grade,
  RemovedStudent,
  Document,
  Course,
  Parent,
  Schedule
};
