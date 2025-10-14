const express = require('express');
// A opção { mergeParams: true } é essencial para que esta rota tenha acesso ao ':compraId' da rota pai.
const router = express.Router({ mergeParams: true });
const compraProdutosController = require('../controller/compra_produtos.controller.js');

// Rota para adicionar um novo item a uma compra
// POST /api/compras/:compraId/items
router.post('/', compraProdutosController.addItem);

// Rota para atualizar um item específico (ex: quantidade) em uma compra
// PUT /api/compras/:compraId/items/:produtoId
router.put('/:produtoId', compraProdutosController.updateItem);

// Rota para remover um item de uma compra
// DELETE /api/compras/:compraId/items/:produtoId
router.delete('/:produtoId', compraProdutosController.removeItem);

module.exports = router;