const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database')

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// La configuración de la base de datos se maneja en database.js

// ===================== CRUD =====================
// POST: es el que envía datos al servidor
// GET: es el que obtiene datos del servidor
// PUT: es el que actualiza datos en el servidor
// DELETE: es el que elimina datos en el servidor
// PATCH: es el que aplica modificaciones parciales a un recurso
// CREATE - Agregar usuario
app.post('/api/usuarios', (req, res) => {
  const userData = req.body
  
  db.createUser(userData, (err, user) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'DNI ya registrado' })
      }
      return res.status(500).json({ error: err.message })
    }
    res.status(201).json(user)
  })
})

// READ - Todos los usuarios
app.get('/api/usuarios', (req, res) => {
  db.getAllUsers((err, users) => { // Funcion que esta en database para obtener todos los usuarios
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(users)
  })
})

// READ - Usuario por ID
//id: placeholder: solo números 
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params
  
  db.getUserById(id, (err, user) => { // funcion para buscar un usuario por id
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(user)
  })
})

// UPDATE - Actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params
  const userData = req.body
  
  db.updateUser(id, userData, (err, user) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'DNI ya registrado' })
      }
      if (err.message === 'Usuario no encontrado') {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      return res.status(500).json({ error: err.message })
    }
    res.json(user)
  })
})

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params
  
  db.deleteUser(id, (err, result) => {
    if (err) {
      if (err.message === 'Usuario no encontrado') {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      return res.status(500).json({ error: err.message })
    }
    res.json(result)
  })
})

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
