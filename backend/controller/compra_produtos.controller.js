const CompraProdutos = require('../model/compra_produtos.model.js');

// Adiciona um novo item a uma compra existente
// (Alternativa ao 'create' do compra.controller, para adicionar itens depois)
exports.addItem = (req, res) => {
    const novaEntrada = {
        compra_id: req.params.compraId, // Pega o ID da compra da URL
        produto_id: req.body.produto_id,
        quantidade: req.body.quantidade,
        preco_unitario: req.body.preco_unitario
    };

    CompraProdutos.create(novaEntrada, (err, data) => {
        if (err) res.status(500).send({ message: "Erro ao adicionar item." });
        else res.status(201).send(data);
    });
};

// Atualiza um item em uma compra (ex: mudar a quantidade)
exports.updateItem = (req, res) => {
    const { compraId, produtoId } = req.params;
    const dados = req.body; // Ex: { quantidade: 3 }

    CompraProdutos.update(compraId, produtoId, dados, (err, data) => {
        if (err) res.status(500).send({ message: "Erro ao atualizar item." });
        else res.send({ message: "Item atualizado com sucesso." });
    });
};

// Remove um item de uma compra
exports.removeItem = (req, res) => {
    const { compraId, produtoId } = req.params;

    CompraProdutos.delete(compraId, produtoId, (err, data) => {
        if (err) res.status(500).send({ message: "Erro ao remover item." });
        else res.send({ message: "Item removido com sucesso." });
    });
};
// ... (suas funções addItem, updateItem, removeItem existentes) ...

// Busca todos os itens de uma compra específica
exports.getItemsForCompra = (req, res) => {
    // O compraId virá da rota pai (ex: /api/compras/:compraId/items)
    const { compraId } = req.params;

    CompraProdutos.findByCompraId(compraId, (err, data) => {
        if (err) {
            res.status(500).send({ message: err.message || "Ocorreu um erro ao buscar os itens da compra." });
        } else {
            res.status(200).send(data);
        }
    });
};