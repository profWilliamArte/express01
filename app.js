// Importamos los módulos necesarios
const express = require('express');
const cors = require('cors'); // Importamos cors
const db = require('./config/db');

// Inicializamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000; // Usamos variable de entorno para el puerto (más flexible)

// Middlewares
app.use(cors()); // Middleware para permitir solicitudes desde otros dominios (React frontend)
app.use(express.json()); // Para parsear cuerpos JSON en las peticiones

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola Mundo!, ¡Servidor funcionando correctamente ahora con nodemon!');
});

// Prueba de conexión a la base de datos
db.getConnection()
  .then(conn => {
    console.log('Conexión a MySQL exitosa!');
    conn.release(); // Liberamos la conexión del pool
  })
  .catch(err => {
    console.error('Error de conexión a MySQL:', err);
  });

// Rutas de la API
app.get('/generos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM generos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/plataformas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM plataformas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/juegos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM juegos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});