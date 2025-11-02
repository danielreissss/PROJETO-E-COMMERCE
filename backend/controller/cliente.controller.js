// Novas importações necessárias para a recuperação de senha
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 
const Cliente = require('../model/cliente.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cria (registra) um novo cliente
exports.create = (req, res) => {
    // Validação para os campos essenciais de um cliente
    if (!req.body.email || !req.body.senha) {
        res.status(400).send({ message: "Email e senha são obrigatórios!" });
        return;
    }

    // Criptografa a senha antes de salvar no banco
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.senha, salt);

    const cliente = {
        nome: req.body.nome,
        email: req.body.email,
        senha: hashedPassword, // Salva a senha já criptografada
        // CORREÇÃO IMPORTANTE: Seu ENUM no banco é 'administrador'
        // Garanta que o cargo 'admin' seja salvo como 'administrador'
        cargo: req.body.cargo === 'admin' ? 'administrador' : 'padrao' 
    };

    Cliente.create(cliente, (err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao criar o cliente." });
        // Retorna apenas dados seguros, nunca a senha
        else res.status(201).send({ id: data.insertId, nome: cliente.nome, email: cliente.email, cargo: cliente.cargo });
    });
};

// Lógica de Login (não faz parte do CRUD, mas é essencial para o cliente)
exports.login = (req, res) => {
    if (!req.body.email || !req.body.senha) {
        return res.status(400).send({ message: "Email e senha são obrigatórios!" });
    }

    Cliente.findByEmail(req.body.email, (err, cliente) => {
        if (err || !cliente) {
            return res.status(404).send({ message: "Usuário não encontrado ou erro." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.senha, cliente.senha);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null, message: "Senha inválida!" });
        }

        const token = jwt.sign({ id: cliente.id, cargo: cliente.cargo }, process.env.JWT_SECRET, {
            expiresIn: 86400 // Expira em 24 horas
        });

        res.status(200).send({ auth: true, token: token });
    });
};


// Busca todos os clientes
exports.findAll = (req, res) => {
    Cliente.getAll((err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao buscar clientes." });
        else res.send(data);
    });
};

// Busca um cliente pelo ID
exports.findOne = (req, res) => {
    Cliente.getById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Cliente não encontrado com id ${req.params.id}.` });
            else res.status(500).send({ message: "Erro ao buscar cliente com id " + req.params.id });
        } else res.send(data);
    });
};

// Atualiza um cliente pelo ID
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "O corpo da requisição não pode ser vazio!" });
    }

    // Se a senha estiver sendo atualizada, ela precisa ser criptografada novamente
    if (req.body.senha) {
        const salt = bcrypt.genSaltSync(10);
        req.body.senha = bcrypt.hashSync(req.body.senha, salt);
    }

    Cliente.update(req.params.id, req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Cliente não encontrado com id ${req.params.id}.` });
            else res.status(500).send({ message: "Erro ao atualizar cliente com id " + req.params.id });
        } else res.send({ message: "Cliente atualizado com sucesso." });
    });
};

// Deleta um cliente pelo ID
exports.delete = (req, res) => {
    Cliente.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Cliente não encontrado com id ${req.params.id}.` });
            else res.status(500).send({ message: "Não foi possível deletar o cliente com id " + req.params.id });
        } else res.send({ message: `Cliente foi deletado com sucesso!` });
    });
};

// --- NOVO CÓDIGO (SEMANA 3) ---

// 1. Solicitar recuperação de senha
exports.forgotPassword = (req, res) => {
    if (!req.body.email) {
        return res.status(400).send({ message: "Email é obrigatório!" });
    }

    Cliente.findByEmail(req.body.email, (err, cliente) => {
        if (err || !cliente) {
            return res.status(200).send({ message: "Se o e-mail existir, um link será enviado." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        Cliente.update(cliente.id, {
            passwordResetToken: hashedToken,
            passwordResetExpires: resetExpires
        }, async (updateErr, data) => {
            if (updateErr) {
                return res.status(500).send({ message: "Erro ao salvar o token de reset." });
            }

            const resetLink = `http://localhost:3000/api/clientes/reset-password?token=${resetToken}`;

            try {
                let transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: process.env.EMAIL_PORT,
                    secure: (process.env.EMAIL_SECURE === 'true'),
                    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                });

                await transporter.sendMail({
                    from: `"PROJETO E-COMMERCE" <${process.env.EMAIL_USER}>`,
                    to: cliente.email,
                    subject: "Recuperação de Senha",
                    html: `<p>Link para resetar sua senha (válido por 15 min):</p>
                           <a href="${resetLink}">${resetLink}</a>`,
                });
                
                res.send({ message: "Email de recuperação enviado!" });
            } catch (error) {
                res.status(500).send({ message: "Erro ao enviar email." });
            }
        });
    });
};

// 2. Resetar a senha
exports.resetPassword = (req, res) => {
    const { token } = req.query; // Pega o token da URL
    const { novaSenha } = req.body;

    if (!token || !novaSenha) {
        return res.status(400).send({ message: "Token e nova senha são obrigatórios." });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // ATENÇÃO: Você precisará criar esta função 'findByValidToken' no seu 'cliente.model.js'
    Cliente.findByValidToken(hashedToken, (err, cliente) => {
        if (err || !cliente) {
            return res.status(400).send({ message: "Token inválido ou expirado." });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(novaSenha, salt);

        Cliente.update(cliente.id, {
            senha: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null
        }, (updateErr, data) => {
            if (updateErr) {
                return res.status(500).send({ message: "Erro ao atualizar senha." });
            }
            res.send({ message: "Senha atualizada com sucesso." });
        });
    });
};