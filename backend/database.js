    require('dotenv').config();
    
    const mysql = require('mysql2');

    const connection = mysql.createConnection({
       host: process.env.DB_HOST,         // CORREÇÃO: Usar process.env para o host
        user: process.env.DB_USER,         // CORREÇÃO: Usar process.env para o usuário
        password: process.env.DB_PASS,  // CORREÇÃO: Usar process.env para a senha
        database: process.env.DB_NAME,       // CORREÇÃO: Usar process.env para o nome do banco
        port: process.env.DB_PORT          // ADIÇÃO: É uma boa prática definir a porta
    });

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database!');
    });

    