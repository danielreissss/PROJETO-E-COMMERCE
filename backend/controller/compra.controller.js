// backend/compra.controller.js

// Controller responsável pelas operações de compra (pedido)

const Compra = require('../model/compra.model');

// ---------------------------------------------------------------------
// Cria uma nova compra com seus produtos
// POST /compras
// ---------------------------------------------------------------------
exports.create = async (req, res) => {
  try {
    const { cliente_id, produtos } = req.body || {};

    // Validação básica
    if (!cliente_id || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({
        message: 'cliente_id e produtos são obrigatórios.',
      });
    }

    const data = await Compra.create({ cliente_id, produtos });

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({
      message: err?.message || 'Erro ao criar compra.',
    });
  }
};

// ---------------------------------------------------------------------
// Busca uma compra pelo ID (inclui os itens)
// GET /compras/:id
// ---------------------------------------------------------------------
exports.findOne = async (req, res) => {
  try {
    const data = await Compra.getById(req.params.id);

    return res.status(200).json(data);
  } catch (err) {
    if (err?.kind === 'not_found') {
      return res
        .status(404)
        .json({ message: 'Compra não encontrada.' });
    }

    return res
      .status(500)
      .json({ message: 'Erro ao buscar compra.' });
  }
};

// ---------------------------------------------------------------------
// Atualiza apenas o status de uma compra
// PATCH /compras/:id/status
// ---------------------------------------------------------------------
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!status) {
      return res
        .status(400)
        .json({ message: 'Status é obrigatório.' });
    }

    const data = await Compra.updateStatus(req.params.id, status);

    // Testes esperam uma mensagem junto com os dados
    return res
      .status(200)
      .json({ ...data, message: 'Compra atualizada com sucesso.' });
  } catch (err) {
    if (err?.kind === 'not_found') {
      return res
        .status(404)
        .json({ message: 'Compra não encontrado.' });
    }

    return res
      .status(500)
      .json({ message: 'Erro ao atualizar compra.' });
  }
};

// ---------------------------------------------------------------------
// Deleta uma compra (e seus itens, via model)
// DELETE /compras/:id
// ---------------------------------------------------------------------
exports.delete = async (req, res) => {
  try {
    await Compra.delete(req.params.id);

    return res
      .status(200)
      .json({ message: 'Compra deletada com sucesso!' });
  } catch (err) {
    if (err?.kind === 'not_found') {
      return res
        .status(404)
        .json({ message: 'Compra não encontrada.' });
    }

    return res.status(500).json({
      message: 'Não foi possível deletar a compra.',
    });
  }
};
