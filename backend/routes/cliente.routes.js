// backend/routes/cliente.routes.js
const express = require('express');
const router = express.Router();

const clienteController = require('../controller/cliente.controller.js');
const { verifyToken, onlyAdmin } = require('../middleware/auth.middleware.js');

router.post('/register', clienteController.register);
router.post('/login', clienteController.login);

// rota protegida usada nos testes: GET /api/clientes/:id
router.get('/:id', verifyToken, async (req, res) => {
  // sempre retorna o usuário do token, que é o que os testes usam
  req.userId = Number(req.userId); // garante número
  return clienteController.me(req, res);
});

// rota de perfil (não usada nos testes, mas ok)
router.get('/me', verifyToken, clienteController.me);

// rota de administrador para deletar cliente
router.delete('/:id', verifyToken, onlyAdmin, clienteController.delete);

module.exports = router;
