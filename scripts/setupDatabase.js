// scripts/setupDatabase.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');

// Criar POOL em vez de uma conexão única
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 1. Queries de CRIAÇÃO DE TABELAS
const tableQueries = [
  `
  CREATE TABLE IF NOT EXISTS cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('padrao', 'administrador') NOT NULL DEFAULT 'padrao',
    passwordResetToken VARCHAR(255),
    passwordResetExpires DATETIME
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    tipo_produto VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2),
    estoque INT DEFAULT 0
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS compra_produtos (
    compra_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (compra_id, produto_id),
    FOREIGN KEY (compra_id) REFERENCES compra(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  );
  `,
];

// 2. Inserção dos produtos
// COLE AQUI a sua query completa de insert, sem "..."
const dataInsertQuery = `
  -- sua query completa de INSERT em produtos
`;

async function createTables() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Conexão com o banco de dados via POOL bem-sucedida.');

    // Criar tabelas
    for (const query of tableQueries) {
      await connection.query(query);
    }
    console.log('Tabelas criadas com sucesso!');

    // Verificar se a tabela produtos está vazia
    const [rows] = await connection.query(
      'SELECT COUNT(*) AS count FROM produtos'
    );

    if (rows[0].count === 0) {
      console.log('Tabela "produtos" vazia. Inserindo dados...');
      await connection.query(dataInsertQuery);
      console.log('Dados inseridos com sucesso!');
    } else {
      console.log('Tabela "produtos" já possui dados.');
    }
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
    process.exitCode = 1; // indica erro
  } finally {
    if (connection) {
      connection.release();
      console.log('Conexão devolvida ao pool.');
    }
    // Fecha o pool e encerra o processo
    await pool.end();
    process.exit(); // garante que o comando npm termine
  }
}

createTables();
