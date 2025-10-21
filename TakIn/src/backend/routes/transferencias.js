const express = require('express');
const router = express.Router();
const { 
  getCuentasCliente, 
  realizarTransferencia, 
  getHistorialTransferencias,
  getDetalleTransferencia,
  getInfoComision
} = require('../controller/transferenciasCtrl');

// Obtener cuentas de un cliente
router.get('/cuentas/:idUsuario', getCuentasCliente);

// Obtener información de comisión para un monto
router.get('/comision', getInfoComision);

// Realizar transferencia
router.post('/transferencia', realizarTransferencia);

// Obtener historial de transferencias
router.get('/historial/:idUsuario', getHistorialTransferencias);

// Obtener detalle de una transferencia
router.get('/transferencia/:idTransferencia', getDetalleTransferencia);

module.exports = router;
