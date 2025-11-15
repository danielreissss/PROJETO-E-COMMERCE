const db = require('../database.js');

const Produto = {};

Produto.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM produtos');
  return rows;
};

Produto.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
  if (!rows || rows.length === 0) throw { kind: 'not_found' };
  return rows[0];
};

Produto.create = async (novoProduto) => {
  const [result] = await db.query('INSERT INTO produtos SET ?', [novoProduto]);
  return { id: result.insertId, ...novoProduto };
};

Produto.update = async (id, dados) => {
  const [result] = await db.query('UPDATE produtos SET ? WHERE id = ?', [dados, id]);
  if (!result || result.affectedRows === 0) throw { kind: 'not_found' };
  return { id: Number(id), ...dados };
};

Produto.delete = async (id) => {
  const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);
  if (!result || result.affectedRows === 0) throw { kind: 'not_found' };
  return true;
};

module.exports = Produto;
