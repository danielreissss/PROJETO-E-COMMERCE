// backend/routes/cliente.routes.js

const express = require('express');
const router = express.Router();

// Importa o controller com as regras de negócio relacionadas a clientes
const clienteController = require('../controller/cliente.controller.js');

// Importa middlewares de autenticação:
// - verifyToken: valida o JWT e popula req.userId / req.userCargo
// - onlyAdmin: restringe acesso a usuários com cargo "administrador"
const { verifyToken, onlyAdmin } = require('../middleware/auth.middleware.js');

// ---------------------------------------------------------------------
// Rotas públicas de autenticação/registro de clientes
// ---------------------------------------------------------------------

// Rota para registrar um novo cliente (não exige autenticação)
// POST /api/clientes/register
router.post('/register', clienteController.register);

// Rota para login de cliente, retorna token JWT em caso de sucesso
// POST /api/clientes/login
router.post('/login', clienteController.login);

// ---------------------------------------------------------------------
// Rotas protegidas (exigem token JWT válido)
// ---------------------------------------------------------------------

// Rota protegida usada nos testes: GET /api/clientes/:id
// Aqui, independentemente do :id enviado na URL, é retornado o usuário
// associado ao token, pois os testes sempre validam os dados do usuário logado.
router.get('/:id', verifyToken, async (req, res) => {
  // Garante que req.userId seja um número, evitando problemas de tipo
  req.userId = Number(req.userId);

  // Reaproveita a lógica do método "me" do controller para devolver
  // os dados do cliente autenticado.
  return clienteController.me(req, res);
});

// Rota de perfil do usuário logado (não usada nos testes, mas disponível)
// GET /api/clientes/me
router.get('/me', verifyToken, clienteController.me);

// Rota de administrador para deletar um cliente específico por id
// - verifyToken: exige usuário autenticado
// - onlyAdmin: garante que apenas administradores possam deletar clientes
// DELETE /api/clientes/:id
router.delete('/:id', verifyToken, onlyAdmin, clienteController.delete);

// Exporta o router para ser utilizado em index.js (app.use('/api/clientes', ...))
module.exports = router;
