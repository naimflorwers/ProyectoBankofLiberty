const express = require('express');
const router = express.Router();
const { getUsuarios, getClientes, getEjecutivos, getGerentes, getUsuario, login, registro } = require('../controller/usuariosCtrl');


router.get('/usuarios', getUsuarios);
router.get('/clientes', getClientes);
router.get('/ejecutivos', getEjecutivos);
router.get('/gerentes', getGerentes);
router.get('/usuario/:id', getUsuario);
router.post('/login', login);
router.post('/registro', registro);

module.exports = router;
