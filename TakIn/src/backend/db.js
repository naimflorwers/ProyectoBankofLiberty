const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'ec2-3-138-190-88.us-east-2.compute.amazonaws.com',  
    user: 'TakInRemoto',                                
    password: '#g~Opc1OB)Qa;4,c',                     
    database: 'Liberty'                                 
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