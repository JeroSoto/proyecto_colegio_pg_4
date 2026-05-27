const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: '/var/www/empresas-app/proyecto_colegio_pg_4/.env' });

// Volvemos a MySQL para compatibilidad con phpMyAdmin según solicitud del usuario
const sequelize = new Sequelize(
  'colegio',
  'root',
  'Root123456!',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true
    }
  }
);

module.exports = sequelize;
