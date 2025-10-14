const express = require('express');
const router = express.Router();
const produtoController = require('../controller/produtos.controller.js');

// Rota para criar um novo produto
// POST /api/produtos
router.post('/', produtoController.create);

// Rota para buscar todos os produtos
// GET /api/produtos
router.get('/', produtoController.findAll);

// Rota para buscar um produto específico pelo ID
// GET /api/produtos/1
router.get('/:id', produtoController.findOne);

// Rota para atualizar um produto pelo ID
// PUT /api/produtos/1
router.put('/:id', produtoController.update);

// Rota para deletar um produto pelo ID
// DELETE /api/produtos/1
router.delete('/:id', produtoController.delete);

module.exports = router;