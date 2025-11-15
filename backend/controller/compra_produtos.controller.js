// backend/compra_produtos.controller.js

// Controller responsável por gerenciar os itens (produtos) dentro de uma compra

const CompraProdutos = require('../model/compra_produtos.model.js');

// ---------------------------------------------------------------------
// Adiciona um produto a uma compra específica
// POST /compras/:compraId/itens
// ---------------------------------------------------------------------
exports.addProduto = async (req, res) => {
  try {
    const novaEntrada = {
      compra_id: req.params.compraId,
      produto_id: req.body.produto_id,
      quantidade: req.body.quantidade,
      preco_unitario: req.body.preco_unitario,
    };

    const data = await CompraProdutos.create(novaEntrada);
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao adicionar item.' });
  }
};

// ---------------------------------------------------------------------
// Atualiza um item (produto) de uma compra
// PUT /compras/:compraId/itens/:produtoId
// ---------------------------------------------------------------------
exports.updateItem = async (req, res) => {
  try {
    const { compraId, produtoId } = req.params;
    const dados = req.body;

    await CompraProdutos.update(compraId, produtoId, dados);

    return res.json({ message: 'Item atualizado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao atualizar item.' });
  }
};

// ---------------------------------------------------------------------
// Remove um item (produto) de uma compra
// DELETE /compras/:compraId/itens/:produtoId
// ---------------------------------------------------------------------
exports.removeItem = async (req, res) => {
  try {
    const { compraId, produtoId } = req.params;

    await CompraProdutos.delete(compraId, produtoId);

    return res.json({ message: 'Item removido com sucesso.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao remover item.' });
  }
};

// ---------------------------------------------------------------------
// Lista todos os itens de uma compra, com dados dos produtos
// GET /compras/:compraId/itens
// ---------------------------------------------------------------------
exports.getItemsForCompra = async (req, res) => {
  try {
    const { compraId } = req.params;

    const data = await CompraProdutos.findByCompraId(compraId);

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      message:
        err.message || 'Ocorreu um erro ao buscar os itens da compra.',
    });
  }
};
