// backend/controller/produtos.controller.js
const Produto = require('../model/produto.model');

exports.create = async (req, res) => {
  try {
    const { marca, modelo, tipo_produto, preco, estoque } = req.body || {};

    if (!marca || !modelo || !tipo_produto) {
      return res
        .status(400)
        .json({ message: 'O produto deve ter marca, modelo e tipo!' });
    }

    const produto = {
      marca,
      modelo,
      tipo_produto,
      preco,
      estoque,
    };

    const data = await Produto.create(produto);

    // testes esperam insertId
    return res.status(201).json({ insertId: data.id, ...produto });
  } catch (err) {
    console.error('ERRO CREATE PRODUTO', err);
    return res.status(500).json({
      message: err?.message || 'Erro ao criar o produto.',
    });
  }
};

exports.findAll = async (_req, res) => {
  try {
    const data = await Produto.getAll();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      message: err?.message || 'Erro ao buscar produtos.',
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const data = await Produto.getById(req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    if (err?.kind === 'not_found') {
      return res.status(404).json({
        message: `Produto não encontrado com id ${req.params.id}.`,
      });
    }
    return res.status(500).json({
      message: 'Erro ao buscar produto com id ' + req.params.id,
    });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: 'O corpo da requisição não pode ser vazio!',
      });
    }

    const data = await Produto.update(req.params.id, req.body);
    return res.status(200).json(data);
  } catch (err) {
    if (err?.kind === 'not_found') {
      return res.status(404).json({
        message: `Produto não encontrado com id ${req.params.id}.`,
      });
    }
    return res.status(500).json({
      message: 'Erro ao atualizar produto com id ' + req.params.id,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    await Produto.delete(req.params.id);
    return res
      .status(200)
      .json({ message: 'Produto foi deletado com sucesso!' });
  } catch (err) {
    if (err?.kind === 'not_found') {
      return res.status(404).json({
        message: `Produto não encontrado com id ${req.params.id}.`,
      });
    }
    return res.status(500).json({
      message:
        'Não foi possível deletar o produto com id ' + req.params.id,
    });
  }
};