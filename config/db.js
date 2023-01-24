const Sequelize = require('sequelize')
require('dotenv').config({ path: 'variables.env' })
const db = new Sequelize(
  process.env.DB_NOMBRE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    define: {
      timestamps: false
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    //Sqlite only
    storage: 'path/to/database.sqlite'
  }
)
module.exports = db

// ALTER USER 'root'@'lolcalhost' IDENTIFIED WITH mysql_native_password BY 'root';
// FLUSH PRIVILEGES;
