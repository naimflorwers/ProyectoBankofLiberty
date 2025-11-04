const emailConfig = require('../config/email.config');

/**
 * Plantilla base para todos los correos
 */
function baseTemplate(content, title = 'Bank of Liberty') {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #2a6bb2 0%, #1a4d7a 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 30px 20px;
            color: #333;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2a6bb2;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 600;
        }
        .button:hover {
            background-color: #1a4d7a;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #2a6bb2;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .footer a {
            color: #2a6bb2;
            text-decoration: none;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        table td:first-child {
            font-weight: 600;
            color: #555;
        }
        .highlight {
            color: #2a6bb2;
            font-weight: 600;
        }
        .amount-positive {
            color: #28a745;
            font-size: 24px;
            font-weight: bold;
        }
        .amount-negative {
            color: #dc3545;
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏦 BANK OF LIBERTY</h1>
        </div>
        ${content}
        <div class="footer">
            <p><strong>Bank of Liberty</strong> - Tu banco de confianza</p>
            <p>
                <a href="${emailConfig.urls.dashboard}">Mi Dashboard</a> | 
                <a href="${emailConfig.urls.support}">Soporte</a>
            </p>
            <p>Este es un correo automático, por favor no responder.</p>
            <p>&copy; ${new Date().getFullYear()} Bank of Liberty. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Plantilla para transferencia enviada
 */
function transferSent(data) {
  const content = `
    <div class="content">
        <h2>Transferencia Enviada</h2>
        <p>Estimado/a <strong>${data.customerName || 'Cliente'}</strong>,</p>
        <p>Su transferencia ha sido procesada exitosamente.</p>
        
        <div class="info-box">
            <p class="amount-negative">- $${Number(data.amount).toFixed(2)} MXN</p>
        </div>
        
        <table>
            <tr>
                <td>Folio:</td>
                <td>${String(data.tranId || '0').padStart(10, '0')}</td>
            </tr>
            <tr>
                <td>Fecha:</td>
                <td>${data.date}</td>
            </tr>
            <tr>
                <td>Cuenta Destino:</td>
                <td>${data.destinationAccount}</td>
            </tr>
            ${data.destinationName ? `
            <tr>
                <td>Beneficiario:</td>
                <td>${data.destinationName}</td>
            </tr>
            ` : ''}
            <tr>
                <td>Concepto:</td>
                <td>${data.description || 'Transferencia'}</td>
            </tr>
            <tr>
                <td>Comisión:</td>
                <td>$${Number(data.fee || 0).toFixed(2)} MXN</td>
            </tr>
            ${data.newBalance ? `
            <tr>
                <td><strong>Nuevo Saldo:</strong></td>
                <td><strong>$${Number(data.newBalance).toFixed(2)} MXN</strong></td>
            </tr>
            ` : ''}
        </table>
        
        <p>Se adjunta el comprobante de la transferencia en formato PDF.</p>
        <p>Gracias por confiar en Bank of Liberty.</p>
    </div>
  `;
  return baseTemplate(content, 'Transferencia Enviada');
}

/**
 * Plantilla para transferencia recibida
 */
function transferReceived(data) {
  const content = `
    <div class="content">
        <h2>Transferencia Recibida</h2>
        <p>Estimado/a <strong>${data.customerName || 'Cliente'}</strong>,</p>
        <p>Ha recibido una transferencia en su cuenta.</p>
        
        <div class="info-box">
            <p class="amount-positive">+ $${Number(data.amount).toFixed(2)} MXN</p>
        </div>
        
        <table>
            <tr>
                <td>Folio:</td>
                <td>${String(data.tranId || '0').padStart(10, '0')}</td>
            </tr>
            <tr>
                <td>Fecha:</td>
                <td>${data.date}</td>
            </tr>
            <tr>
                <td>Cuenta Origen:</td>
                <td>${data.originAccount}</td>
            </tr>
            ${data.originName ? `
            <tr>
                <td>Remitente:</td>
                <td>${data.originName}</td>
            </tr>
            ` : ''}
            <tr>
                <td>Concepto:</td>
                <td>${data.description || 'Transferencia'}</td>
            </tr>
            ${data.newBalance ? `
            <tr>
                <td><strong>Nuevo Saldo:</strong></td>
                <td><strong>$${Number(data.newBalance).toFixed(2)} MXN</strong></td>
            </tr>
            ` : ''}
        </table>
        
        <p>Se adjunta el comprobante de la transferencia en formato PDF.</p>
        <p>Gracias por confiar en Bank of Liberty.</p>
    </div>
  `;
  return baseTemplate(content, 'Transferencia Recibida');
}

/**
 * Plantilla para depósito recibido
 */
function depositReceived(data) {
  const content = `
    <div class="content">
        <h2>Depósito Recibido</h2>
        <p>Estimado/a <strong>${data.customerName || 'Cliente'}</strong>,</p>
        <p>Se ha realizado un depósito en su cuenta.</p>
        
        <div class="info-box">
            <p class="amount-positive">+ $${Number(data.amount).toFixed(2)} MXN</p>
        </div>
        
        <table>
            <tr>
                <td>Folio:</td>
                <td>${String(data.depId || '0').padStart(10, '0')}</td>
            </tr>
            <tr>
                <td>Fecha:</td>
                <td>${data.date}</td>
            </tr>
            <tr>
                <td>Cuenta:</td>
                <td>${data.accountNumber}</td>
            </tr>
            ${data.description ? `
            <tr>
                <td>Concepto:</td>
                <td>${data.description}</td>
            </tr>
            ` : ''}
            <tr>
                <td><strong>Nuevo Saldo:</strong></td>
                <td><strong>$${Number(data.newBalance).toFixed(2)} MXN</strong></td>
            </tr>
        </table>
        
        <p>Se adjunta el comprobante del depósito en formato PDF.</p>
        <p>Gracias por confiar en Bank of Liberty.</p>
    </div>
  `;
  return baseTemplate(content, 'Depósito Recibido');
}

/**
 * Plantilla para recuperación de contraseña
 */
function passwordReset(data) {
  const content = `
    <div class="content">
        <h2>Recuperación de Contraseña</h2>
        <p>Estimado/a <strong>${data.customerName || 'Cliente'}</strong>,</p>
        <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta.</p>
        
        <div class="info-box">
            <p style="font-size: 14px; margin-bottom: 10px;">Su código de verificación es:</p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 15px 0;">
                <p style="font-size: 32px; font-weight: bold; color: #2a6bb2; letter-spacing: 8px; margin: 0;">
                    ${data.resetCode}
                </p>
            </div>
            <p style="margin-top: 15px; font-size: 12px; color: #e74c3c;">
                Este código expirará en ${data.expirationTime || '10 minutos'}.
            </p>
        </div>
        
        <p><strong>Si no solicitó este cambio, por favor ignore este correo.</strong></p>
        <p>Por seguridad, su contraseña actual seguirá siendo válida hasta que complete el proceso de restablecimiento.</p>
    </div>
  `;
  return baseTemplate(content, 'Recuperación de Contraseña');
}

/**
 * Plantilla para notificación de contraseña cambiada
 */
function passwordChanged(data) {
  const content = `
    <div class="content">
        <h2>Contraseña Actualizada</h2>
        <p>Estimado/a <strong>${data.customerName || 'Cliente'}</strong>,</p>
        <p>Le confirmamos que su contraseña ha sido actualizada exitosamente.</p>
        
        <div class="info-box">
            <table style="margin: 0;">
                <tr>
                    <td>Fecha del cambio:</td>
                    <td>${data.date || new Date().toLocaleString('es-MX')}</td>
                </tr>
                ${data.ipAddress ? `
                <tr>
                    <td>Dirección IP:</td>
                    <td>${data.ipAddress}</td>
                </tr>
                ` : ''}
            </table>
        </div>
        
        <p><strong>Si no realizó este cambio, contacte inmediatamente a nuestro soporte.</strong></p>
        
        <center>
            <a href="${emailConfig.urls.support}" class="button">Contactar Soporte</a>
        </center>
    </div>
  `;
  return baseTemplate(content, 'Contraseña Actualizada');
}

/**
 * Plantilla para cuenta creada
 */
function accountCreated(data) {
  const content = `
    <div class="content">
        <h2>¡Cuenta Creada Exitosamente!</h2>
        <p>Estimado/a <strong>${data.customerName || 'Cliente'}</strong>,</p>
        <p>Nos complace informarle que su cuenta ha sido creada exitosamente.</p>
        
        <div class="info-box">
            <table style="margin: 0;">
                ${data.accountType ? `
                <tr>
                    <td>Tipo de Cuenta:</td>
                    <td><strong>${data.accountType}</strong></td>
                </tr>
                ` : ''}
                ${data.accNum ? `
                <tr>
                    <td>Número de Cuenta:</td>
                    <td><strong>${data.accNum}</strong></td>
                </tr>
                ` : ''}
                ${data.clabe ? `
                <tr>
                    <td>CLABE:</td>
                    <td><strong>${data.clabe}</strong></td>
                </tr>
                ` : ''}
                ${data.cardNum ? `
                <tr>
                    <td>Número de Tarjeta:</td>
                    <td><strong>${data.cardNum}</strong></td>
                </tr>
                ` : ''}
                <tr>
                    <td>Fecha de Apertura:</td>
                    <td>${data.date || new Date().toLocaleDateString('es-MX')}</td>
                </tr>
            </table>
        </div>
        
        <p>Ya puede comenzar a utilizar todos nuestros servicios bancarios.</p>
        
        <center>
            <a href="${emailConfig.urls.dashboard}" class="button">Ir a Mi Dashboard</a>
        </center>
    </div>
  `;
  return baseTemplate(content, 'Cuenta Creada');
}

/**
 * Plantilla de bienvenida
 */
function welcome(data) {
  const content = `
    <div class="content">
        <h2>¡Bienvenido/a a Bank of Liberty!</h2>
        <p>Estimado/a <strong>${data.customerName || 'Cliente'}</strong>,</p>
        <p>Es un placer darle la bienvenida a Bank of Liberty. Estamos comprometidos en brindarle el mejor servicio bancario.</p>
        
        <div class="info-box">
            <h3 style="margin-top: 0;">Nuestros Servicios:</h3>
            <ul>
                <li>💰 Transferencias entre cuentas</li>
                <li>💳 Gestión de cuentas en línea</li>
                <li>📊 Consulta de movimientos</li>
                <li>🔐 Seguridad NSSH</li>
                <li>📱 Acceso 24/7</li>
            </ul>
        </div>
        
        <p>Su cuenta de correo electrónico <strong class="highlight">${data.mail}</strong> ha sido registrada exitosamente.</p>
        
        <center>
            <a href="${emailConfig.urls.dashboard}" class="button">Acceder a Mi Cuenta</a>
        </center>
        
        <p style="margin-top: 30px;">Si tiene alguna pregunta, no dude en contactar a nuestro equipo de soporte.</p>
    </div>
  `;
  return baseTemplate(content, 'Bienvenido a Bank of Liberty');
}

module.exports = {
  baseTemplate,
  transferSent,
  transferReceived,
  depositReceived,
  passwordReset,
  passwordChanged,
  accountCreated,
  welcome
};
