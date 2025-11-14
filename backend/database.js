
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão (Opcional, mas bom ter)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL Pool:', err);
        return;
    }
    console.log('Connected to MySQL Pool!');
    connection.release(); // Libera a conexão de teste
});


module.exports = pool; // Exporta o pool