const express = require('express');
const router = express.Router();
const compraController = require('../controller/compra.controller.js');
const compraProdutosRoutes = require('./compra_produtos.routes.js');

// Rota para criar uma nova compra (com seus produtos no corpo da requisição)
// POST /api/compras
router.post('/', compraController.create);

// Rota para buscar uma compra específica e todos os seus produtos
// GET /api/compras/1
router.get('/:id', compraController.findOne);

// Aninhamento de Rotas:
// Permite usar rotas para gerenciar os itens de uma compra específica.
// Ex: PUT /api/compras/1/items/5
router.use('/:compraId/items', compraProdutosRoutes);


module.exports = router;