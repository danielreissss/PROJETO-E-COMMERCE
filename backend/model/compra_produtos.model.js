const dbConnection = require('../database.js');

const CompraProdutos = {};

// Adiciona um produto a uma compra
// A novaEntrada deve ser um objeto com: { compra_id, produto_id, quantidade, preco_unitario }
CompraProdutos.create = (novaEntrada, callback) => {
    dbConnection.query('INSERT INTO compra_produtos SET ?', novaEntrada, callback);
};

// Busca todos os produtos de uma compra específica
// Esta é a função de leitura mais importante para esta tabela.
// Usamos um JOIN para buscar também o nome do produto, o que é muito mais útil.
CompraProdutos.findByCompraId = (compraId, callback) => {
    
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
// 'dados' seria um objeto como { quantidade: 5 }
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

module.exports = CompraProdutos;