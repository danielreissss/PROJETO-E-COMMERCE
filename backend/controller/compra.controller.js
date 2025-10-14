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