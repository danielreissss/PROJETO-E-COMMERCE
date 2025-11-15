// backend/controller/cliente.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cliente = require('../model/cliente.model');

const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body || {};

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    const exists = await Cliente.getByEmail(email);
    if (exists) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const novo = await Cliente.create({
      nome,
      email,
      senha: hash,
      cargo: cargo || 'padrao',
    });

    return res.status(201).json({
      id: novo.id,
      nome: novo.nome,
      email: novo.email,
      cargo: novo.cargo,
    });
  } catch (err) {
    console.error('ERRO REGISTER CLIENTE', err);
    return res.status(500).json({
      message: err?.message || 'Erro ao registrar cliente.',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({
        auth: false,
        message: 'Email e senha são obrigatórios.',
      });
    }

    const user = await Cliente.getByEmail(email);
    if (!user) {
      return res.status(404).json({
        auth: false,
        message: 'Usuário não encontrado.',
      });
    }

    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) {
      return res
        .status(401)
        .json({ auth: false, message: 'Senha inválida!' });
    }

    const token = sign({ id: user.id, cargo: user.cargo });

    return res.status(200).json({ auth: true, token });
  } catch (err) {
    return res.status(500).json({
      auth: false,
      message: err?.message || 'Erro no login.',
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await Cliente.getById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || 'Erro ao buscar usuário.',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const ok = await Cliente.delete(id);

    if (!ok) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    return res
      .status(200)
      .json({ message: 'Cliente foi deletado com sucesso!' });
  } catch (err) {
    if (err?.kind === 'not_found') {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    return res.status(500).json({
      message: 'Não foi possível deletar o cliente.',
    });
  }
};
