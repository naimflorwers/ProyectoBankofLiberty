const db = require('../db');

/**
 * Obtener cuentas de un cliente por IDUsuario
 */
const getCuentasCliente = (req, res) => {
  const { idUsuario } = req.params;
  
  console.log('📌 GET /api/cuentas/' + idUsuario + ' - Buscando cuentas...');
  
  const query = `
    SELECT c.Numcuenta, c.Banco, c.Dinero, c.Clabe, c.NumTelefono
    FROM Cuentas c
    INNER JOIN Cliente cl ON c.IDCliente = cl.IDCliente
    WHERE cl.IDUsuario = ?
  `;
  
  db.query(query, [idUsuario], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener cuentas:', err);
      return res.status(500).json({ error: 'Error al obtener cuentas' });
    }
    console.log('✅ Cuentas encontradas:', results.length);
    console.log('Datos:', results);
    res.json(results);
  });
};

/**
 * Calcular comisión según el monto (ACUMULATIVO)
 * BASE: $5 por cada $100 (siempre)
 * EXTRA: +$10 si monto >= $1,500
 * EXTRA: +$20 si monto >= $3,000 (reemplaza el +$10)
 */
const calcularComision = (monto) => {
  // Comisión base: $5 por cada $100
  let comision = Math.round((monto / 100) * 5 * 100) / 100; // Redondear a 2 decimales
  let descripcion = 'Comisión $5 por cada $100';
  
  // Agregar comisión extra según el monto
  if (monto >= 3000.00) {
    // Agregar $20 extra para montos >= $3,000
    comision = comision + 20.00;
    descripcion = 'Comisión $5 por cada $100 + $20 extra (≥$3,000)';
  } else if (monto >= 1500.00) {
    // Agregar $10 extra para montos >= $1,500
    comision = comision + 10.00;
    descripcion = 'Comisión $5 por cada $100 + $10 extra (≥$1,500)';
  }
  
  return {
    comision: comision,
    descripcion: descripcion
  };
};

/**
 * Realizar transferencia usando el Stored Procedure con comisiones
 */
const realizarTransferencia = (req, res) => {
  const { cuentaRemitente, cuentaDestino, monto, motivo } = req.body;

  // Validaciones básicas
  if (!cuentaRemitente || !cuentaDestino || !monto) {
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan datos requeridos: cuentaRemitente, cuentaDestino, monto' 
    });
  }

  if (monto <= 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'El monto debe ser mayor a 0' 
    });
  }

  // Calcular comisión antes de hacer la transferencia
  const { comision, descripcion } = calcularComision(parseFloat(monto));
  const montoTotal = parseFloat(monto) + comision;

  // Llamar al Stored Procedure con los nuevos parámetros de comisión
  const query = 'CALL sp_realizar_transferencia(?, ?, ?, ?, @resultado, @id_transferencia, @comision, @monto_total)';
  
  db.query(query, [cuentaRemitente, cuentaDestino, monto, motivo || 'Transferencia'], (err, results) => {
    if (err) {
      console.error('Error al ejecutar SP de transferencia:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al procesar la transferencia',
        detalle: err.message 
      });
    }

    // Obtener los valores de salida del SP (ahora incluye comisión y monto total)
    db.query('SELECT @resultado AS resultado, @id_transferencia AS idTransferencia, @comision AS comision, @monto_total AS montoTotal', (err2, output) => {
      if (err2) {
        console.error('Error al obtener resultado del SP:', err2);
        return res.status(500).json({ 
          success: false, 
          error: 'Error al obtener resultado de la transferencia' 
        });
      }

      const resultado = output[0].resultado;
      const idTransferencia = output[0].idTransferencia;
      const comisionCobrada = output[0].comision;
      const montoTotalCobrado = output[0].montoTotal;

      // Verificar si fue exitoso
      if (resultado && resultado.startsWith('EXITO')) {
        return res.json({
          success: true,
          mensaje: resultado,
          idTransferencia: idTransferencia,
          data: {
            cuentaRemitente,
            cuentaDestino,
            monto: parseFloat(monto),
            comision: comisionCobrada,
            montoTotal: montoTotalCobrado,
            motivo: motivo || 'Transferencia',
            fecha: new Date()
          }
        });
      } else {
        // Error de negocio (saldo insuficiente, cuenta no existe, etc.)
        return res.status(400).json({
          success: false,
          error: resultado || 'Error desconocido en la transferencia',
          comision: comisionCobrada,
          montoTotal: montoTotalCobrado
        });
      }
    });
  });
};

/**
 * Obtener historial de transferencias de un cliente
 */
const getHistorialTransferencias = (req, res) => {
  const { idUsuario } = req.params;
  
  const query = `
    SELECT 
      t.IDTransferencia,
      t.NumCuenta,
      t.Monto,
      t.CuentaDestino,
      t.CuentaRemitente,
      t.Motivo,
      t.FechaTransferencia,
      CASE 
        WHEN t.CuentaRemitente = c.Numcuenta THEN 'Enviada'
        WHEN t.CuentaDestino = c.Numcuenta THEN 'Recibida'
      END AS TipoTransferencia
    FROM Transferencia t
    INNER JOIN Cuentas c ON (t.CuentaRemitente = c.Numcuenta OR t.CuentaDestino = c.Numcuenta)
    INNER JOIN Cliente cl ON c.IDCliente = cl.IDCliente
    WHERE cl.IDUsuario = ?
    ORDER BY t.FechaTransferencia DESC
  `;
  
  db.query(query, [idUsuario], (err, results) => {
    if (err) {
      console.error('Error al obtener historial:', err);
      return res.status(500).json({ error: 'Error al obtener historial de transferencias' });
    }
    res.json(results);
  });
};

/**
 * Obtener detalle de una transferencia específica
 */
const getDetalleTransferencia = (req, res) => {
  const { idTransferencia } = req.params;
  
  const query = `
    SELECT 
      t.IDTransferencia,
      t.NumCuenta,
      t.Monto,
      t.CuentaDestino,
      t.CuentaRemitente,
      t.Motivo,
      t.FechaTransferencia
    FROM Transferencia t
    WHERE t.IDTransferencia = ?
  `;
  
  db.query(query, [idTransferencia], (err, results) => {
    if (err) {
      console.error('Error al obtener detalle:', err);
      return res.status(500).json({ error: 'Error al obtener detalle de transferencia' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Transferencia no encontrada' });
    }
    
    res.json(results[0]);
  });
};

/**
 * Obtener información de comisión para un monto dado
 */
const getInfoComision = (req, res) => {
  const { monto } = req.query;
  
  if (!monto || parseFloat(monto) <= 0) {
    return res.status(400).json({ 
      error: 'Debe proporcionar un monto válido' 
    });
  }
  
  const { comision, descripcion } = calcularComision(parseFloat(monto));
  const montoTotal = parseFloat(monto) + comision;
  
  res.json({
    monto: parseFloat(monto),
    comision: comision,
    montoTotal: montoTotal,
    descripcion: descripcion
  });
};

module.exports = {
  getCuentasCliente,
  realizarTransferencia,
  getHistorialTransferencias,
  getDetalleTransferencia,
  getInfoComision
};
