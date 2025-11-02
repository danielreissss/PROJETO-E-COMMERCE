// backend/model/produto.model.js
const dbConnection = require('../database.js');

const Produto = {};

// Buscar todos os produtos
Produto.getAll = (callback) => {
    dbConnection.query('SELECT * FROM produtos', callback);
};

// Buscar um produto por ID
Produto.getById = (id, callback) => {
    dbConnection.query('SELECT * FROM produtos WHERE id = ?', [id], (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        // Se encontramos um resultado, retorne o primeiro (e único) objeto
        if (res.length) {
            callback(null, res[0]);
            return;
        }
        // Não encontrado
        callback({ kind: "not_found" }, null);
    });
};

// Criar um novo produto
Produto.create = (novoProduto, callback) => {
    dbConnection.query('INSERT INTO produtos SET ?', novoProduto, callback);
};

// Atualizar um produto
Produto.update = (id, dadosProduto, callback) => {
    dbConnection.query('UPDATE produtos SET ? WHERE id = ?', [dadosProduto, id], (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        // Verifica se alguma linha foi de fato atualizada
        if (res.affectedRows === 0) {
            // Nenhum produto encontrado com esse ID
            callback({ kind: "not_found" }, null);
            return;
        }
        // Sucesso
        callback(null, { id: id, ...dadosProduto });
    });
};

// Deletar um produto
Produto.delete = (id, callback) => {
    dbConnection.query('DELETE FROM produtos WHERE id = ?', [id], (err, res) => {
        if (err) {
            callback(err, null);
            return;
        }
        // Verifica se alguma linha foi de fato deletada
        if (res.affectedRows === 0) {
            // Nenhum produto encontrado com esse ID
            callback({ kind: "not_found" }, null);
            return;
        }
        // Sucesso
        callback(null, res);
    });
};

module.exports = Produto;