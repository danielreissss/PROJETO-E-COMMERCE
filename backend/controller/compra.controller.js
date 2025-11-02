// backend/controller/compra.controller.js
const Compra = require('../model/compra.model.js');
const CompraProdutos = require('../model/compra_produtos.model.js');
const db = require('../database.js'); // Importa a conexão para usar transações

// Cria uma nova compra e seus produtos (LOGICA DE TRANSAÇÃO)
exports.create = async (req, res) => {
    const { cliente_id, produtos } = req.body;
    if (!cliente_id || !produtos || !produtos.length) {
        return res.status(400).send({ message: "Dados da compra incompletos!" });
    }

    let connection;
    try {
        // Inicia a conexão e a transação
        connection = await db.promise().getConnection();
        await connection.beginTransaction();

        // 1. Cria a "casca" da compra
        const compraData = { cliente_id: cliente_id, status: 'Pendente' };
        const [compraResult] = await connection.query('INSERT INTO compra SET ?', compraData);
        const compraId = compraResult.insertId;

        // 2. Prepara os produtos para a tabela 'compra_produtos'
        const inserts = produtos.map(prod => {
            const item = {
                compra_id: compraId,
                produto_id: prod.produto_id,
                quantidade: prod.quantidade,
                preco_unitario: prod.preco_unitario
            };
            return connection.query('INSERT INTO compra_produtos SET ?', item);
        });

        // 3. Executa todas as inserções dos produtos
        await Promise.all(inserts);

        // 4. Se tudo deu certo, "commita" as mudanças
        await connection.commit();
        res.status(201).send({ message: "Compra registrada com sucesso!", id: compraId });

    } catch (error) {
        // 5. Se algo deu errado, desfaz tudo ("rollback")
        if (connection) await connection.rollback();
        res.status(500).send({ message: "Erro ao processar a compra.", error: error.message });
    } finally {
        // 6. Libera a conexão
        if (connection) connection.release();
    }
};

// Busca uma compra e todos os seus produtos
exports.findOne = (req, res) => {
    const compraId = req.params.id;

    Compra.getById(compraId, (err, dataCompra) => {
        if (err) {
            if (err.kind === "not_found") return res.status(404).send({ message: "Compra não encontrada." });
            return res.status(500).send({ message: "Erro ao buscar compra."});
        }
        
        // Se encontrou a compra, busca os produtos dela
        CompraProdutos.findByCompraId(compraId, (err, dataProdutos) => {
            if (err) return res.status(500).send({ message: "Erro ao buscar itens da compra."});

            // Combina os resultados
            const resposta = {
                ...dataCompra,
                produtos: dataProdutos
            };
            res.send(resposta);
        });
    });
};

// Busca todas as compras (com nome do cliente)
exports.findAll = (req, res) => {
    Compra.getAll((err, data) => {
        if (err) res.status(500).send({ message: err.message || "Erro ao buscar as compras." });
        else res.send(data);
    });
};

// Atualiza uma compra (ex: mudar o status)
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "O corpo da requisição não pode ser vazio!" });
    }

    // Apenas dados da 'compra' (ex: status)
    const dadosAtualizar = req.body; 

    Compra.update(req.params.id, dadosAtualizar, (err, data) => {
        if (err) {
            if (err.kind === "not_found") res.status(404).send({ message: `Compra não encontrada com id ${req.params.id}.` });
            else res.status(500).send({ message: "Erro ao atualizar compra com id " + req.params.id });
        } else res.send({ message: "Compra atualizada com sucesso." });
    });
};

// Deleta uma compra e todos os seus itens associados (LOGICA DE TRANSAÇÃO)
exports.delete = async (req, res) => {
    const compraId = req.params.id;
    let connection;

    try {
        connection = await db.promise().getConnection();
        await connection.beginTransaction();

        // 1. Deleta os "filhos" (itens da 'compra_produtos')
        await connection.query('DELETE FROM compra_produtos WHERE compra_id = ?', [compraId]);

        // 2. Deleta o "pai" (a 'compra')
        const [deleteResult] = await connection.query('DELETE FROM compra WHERE id = ?', [compraId]);

        if (deleteResult.affectedRows === 0) {
            // Se a compra não existia, desfaz a transação
            await connection.rollback();
            return res.status(404).send({ message: `Compra não encontrada com id ${compraId}.` });
        }

        // 3. Se tudo deu certo, "commita"
        await connection.commit();
        res.send({ message: `Compra deletada com sucesso!` });

    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).send({ message: "Não foi possível deletar a compra.", error: error.message });
    } finally {
        if (connection) connection.release();
    }
};