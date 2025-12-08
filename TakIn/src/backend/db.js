const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '3.147.209.153',  
    user: 'TakInRemoto',                                
    password: '#g~Opc1OB)Qa;4,c',                     
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