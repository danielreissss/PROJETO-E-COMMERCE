const dbConnection = require('../database.js');

const Produto = {};

// Buscar todos os produtos (não precisa de alteração)
Produto.getAll = (callback) => {
    dbConnection.query('SELECT * FROM produtos', callback);
};

// Buscar um produto por ID (não precisa de alteração)
Produto.getById = (id, callback) => {
    dbConnection.query('SELECT * FROM produtos WHERE id = ?', [id], callback);
};

// Criar um novo produto
// A função espera um objeto com as colunas da sua tabela: marca, modelo, etc.
Produto.create = (novoProduto, callback) => {
    dbConnection.query('INSERT INTO produtos SET ?', novoProduto, callback);
};


/* Exemplo de como usar a função create:
const meuNovoProduto = {
    nome: "Samsung Galaxy S25",
    descricao: "O mais novo smartphone com IA integrada.",
    preco: 4999.90,
    estoque: 50
};
Produto.create(meuNovoProduto, (err, result) => { ... });
*/


// Atualizar um produto
// A função espera um objeto com os campos que você quer atualizar
Produto.update = (id, dadosProduto, callback) => {
    dbConnection.query('UPDATE produtos SET ? WHERE id = ?', [dadosProduto, id], callback);
};
/* Exemplo de como usar a função update:
const dadosParaAtualizar = {
    preco: 4899.90,
    estoque: 45
};
Produto.update(1, dadosParaAtualizar, (err, result) => { ... });
*/


// Deletar um produto (não precisa de alteração)
Produto.delete = (id, callback) => {
    dbConnection.query('DELETE FROM produtos WHERE id = ?', [id], callback);
};

module.exports = Produto;