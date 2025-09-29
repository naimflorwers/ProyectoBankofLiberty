const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'K4rm4l@nd5Lightning95',
  database: 'TakIn',
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

module.exports = db;