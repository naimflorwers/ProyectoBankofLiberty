const db = require('../db');

/**
 * Verificar elegibilidad para línea de crédito
 */
const verificarElegibilidad = async (req, res) => {
  const { idUsuario } = req.params;

  console.log('🔍 Verificando elegibilidad para usuario:', idUsuario);

  try {
    // 1. Obtener datos del cliente
    const [cliente] = await db.promise().query(
      `SELECT cl.*, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo
       FROM Cliente cl
       JOIN Usuarios u ON cl.IDUsuario = u.IDUsuario
       WHERE cl.IDUsuario = ?`,
      [idUsuario]
    );

    if (cliente.length === 0) {
      return res.json({
        success: true,
        data: {
          elegible: false,
          razon: 'No tienes un perfil de cliente completado',
          montoMaximo: 0,
          tasaMensual: 0,
          plazoMaximo: 0
        }
      });
    }

    const datosCliente = cliente[0];

    // 2. Obtener cuenta del cliente
    const [cuenta] = await db.promise().query(
      `SELECT * FROM Cuentas WHERE IDCliente = ?`,
      [datosCliente.IDCliente]
    );

    if (cuenta.length === 0) {
      return res.json({
        success: true,
        data: {
          elegible: false,
          razon: 'Necesitas tener una cuenta bancaria activa',
          montoMaximo: 0,
          tasaMensual: 0,
          plazoMaximo: 0
        }
      });
    }

    const datosCuenta = cuenta[0];

    // 3. Verificar si tiene préstamos activos
    const [prestamosActivos] = await db.promise().query(
      `SELECT COUNT(*) as total FROM Prestamos 
       WHERE IDCliente = ? AND Autorizado = TRUE`,
      [datosCliente.IDCliente]
    );

    const tienePrestamos = prestamosActivos[0].total > 0;

    // 4. Calcular monto máximo basado en ingreso mensual
    // Fórmula: Monto máximo = IngresoMensual * 5 (multiplicador bancario estándar)
    const ingresoMensual = parseFloat(datosCliente.IngresoMensual) || 0;
    
    if (ingresoMensual < 5000) {
      return res.json({
        success: true,
        data: {
          elegible: false,
          razon: 'Ingreso mensual insuficiente (mínimo $5,000 MXN)',
          montoMaximo: 0,
          tasaMensual: 0,
          plazoMaximo: 0
        }
      });
    }

    // Calcular monto máximo (5 veces el ingreso mensual, máximo $500,000)
    let montoMaximo = Math.min(ingresoMensual * 5, 500000);

    // Si tiene préstamos activos, reducir el monto
    if (tienePrestamos) {
      montoMaximo = montoMaximo * 0.6; // 60% del monto si tiene préstamos
    }

    // 5. Determinar tasa de interés mensual
    // Basada en el score de crédito (si existe) o un valor por defecto
    const [score] = await db.promise().query(
      `SELECT Score FROM Score_de_Credito 
       WHERE IDCliente = ? 
       ORDER BY FechaConsulta DESC 
       LIMIT 1`,
      [datosCliente.IDCliente]
    );

    let tasaMensual = 2.5; // Tasa por defecto 2.5% mensual

    if (score.length > 0) {
      const scoreValor = score[0].Score;
      if (scoreValor >= 700) {
        tasaMensual = 1.8; // Excelente
      } else if (scoreValor >= 650) {
        tasaMensual = 2.2; // Bueno
      } else if (scoreValor >= 600) {
        tasaMensual = 2.8; // Regular
      } else {
        tasaMensual = 3.5; // Bajo
      }
    }

    // 6. Plazo máximo (en meses)
    const plazoMaximo = 36; // 3 años

    console.log('✅ Elegibilidad verificada:', {
      elegible: true,
      montoMaximo,
      tasaMensual,
      plazoMaximo
    });

    res.json({
      success: true,
      data: {
        elegible: true,
        montoMaximo: Math.round(montoMaximo),
        tasaMensual: tasaMensual,
        plazoMaximo: plazoMaximo
      }
    });

  } catch (error) {
    console.error('❌ Error al verificar elegibilidad:', error);
    res.status(500).json({
      success: false,
      error: 'Error al verificar elegibilidad'
    });
  }
};

/**
 * Solicitar línea de crédito
 */
const solicitarCredito = async (req, res) => {
  const {
    idUsuario,
    montoSolicitado,
    plazoMeses,
    tasaInteres,
    pagoMensual,
    totalAPagar,
    ingresoMensual,
    gastosMensuales,
    capacidadPago
  } = req.body;

  console.log('📝 Solicitud de crédito recibida:', {
    idUsuario,
    montoSolicitado,
    plazoMeses
  });

  if (!idUsuario || !montoSolicitado || !plazoMeses) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos requeridos'
    });
  }

  try {
    // 1. Obtener datos del cliente
    const [cliente] = await db.promise().query(
      `SELECT * FROM Cliente WHERE IDUsuario = ?`,
      [idUsuario]
    );

    if (cliente.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }

    const datosCliente = cliente[0];

    // 2. Obtener cuenta del cliente
    const [cuenta] = await db.promise().query(
      `SELECT * FROM Cuentas WHERE IDCliente = ?`,
      [datosCliente.IDCliente]
    );

    if (cuenta.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cuenta no encontrada'
      });
    }

    const numCuenta = cuenta[0].Numcuenta;

    // 3. Crear solicitud de préstamo
    const descripcion = `Línea de Crédito - ${plazoMeses} meses
Ingreso Mensual: $${ingresoMensual}
Gastos Mensuales: $${gastosMensuales}
Capacidad de Pago: $${capacidadPago}
Pago Mensual: $${pagoMensual}
Total a Pagar: $${totalAPagar}`;

    const [result] = await db.promise().query(
      `INSERT INTO Prestamos (
        IDCliente, NumCuenta, Descripcion, Monto, 
        PlazoMeses, TasaInteres, Autorizado
      ) VALUES (?, ?, ?, ?, ?, ?, FALSE)`,
      [
        datosCliente.IDCliente,
        numCuenta,
        descripcion,
        montoSolicitado,
        plazoMeses,
        tasaInteres
      ]
    );

    console.log('✅ Solicitud de crédito creada con ID:', result.insertId);

    res.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      idPrestamo: result.insertId
    });

  } catch (error) {
    console.error('❌ Error al solicitar crédito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
};

module.exports = {
  verificarElegibilidad,
  solicitarCredito
};
