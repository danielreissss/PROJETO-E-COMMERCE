const express = require('express');
const router = express.Router({ mergeParams: true });
const compraProdutosController = require('../controller/compra_produtos.controller.js');

// Rota para buscar todos os itens de uma compra (Read)
// GET /api/compras/:compraId/items
router.get('/', compraProdutosController.getItemsForCompra);

// Rota para adicionar um novo item a uma compra (Create)
// POST /api/compras/:compraId/items
router.post('/', compraProdutosController.addItem);

// Rota para atualizar um item específico em uma compra (Update)
// PUT /api/compras/:compraId/items/:produtoId
router.put('/:produtoId', compraProdutosController.updateItem);

// Rota para remover um item de uma compra (Delete)
// DELETE /api/compras/:compraId/items/:produtoId
router.delete('/:produtoId', compraProdutosController.removeItem);

module.exports = router;