const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
require('dotenv').config({ path: 'variables.env' })
// helpers cons algunas ffunciones
const helpers = require('./helpers')
//crear la conexion a la base de datos
const db = require('./config/db')
require('./models/Usuarios')
require('./models/Proyectos')
require('./models/Tareas')
db.sync()
  .then(() => console.log('Base de datos conectada'))
  .catch((error) => console.log(error))

//crear una app de express
const app = express()

//donde cargar los archivos estaticos
app.use(express.static('public'))

//habilitar pug
app.set('view engine', 'pug')

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }))

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'))

//agregar flash messages
app.use(flash())

app.use(cookieParser())

//sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(
  session({
    secret: 'superSecreto',
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())

//pasar var dump a la aplicacion
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear()
  res.locals.vardump = helpers.vardump
  res.locals.mensajes = req.flash()
  res.locals.usuario = { ...req.user } || null
  next()
})

app.use('/', routes())
const host = process.env.HOST || ''
const port = process.env.PORT || 3000
app.listen(port, host, () => {
  console.log('El servidor esta funcionando')
})
