const Compra = require('../model/compra.model.js');
const CompraProdutos = require('../model/compra_produtos.model.js');

// Cria uma nova compra com seus produtos
exports.create = (req, res) => {
    // A requisição deve ter o id do cliente e um array de produtos
    const { cliente_id, produtos } = req.body;
    if (!cliente_id || !produtos || produtos.length === 0) {
        res.status(400).send({ message: "Dados da compra incompletos!" });
        return;
    }

    // 1. Cria a entrada principal na tabela 'compra'
    Compra.create({ cliente_id: cliente_id }, (err, dataCompra) => {
        if (err) {
            res.status(500).send({ message: "Erro ao registrar a compra." });
            return;
        }

        const compraId = dataCompra.insertId;
        let itemsProcessed = 0;

        // 2. Itera sobre cada produto e o insere na tabela 'compra_produtos'
        produtos.forEach(produto => {
            const novaEntrada = {
                compra_id: compraId,
                produto_id: produto.produto_id,
                quantidade: produto.quantidade,
                preco_unitario: produto.preco_unitario
            };

            CompraProdutos.create(novaEntrada, (err, data) => {
                itemsProcessed++;
                if (err) {
                    // Idealmente, aqui deveria haver uma lógica para reverter a compra (transaction)
                    console.error("Erro ao adicionar produto à compra:", err);
                }
                // Quando todos os itens forem processados, envia a resposta
                if (itemsProcessed === produtos.length) {
                    res.status(201).send({ message: "Compra registrada com sucesso!", compraId: compraId });
                }
            });
        });
    });
};

// Busca uma compra e todos os seus produtos
exports.findOne = (req, res) => {
    const compraId = req.params.id;

    Compra.findById(compraId, (err, dataCompra) => {
        if (err) return res.status(500).send(err);
        if (!dataCompra) return res.status(404).send({ message: "Compra não encontrada." });

        // Agora busca os produtos associados a essa compra
        CompraProdutos.findByCompraId(compraId, (err, dataProdutos) => {
            if (err) return res.status(500).send(err);

            // Combina os resultados
            const resultadoFinal = {
                ...dataCompra,
                produtos: dataProdutos
            };

            res.send(resultadoFinal);
        });
    });
};

// Adicione estas funções ao seu compra.controller.js
// (Você já tem as funções 'create' e 'findOne')

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

    // Passo 1: Deletar todos os itens da tabela 'compra_produtos' associados a esta compra.
    CompraProdutos.deleteAllByCompraId(compraId, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Erro ao deletar os produtos da compra: " + err.message });
            return;
        }

        // Passo 2: Agora que os 'filhos' foram deletados, deletar a compra 'mãe'.
        Compra.delete(compraId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") res.status(404).send({ message: `Compra não encontrada com id ${compraId}.` });
                else res.status(500).send({ message: "Não foi possível deletar a compra com id " + compraId });
            } else res.send({ message: `Compra e seus produtos foram deletados com sucesso!` });
        });
    });
};