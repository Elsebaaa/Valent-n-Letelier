// routes/subirBiografia.js
import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// Guardar biografía en la base de datos (actualiza si ya existe)
router.post('/guardar-biografia', async (req, res) => {
  const { biografia } = req.body;

  if (!biografia || biografia.trim() === '') {
    return res.status(400).send('⚠️ La biografía no puede estar vacía');
  }

  try {
    await pool.query(`
      INSERT INTO biografia (id, contenido)
      VALUES (1, ?)
      ON DUPLICATE KEY UPDATE contenido = ?
    `, [biografia, biografia]);

    res.redirect('/nosotros');
  } catch (error) {
    console.error('🛑 Error al guardar biografía en la BD:', error);
    res.status(500).send('Error al guardar la biografía');
  }
});

export default router;
