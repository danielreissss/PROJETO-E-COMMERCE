const Compra = require('../model/compra.model.js');
// O modelo CompraProdutos não é mais necessário nesta lógica
// const CompraProdutos = require('../model/compra_produtos.model.js');

// Cria uma nova compra com seus produtos
exports.create = (req, res) => {
    const { cliente_id, produtos } = req.body;
    if (!cliente_id || !produtos || !produtos.length) {
        return res.status(400).send({ message: "Dados da compra incompletos!" });
    }

    let itemsProcessed = 0;
    const totalItems = produtos.length;
    const responses = [];

    // CORREÇÃO: Itera sobre cada produto e cria um registro para cada um na tabela 'compra'
    produtos.forEach(produto => {
        const novaCompra = {
            cliente_id: cliente_id,
            produto_id: produto.produto_id,
            quantidade: produto.quantidade,
            valor_unitario: produto.preco_unitario
        };

        Compra.create(novaCompra, (err, data) => {
            itemsProcessed++;
            if (err) {
                responses.push({ error: err.message });
            } else {
                responses.push({ id: data.insertId });
            }

            if (itemsProcessed === totalItems) {
                res.status(201).send({ message: "Processamento da compra finalizado.", results: responses });
            }
        });
    });
};


// O restante do seu código permanece exatamente o mesmo

// Busca uma compra e todos os seus produtos
exports.findOne = (req, res) => {
    const compraId = req.params.id;

    Compra.findById(compraId, (err, dataCompra) => {
        if (err) return res.status(500).send(err);
        if (!dataCompra) return res.status(404).send({ message: "Compra não encontrada." });
        
        // Esta parte agora não é mais necessária pois seu model 'Compra' já pode buscar tudo
        res.send(dataCompra);
    });
};

// Busca todas as compras (sem os produtos, para uma listagem mais leve)
exports.findAll = (req, res) => {
    Compra.getAll((err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao buscar as compras." });
        else res.send(data);
    });
};

// Atualiza uma compra (ex: mudar o status de 'Pendente' para 'Enviado')
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "O corpo da requisição não pode ser vazio!" });
    }

    Compra.update(req.params.id, req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Compra não encontrada com id ${req.params.id}.` });
            else res.status(500).send({ message: "Erro ao atualizar compra com id " + req.params.id });
        } else res.send({ message: "Status da compra atualizado com sucesso." });
    });
};

// Deleta uma compra e todos os seus itens associados
exports.delete = (req, res) => {
    const compraId = req.params.id;

    // Com a nova estrutura, basta deletar a linha da compra
    Compra.delete(compraId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Compra não encontrada com id ${compraId}.` });
            else res.status(500).send({ message: "Não foi possível deletar a compra com id " + compraId });
        } else res.send({ message: `Compra deletada com sucesso!` });
    });
};