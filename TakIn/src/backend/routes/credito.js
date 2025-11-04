const express = require('express');
const router = express.Router();
const { verificarElegibilidad, solicitarCredito } = require('../controller/creditoCtrl');

// Verificar elegibilidad para crédito
router.get('/credito/verificar/:idUsuario', verificarElegibilidad);

// Solicitar línea de crédito
router.post('/credito/solicitar', solicitarCredito);

module.exports = router;
