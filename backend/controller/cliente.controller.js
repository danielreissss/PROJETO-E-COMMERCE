// Adicione estas funções ao seu cliente.controller.js
// (Você já tem as funções 'create' e 'login')

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
        res.status(400).send({ message: "O corpo da requisição não pode ser vazio!" });
    }
    // IMPORTANTE: Se a senha for atualizada, ela também precisa ser criptografada aqui!
    // Ex: if (req.body.senha) { req.body.senha = bcrypt.hashSync(...) }

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