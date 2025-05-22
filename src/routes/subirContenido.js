// src/routes/subirContenido.js

import { Router } from 'express';
import upload from '../middlewares/upload.js'; // asegúrate que guarda en public/uploads
import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';

const router = Router();

// 📤 SUBIR contenido
router.post('/subir-contenido', upload.single('archivo'), async (req, res) => {
  const { curso_id, titulo, descripcion } = req.body;

  // ✅ Ruta relativa pública para la base de datos
  const archivo = path.posix.join('/uploads', req.file.filename);

  try {
    await pool.query(
      'INSERT INTO contenidos (curso_id, titulo, descripcion, archivo) VALUES (?, ?, ?, ?)',
      [curso_id, titulo, descripcion, archivo]
    );
    res.redirect('/contenido');
  } catch (error) {
    console.error('🛑 Error al subir contenido:', error);
    res.status(500).send('Error al guardar contenido');
  }
});

// ✏️ EDITAR (GET)
router.get('/editar-contenido/:id', async (req, res) => {
  const { id } = req.params;
  const [cursos] = await pool.query('SELECT * FROM cursos');
  const [rows] = await pool.query('SELECT * FROM contenidos WHERE id = ?', [id]);

  if (rows.length === 0) return res.status(404).send('Contenido no encontrado');

  res.render('editar-contenido', {
    contenido: rows[0],
    cursos
  });
});

// ✏️ EDITAR (POST)
router.post('/editar-contenido/:id', upload.single('archivo'), async (req, res) => {
  const { id } = req.params;
  const { curso_id, titulo, descripcion } = req.body;

  try {
    const [rows] = await pool.query('SELECT archivo FROM contenidos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send('Contenido no encontrado');

    const archivoActual = rows[0].archivo;
    let nuevoArchivo = archivoActual;

    // 📁 Reemplazar archivo si se subió uno nuevo
    if (req.file) {
      const rutaAntigua = path.join('public', archivoActual);
      if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);

      nuevoArchivo = path.posix.join('/uploads', req.file.filename);
    }

    await pool.query(
      'UPDATE contenidos SET curso_id = ?, titulo = ?, descripcion = ?, archivo = ? WHERE id = ?',
      [curso_id, titulo, descripcion, nuevoArchivo, id]
    );

    res.redirect('/contenido');
  } catch (error) {
    console.error('🛑 Error al actualizar contenido:', error);
    res.status(500).send('Error al actualizar contenido');
  }
});

// 🗑️ ELIMINAR
router.post('/eliminar-contenido/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT archivo FROM contenidos WHERE id = ?', [id]);
    if (rows.length > 0) {
      const ruta = path.join('public', rows[0].archivo);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    await pool.query('DELETE FROM contenidos WHERE id = ?', [id]);
    res.redirect('/contenido');
  } catch (error) {
    console.error('🛑 Error al eliminar contenido:', error);
    res.status(500).send('Error al eliminar contenido');
  }
});

export default router;
