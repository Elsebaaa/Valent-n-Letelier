import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { pool } from '../config/db.js';

// Formularios (modularizados)
import subirNoticiaRouter from './subirNoticia.js';
import subirDirectivoRouter from './subirDirectivo.js';
import subirBiografiaRouter from './subirBiografia.js';
import subirContenidoRouter from './subirContenido.js';

const router = Router();

//
// 📄 PÁGINAS PÚBLICAS
//

// Página principal
router.get('/', (req, res) => res.render('index'));

// Nosotros (desde archivo JSON)
router.get('/nosotros', (req, res) => {
  const rutaJson = path.join(process.cwd(), 'src/data/biografia.json');
  try {
    const raw = fs.readFileSync(rutaJson, 'utf8');
    const { contenido } = JSON.parse(raw);
    res.render('nosotros', { biografia: contenido });
  } catch (error) {
    console.error('🛑 Error al leer biografía JSON:', error);
    res.render('nosotros', { biografia: '' });
  }
});

// Misión y Visión
router.get('/misionyvision', (req, res) => res.render('misionyvision'));

// Sellos
router.get('/sellos', (req, res) => res.render('sellos'));

// Contacto
router.get('/contacto', (req, res) => res.render('contacto'));

//
// 📰 NOTICIAS
//

router.get('/noticias', async (req, res) => {
  try {
    const [noticias] = await pool.query('SELECT * FROM noticias ORDER BY fecha DESC');
    res.render('noticias', { noticias });
  } catch (error) {
    console.error('🛑 Error al obtener noticias:', error);
    res.status(500).send('Error al cargar noticias');
  }
});

//
// 👥 DIRECTIVOS
//

router.get('/directivos', async (req, res) => {
  try {
    const [directivos] = await pool.query('SELECT * FROM directivos');
    res.render('directivos', { directivos });
  } catch (error) {
    console.error('🛑 Error al obtener directivos:', error);
    res.status(500).send('Error al cargar directivos');
  }
});

//
// 📘 CONTENIDO POR CURSO
//

router.get('/contenido', async (req, res) => {
  try {
    const [contenidos] = await pool.query('SELECT * FROM contenidos ORDER BY curso');
    res.render('contenido', {
      contenidos,
      usuario: req.session?.usuario || null
    });
  } catch (error) {
    console.error('🛑 Error al obtener contenidos:', error);
    res.status(500).send('Error al cargar contenidos');
  }
});

//
// 🎓 ALUMNOS
//

router.get('/alumno', async (req, res) => {
  try {
    const [alumnos] = await pool.query('SELECT * FROM alumnos ORDER BY curso, nombre');
    res.render('alumno', {
      alumnos,
      sesion: req.session?.usuario || null
    });
  } catch (error) {
    console.error('🛑 Error al obtener alumnos:', error);
    res.status(500).send('Error al cargar alumnos');
  }
});

//
// 🧑‍🏫 FORMULARIOS DE PROFESORES
//

router.use('/profesor', subirContenidoRouter);

//
// 🧑‍💼 FORMULARIOS DE ADMINISTRADOR
//

router.use('/admin', subirNoticiaRouter);
router.use('/admin', subirDirectivoRouter);
router.use('/', subirBiografiaRouter);

export default router;
