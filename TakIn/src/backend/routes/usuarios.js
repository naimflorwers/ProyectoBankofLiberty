const express = require('express');
const router = express.Router();
const { getUsuarios, getClientes, getEjecutivos, getGerentes, getUsuario, login } = require('../controller/usuariosCtrl');

// Rutas de solo consulta
router.get('/usuarios', getUsuarios);
router.get('/clientes', getClientes);
router.get('/ejecutivos', getEjecutivos);
router.get('/gerentes', getGerentes);
router.get('/usuario/:id', getUsuario);
// Ruta de login
router.post('/login', login);

module.exports = router;
