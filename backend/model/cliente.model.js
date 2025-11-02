const dbConnection = require('../database.js');

const Cliente = {};

// Buscar todos os clientes (sem expor a senha)
Cliente.getAll = (callback) => {
    dbConnection.query('SELECT id, nome, email, cargo FROM cliente', callback);
};

// Buscar um cliente por ID (sem expor a senha)
Cliente.getById = (id, callback) => {
    dbConnection.query('SELECT id, nome, email, cargo FROM cliente WHERE id = ?', [id], callback);
};

// NOVO MÉTODO ESSENCIAL PARA O LOGIN
// Buscar um cliente pelo Email
Cliente.findByEmail = (email, callback) => {
    // Para o login, precisamos de todos os dados, incluindo a senha para comparação
    dbConnection.query('SELECT * FROM cliente WHERE email = ?', [email], callback);
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

Cliente.findByValidToken = (token, result) => {
  sql.query(
    "SELECT * FROM cliente WHERE passwordResetToken = ? AND passwordResetExpires > NOW()",
    [token],
    (err, res) => {
      if (err) {
        console.log("erro: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // Token não encontrado ou já expirou
      result({ kind: "not_found" }, null);
    }
  );
};

module.exports = Cliente;