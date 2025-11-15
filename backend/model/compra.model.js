// backend/compra.model.js
const db = require('../database');

const Compra = {};

Compra.create = async ({ cliente_id, produtos }) => {
  const conn = db;

  const [result] = await conn.query(
    'INSERT INTO compra (cliente_id, status) VALUES (?, ?)',
    [cliente_id, 'Pendente']
  );

  const compraId = result.insertId;

  for (const p of produtos) {
    await conn.query(
      'INSERT INTO compra_produtos (compra_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
      [compraId, p.produto_id, p.quantidade, p.preco_unitario]
    );
  }

  return { id: compraId, cliente_id, status: 'Pendente', produtos };
};

Compra.getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM compra WHERE id = ?',
    [id]
  );

  if (!rows || rows.length === 0) {
    throw { kind: 'not_found' };
  }

  const compra = rows[0];

  const [itens] = await db.query(
    'SELECT produto_id, quantidade, preco_unitario FROM compra_produtos WHERE compra_id = ?',
    [id]
  );

  return { ...compra, produtos: itens };
};

Compra.updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE compra SET status = ? WHERE id = ?',
    [status, id]
  );

  if (!result || result.affectedRows === 0) {
    throw { kind: 'not_found' };
  }

  return { id: Number(id), status };
};

Compra.delete = async (id) => {
  await db.query(
    'DELETE FROM compra_produtos WHERE compra_id = ?',
    [id]
  );

  const [result] = await db.query(
    'DELETE FROM compra WHERE id = ?',
    [id]
  );

  if (!result || result.affectedRows === 0) {
    throw { kind: 'not_found' };
  }

  return true;
};

module.exports = Compra;
