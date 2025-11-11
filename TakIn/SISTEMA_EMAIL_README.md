# 📧 Sistema de Correos Electrónicos - Bank of Liberty

## 🎯 Resumen
Se ha implementado un sistema completo de notificaciones por correo electrónico para Bank of Liberty, basado en el sistema del Banco JETY.

## ✅ Funcionalidades Implementadas

### 1. Notificaciones de Transferencias
- ✉️ **Correo al remitente**: Se envía cuando se realiza una transferencia exitosa
- ✉️ **Correo al destinatario**: Se envía cuando se recibe una transferencia
- 📄 **PDF adjunto**: Comprobante profesional de la transferencia
- 📊 **Información incluida**: Folio, monto, comisión, cuentas, fecha, concepto

### 2. Plantillas Disponibles (listas para usar)
- `transferSent` - Transferencia enviada
- `transferReceived` - Transferencia recibida  
- `depositReceived` - Depósito recibido
- `passwordReset` - Recuperación de contraseña
- `passwordChanged` - Contraseña actualizada
- `accountCreated` - Cuenta creada
- `welcome` - Bienvenida al banco

### 3. Características Técnicas
- ✅ Reintentos automáticos (3 intentos con delay)
- ✅ Envío asíncrono (no bloquea la respuesta al cliente)
- ✅ PDFs generados en memoria con pdfkit
- ✅ Plantillas HTML profesionales con diseño responsivo
- ✅ Logs detallados de cada operación
- ✅ Manejo robusto de errores

## 🚀 Configuración Rápida

### Paso 1: Configurar Gmail App Password

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. **Seguridad** > **Verificación en dos pasos** (actívala si no lo está)
3. **Seguridad** > **Contraseñas de aplicaciones**
4. Selecciona **Correo** y tu dispositivo
5. Google generará un código de 16 caracteres como: `xxxx xxxx xxxx xxxx`
6. Copia ese código (sin espacios)

### Paso 2: Editar archivo `.env`

Abre el archivo `/TakIn/src/backend/.env` y configura:

```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=xxxxxxxxxxxxxxxx  # El código de 16 caracteres sin espacios
```

### Paso 3: Reiniciar el servidor

```bash
# Detén el servidor actual (Ctrl+C)
# Inicia nuevamente:
cd TakIn/src/backend
node server.js
```

Deberías ver:
```
✅ Servidor corriendo en http://localhost:3000
[EMAIL] Transporter de correo configurado
✅ [EMAIL] Conexión SMTP verificada correctamente
```

## 📁 Archivos Creados

```
TakIn/src/backend/
├── config/
│   └── email.config.js          # Configuración SMTP
├── services/
│   ├── emailService.js          # Servicio principal de envío
│   ├── emailTemplates.js        # Plantillas HTML
│   └── pdfService.js            # Generación de PDFs
├── .env                         # Variables de entorno (CONFIGURAR AQUÍ)
└── .env.example                 # Ejemplo de configuración
```

## 🧪 Pruebas

### Probar Transferencia con Correos

1. Asegúrate de que el servidor backend esté corriendo
2. Realiza una transferencia desde el frontend
3. Revisa los logs del servidor:
   ```
   📧 [EMAIL] Preparando correo de transferencia enviada...
   ✅ [EMAIL] Correo enviado exitosamente - ID: <...>
   ```
4. Revisa las bandejas de entrada de ambos usuarios (remitente y destinatario)

### Verificar Configuración SMTP

El servidor verifica la conexión automáticamente al iniciar. Si hay problemas:
- ❌ Verifica que EMAIL_USER y EMAIL_PASS estén correctos en `.env`
- ❌ Verifica que la verificación en dos pasos esté activa
- ❌ Verifica que hayas generado una App Password (no uses tu contraseña normal)

## 🔧 Integración Actual

### En `transferenciasCtrl.js`

Después de una transferencia exitosa:
```javascript
// 1. Se realiza la transferencia (SP)
// 2. Si es exitosa, se envían correos asíncronamente:
//    - Correo al remitente con PDF
//    - Correo al destinatario con PDF
// 3. Los correos NO bloquean la respuesta al cliente
// 4. Los errores de email se loguean pero no afectan la transferencia
```

## 📋 Próximos Pasos (Opcional)

Si quieres extender el sistema:

1. **Depósitos**: Ya está preparado `sendDepositReceivedEmail()`
2. **Recuperación de contraseña**: Implementar endpoint + `sendPasswordResetEmail()`
3. **Registro**: Agregar `sendWelcomeEmail()` y `sendAccountCreatedEmail()`
4. **Personalización**: Modificar plantillas en `emailTemplates.js`

## 🎨 Personalización de Plantillas

Para modificar el diseño de los correos, edita `services/emailTemplates.js`:
- Colores corporativos: `#2a6bb2` (azul Bank of Liberty)
- Logo: Agrega tu logo en el header
- Textos: Modifica mensajes según tu preferencia

## ⚠️ Notas Importantes

- **Producción**: Cambiar `rejectUnauthorized: false` a `true` en `email.config.js`
- **Seguridad**: NUNCA subir `.env` a Git (ya está en .gitignore)
- **Límites Gmail**: Gmail tiene límite de ~500 correos/día para cuentas gratuitas
- **Alternativas**: Puedes cambiar a Outlook, Yahoo, o servicios profesionales (SendGrid, AWS SES)

## 🐛 Solución de Problemas

### "Error: Invalid login"
- Verifica EMAIL_USER y EMAIL_PASS en `.env`
- Asegúrate de usar App Password, no tu contraseña normal

### "Connection timeout"
- Verifica tu conexión a internet
- Gmail puede estar bloqueado por firewall corporativo

### "No se envían correos"
- Revisa los logs del servidor
- Verifica que los usuarios tengan correos válidos en la BD
- Prueba la verificación: `emailService.verifyConnection()`

## 📞 Soporte

Para más ayuda, revisa:
- [Documentación Nodemailer](https://nodemailer.com/)
- [Google App Passwords](https://support.google.com/accounts/answer/185833)
- Logs del servidor para diagnóstico detallado

---
**Bank of Liberty** - Sistema de Notificaciones por Email  
Implementado: Octubre 2025
