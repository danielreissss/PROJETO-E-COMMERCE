// backend/compra.routes.js

const express = require('express');
const router = express.Router();

// Importa o controller responsável pelas operações de compra
// (criação, busca, atualização de status e deleção)
const compraController = require('../controller/compra.controller.js');

// ---------------------------------------------------------------------
// Rotas principais para gerenciamento de compras
// Prefixo esperado em index.js: /api/compras
// ---------------------------------------------------------------------

// Cria uma nova compra para um cliente, incluindo os produtos associados
// POST /api/compras
router.post('/', compraController.create);

// Busca uma compra específica pelo ID, incluindo detalhes do cliente e itens
// GET /api/compras/:id
router.get('/:id', compraController.findOne);

// Atualiza o status de uma compra (ex.: Pendente -> Enviado)
// PUT /api/compras/:id
router.put('/:id', compraController.updateStatus);

// Deleta uma compra específica pelo ID
// DELETE /api/compras/:id
router.delete('/:id', compraController.delete);

// Exporta o router para ser usado no app principal (index.js)
module.exports = router;
