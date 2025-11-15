// backend/cliente.model.js
const db = require('../database.js');

const Cliente = {};

Cliente.getByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM cliente WHERE email = ?', [email]);
  if (!rows || rows.length === 0) return null;
  return rows[0];
};

Cliente.getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM cliente WHERE id = ?',
    [id]
  );
  return rows && rows.length ? rows[0] : null;
};

Cliente.create = async ({ nome, email, senha, cargo }) => {
  const [result] = await db.query(
    'INSERT INTO cliente (nome, email, senha, cargo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, cargo]
  );
  return { id: result.insertId, nome, email, cargo };
};

Cliente.delete = async (id) => {
  const [result] = await db.query(
    'DELETE FROM cliente WHERE id = ?',
    [id]
  );
  if (!result || result.affectedRows === 0) {
    throw { kind: 'not_found' };
  }
  return true;
};

module.exports = Cliente;
