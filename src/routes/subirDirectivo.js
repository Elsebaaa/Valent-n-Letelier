import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// Mostrar formulario para agregar directivo
router.get('/subir-directivo', (req, res) => {
  res.render('subir-directivo'); // asegúrate de tener el formulario actualizado
});

// Procesar formulario
router.post('/subir-directivo', async (req, res) => {
  const { nombre, rut, cargo, correo, telefono, contrasena } = req.body;

  try {
    // Insertar en la tabla directivos
    await pool.query(
      'INSERT INTO directivos (nombre, rut, cargo, correo, telefono) VALUES (?, ?, ?, ?, ?)',
      [nombre, rut, cargo, correo, telefono]
    );

    // Insertar en la tabla usuarios (rut se usa como nombre de usuario)
    await pool.query(
      'INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)',
      [rut, contrasena, 'profesor']
    );

    res.redirect('/directivos');
  } catch (error) {
    console.error('🛑 Error al agregar directivo y usuario:', error);
    res.status(500).send('Error al agregar directivo');
  }
});

// Mostrar formulario de edición
router.get('/editar-directivo/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('SELECT * FROM directivos WHERE id = ?', [id]);
    if (result.length === 0) return res.status(404).send('Directivo no encontrado');

    res.render('editar-directivo', {
      directivo: result[0],
      sesion: req.session
    });
  } catch (error) {
    console.error('🛑 Error al cargar el directivo:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Procesar edición
router.post('/editar-directivo/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, rut, cargo, correo, telefono, contrasena } = req.body;

  try {
    // Actualizar tabla directivos
    await pool.query(
      'UPDATE directivos SET nombre = ?, rut = ?, cargo = ?, correo = ?, telefono = ? WHERE id = ?',
      [nombre, rut, cargo, correo, telefono, id]
    );

    // Actualizar en tabla usuarios
    await pool.query(
      'UPDATE usuarios SET usuario = ?, contrasena = ? WHERE usuario = ?',
      [rut, contrasena, rut]
    );

    res.redirect('/directivos');
  } catch (error) {
    console.error('🛑 Error al actualizar directivo:', error);
    res.status(500).send('Error al actualizar directivo');
  }
});

// Eliminar directivo y usuario
router.post('/eliminar-directivo/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT rut FROM directivos WHERE id = ?', [id]);
    if (rows.length > 0) {
      const rut = rows[0].rut;
      await pool.query('DELETE FROM directivos WHERE id = ?', [id]);
      await pool.query('DELETE FROM usuarios WHERE usuario = ?', [rut]);
    }
    res.redirect('/directivos');
  } catch (error) {
    console.error('🛑 Error al eliminar directivo:', error);
    res.status(500).send('Error al eliminar directivo');
  }
});

export default router;
