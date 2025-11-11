const express = require('express');
const router = express.Router();
const { obtenerEstadoCuenta } = require('../controller/estadoCuentaCtrl');
const { generarPDFEstadoCuenta } = require('../controller/estadoCuentaPDFCtrl');
const { enviarEstadoCuentaPorEmail } = require('../controller/estadoCuentaEmailCtrl');

// Obtener estado de cuenta
router.post('/estado-cuenta', obtenerEstadoCuenta);

// Generar PDF del estado de cuenta
router.post('/estado-cuenta/pdf', generarPDFEstadoCuenta);

// Enviar estado de cuenta por correo electrónico
router.post('/estado-cuenta/enviar-email', enviarEstadoCuentaPorEmail);

module.exports = router;
