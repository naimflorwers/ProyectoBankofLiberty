const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'Liberty',
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar MySQL:', err.message);
    console.error('Código de error:', err.code);
    console.error('Detalles completos:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

module.exports = db;