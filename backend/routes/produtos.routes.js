// backend/produtos.routes.js

const express = require('express');
const router = express.Router();

// Importa o controller responsável pelas operações de produtos
// (criação, listagem, busca por id, atualização e deleção)
const produtoController = require('../controller/produtos.controller.js');

// ---------------------------------------------------------------------
// Rotas principais para gerenciamento de produtos
// Prefixo esperado em index.js: /api/produtos
// ---------------------------------------------------------------------

// Cria um novo produto
// POST /api/produtos
router.post('/', produtoController.create);

// Lista todos os produtos cadastrados
// GET /api/produtos
router.get('/', produtoController.findAll);

// Busca um produto específico pelo ID
// GET /api/produtos/:id
router.get('/:id', produtoController.findOne);

// Atualiza um produto existente pelo ID
// PUT /api/produtos/:id
router.put('/:id', produtoController.update);

// Deleta um produto específico pelo ID
// DELETE /api/produtos/:id
router.delete('/:id', produtoController.delete);

// Exporta o router para ser usado pelo app principal (index.js)
module.exports = router;
