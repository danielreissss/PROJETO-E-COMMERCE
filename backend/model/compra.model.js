// backend/model/compra.model.js
const dbConnection = require('../database.js');

const Compra = {};

// Listar todas as compras (com nome do cliente)
Compra.getAll = (callback) => {
    const sql = `
        SELECT 
            c.id, c.cliente_id, c.data_pedido, c.status,
            cl.nome as cliente_nome
        FROM compra c
        JOIN cliente cl ON c.cliente_id = cl.id
    `;
    dbConnection.query(sql, callback);
};

// Buscar uma compra específica por ID
Compra.getById = (id, callback) => {
    dbConnection.query('SELECT * FROM compra WHERE id = ?', [id], (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (res.length) {
            callback(null, res[0]);
            return;
        }
        callback({ kind: "not_found" }, null);
    });
};

// Listar todas as compras de um cliente específico
Compra.findByClienteId = (clienteId, callback) => {
    dbConnection.query('SELECT * FROM compra WHERE cliente_id = ?', [clienteId], callback);
};

// Registrar uma nova compra (apenas a "casca" da compra)
Compra.create = (novaCompra, callback) => {
    dbConnection.query('INSERT INTO compra SET ?', novaCompra, callback);
};

// NOVO: Atualizar uma compra (ex: status)
Compra.update = (id, dados, callback) => {
    dbConnection.query('UPDATE compra SET ? WHERE id = ?', [dados, id], (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (res.affectedRows === 0) {
            callback({ kind: "not_found" }, null);
            return;
        }
        callback(null, { id: id, ...dados });
    });
};

// NOVO: Deletar uma compra
Compra.delete = (id, callback) => {
    dbConnection.query('DELETE FROM compra WHERE id = ?', [id], (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (res.affectedRows === 0) {
            callback({ kind: "not_found" }, null);
            return;
        }
        callback(null, res);
    });
};

module.exports = Compra;