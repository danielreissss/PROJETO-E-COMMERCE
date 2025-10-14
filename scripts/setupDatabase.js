const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Importa a biblioteca mysql2 para usar a versão com Promises
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const queries = [
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
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        estoque INT NOT NULL DEFAULT 0
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS compra (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NOT NULL,
        data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
        /* CORREÇÃO: Apontando para a tabela 'cliente' (singular) */
        FOREIGN KEY (cliente_id) REFERENCES cliente(id)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS compra_produtos (
        /* CORREÇÃO: Nome da coluna para consistência */
        compra_id INT NOT NULL,
        produto_id INT NOT NULL,
        quantidade INT NOT NULL,
        preco_unitario DECIMAL(10, 2) NOT NULL,
        /* CORREÇÃO: Nomes corretos na chave primária */
        PRIMARY KEY (compra_id, produto_id),
        /* CORREÇÃO: Chave estrangeira apontando para a tabela 'compra' */
        FOREIGN KEY (compra_id) REFERENCES compra(id),
        /* CORREÇÃO: Chave estrangeira com o nome correto da coluna */
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );
    `
];

// Função assíncrona para criar as tabelas
async function createTables() {
    let connection;
    try {
        // Cria a conexão com o banco de dados
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados bem-sucedida.');

        // Executa cada query do array uma por uma
        for (const query of queries) {
            await connection.query(query);
        }

        console.log('Tabelas criadas ou já existentes com sucesso!');
    } catch (error) {
        console.error('Erro ao criar as tabelas:', error);
    } finally {
        // Fecha a conexão, independentemente de ter ocorrido erro ou não
        if (connection) {
            await connection.end();
            console.log('Conexão com o banco de dados fechada.');
        }
    }
}

// Executa a função
createTables();