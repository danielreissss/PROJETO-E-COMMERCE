// backend/controller/cliente.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cliente = require('../model/cliente.model');

// Função helper para assinar o token JWT
const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

// ---------------------------------------------------------------------
// Registro de novo cliente
// ---------------------------------------------------------------------
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body || {};

    // Validação básica de campos obrigatórios
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    // Verifica se já existe cliente com o mesmo e-mail
    const exists = await Cliente.getByEmail(email);
    if (exists) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    // Gera hash seguro da senha
    const hash = await bcrypt.hash(senha, 10);

    // Cria o novo cliente no banco
    const novo = await Cliente.create({
      nome,
      email,
      senha: hash,
      // Se não for enviado "cargo", assume "padrao"
      cargo: cargo || 'padrao',
    });

    // Retorna dados públicos do cliente criado (sem a senha)
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

// ---------------------------------------------------------------------
// Login do cliente (autenticação)
// ---------------------------------------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({
        auth: false,
        message: 'Email e senha são obrigatórios.',
      });
    }

    // Busca cliente pelo e-mail
    const user = await Cliente.getByEmail(email);
    if (!user) {
      return res.status(404).json({
        auth: false,
        message: 'Usuário não encontrado.',
      });
    }

    // Compara senha enviada com o hash armazenado
    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) {
      return res
        .status(401)
        .json({ auth: false, message: 'Senha inválida!' });
    }

    // Gera token contendo id e cargo
    const token = sign({ id: user.id, cargo: user.cargo });

    return res.status(200).json({ auth: true, token });
  } catch (err) {
    return res.status(500).json({
      auth: false,
      message: err?.message || 'Erro no login.',
    });
  }
};

// ---------------------------------------------------------------------
// Retorna dados do usuário autenticado (rota /me)
// ---------------------------------------------------------------------
exports.me = async (req, res) => {
  try {
    // req.userId é preenchido pelo middleware verifyToken
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

// ---------------------------------------------------------------------
// Deleta um cliente pelo ID
// ---------------------------------------------------------------------
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
