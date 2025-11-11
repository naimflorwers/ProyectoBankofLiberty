const db = require('../db');
const PDFDocument = require('pdfkit');

/**
 * Generar PDF del estado de cuenta
 */
const generarPDFEstadoCuenta = async (req, res) => {
  const { idUsuario, fechaInicio, fechaFin } = req.body;

  if (!idUsuario || !fechaInicio || !fechaFin) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos requeridos'
    });
  }

  try {
    // Obtener datos del estado de cuenta (reutilizamos la lógica)
    const [usuario] = await db.promise().query(
      `SELECT u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, 
              c.Numcuenta, c.Dinero as Saldo, c.Banco
       FROM Usuarios u
       LEFT JOIN Cliente cl ON u.IDUsuario = cl.IDUsuario
       LEFT JOIN Cuentas c ON cl.IDCliente = c.IDCliente
       WHERE u.IDUsuario = ?`,
      [idUsuario]
    );

    if (usuario.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const datosUsuario = usuario[0];

    if (!datosUsuario.Numcuenta) {
      return res.status(404).json({
        success: false,
        error: 'Usuario sin cuenta bancaria'
      });
    }

    const numCuenta = datosUsuario.Numcuenta;

    // Usar saldo actual
    const saldoInicialValue = datosUsuario.Saldo || 0;

    // Obtener movimientos
    const [movimientos] = await db.promise().query(
      `SELECT * FROM (
        SELECT 
          t.FechaTransferencia as fecha,
          'Transferencia Enviada' as tipo,
          CONCAT('Transferencia a cuenta ', t.CuentaDestino) as descripcion,
          CONCAT('TRANS-', t.IDTransferencia) as referencia,
          -t.Monto as monto,
          t.FechaTransferencia as ordenFecha
        FROM Transferencia t
        WHERE t.NumCuenta = ?
        AND t.CuentaRemitente = ?
        AND t.FechaTransferencia BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        SELECT 
          t.FechaTransferencia as fecha,
          'Transferencia Recibida' as tipo,
          CONCAT('Transferencia de cuenta ', t.CuentaRemitente) as descripcion,
          CONCAT('TRANS-', t.IDTransferencia) as referencia,
          t.Monto as monto,
          t.FechaTransferencia as ordenFecha
        FROM Transferencia t
        WHERE t.CuentaDestino = ?
        AND t.FechaTransferencia BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        SELECT 
          i.FechaIngreso as fecha,
          'Depósito' as tipo,
          CONCAT('Depósito - ', IFNULL(i.MetodoDeposito, 'Efectivo')) as descripcion,
          IFNULL(i.ClaveReferencia, CONCAT('ING-', i.IDIngreso)) as referencia,
          i.Monto as monto,
          i.FechaIngreso as ordenFecha
        FROM Ingresar i
        WHERE i.NumCuenta = ?
        AND i.FechaIngreso BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        SELECT 
          r.FechaRetiro as fecha,
          'Retiro' as tipo,
          CONCAT('Retiro - ', IFNULL(r.Metodo, 'Efectivo')) as descripcion,
          IFNULL(r.NumeroReferencia, CONCAT('RET-', r.IDRetiro)) as referencia,
          -r.Monto as monto,
          r.FechaRetiro as ordenFecha
        FROM Retirar r
        WHERE r.NumCuenta = ?
        AND r.FechaRetiro BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
        
        UNION ALL
        
        SELECT 
          p.FechaSolicitud as fecha,
          'Préstamo' as tipo,
          CONCAT('Préstamo autorizado') as descripcion,
          CONCAT('PRES-', p.IDPrestamo) as referencia,
          p.Monto as monto,
          p.FechaSolicitud as ordenFecha
        FROM Prestamos p
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

    // Calcular saldos
    let saldoActual = saldoInicialValue;
    const movimientosConSaldo = movimientos.map(mov => {
      saldoActual += mov.monto;
      return {
        ...mov,
        saldo: saldoActual
      };
    });

    const ingresos = movimientos
      .filter(m => m.monto > 0)
      .reduce((sum, m) => sum + m.monto, 0);
    
    const egresos = Math.abs(movimientos
      .filter(m => m.monto < 0)
      .reduce((sum, m) => sum + m.monto, 0));

    const saldoFinal = datosUsuario.Saldo || 0;

    // Crear PDF
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });

    // Headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=estado-cuenta-${fechaInicio}-${fechaFin}.pdf`);

    doc.pipe(res);

    // Encabezado
    doc.fontSize(20)
       .fillColor('#2a6bb2')
       .text('BANK OF LIBERTY', { align: 'center' })
       .moveDown(0.5);

    doc.fontSize(16)
       .fillColor('#000')
       .text('ESTADO DE CUENTA', { align: 'center' })
       .moveDown(1.5);

    // Información del cliente
    doc.fontSize(10)
       .fillColor('#000')
       .text(`Titular: ${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno}`, 50, doc.y)
       .text(`Número de Cuenta: ${datosUsuario.Numcuenta || 'N/A'}`)
       .text(`Banco: ${datosUsuario.Banco || 'Liberty Bank'}`)
       .text(`Periodo: ${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`)
       .text(`Fecha de emisión: ${formatearFecha(new Date())}`)
       .moveDown(1.5);

    // Línea separadora
    doc.moveTo(50, doc.y)
       .lineTo(562, doc.y)
       .stroke()
       .moveDown(1);

    // Resumen de saldos
    doc.fontSize(12)
       .fillColor('#2a6bb2')
       .text('RESUMEN DE SALDOS', { underline: true })
       .moveDown(0.5);

    doc.fontSize(10)
       .fillColor('#000')
       .text(`Saldo Inicial:`, 50, doc.y, { continued: true })
       .text(`$${formatearMoneda(saldoInicialValue)}`, { align: 'right' })
       .text(`Total Ingresos:`, 50, doc.y, { continued: true })
       .fillColor('#27ae60')
       .text(`+ $${formatearMoneda(ingresos)}`, { align: 'right' })
       .fillColor('#000')
       .text(`Total Egresos:`, 50, doc.y, { continued: true })
       .fillColor('#e74c3c')
       .text(`- $${formatearMoneda(egresos)}`, { align: 'right' })
       .fillColor('#000')
       .text(`Saldo Final:`, 50, doc.y, { continued: true })
       .fontSize(12)
       .fillColor('#2a6bb2')
       .text(`$${formatearMoneda(saldoFinal)}`, { align: 'right' })
       .moveDown(1.5);

    // Línea separadora
    doc.moveTo(50, doc.y)
       .lineTo(562, doc.y)
       .stroke()
       .moveDown(1);

    // Tabla de movimientos
    doc.fontSize(12)
       .fillColor('#2a6bb2')
       .text('DETALLE DE MOVIMIENTOS', { underline: true })
       .moveDown(0.5);

    if (movimientosConSaldo.length === 0) {
      doc.fontSize(10)
         .fillColor('#000')
         .text('No hay movimientos en este periodo', { align: 'center' })
         .moveDown(2);
    } else {
      // Encabezados de tabla
      doc.fontSize(9)
         .fillColor('#000')
         .text('Fecha', 50, doc.y, { width: 70 })
         .text('Tipo', 120, doc.y - 9, { width: 100 })
         .text('Descripción', 220, doc.y - 9, { width: 150 })
         .text('Monto', 370, doc.y - 9, { width: 90, align: 'right' })
         .text('Saldo', 460, doc.y - 9, { width: 90, align: 'right' })
         .moveDown(0.3);

      // Línea debajo de encabezados
      doc.moveTo(50, doc.y)
         .lineTo(562, doc.y)
         .stroke()
         .moveDown(0.5);

      // Movimientos
      movimientosConSaldo.forEach(mov => {
        if (doc.y > 700) {
          doc.addPage();
        }

        const yPos = doc.y;
        
        doc.fontSize(8)
           .fillColor('#000')
           .text(formatearFecha(mov.fecha), 50, yPos, { width: 70 })
           .text(mov.tipo, 120, yPos, { width: 100 })
           .text(mov.descripcion.substring(0, 30), 220, yPos, { width: 150 })
           .fillColor(mov.monto >= 0 ? '#27ae60' : '#e74c3c')
           .text(`${mov.monto >= 0 ? '+' : ''}$${formatearMoneda(Math.abs(mov.monto))}`, 370, yPos, { width: 90, align: 'right' })
           .fillColor('#000')
           .text(`$${formatearMoneda(mov.saldo)}`, 460, yPos, { width: 90, align: 'right' })
           .moveDown(0.8);
      });
    }

    // Pie de página
    doc.fontSize(8)
       .fillColor('#666')
       .text('Este documento es un estado de cuenta oficial de Bank of Liberty', 50, 720, { align: 'center' })
       .text('Para cualquier aclaración, contáctanos al (555) 123-4567', { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Error al generar PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Error al generar el PDF'
      });
    }
  }
};

/**
 * Formatear fecha
 */
function formatearFecha(fecha) {
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatear moneda
 */
function formatearMoneda(monto) {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(monto);
}

module.exports = {
  generarPDFEstadoCuenta
};
