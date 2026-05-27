const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Cargar .env del proyecto si existe (caerá silenciosamente si no)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Si el usuario especifica DB_DIALECT=mysql en .env, usar MySQL (requiere credenciales válidas).
// Por defecto local usamos SQLite para evitar errores de acceso y simplificar desarrollo.
const DIALECT = process.env.DB_DIALECT || 'sqlite';

let sequelize;
if (DIALECT === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'colegio',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
      define: { timestamps: true }
    }
  );
} else {
  // SQLite local (archivo en carpeta data/)
  const storagePath = process.env.SQLITE_STORAGE || path.resolve(process.cwd(), 'data', 'database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
    define: { timestamps: true }
  });
}

module.exports = sequelize;
