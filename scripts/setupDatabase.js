// scripts/setupDatabase.js

const path = require('path');

// Carrega o .env localizado na raiz do projeto (um nível acima deste script)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');

// Cria um pool de conexões com MySQL em vez de uma conexão única,
// permitindo melhor gerenciamento e reutilização de conexões.
const pool = mysql.createPool({
  host: process.env.DB_HOST,    // Host do banco (ex.: localhost ou nome do serviço no Docker)
  user: process.env.DB_USER,    // Usuário do banco definido no .env
  password: process.env.DB_PASS, // Senha do banco definida no .env
  database: process.env.DB_NAME, // Nome do schema do banco
  port: process.env.DB_PORT,     // Porta do MySQL (ex.: 3306)
  waitForConnections: true,      // Fila requisições quando não houver conexão imediata
  connectionLimit: 10,           // Máximo de conexões simultâneas no pool
  queueLimit: 0,                 // 0 = sem limite de fila
});

// ---------------------------------------------------------
// 1. Queries de criação de tabelas (DDL)
// ---------------------------------------------------------
// Cada string do array representa a criação de uma tabela necessária ao sistema.
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

// ---------------------------------------------------------
// 2. Query de inserção inicial de produtos (seed)
// ---------------------------------------------------------
// Substituir o comentário pela query completa de INSERT usada para popular a tabela.
const dataInsertQuery = `
  -- sua query completa de INSERT em produtos
`;

// ---------------------------------------------------------
// Função principal responsável por:
// - abrir conexão do pool
// - criar tabelas
// - inserir dados iniciais (seed) em produtos, se necessário
// - encerrar conexões
// ---------------------------------------------------------
async function createTables() {
  let connection;

  try {
    // Obtém uma conexão do pool
    connection = await pool.getConnection();
    console.log('Conexão com o banco de dados via POOL bem-sucedida.');

    // Executa cada comando de criação de tabela em sequência
    for (const query of tableQueries) {
      await connection.query(query);
    }
    console.log('Tabelas criadas com sucesso!');

    // Verifica se a tabela produtos já possui registros
    const [rows] = await connection.query(
      'SELECT COUNT(*) AS count FROM produtos',
    );

    // Se ainda não houver registros, insere os dados iniciais (seed)
    if (rows[0].count === 0) {
      console.log('Tabela "produtos" vazia. Inserindo dados...');
      await connection.query(dataInsertQuery);
      console.log('Dados inseridos com sucesso!');
    } else {
      console.log('Tabela "produtos" já possui dados.');
    }
  } catch (error) {
    // Loga qualquer erro que ocorra durante a configuração do banco
    console.error('Erro ao configurar o banco de dados:', error);
    // Define código de saída diferente de 0 para indicar erro em scripts npm
    process.exitCode = 1;
  } finally {
    // Garante devolução da conexão ao pool, se tiver sido aberta
    if (connection) {
      connection.release();
      console.log('Conexão devolvida ao pool.');
    }
    // Encerra o pool de conexões e finaliza o processo do script
    await pool.end();
    process.exit(); // Garante que o comando npm termine após a execução do script
  }
}

// Executa a função de criação/configuração das tabelas
createTables();
