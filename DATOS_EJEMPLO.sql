-- Datos de ejemplo para testing
-- Ejecuta este archivo en SQLite si quieres poblar la base de datos con datos de ejemplo

-- Insertar profesores (contraseña: password123 hasheada con bcrypt)
INSERT INTO teachers (firstName, lastName, email, documentNumber, password, gradeAssigned, subject)
VALUES 
  ('Juan', 'Pérez', 'juan.perez@colegio.com', '1122334455', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq', 6, 'Matemáticas'),
  ('María', 'González', 'maria.gonzalez@colegio.com', '1122334466', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq', 7, 'Lenguaje'),
  ('Carlos', 'López', 'carlos.lopez@colegio.com', '1122334477', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq', 2, 'Matemáticas');

-- Insertar estudiantes de grado 6 (Secundaria)
INSERT INTO students (firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, password)
VALUES 
  ('Carlos', 'López', 6, 'secundaria', 'CC', '1234567890', 'carlos@email.com', '3001234567', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('María', 'Rodríguez', 6, 'secundaria', 'CC', '1234567891', 'maria@email.com', '3001234568', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('Juan', 'Martínez', 6, 'secundaria', 'CC', '1234567892', 'juan@email.com', '3001234569', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('Andrea', 'Silva', 6, 'secundaria', 'CC', '1234567893', 'andrea@email.com', '3001234570', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('Pedro', 'García', 6, 'secundaria', 'CC', '1234567894', 'pedro@email.com', '3001234571', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq');

-- Insertar estudiantes de grado 7 (Secundaria)
INSERT INTO students (firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, password)
VALUES 
  ('Laura', 'Díaz', 7, 'secundaria', 'CC', '1234567895', 'laura@email.com', '3001234572', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('Fernando', 'Sánchez', 7, 'secundaria', 'CC', '1234567896', 'fernando@email.com', '3001234573', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('Isabel', 'Ortega', 7, 'secundaria', 'CC', '1234567897', 'isabel@email.com', '3001234574', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq');

-- Insertar estudiantes de grado 2 (Primaria)
INSERT INTO students (firstName, lastName, grade, gradeCategory, documentType, documentNumber, email, phone, password)
VALUES 
  ('Sofía', 'Ramírez', 2, 'primaria', 'CC', '1234567898', 'sofia@email.com', '3001234575', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('Diego', 'Flores', 2, 'primaria', 'CC', '1234567899', 'diego@email.com', '3001234576', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq'),
  ('Valentina', 'Castro', 2, 'primaria', 'CC', '1234567900', 'valentina@email.com', '3001234577', '$2b$10$HVyN6KSn7pGm5P.kk7zV6.9e.1pGkVGKw7.d6KDDhqW5.D.DqVyMq');

-- Insertar calificaciones para grado 6, trimestre 1
INSERT INTO grades (studentId, teacherId, subject, score, quarter, period)
VALUES 
  (1, 1, 'Matemáticas', 4.5, 1, 2026),
  (2, 1, 'Matemáticas', 3.8, 1, 2026),
  (3, 1, 'Matemáticas', 4.2, 1, 2026),
  (4, 1, 'Matemáticas', 4.9, 1, 2026),
  (5, 1, 'Matemáticas', 3.5, 1, 2026);

-- Insertar calificaciones para grado 6, trimestre 2
INSERT INTO grades (studentId, teacherId, subject, score, quarter, period)
VALUES 
  (1, 1, 'Matemáticas', 4.7, 2, 2026),
  (2, 1, 'Matemáticas', 4.0, 2, 2026),
  (3, 1, 'Matemáticas', 4.5, 2, 2026),
  (4, 1, 'Matemáticas', 5.0, 2, 2026),
  (5, 1, 'Matemáticas', 3.9, 2, 2026);

-- Insertar calificaciones para grado 7, trimestre 1
INSERT INTO grades (studentId, teacherId, subject, score, quarter, period)
VALUES 
  (6, 2, 'Lenguaje', 4.3, 1, 2026),
  (7, 2, 'Lenguaje', 4.1, 1, 2026),
  (8, 2, 'Lenguaje', 3.9, 1, 2026);

-- Insertar calificaciones para grado 2, trimestre 1
INSERT INTO grades (studentId, teacherId, subject, score, quarter, period)
VALUES 
  (9, 3, 'Matemáticas', 4.4, 1, 2026),
  (10, 3, 'Matemáticas', 4.6, 1, 2026),
  (11, 3, 'Matemáticas', 4.0, 1, 2026);

-- Verificar datos insertados
SELECT 'Profesores:' as tipo, COUNT(*) as cantidad FROM teachers
UNION ALL
SELECT 'Estudiantes:', COUNT(*) FROM students
UNION ALL
SELECT 'Calificaciones:', COUNT(*) FROM grades;
