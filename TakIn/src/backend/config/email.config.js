require('dotenv').config();

const emailConfig = {
  service: 'gmail', // Puede ser 'gmail', 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER || 'bankofliberty@gmail.com', // Cambiar por tu email
    pass: process.env.EMAIL_PASS || '' // App Password de Gmail
  },
  from: {
    name: 'Bank of Liberty',
    address: process.env.EMAIL_USER || 'bankofliberty@gmail.com'
  },
  // URLs para enlaces en correos
  urls: {
    resetPassword: process.env.RESET_PASSWORD_URL || 'http://penyrphf.icu:4200/reset-password',
    dashboard: process.env.DASHBOARD_URL || 'http://penyrphf.icu:4200/menu-cliente',
    support: process.env.SUPPORT_URL || 'http://penyrphf.icu:4200/support'
  },
  // Configuración de reintentos
  retry: {
    maxAttempts: 3,
    delay: 1000 // milisegundos
  },
  // Configuración TLS
  tls: {
    rejectUnauthorized: false // true en producción
  }
};

module.exports = emailConfig;
