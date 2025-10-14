const dbConnection = require('../database.js');

const Compra = {};

// Listar todas as compras
Compra.getAll = (callback) => {
    const sql = `
        SELECT 
            c.id, c.data_compra, c.quantidade, c.preco_total,
            cl.nome as cliente_nome, 
            p.nome as produto_nome 
        FROM compra c
        JOIN cliente cl ON c.cliente_id = cl.id
        JOIN produtos p ON c.produto_id = p.id
    `;
    dbConnection.query(sql, callback);
};

// Buscar uma compra específica por ID
Compra.getById = (id, callback) => {
    dbConnection.query('SELECT * FROM compra WHERE id = ?', [id], callback);
};

// Listar todas as compras de um cliente específico
Compra.findByClienteId = (clienteId, callback) => {
    dbConnection.query('SELECT * FROM compra WHERE cliente_id = ?', [clienteId], callback);
};

// Registrar uma nova compra
Compra.create = (novaCompra, callback) => {
    dbConnection.query('INSERT INTO compra SET ?', novaCompra, callback);
};


module.exports = Compra;