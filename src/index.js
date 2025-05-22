import express from 'express';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { pool } from './config/db.js';

// Routers
import subirNoticiaRouter from './routes/subirNoticia.js';
import subirDirectivoRouter from './routes/subirDirectivo.js';
import subirBiografiaRouter from './routes/subirBiografia.js';
import subirContenidoRouter from './routes/subirContenido.js';
import subirAlumnoRouter from './routes/subirAlumno.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Session
app.use(session({
  secret: 'secreto-seguro',
  resave: false,
  saveUninitialized: true
}));

// Middleware de sesión
function verificarSesion(req, res, next) {
  if (req.session.usuario) next();
  else res.redirect('/login');
}

// Middleware global
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 👉 Redirigir raíz al login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 👉 Login
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?', [usuario, contrasena]);
    if (rows.length > 0) {
      req.session.usuario = rows[0].usuario;
      req.session.rol = rows[0].rol;
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('🛑 Error login:', error);
    res.status(500).send('Error al iniciar sesión');
  }
});

// 👉 Página de inicio real
app.get('/dashboard', verificarSesion, (req, res) => {
  res.render('index', { sesion: req.session });
});

// 👉 Logout
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/login')));

// Noticias
app.get('/noticias', async (req, res) => {
  const [noticias] = await pool.query('SELECT * FROM noticias ORDER BY fecha DESC');
  res.render('noticias', { noticias, usuario: req.session });
});

// Directivos
app.get('/directivos', async (req, res) => {
  const [directivos] = await pool.query('SELECT * FROM directivos');
  res.render('directivos', { directivos, sesion: req.session });
});

// Alumnos (con JOIN cursos)
app.get('/alumnos', async (req, res) => {
  const sesion = req.session;

  if (!sesion || (sesion.rol !== 'admin' && sesion.rol !== 'profesor')) {
    return res.status(403).send('Acceso no autorizado');
  }

  try {
    const [alumnos] = await pool.query(`
      SELECT alumnos.*, cursos.nombre AS curso_nombre
      FROM alumnos
      JOIN cursos ON alumnos.curso_id = cursos.id
      ORDER BY cursos.nombre, alumnos.nombre
    `);

    res.render('alumnos', {
      alumnos,
      usuario: sesion
    });
  } catch (error) {
    console.error('🛑 Error al obtener alumnos:', error);
    res.status(500).send('Error al cargar alumnos');
  }
});

// Nosotros (desde base de datos)
app.get('/nosotros', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT contenido FROM biografia WHERE id = 1');
    const biografia = rows[0]?.contenido || '';
    res.render('nosotros', { biografia, sesion: req.session });
  } catch {
    res.render('nosotros', { biografia: '', sesion: req.session });
  }
});

// Misión y Visión
app.get('/misionyvision', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM mision_vision WHERE id = 1');
  const mision = rows[0]?.mision || 'Texto no disponible';
  const vision = rows[0]?.vision || 'Texto no disponible';
  res.render('misionyvision', { usuario: req.session, mision, vision });
});

// Contenido (JOIN cursos y archivo existente)
app.get('/contenido', async (req, res) => {
  const [contenidos] = await pool.query(`
    SELECT contenidos.*, cursos.nombre AS curso_nombre
    FROM contenidos
    JOIN cursos ON contenidos.curso_id = cursos.id
    ORDER BY cursos.nombre
  `);
  const [cursos] = await pool.query('SELECT * FROM cursos');

  const contenidosConEstado = contenidos.map(c => {
    const archivoLocal = path.join(__dirname, '../public', c.archivo);
    return { ...c, existeArchivo: fs.existsSync(archivoLocal) };
  });

  res.render('contenido', {
    contenidos: contenidosConEstado,
    cursos,
    usuario: {
      usuario: req.session.usuario,
      rol: req.session.rol
    }
  });
});

// Estáticas
app.get('/sellos', (req, res) => res.render('sellos'));
app.get('/contacto', (req, res) => res.render('contacto'));

// Routers protegidos
app.use('/admin', verificarSesion, subirNoticiaRouter);
app.use('/admin', verificarSesion, subirDirectivoRouter);
app.use('/admin', verificarSesion, subirBiografiaRouter);
app.use('/admin', verificarSesion, subirAlumnoRouter);
app.use('/profesor', verificarSesion, subirContenidoRouter);

// Obtener IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) return config.address;
    }
  }
  return 'localhost';
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('✅ Servidor activo en:');
  console.log(`👉 PC: http://localhost:${PORT}`);
  console.log(`👉 Teléfono en red local: http://${localIP}:${PORT}`);
});
