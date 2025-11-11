const PDFDocument = require('pdfkit');

/**
 * Genera un PDF de comprobante de transferencia
 * @param {Object} data - Datos de la transferencia
 * @returns {Buffer} - PDF en formato buffer
 */
function generateTransferPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Encabezado
      doc.fontSize(24)
         .text('BANK OF LIBERTY', { align: 'center' })
         .moveDown(0.5);
      
      doc.fontSize(18)
         .text('Comprobante de Transferencia', { align: 'center' })
         .moveDown(1);

      // Línea separadora
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();
      doc.moveDown(1);

      // Folio y Fecha
      const folio = String(data.tranId || '0').padStart(10, '0');
      doc.fontSize(12);
      doc.text(`Folio: ${folio}`, { continued: true })
         .text(`Fecha: ${data.date}`, { align: 'right' });
      doc.moveDown(1);

      // Detalles de la transferencia
      doc.fontSize(14)
         .text('Detalles de la Operación', { underline: true })
         .moveDown(0.5);

      doc.fontSize(11);
      doc.text(`Monto: $${Number(data.amount).toFixed(2)} MXN`);
      doc.text(`Comisión: $${Number(data.fee || 0).toFixed(2)} MXN`);
      doc.text(`Total: $${(Number(data.amount) + Number(data.fee || 0)).toFixed(2)} MXN`);
      doc.moveDown(0.5);

      doc.text(`Cuenta Origen: ${data.originAccount}`);
      if (data.senderName) {
        doc.text(`Remitente: ${data.senderName}`);
      }
      doc.moveDown(0.5);

      doc.text(`Cuenta Destino: ${data.destinationAccount}`);
      if (data.recipientName) {
        doc.text(`Beneficiario: ${data.recipientName}`);
      }
      doc.moveDown(0.5);

      if (data.description) {
        doc.text(`Concepto: ${data.description}`);
      }
      doc.moveDown(1);

      // Pie de página
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();
      doc.moveDown(0.5);

      doc.fontSize(9)
         .text('Este comprobante es válido como prueba de la transacción realizada.', { align: 'center' })
         .text('Conserve este documento para futuras aclaraciones.', { align: 'center' })
         .moveDown(0.5);
      
      doc.text('Bank of Liberty - Sistema de Transferencias', { align: 'center' })
         .text(`Generado: ${new Date().toLocaleString('es-MX')}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Genera un PDF de comprobante de depósito
 * @param {Object} data - Datos del depósito
 * @returns {Buffer} - PDF en formato buffer
 */
function generateDepositPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Encabezado
      doc.fontSize(24)
         .text('BANK OF LIBERTY', { align: 'center' })
         .moveDown(0.5);
      
      doc.fontSize(18)
         .text('Comprobante de Depósito', { align: 'center' })
         .moveDown(1);

      // Línea separadora
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();
      doc.moveDown(1);

      // Folio y Fecha
      const folio = String(data.depId || '0').padStart(10, '0');
      doc.fontSize(12);
      doc.text(`Folio: ${folio}`, { continued: true })
         .text(`Fecha: ${data.date}`, { align: 'right' });
      doc.moveDown(1);

      // Detalles del depósito
      doc.fontSize(14)
         .text('Detalles de la Operación', { underline: true })
         .moveDown(0.5);

      doc.fontSize(11);
      doc.text(`Monto Depositado: $${Number(data.amount).toFixed(2)} MXN`);
      doc.text(`Cuenta Destino: ${data.accountNumber}`);
      
      if (data.newBalance) {
        doc.text(`Nuevo Saldo: $${Number(data.newBalance).toFixed(2)} MXN`);
      }
      
      if (data.customerName) {
        doc.text(`Titular: ${data.customerName}`);
      }
      
      if (data.description) {
        doc.text(`Concepto: ${data.description}`);
      }
      doc.moveDown(1);

      // Pie de página
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();
      doc.moveDown(0.5);

      doc.fontSize(9)
         .text('Este comprobante es válido como prueba de la transacción realizada.', { align: 'center' })
         .text('Conserve este documento para futuras aclaraciones.', { align: 'center' })
         .moveDown(0.5);
      
      doc.text('Bank of Liberty - Sistema Bancario', { align: 'center' })
         .text(`Generado: ${new Date().toLocaleString('es-MX')}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateTransferPDF,
  generateDepositPDF
};
