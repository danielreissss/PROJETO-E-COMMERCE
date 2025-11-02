const express = require('express');
const router = express.Router();
const clienteController = require('../controller/cliente.controller.js');

// 1. IMPORTAÇÃO (NOVO)
// Importa o middleware que verifica o token e o cargo
const authMiddleware = require('../middleware/auth.middleware.js');


// --- Rotas Públicas (Não precisam de token) ---

// Rota para registrar um novo cliente (Create)
router.post('/register', clienteController.create);

// Rota para fazer login
router.post('/login', clienteController.login);

// 2. NOVAS ROTAS (NOVO)
// Rotas para recuperação de senha
router.post('/forgot-password', clienteController.forgotPassword);
router.post('/reset-password', clienteController.resetPassword);


// --- Rotas Protegidas (Precisam de token) ---

// Rota para buscar todos os clientes (Read)
// MUDANÇA: Adicionado [authMiddleware.verifyToken]
router.get('/', [authMiddleware.verifyToken], clienteController.findAll);

// Rota para buscar um cliente específico pelo ID (Read)
// MUDANÇA: Adicionado [authMiddleware.verifyToken]
router.get('/:id', [authMiddleware.verifyToken], clienteController.findOne);

// Rota para atualizar um cliente pelo ID (Update)
// MUDANÇA: Adicionado [authMiddleware.verifyToken]
router.put('/:id', [authMiddleware.verifyToken], clienteController.update);

// --- Rota de Administrador (Token + Cargo "administrador") ---

// Rota para deletar um cliente pelo ID (Delete)
// MUDANÇA: Adicionado [authMiddleware.verifyToken, authMiddleware.isAdmin]
// Esta é a rota restrita ao administrador que o desafio pedia
router.delete('/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], clienteController.delete);

module.exports = router;