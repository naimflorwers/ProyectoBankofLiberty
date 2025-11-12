const db = require('../db');

/**
 * Obtener estado de cuenta de un usuario
 */
const obtenerEstadoCuenta = async (req, res) => {
  const { idUsuario, fechaInicio, fechaFin } = req.body;

  console.log('📊 Estado de Cuenta - Request:', { idUsuario, fechaInicio, fechaFin });

  if (!idUsuario || !fechaInicio || !fechaFin) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos requeridos'
    });
  }

  try {
    // 1. Obtener información del usuario y su cuenta
    // CORREGIDO: 'usuarios', 'cliente', 'cuentas'
    const [usuario] = await db.promise().query(
      `SELECT u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, 
              c.Numcuenta, c.Dinero as Saldo, c.Banco
       FROM usuarios u
       LEFT JOIN cliente cl ON u.IDUsuario = cl.IDUsuario
       LEFT JOIN cuentas c ON cl.IDCliente = c.IDCliente
       WHERE u.IDUsuario = ?`,
      [idUsuario]
    );

    console.log('👤 Usuario encontrado:', usuario[0]);

    if (usuario.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const datosUsuario = usuario[0];

    // 2. Obtener saldo inicial (usar el saldo actual de la cuenta)
    const saldoInicialValue = datosUsuario.Saldo || 0;

    // 3. Obtener ID del cliente para las consultas
    // CORREGIDO: 'cliente'
    const [cliente] = await db.promise().query(
      `SELECT IDCliente FROM cliente WHERE IDUsuario = ?`,
      [idUsuario]
    );

    if (cliente.length === 0 || !datosUsuario.Numcuenta) {
      // Si no tiene cuenta o cliente, devolver vacío
      console.log('⚠️ Usuario sin cuenta bancaria o sin registro de cliente');
      return res.json({
        success: true,
        data: {
          periodo: { inicio: fechaInicio, fin: fechaFin },
          cuenta: {
            numero: 'N/A',
            titular: `${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`,
            tipo: 'Sin cuenta'
          },
          saldos: { inicial: 0, ingresos: 0, egresos: 0, final: 0 },
          movimientos: []
        }
      });
    }

    const numCuenta = datosUsuario.Numcuenta;
    console.log('💳 Consultando movimientos para cuenta:', numCuenta);

    // 4. Obtener todos los movimientos en el periodo
    // CORREGIDO: 'transferencia', 'ingresar', 'retirar', 'prestamos'
    const [movimientos] = await db.promise().query(
      `SELECT * FROM (
        -- Transferencias enviadas
        SELECT 
          t.FechaTransferencia as fecha,
          'Transferencia Enviada' as tipo,
          CONCAT('Transferencia a cuenta ', t.CuentaDestino) as descripcion,
          CONCAT('TRANS-', t.IDTransferencia) as referencia,
          -t.Monto as monto,
          t.FechaTransferencia as ordenFecha
        FROM transferencia t
        WHERE t.NumCuenta = ?
        AND t.CuentaRemitente = ?
        AND t.FechaTransferencia BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        -- Transferencias recibidas
        SELECT 
          t.FechaTransferencia as fecha,
          'Transferencia Recibida' as tipo,
          CONCAT('Transferencia de cuenta ', t.CuentaRemitente) as descripcion,
          CONCAT('TRANS-', t.IDTransferencia) as referencia,
          t.Monto as monto,
          t.FechaTransferencia as ordenFecha
        FROM transferencia t
        WHERE t.CuentaDestino = ?
        AND t.FechaTransferencia BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        -- Ingresos/Depósitos
        SELECT 
          i.FechaIngreso as fecha,
          'Depósito' as tipo,
          CONCAT('Depósito - ', IFNULL(i.MetodoDeposito, 'Efectivo')) as descripcion,
          IFNULL(i.ClaveReferencia, CONCAT('ING-', i.IDIngreso)) as referencia,
          i.Monto as monto,
          i.FechaIngreso as ordenFecha
        FROM ingresar i
        WHERE i.NumCuenta = ?
        AND i.FechaIngreso BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        -- Retiros
        SELECT 
          r.FechaRetiro as fecha,
          'Retiro' as tipo,
          CONCAT('Retiro - ', IFNULL(r.Metodo, 'Efectivo')) as descripcion,
          IFNULL(r.NumeroReferencia, CONCAT('RET-', r.IDRetiro)) as referencia,
          -r.Monto as monto,
          r.FechaRetiro as ordenFecha
        FROM retirar r
        WHERE r.NumCuenta = ?
        AND r.FechaRetiro BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        -- Préstamos otorgados
        SELECT 
          p.FechaSolicitud as fecha,
          'Préstamo' as tipo,
          CONCAT('Préstamo autorizado') as descripcion,
          CONCAT('PRES-', p.IDPrestamo) as referencia,
          p.Monto as monto,
          p.FechaSolicitud as ordenFecha
        FROM prestamos p
        WHERE p.NumCuenta = ?
        AND p.Autorizado = TRUE
        AND p.FechaSolicitud BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
      ) AS todos_movimientos
      ORDER BY ordenFecha ASC`,
      [
        numCuenta, numCuenta, fechaInicio, fechaFin,
        numCuenta, fechaInicio, fechaFin,
        numCuenta, fechaInicio, fechaFin,
        numCuenta, fechaInicio, fechaFin,
        numCuenta, fechaInicio, fechaFin
      ]
    );

    // 5. Calcular saldos y agregar saldo después de cada movimiento
    let saldoActual = saldoInicialValue;
    const movimientosConSaldo = movimientos.map(mov => {
      saldoActual += mov.monto;
      return {
        ...mov,
        saldo: saldoActual
      };
    });

    // 6. Calcular resumen
    const ingresos = movimientos
      .filter(m => m.monto > 0)
      .reduce((sum, m) => sum + m.monto, 0);
    
    const egresos = Math.abs(movimientos
      .filter(m => m.monto < 0)
      .reduce((sum, m) => sum + m.monto, 0));

    const saldoFinal = datosUsuario.Saldo || 0;

    // 7. Construir respuesta
    const estadoCuenta = {
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin
      },
      cuenta: {
        numero: datosUsuario.Numcuenta || 'N/A',
        titular: `${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`,
        tipo: datosUsuario.Banco || 'Liberty Bank'
      },
      saldos: {
        inicial: saldoInicialValue,
        ingresos: ingresos,
        egresos: egresos,
        final: saldoFinal
      },
      movimientos: movimientosConSaldo
    };

    console.log('✅ Estado de cuenta generado exitosamente');
    console.log('📈 Resumen:', {
      movimientos: movimientosConSaldo.length,
      ingresos,
      egresos,
      saldoFinal
    });

    res.json({
      success: true,
      data: estadoCuenta
    });

  } catch (error) {
    console.error('❌ Error al obtener estado de cuenta:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el estado de cuenta',
      details: error.message
    });
  }
};

module.exports = {
  obtenerEstadoCuenta
};