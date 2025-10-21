const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Liberty',
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

module.exports = db;