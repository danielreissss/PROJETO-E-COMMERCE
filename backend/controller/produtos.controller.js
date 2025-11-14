const Produto = require('../model/produto.model.js');

// Cria e salva um novo produto
exports.create = (req, res) => {
    // CORREÇÃO: Validando os campos corretos do seu banco de dados
    if (!req.body.marca || !req.body.modelo || !req.body.tipo_produto) {
        res.status(400).send({ message: "O produto deve ter marca, modelo e tipo!" });
        return;
    }

    // CORREÇÃO: Mapeando os campos corretos do body para o objeto
    const produto = {
        marca: req.body.marca,
        modelo: req.body.modelo,
        tipo_produto: req.body.tipo_produto,
        preco: req.body.preco,       //
        estoque: req.body.estoque    //
    };

    Produto.create(produto, (err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao criar o produto." });
        else res.status(201).send(data);
    });
};

// Busca todos os produtos (Esta função já estava correta)
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
// Ela funciona pois passa o 'req.body' (com os campos corretos) direto para o model.
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