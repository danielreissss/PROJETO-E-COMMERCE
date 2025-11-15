// backend/compra_produtos.controller.js
const CompraProdutos = require('../model/compra_produtos.model.js');

exports.addProduto = async (req, res) => {
  try {
    const novaEntrada = {
      compra_id: req.params.compraId,
      produto_id: req.body.produto_id,
      quantidade: req.body.quantidade,
      preco_unitario: req.body.preco_unitario,
    };

    const data = await CompraProdutos.create(novaEntrada);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar item.' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { compraId, produtoId } = req.params;
    const dados = req.body;
    await CompraProdutos.update(compraId, produtoId, dados);
    res.json({ message: 'Item atualizado com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar item.' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { compraId, produtoId } = req.params;
    await CompraProdutos.delete(compraId, produtoId);
    res.json({ message: 'Item removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover item.' });
  }
};

exports.getItemsForCompra = async (req, res) => {
  try {
    const { compraId } = req.params;
    const data = await CompraProdutos.findByCompraId(compraId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || 'Ocorreu um erro ao buscar os itens da compra.',
    });
  }
};
