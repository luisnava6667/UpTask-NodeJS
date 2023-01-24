const Sequelize = require('sequelize')
const db = require('../config/db')
const Proyectos = require('./Proyectos')
const bcrypt = require('bcrypt-nodejs')
const Usuarios = db.define(
  'usuarios',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING(60),
      validate: {
        isEmail: {
          args: true,
          msg: 'Agrega un correo válido'
        },
        notEmpty: {
          args: true,
          msg: 'El email no puede ir vacío'
        }
      }
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El password no puede ir vacío'
        }
      }
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE,
    activo: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(10)
        )
      }
    }
  }
)
//metodo para verificar password
Usuarios.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}
Usuarios.hasMany(Proyectos)
module.exports = Usuarios
