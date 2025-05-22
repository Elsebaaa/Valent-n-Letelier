// routes/subirAlumno.js

import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

// Mostrar formulario para agregar alumno
router.get('/subir-alumno', async (req, res) => {
  const [cursos] = await pool.query('SELECT * FROM cursos');
  res.render('subir-alumno', {
    cursos,
    usuario: req.session
  });
});

// Guardar nuevo alumno
router.post('/subir-alumno', async (req, res) => {
  const { nombre, apellido, rut, curso_id, telefono_apoderado, contrasena } = req.body;

  try {
    await pool.query(
      'INSERT INTO alumnos (nombre, apellido, rut, curso_id, telefono_apoderado, contrasena) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, rut, curso_id, telefono_apoderado, contrasena]
    );
    res.redirect('/alumnos');
  } catch (error) {
    console.error('🛑 Error al guardar alumno:', error);
    res.status(500).send('Error al guardar alumno');
  }
});

// Mostrar formulario de edición
router.get('/editar-alumno/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [alumnoRows] = await pool.query('SELECT * FROM alumnos WHERE id = ?', [id]);
    const [cursos] = await pool.query('SELECT * FROM cursos');

    if (alumnoRows.length === 0) {
      return res.status(404).send('Alumno no encontrado');
    }

    res.render('editar-alumno', {
      alumno: alumnoRows[0],
      cursos,
      usuario: req.session
    });
  } catch (error) {
    console.error('🛑 Error al cargar alumno:', error);
    res.status(500).send('Error al cargar el formulario');
  }
});

// Procesar edición
router.post('/editar-alumno/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, rut, curso_id, telefono_apoderado, contrasena } = req.body;

  try {
    await pool.query(
      'UPDATE alumnos SET nombre = ?, apellido = ?, rut = ?, curso_id = ?, telefono_apoderado = ?, contrasena = ? WHERE id = ?',
      [nombre, apellido, rut, curso_id, telefono_apoderado, contrasena, id]
    );
    res.redirect('/alumnos');
  } catch (error) {
    console.error('🛑 Error al actualizar alumno:', error);
    res.status(500).send('Error al actualizar alumno');
  }
});

// Eliminar alumno
router.post('/eliminar-alumno/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM alumnos WHERE id = ?', [id]);
    res.redirect('/alumnos');
  } catch (error) {
    console.error('🛑 Error al eliminar alumno:', error);
    res.status(500).send('Error al eliminar alumno');
  }
});

export default router;
