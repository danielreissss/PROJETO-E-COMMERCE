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
    /* CORREÇÃO: Tabela 'produtos' atualizada para usar 'marca', 'modelo' e 'tipo_produto' */
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
    `
];

// 2. Query de INSERÇÃO DE DADOS (Baseado no seu schema.sql original)
const dataInsertQuery = `
INSERT INTO produtos (marca, modelo, tipo_produto, preco, estoque) VALUES
('Logitech', 'G Pro X Superlight', 'Mouse', 1999.00, 10),
('Logitech', 'G502 Hero', 'Mouse', 699.00, 15),
('Logitech', 'MX Master 3', 'Mouse', 499.00, 12),
('Logitech', 'G915 TKL', 'Teclado', 1299.00, 8),
('Logitech', 'G815', 'Teclado', 1499.00, 6),
('Logitech', 'G733', 'Headset', 799.00, 10),
('Logitech', 'G Pro Keyboard', 'Teclado', 999.00, 7),
('Logitech', 'G213 Prodigy', 'Teclado', 399.00, 20),
('Logitech', 'G560', 'Caixa de Som', 899.00, 5),
('Logitech', 'G435', 'Headset', 399.00, 15),
('Logitech', 'MX Keys', 'Teclado', 699.00, 10),
('Logitech', 'C922 Pro Stream', 'Webcam', 699.00, 12),
('Logitech', 'Brio 4K', 'Webcam', 1299.00, 5),
('Logitech', 'G600 MMO', 'Mouse', 399.00, 8),
('Logitech', 'Powerplay Wireless Charging', 'Mouse Pad', 599.00, 6),
('Razer', 'DeathAdder V2', 'Mouse', 399.00, 12),
('Razer', 'Viper Ultimate', 'Mouse', 899.00, 8),
('Razer', 'BlackWidow V3', 'Teclado', 899.00, 10),
('Razer', 'Huntsman Elite', 'Teclado', 1299.00, 5),
('Razer', 'Kraken X', 'Headset', 299.00, 15),
('Razer', 'Kiyo Pro', 'Webcam', 699.00, 7),
('Razer', 'Blade 15', 'Notebook Gamer', 12999.00, 3),
('Razer', 'Naga X', 'Mouse MMO', 499.00, 9),
('Razer', 'Ornata V2', 'Teclado', 599.00, 12),
('Razer', 'Cynosa V2', 'Teclado', 399.00, 15),
('Razer', 'Seiren X', 'Microfone', 499.00, 8),
('Razer', 'Base Station V2 Chroma', 'Dock', 599.00, 4),
('Razer', 'Viper Mini', 'Mouse', 299.00, 15),
('Razer', 'Goliathus Extended Chroma', 'Mouse Pad', 399.00, 6),
('Razer', 'Hammerhead True Wireless', 'Fone de Ouvido', 499.00, 10),
('Gigabyte', 'AORUS Z790 Master', 'Placa-Mãe', 2799.00, 5),
('Gigabyte', 'Z690 AORUS Ultra', 'Placa-Mãe', 1999.00, 6),
('Gigabyte', 'B650 AORUS Elite', 'Placa-Mãe', 1499.00, 8),
('Gigabyte', 'GeForce RTX 4090 Gaming OC', 'Placa de Vídeo', 14999.00, 2),
('Gigabyte', 'GeForce RTX 4080 Gaming OC', 'Placa de Vídeo', 10999.00, 3),
('Gigabyte', 'GeForce RTX 4070 Ti Gaming OC', 'Placa de Vídeo', 6999.00, 4),
('Gigabyte', 'AORUS RGB Memory 32GB', 'Memória RAM', 899.00, 12),
('Gigabyte', 'AORUS Waterforce 360', 'Watercooler', 1499.00, 6),
('Gigabyte', 'AORUS FI27Q X', 'Monitor', 2599.00, 5),
('Gigabyte', 'GeForce RTX 4060 Gaming OC', 'Placa de Vídeo', 4999.00, 7),
('Gigabyte', 'AORUS 16GB DDR5', 'Memória RAM', 499.00, 10),
('Gigabyte', 'AORUS 32GB DDR5', 'Memória RAM', 999.00, 8),
('Gigabyte', 'Z790 AORUS Elite', 'Placa-Mãe', 1699.00, 7),
('Gigabyte', 'GeForce GTX 1660 Super', 'Placa de Vídeo', 1999.00, 10),
('Gigabyte', 'AORUS 24.5" Gaming Monitor', 'Monitor', 1799.00, 6),
('Alienware', 'AW3423DW', 'Monitor', 7499.00, 4),
('Alienware', 'AW2523HF', 'Monitor', 3999.00, 5),
('Alienware', 'Aurora R15', 'Desktop Gamer', 19999.00, 2),
('Alienware', 'Aurora R14', 'Desktop Gamer', 17999.00, 3),
('Alienware', 'AW310H', 'Headset', 599.00, 10),
('Alienware', 'AW510H', 'Headset', 799.00, 8),
('Alienware', 'AW568 Keyboard', 'Teclado', 699.00, 12),
('Alienware', 'AW959 Keyboard', 'Teclado', 999.00, 5),
('Alienware', 'Alienware Elite Mouse', 'Mouse', 499.00, 9),
('Alienware', 'AW310M Mouse', 'Mouse', 399.00, 10),
('Alienware', 'Aurora Ryzen Edition', 'Desktop Gamer', 18999.00, 2),
('Alienware', 'AW3420DW', 'Monitor', 6999.00, 4),
('Alienware', 'AW2521H', 'Monitor', 3799.00, 6),
('Alienware', 'AW3821DW', 'Monitor', 8499.00, 3),
('Alienware', 'AW988 Keyboard', 'Teclado', 1099.00, 5);
`;

// Função assíncrona para criar as tabelas
async function createTables() {
    let connection;
    try {
        // Cria a conexão com o banco de dados
        connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados bem-sucedida.');

        // Executa cada query de CRIAÇÃO DE TABELA uma por uma
        for (const query of tableQueries) {
            await connection.query(query);
        }

        console.log('Tabelas criadas ou já existentes com sucesso!');

        // NOVO: Verifica se a tabela 'produtos' está vazia antes de inserir
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM produtos');
        
        if (rows[0].count === 0) {
            console.log('Tabela "produtos" vazia. Populando com dados...');
            // Insere todos os 60 produtos de uma vez
            await connection.query(dataInsertQuery);
            console.log('Dados de produtos inseridos com sucesso!');
        } else {
            console.log('Tabela "produtos" já contém dados. Nenhuma inserção foi feita.');
        }

    } catch (error) {
        console.error('Erro ao configurar o banco de dados:', error);
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