-- Script para inicializar la base de datos 'colegio' en PHPMyAdmin
-- Ejecutar esto en la pestaña SQL de PHPMyAdmin

CREATE DATABASE IF NOT EXISTS colegio;
USE colegio;

-- La estructura de tablas será creada/actualizada automáticamente por Sequelize al iniciar la app.
-- Sin embargo, aquí tienes el script manual exacto:

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  grade INT NOT NULL,
  gradeCategory VARCHAR(255) NOT NULL,
  documentType VARCHAR(255),
  documentNumber VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  documentNumber VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  gradeAssigned INT NOT NULL,
  subject VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  teacherId INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  score DECIMAL(3, 1) NOT NULL,
  quarter INT NOT NULL,
  period INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  teacherId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS removed_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  grade INT NOT NULL,
  gradeCategory VARCHAR(255) NOT NULL,
  documentType VARCHAR(255),
  documentNumber VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  removedAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Datos de ejemplo (Contraseña: password123)
-- Importante: El sistema usa bcrypt, por lo que las contraseñas deben estar hasheadas.
INSERT INTO teachers (firstName, lastName, email, documentNumber, password, gradeAssigned, subject) VALUES 
('Juan', 'Pérez', 'juan.perez@colegio.com', '1122334455', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq', 6, 'Matemáticas'),
('María', 'González', 'maria.gonzalez@colegio.com', '1122334466', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq', 7, 'Lenguaje');

INSERT INTO students (firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, password) VALUES 
('Carlos', 'López', 6, 'secundaria', 'CC', '1234567890', 'carlos@email.com', '3001234567', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
('Ana', 'García', 6, 'secundaria', 'TI', '1234567891', 'ana@email.com', '3009876543', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq');
