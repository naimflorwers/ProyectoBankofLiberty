const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const transferenciasRoutes = require('./routes/transferencias');

console.log('Iniciando server.js...');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', usuariosRoutes);
app.use('/api', transferenciasRoutes);

app.listen(3000, () => console.log('✅ Servidor corriendo en http://localhost:3000'));