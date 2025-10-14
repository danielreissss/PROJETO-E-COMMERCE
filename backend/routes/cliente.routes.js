const express = require('express');
const router = express.Router();
const clienteController = require('../controller/cliente.controller.js');

// Rota para registrar um novo cliente
// POST /api/clientes/register
router.post('/register', clienteController.create);

// Rota para fazer login
// POST /api/clientes/login
router.post('/login', clienteController.login);

// Você pode adicionar outras rotas de CRUD para clientes aqui, se necessário
// Ex: router.get('/', clienteController.findAll);

module.exports = router;