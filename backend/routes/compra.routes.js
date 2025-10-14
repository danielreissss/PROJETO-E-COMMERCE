const express = require('express');
const router = express.Router();
const compraController = require('../controller/compra.controller.js');
const compraProdutosRoutes = require('./compra_produtos.routes.js');

// --- Rotas de CRUD para Compra ---

// Rota para buscar todas as compras (Read)
router.get('/', compraController.findAll);

// Rota para criar uma nova compra (Create)
router.post('/', compraController.create);

// Rota para buscar uma compra específica e seus produtos (Read)
router.get('/:id', compraController.findOne);

// Rota para atualizar o status de uma compra (Update)
router.put('/:id', compraController.update);

// Rota para deletar uma compra (Delete)
router.delete('/:id', compraController.delete);


// --- Aninhamento de Rotas para gerenciar os itens da compra ---
router.use('/:compraId/items', compraProdutosRoutes);


module.exports = router;