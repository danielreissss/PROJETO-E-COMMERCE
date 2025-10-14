const express = require('express');
const router = express.Router();
const clienteController = require('../controller/cliente.controller.js');

// --- Rotas de Autenticação ---

// Rota para registrar um novo cliente (Create)
router.post('/register', clienteController.create);

// Rota para fazer login
router.post('/login', clienteController.login);


// --- Rotas de CRUD ---

// Rota para buscar todos os clientes (Read)
router.get('/', clienteController.findAll);

// Rota para buscar um cliente específico pelo ID (Read)
router.get('/:id', clienteController.findOne);

// Rota para atualizar um cliente pelo ID (Update)
router.put('/:id', clienteController.update);

// Rota para deletar um cliente pelo ID (Delete)
router.delete('/:id', clienteController.delete);

module.exports = router;