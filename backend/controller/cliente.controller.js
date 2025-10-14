const Cliente = require('../model/cliente.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cria (registra) um novo cliente com senha criptografada
exports.create = (req, res) => {
    if (!req.body.email || !req.body.senha) {
        res.status(400).send({ message: "Email e senha são obrigatórios!" });
        return;
    }

    // Criptografa a senha antes de salvar
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.senha, salt);

    const cliente = {
        nome: req.body.nome,
        email: req.body.email,
        senha: hashedPassword,
        cargo: req.body.cargo || 'padrao'
    };

    Cliente.create(cliente, (err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao criar o cliente." });
        else res.status(201).send({ id: data.insertId, nome: cliente.nome, email: cliente.email });
    });
};

// Lógica de Login
exports.login = (req, res) => {
    if (!req.body.email || !req.body.senha) {
        res.status(400).send({ message: "Email e senha são obrigatórios!" });
        return;
    }

    Cliente.findByEmail(req.body.email, (err, cliente) => {
        if (err) {
            res.status(500).send({ message: "Erro interno." });
            return;
        }
        if (!cliente) {
            res.status(404).send({ message: "Usuário não encontrado." });
            return;
        }

        // Compara a senha enviada com a senha criptografada no banco
        const passwordIsValid = bcrypt.compareSync(req.body.senha, cliente.senha);
        if (!passwordIsValid) {
            res.status(401).send({ auth: false, token: null, message: "Senha inválida!" });
            return;
        }

        // Gera o token JWT
        const token = jwt.sign({ id: cliente.id, cargo: cliente.cargo }, process.env.JWT_SECRET, {
            expiresIn: 86400 // Expira em 24 horas
        });

        res.status(200).send({ auth: true, token: token });
    });
};

// Adicione aqui as funções findAll, findOne, update e delete se necessário