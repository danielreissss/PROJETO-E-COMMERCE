const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const header = req.headers['authorization'] || '';
  const parts = header.split(' ');
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.cargo;
    return next();
  });
};

const onlyAdmin = (req, res, next) => {
  if (req.userRole !== 'administrador') {
    return res.status(403).json({ message: 'Acesso restrito a administradores' });
  }
  return next();
};

module.exports = { verifyToken, onlyAdmin };
