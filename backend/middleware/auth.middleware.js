// backend/auth.middleware.js

// Middleware de autenticação e autorização usando JWT

const jwt = require('jsonwebtoken');

// ---------------------------------------------------------------------
// Middleware para verificar se o token JWT é válido
// ---------------------------------------------------------------------
// Espera o header Authorization no formato: "Bearer <token>"
const verifyToken = (req, res, next) => {
  const header = req.headers['authorization'] || '';
  const parts = header.split(' ');

  // Pega o token apenas se estiver no formato "Bearer <token>"
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Acesso negado. Token não fornecido.' });
  }

  // Usa a chave JWT_SECRET do .env, ou "secret" como fallback em desenvolvimento/teste
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: 'Token inválido ou expirado.' });
    }

    // Salva informações do usuário no request para uso posterior
    req.userId = decoded.id;
    req.userRole = decoded.cargo;

    return next();
  });
};

// ---------------------------------------------------------------------
// Middleware para permitir acesso apenas a administradores
// ---------------------------------------------------------------------
// Deve ser usado depois de verifyToken (pois depende de req.userRole)
const onlyAdmin = (req, res, next) => {
  if (req.userRole !== 'administrador') {
    return res
      .status(403)
      .json({ message: 'Acesso restrito a administradores' });
  }

  return next();
};

module.exports = { verifyToken, onlyAdmin };
