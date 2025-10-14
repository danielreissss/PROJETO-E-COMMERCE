const dbConnection = require('../database.js');

const Cliente = {};

// Buscar todos os clientes
Cliente.getAll = (callback) => {
    dbConnection.query('SELECT * FROM cliente', callback);
};

// Buscar um cliente por ID
Cliente.getById = (id, callback) => {
    dbConnection.query('SELECT * FROM cliente WHERE id = ?', [id], callback);
};

// Criar um novo cliente
Cliente.create = (novoCliente, callback) => {
    dbConnection.query('INSERT INTO cliente SET ?', novoCliente, callback);
};

// Atualizar um cliente
Cliente.update = (id, dadosCliente, callback) => {
    dbConnection.query('UPDATE cliente SET ? WHERE id = ?', [dadosCliente, id], callback);
};

// Deletar um cliente
Cliente.delete = (id, callback) => {
    dbConnection.query('DELETE FROM cliente WHERE id = ?', [id], callback);
};

module.exports = Cliente;