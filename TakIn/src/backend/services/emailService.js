const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');
const emailTemplates = require('./emailTemplates');
const pdfService = require('./pdfService');

let transporter = null;

/**
 * Crea y configura el transporter de Nodemailer
 */
function createTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth,
      tls: emailConfig.tls
    });
    console.log('[EMAIL] Transporter de correo configurado');
  }
  return transporter;
}

/**
 * Envía un correo electrónico con reintentos
 * @param {Object} mailOptions - Opciones del correo
 * @param {number} attempt - Intento actual
 * @returns {Promise<Object>} - Resultado del envío
 */
async function sendEmail(mailOptions, attempt = 1) {
  try {
    const transport = createTransporter();
    
    console.log(`📧 [EMAIL] Intento ${attempt}/${emailConfig.retry.maxAttempts} - Enviando correo a: ${mailOptions.to}`);
    
    const info = await transport.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.address}>`,
      ...mailOptions
    });
    
    console.log(`✅ [EMAIL] Correo enviado exitosamente - ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
    
  } catch (error) {
    console.error(`❌ [EMAIL] Error en intento ${attempt}:`, error.message);
    
    if (attempt < emailConfig.retry.maxAttempts) {
      console.log(`🔄 [EMAIL] Reintentando en ${emailConfig.retry.delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, emailConfig.retry.delay));
      return sendEmail(mailOptions, attempt + 1);
    }
    
    console.error(`❌ [EMAIL] Falló después de ${emailConfig.retry.maxAttempts} intentos`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Envía correo de transferencia enviada
 */
async function sendTransferSentEmail(recipientEmail, data) {
  try {
    console.log('📧 [EMAIL] Preparando correo de transferencia enviada...');
    
    const htmlContent = emailTemplates.transferSent(data);
    const pdfBuffer = await pdfService.generateTransferPDF(data);
    
    const folio = String(data.tranId || '0').padStart(10, '0');
    
    const mailOptions = {
      to: recipientEmail,
      subject: `Transferencia Enviada - Folio #${folio}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Transferencia_${folio}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    return await sendEmail(mailOptions);
  } catch (error) {
    console.error('❌ [EMAIL] Error al preparar correo de transferencia enviada:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía correo de transferencia recibida
 */
async function sendTransferReceivedEmail(recipientEmail, data) {
  try {
    console.log('📧 [EMAIL] Preparando correo de transferencia recibida...');
    
    const htmlContent = emailTemplates.transferReceived(data);
    const pdfBuffer = await pdfService.generateTransferPDF(data);
    
    const folio = String(data.tranId || '0').padStart(10, '0');
    
    const mailOptions = {
      to: recipientEmail,
      subject: `Transferencia Recibida - Folio #${folio}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Transferencia_${folio}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    return await sendEmail(mailOptions);
  } catch (error) {
    console.error('❌ [EMAIL] Error al preparar correo de transferencia recibida:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía correo de depósito recibido
 */
async function sendDepositReceivedEmail(recipientEmail, data) {
  try {
    console.log('📧 [EMAIL] Preparando correo de depósito recibido...');
    
    const htmlContent = emailTemplates.depositReceived(data);
    const pdfBuffer = await pdfService.generateDepositPDF(data);
    
    const folio = String(data.depId || '0').padStart(10, '0');
    
    const mailOptions = {
      to: recipientEmail,
      subject: 'Depósito Recibido - Bank of Liberty',
      html: htmlContent,
      attachments: [
        {
          filename: `Deposito_${folio}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    return await sendEmail(mailOptions);
  } catch (error) {
    console.error('❌ [EMAIL] Error al preparar correo de depósito:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía correo de recuperación de contraseña con código de verificación
 */
async function sendPasswordResetEmail(recipientEmail, data) {
  try {
    console.log('📧 [EMAIL] Preparando correo de recuperación de contraseña...');
    console.log(`📧 [EMAIL] Código de verificación: ${data.resetCode}`);
    
    const htmlContent = emailTemplates.passwordReset(data);
    
    const mailOptions = {
      to: recipientEmail,
      subject: 'Código de Recuperación - Bank of Liberty',
      html: htmlContent
    };
    
    return await sendEmail(mailOptions);
  } catch (error) {
    console.error('❌ [EMAIL] Error al preparar correo de recuperación:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía correo de contraseña cambiada
 */
async function sendPasswordChangedEmail(recipientEmail, data) {
  try {
    console.log('📧 [EMAIL] Preparando correo de contraseña cambiada...');
    
    const htmlContent = emailTemplates.passwordChanged(data);
    
    const mailOptions = {
      to: recipientEmail,
      subject: 'Contraseña Actualizada - Bank of Liberty',
      html: htmlContent
    };
    
    return await sendEmail(mailOptions);
  } catch (error) {
    console.error('❌ [EMAIL] Error al preparar correo de contraseña cambiada:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía correo de cuenta creada
 */
async function sendAccountCreatedEmail(recipientEmail, data) {
  try {
    console.log('📧 [EMAIL] Preparando correo de cuenta creada...');
    
    const htmlContent = emailTemplates.accountCreated(data);
    
    const mailOptions = {
      to: recipientEmail,
      subject: '¡Cuenta Creada Exitosamente! - Bank of Liberty',
      html: htmlContent
    };
    
    return await sendEmail(mailOptions);
  } catch (error) {
    console.error('❌ [EMAIL] Error al preparar correo de cuenta creada:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía correo de bienvenida
 */
async function sendWelcomeEmail(recipientEmail, data) {
  try {
    console.log('📧 [EMAIL] Preparando correo de bienvenida...');
    
    const htmlContent = emailTemplates.welcome(data);
    
    const mailOptions = {
      to: recipientEmail,
      subject: '¡Bienvenido/a a Bank of Liberty!',
      html: htmlContent
    };
    
    return await sendEmail(mailOptions);
  } catch (error) {
    console.error('❌ [EMAIL] Error al preparar correo de bienvenida:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica la conexión con el servidor SMTP
 */
async function verifyConnection() {
  try {
    const transport = createTransporter();
    await transport.verify();
    console.log('✅ [EMAIL] Conexión SMTP verificada correctamente');
    return { success: true };
  } catch (error) {
    console.error('❌ [EMAIL] Error al verificar conexión SMTP:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendTransferSentEmail,
  sendTransferReceivedEmail,
  sendDepositReceivedEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendAccountCreatedEmail,
  sendWelcomeEmail,
  verifyConnection
};
