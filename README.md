# Curso de Backend: Creando una API REST con Express y MySQL

¡Bienvenido! Este repositorio contiene el código y la guía paso a paso para construir una API RESTful básica. El objetivo es aprender los fundamentos de Express.js para crear un servidor, conectarlo a una base de datos MySQL y exponer datos a través de endpoints.

Este proyecto sigue una estructura inicial simple, ideal para comprender los conceptos básicos [1]. Para una estructura más avanzada y escalable, puedes consultar el repositorio `express02` [2].

## 🚀 Ruta de Aprendizaje

Seguiremos 5 pasos clave para construir nuestro backend desde cero.

---

### Paso 1: Preparación del Entorno

En este paso, inicializaremos nuestro proyecto Node.js e instalaremos todas las herramientas (dependencias) que necesitaremos [3-5].

1.  **Inicializa tu proyecto**: Esto crea el archivo `package.json`, el ADN de nuestra aplicación [3].
    ```bash
    npm init -y
    ```

2.  **Instala las dependencias de producción**:
    *   `express`: El framework para construir nuestro servidor y API [3, 6].
    *   `mysql2`: El conector para comunicarnos con nuestra base de datos MySQL [3, 7].
    *   `cors`: Un middleware para permitir que nuestro frontend se comunique con este backend [3, 4].
    *   `dotenv`: Para gestionar nuestras credenciales de forma segura [3, 5].
    ```bash
    npm install express mysql2 cors dotenv
    ```

3.  **Instala la dependencia de desarrollo**:
    *   `nodemon`: Una herramienta que reiniciará nuestro servidor automáticamente cada vez que guardemos un cambio en el código [3-5].
    ```bash
    npm install --save-dev nodemon
    ```

---

### Paso 2: Creando Nuestro Primer Servidor

Ahora, crearemos el archivo principal `app.js` y levantaremos un servidor mínimo con Express [8-10].

1.  **Crea un archivo `app.js`** en la raíz de tu proyecto.
2.  **Añade el siguiente código**:

    ```javascript
    const express = require('express');
    const cors = require('cors');
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middlewares: funciones que se ejecutan antes que nuestras rutas
    app.use(cors()); // Habilita CORS para permitir peticiones desde otros orígenes
    app.use(express.json()); // Permite al servidor entender peticiones con cuerpo en formato JSON

    // Ruta de prueba
    app.get('/', (req, res) => {
      res.send('¡Servidor funcionando correctamente!');
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
    ```

3.  **Prueba el servidor**: Ejecuta en tu terminal `node app.js` y visita `http://localhost:3000` en tu navegador. Deberías ver el mensaje de bienvenida [9, 11].

---

### Paso 3: Optimizando el Flujo de Trabajo con Nodemon

Para no tener que reiniciar el servidor manualmente con cada cambio, configuraremos un script que use `nodemon` [10-12].

1.  **Abre tu archivo `package.json`** y añade la sección `scripts`:
    ```json
    "scripts": {
      "start": "node app.js",
      "dev": "nodemon app.js"
    }
    ```
2.  **Detén tu servidor** (con `Ctrl + C`) y **vuelve a iniciarlo** con el nuevo script:
    ```bash
    npm run dev
    ```
    Ahora, cada vez que guardes un cambio, el servidor se reiniciará solo [11, 12].

---

### Paso 4: Conexión a la Base de Datos MySQL

Vamos a conectar nuestra aplicación a MySQL de forma segura y organizada.

1.  **Crea la configuración**: Crea una carpeta `config` y dentro un archivo `db.js`. Este archivo centralizará la conexión usando un "pool" para mayor eficiencia [12-14].
    ```javascript
    // config/db.js
    const mysql = require('mysql2/promise');
    require('dotenv').config();

    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'dbjuegos',
        waitForConnections: true,
        connectionLimit: 10
    });

    module.exports = pool;
    ```

2.  **Guarda tus credenciales**: Crea un archivo `.env` en la raíz del proyecto para guardar tus datos sensibles. **¡Este archivo nunca debe subirse a GitHub!** [13, 15, 16].
    ```
    # .env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=dbjuegos
    ```

3.  **Prueba la conexión**: Modifica `app.js` para verificar que la conexión es exitosa al arrancar [13, 15, 16].
    ```javascript
    // Agrega esto en app.js
    const db = require('./config/db');

    // ... después de app.listen ...
    db.getConnection()
      .then(conn => {
        console.log('Conexión a MySQL exitosa!');
        conn.release(); // Libera la conexión
      })
      .catch(err => {
        console.error('Error de conexión a MySQL:', err);
      });
    ```

---

### Paso 5: Creación de Rutas (Endpoints)

Finalmente, crearemos las rutas para que un cliente pueda solicitar los datos de nuestra base de datos [17-19]. Añade este código a tu `app.js`:

```javascript
// app.js

// Endpoint para obtener todos los géneros
app.get('/generos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM generos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener todas las plataformas
app.get('/plataformas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM plataformas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener todos los juegos
app.get('/juegos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM juegos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
¡Y listo! Ahora tienes una API funcional que sirve datos desde tu base de datos MySQL.
