const sqlite3 = require('sqlite3').verbose()
const path = require('path')

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, 'usuarios.db')
    this.db = null
    this.init()
  }

  init() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error conectando a SQLite:', err.message)
      } else {
        console.log('Conectado a SQLite ✅')
        this.createTable()
      }
    })
  }

  createTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni TEXT UNIQUE NOT NULL,
        nombres TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        genero TEXT NOT NULL,
        ciudad TEXT NOT NULL
      )
    `
    
    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creando tabla usuarios:', err.message)
      } else {
        console.log('Tabla usuarios creada o ya existe ✅')
      }
    })
  }

  // CREATE - Agregar usuario
  createUser(userData, callback) {
    const { dni, nombres, apellidos, fechaNacimiento, genero, ciudad } = userData
    const sql = `INSERT INTO usuarios (dni, nombres, apellidos, fecha_nacimiento, genero, ciudad)
                 VALUES (?, ?, ?, ?, ?, ?)`
    
    const db = this.db
    this.db.run(sql, [dni, nombres, apellidos, fechaNacimiento, genero, ciudad], function(err) {
      if (err) {
        return callback(err, null)
      }
      
      // Obtener el usuario recién creado
      db.get('SELECT * FROM usuarios WHERE id = ?', [this.lastID], callback)
    })
  }

  // READ - Todos los usuarios
  getAllUsers(callback) {
    const sql = 'SELECT * FROM usuarios ORDER BY id DESC'
    this.db.all(sql, [], callback)
  }

  // READ - Usuario por ID
  getUserById(id, callback) {
    this.db.get('SELECT * FROM usuarios WHERE id = ?', [id], callback)
  }

  // UPDATE - Actualizar usuario
  updateUser(id, userData, callback) {
    const { dni, nombres, apellidos, fechaNacimiento, genero, ciudad } = userData
    const sql = `UPDATE usuarios SET
                 dni = COALESCE(?, dni),
                 nombres = COALESCE(?, nombres),
                 apellidos = COALESCE(?, apellidos),
                 fecha_nacimiento = COALESCE(?, fecha_nacimiento),
                 genero = COALESCE(?, genero),
                 ciudad = COALESCE(?, ciudad)
                 WHERE id = ?`
    
    const db = this.db
    this.db.run(sql, [dni, nombres, apellidos, fechaNacimiento, genero, ciudad, id], function(err) {
      if (err) {
        return callback(err, null)
      }
      
      if (this.changes === 0) {
        return callback(new Error('Usuario no encontrado'), null)
      }
      
      // Obtener el usuario actualizado
      db.get('SELECT * FROM usuarios WHERE id = ?', [id], callback)
    })
  }

  // DELETE - Eliminar usuario
  deleteUser(id, callback) {
    this.db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
      if (err) {
        return callback(err, null)
      }
      if (this.changes === 0) {
        return callback(new Error('Usuario no encontrado'), null)
      }
      callback(null, { message: 'Usuario eliminado exitosamente' })
    })
  }

  // Cerrar conexión
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error cerrando la base de datos:', err.message)
        } else {
          console.log('Conexión a SQLite cerrada')
        }
      })
    }
  }
}

module.exports = new Database()