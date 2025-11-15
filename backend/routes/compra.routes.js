// backend/compra.routes.js
const express = require('express');
const router = express.Router();

const compraController = require('../controller/compra.controller.js');

router.post('/', compraController.create);
router.get('/:id', compraController.findOne);
router.put('/:id', compraController.updateStatus);
router.delete('/:id', compraController.delete);

module.exports = router;
