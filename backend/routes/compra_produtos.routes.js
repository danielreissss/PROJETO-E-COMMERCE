// backend/compra_produtos.routes.js
const express = require('express');
const router = express.Router();

const compraProdutosController = require('../controller/compra_produtos.controller.js');

router.post('/:compraId', compraProdutosController.addProduto);
router.get('/:compraId', compraProdutosController.getItemsForCompra);
router.put('/:compraId/:produtoId', compraProdutosController.updateItem);
router.delete('/:compraId/:produtoId', compraProdutosController.removeItem);

module.exports = router;
