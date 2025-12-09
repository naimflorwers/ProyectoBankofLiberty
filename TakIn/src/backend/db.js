const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'database-1.c5emsau6exwb.us-east-2.rds.amazonaws.com',  
    user: 'admin',                                
    password: 'root1234',                     
    database: 'Liberty',
    multipleStatements: true                                
});

db.connect((err) => {
    if (err) {
        console.error('ERROR AL CONECTAR A AWS MYSQL:', err.message);
        console.error('Código de error:', err.code);
        console.error('Detalles completos:', err);
        return;
    }
    
    console.log('¡Conectado exitosamente a la base de datos de AWS EC2!'); 
});

module.exports = db;