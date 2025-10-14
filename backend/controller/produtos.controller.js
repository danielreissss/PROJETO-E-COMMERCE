const Produto = require('../model/produto.model.js');

// Cria e salva um novo produto
exports.create = (req, res) => {
    if (!req.body.nome || req.body.preco == null) {
        res.status(400).send({ message: "O produto deve ter nome e preço!" });
        return;
    }

    const produto = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        preco: req.body.preco,
        estoque: req.body.estoque
    };

    Produto.create(produto, (err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao criar o produto." });
        else res.status(201).send(data);
    });
};

// Busca todos os produtos
exports.findAll = (req, res) => {
    Produto.getAll((err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao buscar produtos." });
        else res.send(data);
    });
};

// Busca um produto pelo ID
exports.findOne = (req, res) => {
    Produto.getById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Produto não encontrado com id ${req.params.id}.` });
            else res.status(500).send({ message: "Erro ao buscar produto com id " + req.params.id });
        } else res.send(data);
    });
};

// Atualiza um produto pelo ID
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "O corpo da requisição não pode ser vazio!" });
    }

    Produto.update(req.params.id, req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Produto não encontrado com id ${req.params.id}.` });
            else res.status(500).send({ message: "Erro ao atualizar produto com id " + req.params.id });
        } else res.send(data);
    });
};

// Deleta um produto pelo ID
exports.delete = (req, res) => {
    Produto.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Produto não encontrado com id ${req.params.id}.` });
            else res.status(500).send({ message: "Não foi possível deletar o produto com id " + req.params.id });
        } else res.send({ message: `Produto foi deletado com sucesso!` });
    });
};