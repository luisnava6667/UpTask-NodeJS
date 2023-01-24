const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')
exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear Cuenta en UpTask'
  })
}
exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar sesion en UpTask',
    error
  })
}
exports.crearCuenta = async (req, res) => {
  //leer los datos
  const { email, password } = req.body
  const existe = await Usuarios.findOne({ where: { email } })

  if (existe) {
    req.flash('error', 'El usuario ya existe')
    res.redirect('/crear-cuenta')
  }
  try {
    //crear el usuario
    await Usuarios.create({
      email,
      password
    })
    //crear una url de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
    //crear el objeto de usuario
    const usuario = {
      email
    }
    //enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirma tu cuenta UpTask',
      confirmarUrl,
      archivo: 'confirmar-cuenta'
    })
    //redirigir al usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
    res.redirect('/iniciar-sesion')
  } catch (error) {
    console.log(error.errors)
    req.flash(
      'error',
      error.errors.map((error) => error.message)
    ),
      res.render('crearCuenta', {
        mensajes: req.flash(),
        nombrePagina: 'Crear Cuenta en UpTask',
        email,
        password
        // mensajes: error.errors.map(error => error.message)
      })
  }
}
exports.formRestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer tu contraseña'
  })
}
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  })
  //si no existe el usuario
  if (!usuario) {
    req.flash('error', 'No valido')
    res.redirect('/crear-cuenta')
  }
  usuario.activo = 1
  await usuario.save()
  req.flash('correcto', 'La cuenta se ha activado')
  res.redirect('/iniciar-sesion')
}
