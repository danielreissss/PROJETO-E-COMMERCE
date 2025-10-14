const dbConnection = require('../database.js');

const Compra = {};

// Listar todas as compras
Compra.getAll = (callback) => {
    const sql = `
        SELECT 
            c.id, c.data_compra, c.quantidade, c.valor_unitario,   // CORREÇÃO: Sua coluna se chama 'valor_unitario', não 'preco_total'.
            cl.nome as cliente_nome, 
            p.marca as produto_marca,                               // CORREÇÃO: Sua tabela 'produtos' usa 'marca' e 'modelo', não 'nome'.
            p.modelo as produto_modelo
        FROM compra c
        JOIN cliente cl ON c.id_cliente = cl.id                  // CORREÇÃO: A coluna na sua tabela 'compra' se chama 'id_cliente'.
        JOIN produtos p ON c.id_produto = p.id                  // CORREÇÃO: A coluna na sua tabela 'compra' se chama 'id_produto'.
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