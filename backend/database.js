// Carrega variáveis de ambiente do .env (DB_HOST, DB_USER, DB_PASS, etc.)
require('dotenv').config();

const mysql = require('mysql2/promise');

// Cria um pool de conexões com o MySQL.
// O uso de pool melhora desempenho e reaproveitamento de conexões,
// ao invés de abrir/fechar uma conexão nova para cada operação.
const pool = mysql.createPool({
  // Host do servidor de banco; usa o valor do .env ou 127.0.0.1 como padrão
  host: process.env.DB_HOST || '127.0.0.1',

  // Porta do MySQL; converte para número e usa 3306 se não estiver definida
  port: Number(process.env.DB_PORT) || 3306,

  // Usuário do banco; por padrão "root" em ambiente local
  user: process.env.DB_USER || 'root',

  // Senha do banco; tenta primeiro DB_PASS, depois DB_PASSWORD, ou vazio
  password: process.env.DB_PASS || process.env.DB_PASSWORD || '',

  // Nome do schema do banco; aqui padronizado como "eCommerce"
  // (atenção ao case para bater exatamente com o nome criado no MySQL)
  database: process.env.DB_NAME || 'eCommerce',

  // Configurações de controle de conexões do pool
  waitForConnections: true, // coloca chamadas em fila quando o limite é atingido
  connectionLimit: 10,      // número máximo de conexões simultâneas no pool
  queueLimit: 0,            // 0 = sem limite de itens na fila
});

// Exporta o pool para ser usado nos models/queries do sistema
module.exports = pool;
