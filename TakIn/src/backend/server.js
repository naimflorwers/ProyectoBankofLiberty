require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const transferenciasRoutes = require('./routes/transferencias');
const recuperacionRoutes = require('./routes/recuperacion');

console.log('Iniciando server.js...');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', usuariosRoutes);
app.use('/api', transferenciasRoutes);
app.use('/api', recuperacionRoutes);

app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
  
  // Verificar configuración de email al iniciar
  const emailService = require('./services/emailService');
  emailService.verifyConnection();
});