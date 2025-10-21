// Importamos las librerías requeridas
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Creamos la instancia de la aplicación Express
const app = express();

// Configuramos el parser para que entienda JSON
const jsonParser = bodyParser.json();

// Creación de la tabla "todos" en SQLite ---
// Abrimos la conexión con el archivo de la base de datos
let db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
        console.error("Error al abrir la base de datos:", err.message);
    }
    console.log('Conectado a la base de datos SQLite.');

    // Usamos db.run para ejecutar un comando SQL
    // "CREATE TABLE IF NOT EXISTS" asegura que la tabla solo se crea si no existe
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        created_at INTEGER
    )`, (err) => {
        if (err) {
            console.error("Error al crear la tabla:", err.message);
        } else {
            console.log('Tabla "todos" creada o ya existente.');
        }
    });
});

// Endpoint de prueba para verificar que el servidor funciona
app.get('/', function (req, res) {
    res.json({ status: 'Servidor funcionando correctamente' });
});


// Creación del endpoint "agrega_todo" ---
// Usamos app.post para definir una ruta que acepta el método POST
app.post('/agrega_todo', jsonParser, function (req, res) {
    
    // Modificación para guardar datos en la tabla ---
    // Extraemos el campo 'todo' del cuerpo (body) de la petición JSON
    const { todo } = req.body;
    console.log(req.body);
    // Validación simple: nos aseguramos de que el campo 'todo' no venga vacío
    if (!todo) {
        return res.status(400).json({ error: 'El campo "todo" es obligatorio.' });
    }

    // Preparamos la sentencia SQL para insertar datos
    const sql = 'INSERT INTO todos (todo, created_at) VALUES (?, CURRENT_TIMESTAMP)';
    
    // Ejecutamos la sentencia con el dato proporcionado
    db.run(sql, [todo], function(err) {
        if (err) {
            console.error("Error al insertar en la base de datos:", err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }

        // Devolvemos un JSON con estado HTTP 201 
        // Si la operación es exitosa, devolvemos el estado 201 (Created)
        // y un JSON que lo confirma, incluyendo el ID del nuevo registro.
        // 'this.lastID' es una propiedad del callback que nos da el ID del último elemento insertado.
        res.status(201).json({
            message: 'Todo agregado con éxito',
            id: this.lastID
        });
    });
});


// Ponemos el servidor a escuchar en el puerto 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Aplicación corriendo en http://localhost:${port}`);
});
