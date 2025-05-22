import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Configuración de multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/img'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ==========================
// 📌 SUBIR NUEVA NOTICIA
// ==========================
router.get('/subir-noticia', (req, res) => {
  res.render('subir-noticia');
});

router.post('/subir-noticia', upload.single('imagen'), async (req, res) => {
  const { titulo, descripcion, link } = req.body;
  const imagen = `/img/${req.file.filename}`;
  const fecha = new Date();

  try {
    await pool.query(
      'INSERT INTO noticias (fecha, titulo, descripcion, imagen, link) VALUES (?, ?, ?, ?, ?)',
      [fecha, titulo, descripcion, imagen, link || '#']
    );
    res.redirect('/noticias');
  } catch (error) {
    console.error('🛑 Error al guardar noticia en MySQL:', error);
    res.status(500).send('Error al subir noticia');
  }
});

// ==========================
// 🗑️ ELIMINAR NOTICIA
// ==========================
router.post('/eliminar-noticia/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT imagen FROM noticias WHERE id = ?', [id]);
    const noticia = rows[0];

    if (noticia && noticia.imagen) {
      const rutaImagen = path.join(__dirname, '../public', noticia.imagen);
      if (fs.existsSync(rutaImagen)) fs.unlinkSync(rutaImagen);
    }

    await pool.query('DELETE FROM noticias WHERE id = ?', [id]);
    res.redirect('/noticias');
  } catch (err) {
    console.error('🛑 Error al eliminar noticia:', err);
    res.status(500).send('Error al eliminar la noticia');
  }
});

// ==========================
// ✏️ EDITAR NOTICIA (GET)
// ==========================
router.get('/editar-noticia/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM noticias WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send('Noticia no encontrada');

    res.render('editar-noticia', { noticia: rows[0], usuario: req.session });
  } catch (error) {
    console.error('🛑 Error al obtener noticia:', error);
    res.status(500).send('Error al cargar la noticia');
  }
});

// ==========================
// 💾 EDITAR NOTICIA (POST)
// ==========================
router.post('/editar-noticia/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { fecha, titulo, descripcion, link } = req.body;

  try {
    let nuevaImagen = null;

    if (req.file) {
      nuevaImagen = `/img/${req.file.filename}`;

      // Eliminar imagen anterior si hay una
      const [rows] = await pool.query('SELECT imagen FROM noticias WHERE id = ?', [id]);
      const noticia = rows[0];
      if (noticia && noticia.imagen) {
        const rutaAnterior = path.join(__dirname, '../public', noticia.imagen);
        if (fs.existsSync(rutaAnterior)) fs.unlinkSync(rutaAnterior);
      }
    }

    // Actualizar datos
    if (nuevaImagen) {
      await pool.query(
        'UPDATE noticias SET fecha = ?, titulo = ?, descripcion = ?, link = ?, imagen = ? WHERE id = ?',
        [fecha, titulo, descripcion, link, nuevaImagen, id]
      );
    } else {
      await pool.query(
        'UPDATE noticias SET fecha = ?, titulo = ?, descripcion = ?, link = ? WHERE id = ?',
        [fecha, titulo, descripcion, link, id]
      );
    }

    res.redirect('/noticias');
  } catch (error) {
    console.error('🛑 Error al actualizar noticia:', error);
    res.status(500).send('Error al actualizar la noticia');
  }
});

export default router;
