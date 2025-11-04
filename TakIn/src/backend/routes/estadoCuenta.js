const express = require('express');
const router = express.Router();
const { obtenerEstadoCuenta } = require('../controller/estadoCuentaCtrl');
const { generarPDFEstadoCuenta } = require('../controller/estadoCuentaPDFCtrl');

// Obtener estado de cuenta
router.post('/estado-cuenta', obtenerEstadoCuenta);

// Generar PDF del estado de cuenta
router.post('/estado-cuenta/pdf', generarPDFEstadoCuenta);

module.exports = router;
