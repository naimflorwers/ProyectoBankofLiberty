const db = require('../db');
const bcrypt = require('bcrypt');
const emailService = require('../services/emailService');

// Almacenamiento temporal de códigos (en producción usar Redis o base de datos)
const codigosVerificacion = new Map();

/**
 * Generar código de verificación de 6 dígitos
 */
function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Solicitar código de recuperación
 */
const solicitarRecuperacion = (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ success: false, error: 'El correo es requerido' });
  }

  // Verificar si el correo existe en la base de datos
  const query = 'SELECT IDUsuario, CONCAT(Nombre, " ", ApellidoPaterno) as NombreCompleto FROM Usuarios WHERE Correo = ?';
  
  db.query(query, [correo], async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ success: false, error: 'Error al procesar la solicitud' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'El correo no está registrado' });
    }

    const usuario = results[0];
    const codigo = generarCodigo();
    const expiracion = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Guardar código con expiración
    codigosVerificacion.set(correo, {
      codigo: codigo,
      expiracion: expiracion,
      intentos: 0
    });

    console.log(`📧 Código generado para ${correo}: ${codigo}`);

    // Enviar correo con el código
    try {
      const resultEmail = await emailService.sendPasswordResetEmail(correo, {
        customerName: usuario.NombreCompleto,
        resetCode: codigo,
        expirationTime: '10 minutos'
      });

      if (resultEmail.success) {
        return res.json({ 
          success: true, 
          mensaje: 'Se ha enviado un código de verificación a tu correo' 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          error: 'Error al enviar el correo de recuperación' 
        });
      }
    } catch (error) {
      console.error('Error al enviar correo:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al enviar el correo de recuperación' 
      });
    }
  });
};

/**
 * Verificar código de recuperación
 */
const verificarCodigo = (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({ success: false, error: 'Correo y código son requeridos' });
  }

  const datosAlmacenados = codigosVerificacion.get(correo);

  if (!datosAlmacenados) {
    return res.status(404).json({ success: false, error: 'No se ha solicitado recuperación para este correo' });
  }

  // Verificar expiración
  if (Date.now() > datosAlmacenados.expiracion) {
    codigosVerificacion.delete(correo);
    return res.status(400).json({ success: false, error: 'El código ha expirado. Solicita uno nuevo' });
  }

  // Verificar intentos
  if (datosAlmacenados.intentos >= 3) {
    codigosVerificacion.delete(correo);
    return res.status(400).json({ success: false, error: 'Demasiados intentos fallidos. Solicita un nuevo código' });
  }

  // Verificar código
  if (datosAlmacenados.codigo !== codigo) {
    datosAlmacenados.intentos++;
    codigosVerificacion.set(correo, datosAlmacenados);
    return res.status(400).json({ 
      success: false, 
      error: 'Código incorrecto',
      intentosRestantes: 3 - datosAlmacenados.intentos
    });
  }

  // Código correcto
  return res.json({ 
    success: true, 
    mensaje: 'Código verificado correctamente' 
  });
};

/**
 * Cambiar contraseña
 */
const cambiarContrasena = (req, res) => {
  const { correo, codigo, nuevaContrasena } = req.body;

  if (!correo || !codigo || !nuevaContrasena) {
    return res.status(400).json({ success: false, error: 'Todos los campos son requeridos' });
  }

  if (nuevaContrasena.length < 6) {
    return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const datosAlmacenados = codigosVerificacion.get(correo);

  if (!datosAlmacenados) {
    return res.status(404).json({ success: false, error: 'No se ha verificado el código' });
  }

  // Verificar código nuevamente
  if (datosAlmacenados.codigo !== codigo) {
    return res.status(400).json({ success: false, error: 'Código inválido' });
  }

  // Verificar expiración
  if (Date.now() > datosAlmacenados.expiracion) {
    codigosVerificacion.delete(correo);
    return res.status(400).json({ success: false, error: 'El código ha expirado' });
  }

  // Hashear la nueva contraseña
  bcrypt.hash(nuevaContrasena, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error al hashear contraseña:', err);
      return res.status(500).json({ success: false, error: 'Error al procesar la contraseña' });
    }

    // Actualizar contraseña en la base de datos
    const query = 'UPDATE Usuarios SET Contrasena = ? WHERE Correo = ?';
    
    db.query(query, [hashedPassword, correo], async (err, result) => {
      if (err) {
        console.error('Error al actualizar contraseña:', err);
        return res.status(500).json({ success: false, error: 'Error al actualizar la contraseña' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }

      // Eliminar código usado
      codigosVerificacion.delete(correo);

      // Obtener nombre del usuario para el correo
      db.query('SELECT CONCAT(Nombre, " ", ApellidoPaterno) as NombreCompleto FROM Usuarios WHERE Correo = ?', [correo], async (err, results) => {
        if (!err && results.length > 0) {
          // Enviar correo de confirmación
          await emailService.sendPasswordChangedEmail(correo, {
            customerName: results[0].NombreCompleto,
            date: new Date().toLocaleString('es-MX')
          });
        }
      });

      console.log(`✅ Contraseña actualizada para: ${correo}`);
      return res.json({ 
        success: true, 
        mensaje: 'Contraseña actualizada exitosamente' 
      });
    });
  });
};

module.exports = {
  solicitarRecuperacion,
  verificarCodigo,
  cambiarContrasena
};
