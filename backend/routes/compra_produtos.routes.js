// backend/compra_produtos.routes.js

const express = require('express');
const router = express.Router();

// Importa o controller responsável por gerenciar os itens
// (produtos) associados a uma determinada compra
const compraProdutosController = require('../controller/compra_produtos.controller.js');

// ---------------------------------------------------------------------
// Rotas para gerenciamento dos itens de uma compra específica
// Prefixo esperado em index.js: /api/compra-produtos ou similar
// ---------------------------------------------------------------------

// Adiciona um novo produto a uma compra existente
// POST /api/compra-produtos/:compraId
router.post('/:compraId', compraProdutosController.addProduto);

// Lista todos os itens (produtos) de uma compra
// GET /api/compra-produtos/:compraId
router.get('/:compraId', compraProdutosController.getItemsForCompra);

// Atualiza um item específico (por exemplo, quantidade ou preço)
// PUT /api/compra-produtos/:compraId/:produtoId
router.put('/:compraId/:produtoId', compraProdutosController.updateItem);

// Remove um produto específico de uma compra
// DELETE /api/compra-produtos/:compraId/:produtoId
router.delete('/:compraId/:produtoId', compraProdutosController.removeItem);

// Exporta o router para ser usado no arquivo principal de rotas
module.exports = router;
