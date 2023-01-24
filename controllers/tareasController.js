const Proyectos = require('../models/Proyectos')
const Tarea = require('../models/Tareas')
exports.agregarTarea = async (req, res, next) => {
  const proyecto = await Proyectos.findOne({
    where: {
      url: req.params.url
    }
  })
  // Leer el valor del input
  const { tarea } = req.body
  // estado 0 = incompleto y ID del proyecto
  const estado = 0
  const proyectoId = proyecto.id
  // Insertar en la BD
  const resultado = await Tarea.create({ tarea, estado, proyectoId })
  if (!resultado) {
    return next()
  }
  // Redireccionar
  res.redirect(`/proyectos/${req.params.url}`)
}
exports.cambiarEstadoTarea = async (req, res, next) => {
  const { id } = req.params
  const tarea = await Tarea.findOne({
    where: { id }
  })
  // Cambiar el estado
  let estado = 0
  if (tarea.estado === estado) {
    estado = 1
  }
  tarea.estado = estado
  const resultado = await tarea.save()
  if (!resultado) return next()
  res.status(200).send('Actualizado')
}
exports.eliminarTarea = async (req, res, next) => {
    // console.log(req.params)
    const { id } = req.params
    // Eliminar la tarea
    const resultado = await Tarea.destroy({ where: { id } })
    if (!resultado) return next()
    res.status(200).send('Tarea eliminada correctamente')   
}
// exports.formularioEditar = async (req, res) => {}
