// backend/model/compra_produtos.model.js

// Importa o pool de conexão com o banco de dados
const dbConnection = require('../database.js');

// Objeto que agrupa todas as operações relacionadas à tabela compra_produtos
const CompraProdutos = {};

// ---------------------------------------------------------------------
// Adiciona um produto a uma compra
// ---------------------------------------------------------------------
// novaEntrada deve conter: { compra_id, produto_id, quantidade, preco_unitario }
CompraProdutos.create = async (novaEntrada) => {
  // Usa sintaxe "SET ?" para montar o INSERT com base nas chaves do objeto
  const [result] = await dbConnection.query('INSERT INTO compra_produtos SET ?', novaEntrada);

  // Retorna o id gerado e os dados gravados
  return { insertId: result.insertId, ...novaEntrada };
};

// ---------------------------------------------------------------------
// Busca todos os produtos de uma compra específica
// ---------------------------------------------------------------------
// Retorna a lista de itens com dados do produto (marca/modelo) e da compra_produtos.
CompraProdutos.findByCompraId = async (compraId) => {
  const query = `
    SELECT 
      cp.quantidade, 
      cp.preco_unitario, 
      p.id AS produto_id, 
      p.marca AS produto_nome,
      p.modelo AS produto_descricao
    FROM 
      compra_produtos cp 
    JOIN 
      produtos p ON cp.produto_id = p.id 
    WHERE 
      cp.compra_id = ?;
  `;

  const [rows] = await dbConnection.query(query, [compraId]);
  return rows;
};

// ---------------------------------------------------------------------
// Atualiza os dados de um produto em uma compra
// ---------------------------------------------------------------------
// "dados" pode conter, por exemplo, { quantidade, preco_unitario }.
CompraProdutos.update = async (compraId, produtoId, dados) => {
  const [result] = await dbConnection.query(
    'UPDATE compra_produtos SET ? WHERE compra_id = ? AND produto_id = ?',
    [dados, compraId, produtoId],
  );
  return result;
};

// ---------------------------------------------------------------------
// Remove um produto específico de uma compra
// ---------------------------------------------------------------------
CompraProdutos.delete = async (compraId, produtoId) => {
  const [result] = await dbConnection.query(
    'DELETE FROM compra_produtos WHERE compra_id = ? AND produto_id = ?',
    [compraId, produtoId],
  );
  return result;
};

// ---------------------------------------------------------------------
// Remove TODOS os produtos associados a uma compra
// ---------------------------------------------------------------------
CompraProdutos.deleteByCompraId = async (compraId) => {
  const [result] = await dbConnection.query(
    'DELETE FROM compra_produtos WHERE compra_id = ?',
    [compraId],
  );
  return result;
};

// Exporta o modelo
module.exports = CompraProdutos;
