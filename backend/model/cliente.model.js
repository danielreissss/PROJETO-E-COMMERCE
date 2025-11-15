// backend/cliente.model.js

// Importa o pool de conexões com o banco de dados MySQL.
// O arquivo ../database.js expõe um pool criado com mysql2/promise.
const db = require('../database.js');

// Objeto que irá agrupar todas as funções relacionadas ao modelo Cliente
const Cliente = {};

// ---------------------------------------------------------------------
// Busca cliente pelo e-mail (usado em login e validações de cadastro)
// ---------------------------------------------------------------------
Cliente.getByEmail = async (email) => {
  // Executa SELECT com placeholder (?) para evitar SQL injection
  const [rows] = await db.query('SELECT * FROM cliente WHERE email = ?', [email]);

  // Se não encontrar nenhum registro, retorna null
  if (!rows || rows.length === 0) return null;

  // Retorna o primeiro registro encontrado (e-mails são únicos)
  return rows[0];
};

// ---------------------------------------------------------------------
// Busca cliente pelo ID
// ---------------------------------------------------------------------
Cliente.getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM cliente WHERE id = ?',
    [id],
  );

  // Se houver pelo menos um resultado, retorna o primeiro; senão, null
  return rows && rows.length ? rows[0] : null;
};

// ---------------------------------------------------------------------
// Cria um novo cliente
// ---------------------------------------------------------------------
// Recebe um objeto com nome, email, senha (já criptografada) e cargo.
Cliente.create = async ({ nome, email, senha, cargo }) => {
  const [result] = await db.query(
    'INSERT INTO cliente (nome, email, senha, cargo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, cargo],
  );

  // Retorna um objeto simples com os dados principais do cliente criado
  return { id: result.insertId, nome, email, cargo };
};

// ---------------------------------------------------------------------
// Deleta um cliente pelo ID
// ---------------------------------------------------------------------
Cliente.delete = async (id) => {
  const [result] = await db.query(
    'DELETE FROM cliente WHERE id = ?',
    [id],
  );

  // Se nenhuma linha foi afetada, significa que o cliente não existia
  if (!result || result.affectedRows === 0) {
    // Usa uma convenção de erro com "kind: 'not_found'" para o controller tratar
    throw { kind: 'not_found' };
  }

  // Retorna true indicando sucesso na exclusão
  return true;
};

// Exporta o objeto Cliente com todos os métodos do modelo
module.exports = Cliente;
