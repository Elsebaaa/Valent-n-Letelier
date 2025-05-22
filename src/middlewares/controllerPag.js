function verificarSesion(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

function soloAdmin(req, res, next) {
  if (req.session && req.session.rol === 'admin') {
    return next();
  }
  return res.status(403).send('Acceso restringido solo a administradores.');
}

function soloProfesor(req, res, next) {
  if (req.session && (req.session.rol === 'admin' || req.session.rol === 'profesor')) {
    return next();
  }
  return res.status(403).send('Acceso restringido a profesores o administradores.');
}

function soloAlumno(req, res, next) {
  if (req.session && req.session.rol === 'alumno') {
    return next();
  }
  return res.status(403).send('Acceso restringido a alumnos.');
}

module.exports = {
  verificarSesion,
  soloAdmin,
  soloProfesor,
  soloAlumno
};
