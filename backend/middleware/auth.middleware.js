// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// 1. Verifica se o usuário está logado
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (token == null) {
        return res.status(401).send({ message: "Acesso negado. Token não fornecido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({ message: "Token inválido ou expirado." });
        }
        req.user = user; // Salva o usuário (id, cargo) no 'req'
        next();
    });
};

// 2. Verifica se o usuário é Administrador
// (Note que usamos 'administrador', como no seu banco de dados)
exports.isAdmin = (req, res, next) => {
    if (req.user.cargo !== 'administrador') { 
        return res.status(403).send({ message: "Acesso restrito a administradores." });
    }
    next();
};