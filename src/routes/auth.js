import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

const router = Router();

// Formulario de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Validar login con base normalizada
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (rows.length === 0) {
      return res.render('login', { error: 'Usuario no registrado' });
    }

    const user = rows[0];
    const passwordOk = await bcrypt.compare(password, user.contrasena);

    if (!passwordOk) {
      return res.render('login', { error: 'Contraseña incorrecta' });
    }

    req.session.usuario = user.usuario;
    req.session.rol = user.rol;
    res.redirect('/');
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).render('login', { error: 'Error interno del servidor' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;
