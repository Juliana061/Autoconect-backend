const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, token requerido' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores' });
  }
  next();
}

function gestorOrAdmin(req, res, next) {
  if (!['gestor', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Acceso restringido a gestores o administradores' });
  }
  next();
}

module.exports = { protect, adminOnly, gestorOrAdmin };
