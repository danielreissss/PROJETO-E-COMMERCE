// backend/model/compra_produtos.model.js
const dbConnection = require('../database.js');

const CompraProdutos = {};

// Adiciona um produto a uma compra
CompraProdutos.create = async (novaEntrada) => {
    const [result] = await dbConnection.query('INSERT INTO compra_produtos SET ?', novaEntrada);
    return { insertId: result.insertId, ...novaEntrada };
};

// Busca todos os produtos de uma compra específica
CompraProdutos.findByCompraId = async (compraId) => {
    const query = `
        SELECT 
            cp.quantidade, 
            cp.preco_unitario, 
            p.id as produto_id, 
            p.marca as produto_nome,
            p.modelo as produto_descricao
        FROM 
            compra_produtos cp 
        JOIN 
            produtos p ON cp.produto_id = p.id 
        WHERE 
            cp.compra_id = ?;
    `;
    const [rows] = await dbConnection.query(query, [compraId]);
    return rows;
};

// Atualiza a quantidade de um produto em uma compra
CompraProdutos.update = async (compraId, produtoId, dados) => {
    const [result] = await dbConnection.query(
        'UPDATE compra_produtos SET ? WHERE compra_id = ? AND produto_id = ?',
        [dados, compraId, produtoId]
    );
    return result;
};

// Remove um produto de uma compra
CompraProdutos.delete = async (compraId, produtoId) => {
    const [result] = await dbConnection.query(
        'DELETE FROM compra_produtos WHERE compra_id = ? AND produto_id = ?',
        [compraId, produtoId]
    );
    return result;
};

// Deleta TODOS os produtos associados a um ID de compra
CompraProdutos.deleteByCompraId = async (compraId) => {
    const [result] = await dbConnection.query(
        'DELETE FROM compra_produtos WHERE compra_id = ?',
        [compraId]
    );
    return result;
};

module.exports = CompraProdutos;