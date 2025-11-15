// backend/compra.model.js

// Importa o pool/conexão com o banco de dados MySQL
const db = require('../database');

// Objeto que agrupa todas as operações relacionadas à tabela "compra"
const Compra = {};

// ---------------------------------------------------------------------
// Cria uma nova compra com seus produtos associados
// ---------------------------------------------------------------------
// Espera um objeto: { cliente_id, produtos: [{ produto_id, quantidade, preco_unitario }, ...] }
Compra.create = async ({ cliente_id, produtos }) => {
  const conn = db;

  // Cria o registro principal da compra com status inicial "Pendente"
  const [result] = await conn.query(
    'INSERT INTO compra (cliente_id, status) VALUES (?, ?)',
    [cliente_id, 'Pendente'],
  );

  const compraId = result.insertId;

  // Para cada produto no array, adiciona uma linha em compra_produtos
  for (const p of produtos) {
    await conn.query(
      'INSERT INTO compra_produtos (compra_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
      [compraId, p.produto_id, p.quantidade, p.preco_unitario],
    );
  }

  // Retorna um resumo da compra criada
  return { id: compraId, cliente_id, status: 'Pendente', produtos };
};

// ---------------------------------------------------------------------
// Busca uma compra pelo ID, incluindo seus itens
// ---------------------------------------------------------------------
Compra.getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM compra WHERE id = ?',
    [id],
  );

  // Se não encontrar a compra, lança erro com "kind: 'not_found'"
  if (!rows || rows.length === 0) {
    throw { kind: 'not_found' };
  }

  const compra = rows[0];

  // Busca os itens associados na tabela compra_produtos
  const [itens] = await db.query(
    'SELECT produto_id, quantidade, preco_unitario FROM compra_produtos WHERE compra_id = ?',
    [id],
  );

  // Retorna a compra com o array de produtos
  return { ...compra, produtos: itens };
};

// ---------------------------------------------------------------------
// Atualiza o status de uma compra (ex.: Pendente -> Enviado)
// ---------------------------------------------------------------------
Compra.updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE compra SET status = ? WHERE id = ?',
    [status, id],
  );

  // Se nenhuma linha foi afetada, a compra não existe
  if (!result || result.affectedRows === 0) {
    throw { kind: 'not_found' };
  }

  return { id: Number(id), status };
};

// ---------------------------------------------------------------------
// Deleta uma compra e todos os seus produtos associados
// ---------------------------------------------------------------------
Compra.delete = async (id) => {
  // Primeiro remove os itens da compra para evitar problemas de FK
  await db.query(
    'DELETE FROM compra_produtos WHERE compra_id = ?',
    [id],
  );

  // Em seguida remove o registro da compra
  const [result] = await db.query(
    'DELETE FROM compra WHERE id = ?',
    [id],
  );

  // Se nenhuma linha foi deletada, a compra não existia
  if (!result || result.affectedRows === 0) {
    throw { kind: 'not_found' };
  }

  return true;
};

// Exporta o modelo de Compra
module.exports = Compra;
