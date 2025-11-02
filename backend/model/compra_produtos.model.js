// backend/model/compra_produtos.model.js
const dbConnection = require('../database.js');

const CompraProdutos = {};

// Adiciona um produto a uma compra
CompraProdutos.create = (novaEntrada, callback) => {
    dbConnection.query('INSERT INTO compra_produtos SET ?', novaEntrada, callback);
};

// Busca todos os produtos de uma compra específica
CompraProdutos.findByCompraId = (compraId, callback) => {
    
    // CORREÇÃO: Voltamos a usar 'marca' e 'modelo' para bater com sua imagem
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

    dbConnection.query(query, [compraId], callback);
};

// Atualiza a quantidade de um produto em uma compra
CompraProdutos.update = (compraId, produtoId, dados, callback) => {
    dbConnection.query(
        'UPDATE compra_produtos SET ? WHERE compra_id = ? AND produto_id = ?',
        [dados, compraId, produtoId],
        callback
    );
};

// Remove um produto de uma compra
CompraProdutos.delete = (compraId, produtoId, callback) => {
    dbConnection.query(
        'DELETE FROM compra_produtos WHERE compra_id = ? AND produto_id = ?',
        [compraId, produtoId],
        callback
    );
};

// Deleta TODOS os produtos associados a um ID de compra
CompraProdutos.deleteByCompraId = (compraId, callback) => {
    dbConnection.query(
        'DELETE FROM compra_produtos WHERE compra_id = ?',
        [compraId],
        callback
    );
};

module.exports = CompraProdutos;