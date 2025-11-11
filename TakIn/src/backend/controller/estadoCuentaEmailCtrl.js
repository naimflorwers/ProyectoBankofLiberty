const db = require('../db');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

/**
 * Enviar estado de cuenta por correo electrónico
 */
const enviarEstadoCuentaPorEmail = async (req, res) => {
  const { idUsuario, fechaInicio, fechaFin, correo } = req.body;

  if (!idUsuario || !fechaInicio || !fechaFin || !correo) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos requeridos'
    });
  }

  try {
    // Obtener datos del usuario y cuenta
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
      ) as TodosMovimientos
      ORDER BY ordenFecha ASC`,
      [
        numCuenta, numCuenta, fechaInicio, fechaInicio,
        numCuenta, fechaInicio, fechaInicio,
        numCuenta, fechaInicio, fechaInicio,
        numCuenta, fechaInicio, fechaInicio
      ]
    );

    // Calcular saldos
    let totalIngresos = 0;
    let totalEgresos = 0;

    movimientos.forEach(mov => {
      if (mov.monto > 0) {
        totalIngresos += mov.monto;
      } else {
        totalEgresos += Math.abs(mov.monto);
      }
    });

    const saldoFinal = saldoInicialValue + totalIngresos - totalEgresos;

    // Generar PDF en memoria
    const pdfDoc = new PDFDocument({ margin: 50 });
    const chunks = [];

    pdfDoc.on('data', chunk => chunks.push(chunk));

    // Encabezado
    pdfDoc
      .fontSize(20)
      .fillColor('#2a6bb2')
      .text('Bank of Liberty', { align: 'center' })
      .fontSize(16)
      .fillColor('#333333')
      .text('Estado de Cuenta', { align: 'center' })
      .moveDown();

    // Información del cliente
    pdfDoc
      .fontSize(10)
      .fillColor('#666666')
      .text(`Titular: ${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno} ${datosUsuario.ApellidoMaterno || ''}`)
      .text(`Cuenta: ${datosUsuario.Numcuenta}`)
      .text(`Periodo: ${new Date(fechaInicio).toLocaleDateString('es-MX')} - ${new Date(fechaFin).toLocaleDateString('es-MX')}`)
      .moveDown();

    // Resumen de saldos
    pdfDoc
      .fontSize(12)
      .fillColor('#2a6bb2')
      .text('Resumen', { underline: true })
      .fontSize(10)
      .fillColor('#333333')
      .text(`Saldo Inicial: $${saldoInicialValue.toFixed(2)}`)
      .text(`Ingresos: $${totalIngresos.toFixed(2)}`, { color: '#27ae60' })
      .text(`Egresos: $${totalEgresos.toFixed(2)}`, { color: '#e74c3c' })
      .fontSize(11)
      .fillColor('#2a6bb2')
      .text(`Saldo Final: $${saldoFinal.toFixed(2)}`, { bold: true })
      .moveDown();

    // Movimientos
    pdfDoc
      .fontSize(12)
      .fillColor('#2a6bb2')
      .text('Movimientos', { underline: true })
      .moveDown(0.5);

    if (movimientos.length > 0) {
      movimientos.forEach((mov, index) => {
        const color = mov.monto >= 0 ? '#27ae60' : '#e74c3c';
        const signo = mov.monto >= 0 ? '+' : '';
        
        pdfDoc
          .fontSize(9)
          .fillColor('#333333')
          .text(`${new Date(mov.fecha).toLocaleDateString('es-MX')} - ${mov.tipo}`, { continued: true })
          .fillColor(color)
          .text(` ${signo}$${Math.abs(mov.monto).toFixed(2)}`, { align: 'right' })
          .fontSize(8)
          .fillColor('#666666')
          .text(`   ${mov.descripcion}`)
          .text(`   Ref: ${mov.referencia}`)
          .moveDown(0.5);

        if ((index + 1) % 15 === 0 && index < movimientos.length - 1) {
          pdfDoc.addPage();
        }
      });
    } else {
      pdfDoc
        .fontSize(10)
        .fillColor('#666666')
        .text('No hay movimientos en este periodo');
    }

    // Pie de página
    pdfDoc
      .moveDown(2)
      .fontSize(8)
      .fillColor('#999999')
      .text('Este es un documento generado automáticamente.', { align: 'center' })
      .text(`Generado el ${new Date().toLocaleString('es-MX')}`, { align: 'center' });

    pdfDoc.end();

    // Esperar a que el PDF termine
    await new Promise((resolve, reject) => {
      pdfDoc.on('end', resolve);
      pdfDoc.on('error', reject);
    });

    const pdfBuffer = Buffer.concat(chunks);

    // Configurar transporter de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Configurar correo
    const mailOptions = {
      from: `"Bank of Liberty" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: `Estado de Cuenta - ${datosUsuario.Numcuenta}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2a6bb2;">Estado de Cuenta</h2>
          <p>Estimado/a <strong>${datosUsuario.Nombre} ${datosUsuario.ApellidoPaterno}</strong>,</p>
          <p>Adjunto encontrarás tu estado de cuenta del periodo:</p>
          <ul>
            <li><strong>Fecha inicio:</strong> ${new Date(fechaInicio).toLocaleDateString('es-MX')}</li>
            <li><strong>Fecha fin:</strong> ${new Date(fechaFin).toLocaleDateString('es-MX')}</li>
            <li><strong>Número de cuenta:</strong> ${datosUsuario.Numcuenta}</li>
          </ul>
          <div style="background: #f5f7fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2a6bb2; margin-top: 0;">Resumen</h3>
            <p style="margin: 5px 0;"><strong>Saldo Inicial:</strong> $${saldoInicialValue.toFixed(2)}</p>
            <p style="margin: 5px 0; color: #27ae60;"><strong>+ Ingresos:</strong> $${totalIngresos.toFixed(2)}</p>
            <p style="margin: 5px 0; color: #e74c3c;"><strong>- Egresos:</strong> $${totalEgresos.toFixed(2)}</p>
            <p style="margin: 5px 0; font-size: 18px;"><strong>Saldo Final:</strong> $${saldoFinal.toFixed(2)}</p>
          </div>
          <p>Gracias por confiar en Bank of Liberty.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Este es un correo automático, por favor no responder.<br>
            Bank of Liberty © ${new Date().getFullYear()}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `estado-cuenta-${fechaInicio}-${fechaFin}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    console.log(`✅ Estado de cuenta enviado por email a: ${correo}`);

    res.json({
      success: true,
      message: `Estado de cuenta enviado exitosamente a ${correo}`
    });

  } catch (error) {
    console.error('Error al enviar estado de cuenta por email:', error);
    res.status(500).json({
      success: false,
      error: 'Error al enviar el estado de cuenta por correo'
    });
  }
};

module.exports = { enviarEstadoCuentaPorEmail };
