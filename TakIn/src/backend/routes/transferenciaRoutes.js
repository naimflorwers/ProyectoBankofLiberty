// backend/routes/transferenciaRoutes.js
const express = require('express');
const router = express.Router();

// Importamos el controlador que creaste en el paso anterior
const transferenciaController = require('../controller/transferenciaController');

// Definimos la ruta POST
// Cuando alguien entre a '/transferir', se ejecuta la función 'realizarTransferencia'
router.post('/transferir', transferenciaController.realizarTransferencia);

module.exports = router;