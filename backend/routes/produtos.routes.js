// backend/produtos.routes.js
const express = require('express');
const router = express.Router();

const produtoController = require('../controller/produtos.controller.js');

router.post('/', produtoController.create);
router.get('/', produtoController.findAll);
router.get('/:id', produtoController.findOne);
router.put('/:id', produtoController.update);
router.delete('/:id', produtoController.delete);

module.exports = router;
