// backend/model/cliente.model.js
const dbConnection = require('../database.js');

const Cliente = {};

// Buscar todos os clientes (sem expor a senha)
Cliente.getAll = (callback) => {
    // Esta está correta, pois esperamos uma lista
    dbConnection.query('SELECT id, nome, email, cargo FROM cliente', callback);
};

// Buscar um cliente por ID (sem expor a senha)
// ATUALIZAÇÃO: Adicionada lógica para tratar o array de resultados
Cliente.getById = (id, callback) => {
    dbConnection.query('SELECT id, nome, email, cargo FROM cliente WHERE id = ?', [id], (err, res) => {
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

// NOVO MÉTODO ESSENCIAL PARA O LOGIN
// Buscar um cliente pelo Email
// ATUALIZAÇÃO: Adicionada lógica para tratar o array e retornar um objeto
Cliente.findByEmail = (email, callback) => {
    // Para o login, precisamos de todos os dados, incluindo a senha para comparação
    dbConnection.query('SELECT * FROM cliente WHERE email = ?', [email], (err, res) => {
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

// Criar um novo cliente
Cliente.create = (novoCliente, callback) => {
    // Lembre-se: A senha em 'novoCliente' já deve chegar aqui criptografada (hashed)!
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

// --- NOVO CÓDIGO (SEMANA 3) ---
// Função necessária para o 'exports.resetPassword'
Cliente.findByValidToken = (token, callback) => {
    dbConnection.query(
        "SELECT * FROM cliente WHERE passwordResetToken = ? AND passwordResetExpires > NOW()",
        [token],
        (err, res) => {
            if (err) {
                callback(err, null);
                return;
            }
            // Se encontramos um token válido, retorne o usuário
            if (res.length) {
                callback(null, res[0]);
                return;
            }
            // Token não encontrado ou já expirou
            callback({ kind: "not_found" }, null);
        }
    );
};
// --- FIM DO NOVO CÓDIGO ---

module.exports = Cliente;