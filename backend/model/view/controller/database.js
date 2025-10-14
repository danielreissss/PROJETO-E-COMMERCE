    require('dotenv').config();
    
    const mysql = require('mysql2');

    const connection = mysql.createConnection({
        host: '${DB_PORT}',
        user: 'root',
        password: '${DB_PASS_ROOT}',
        database: '${DB_NAME}'
    });

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database!');
    });

    