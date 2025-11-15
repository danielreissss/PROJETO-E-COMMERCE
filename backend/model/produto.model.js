// backend/produto.model.js

// Importa o pool/conexão com o banco de dados MySQL
const db = require('../database.js');

// Objeto que agrupa todas as operações relacionadas à tabela "produtos"
const Produto = {};

// ---------------------------------------------------------------------
// Lista todos os produtos
// ---------------------------------------------------------------------
Produto.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM produtos');
  return rows;
};

// ---------------------------------------------------------------------
// Busca um produto específico pelo ID
// ---------------------------------------------------------------------
Produto.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);

  if (!rows || rows.length === 0) {
    // Convenção de erro para ser tratada no controller
    throw { kind: 'not_found' };
  }

  return rows[0];
};

// ---------------------------------------------------------------------
// Cria um novo produto
// ---------------------------------------------------------------------
// novoProduto pode conter campos como: { marca, modelo, preco, estoque, ... }
Produto.create = async (novoProduto) => {
  const [result] = await db.query('INSERT INTO produtos SET ?', [novoProduto]);
  return { id: result.insertId, ...novoProduto };
};

// ---------------------------------------------------------------------
// Atualiza um produto existente
// ---------------------------------------------------------------------
// dados pode conter qualquer campo da tabela produtos que você queira alterar
Produto.update = async (id, dados) => {
  const [result] = await db.query('UPDATE produtos SET ? WHERE id = ?', [dados, id]);

  if (!result || result.affectedRows === 0) {
    throw { kind: 'not_found' };
  }

  return { id: Number(id), ...dados };
};

// ---------------------------------------------------------------------
// Deleta um produto pelo ID
// ---------------------------------------------------------------------
Produto.delete = async (id) => {
  const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);

  if (!result || result.affectedRows === 0) {
    throw { kind: 'not_found' };
  }

  return true;
};

// Exporta o modelo de Produto
module.exports = Produto;
