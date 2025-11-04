const express = require('express');
const router = express.Router();
const {
  solicitarRecuperacion,
  verificarCodigo,
  cambiarContrasena
} = require('../controller/recuperacionCtrl');

// Solicitar código de recuperación
router.post('/solicitar-recuperacion', solicitarRecuperacion);

// Verificar código
router.post('/verificar-codigo', verificarCodigo);

// Cambiar contraseña
router.post('/cambiar-contrasena', cambiarContrasena);

module.exports = router;
