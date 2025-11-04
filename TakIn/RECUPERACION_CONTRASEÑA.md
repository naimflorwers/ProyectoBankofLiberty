# 🔐 Sistema de Recuperación de Contraseña - Bank of Liberty

## ✅ Implementación Completa

Se ha implementado un sistema seguro de recuperación de contraseña con verificación por código de email.

---

## 📋 Flujo del Sistema

### **Paso 1: Solicitar Código**
1. Usuario ingresa su correo electrónico
2. Sistema verifica que el correo existe en la BD
3. Genera código aleatorio de 6 dígitos
4. Envía correo con el código (válido por 10 minutos)
5. Usuario pasa al Paso 2

### **Paso 2: Verificar Código**
1. Usuario ingresa el código de 6 dígitos recibido por email
2. Sistema valida:
   - Código correcto
   - No expirado (10 minutos)
   - Máximo 3 intentos
3. Si es correcto, pasa al Paso 3

### **Paso 3: Nueva Contraseña**
1. Usuario ingresa y confirma nueva contraseña
2. Sistema valida:
   - Mínimo 6 caracteres
   - Contraseñas coinciden
   - Código sigue siendo válido
3. Actualiza contraseña en BD (hasheada con bcrypt)
4. Envía correo de confirmación
5. Redirige al login

---

## 🎨 Características de la UI

- ✅ **Indicador de pasos visual** (1→2→3)
- ✅ **Validación en tiempo real**
- ✅ **Mensajes de error/éxito claros**
- ✅ **Botón "Volver" entre pasos**
- ✅ **Botón "Reenviar código"**
- ✅ **Toggle de visibilidad de contraseña**
- ✅ **Spinners de carga**
- ✅ **Diseño responsivo**
- ✅ **Estilo coherente con Bank of Liberty**

---

## 🔒 Seguridad Implementada

1. **Código de 6 dígitos aleatorio** (Math.random)
2. **Expiración de 10 minutos**
3. **Máximo 3 intentos** de verificación
4. **Contraseña hasheada** con bcrypt (salt rounds: 10)
5. **Validación en backend y frontend**
6. **Limpieza de códigos usados/expirados**

---

## 📁 Archivos Creados

### Frontend (Angular)
```
src/app/recuperar-contrasena/
├── recuperar-contrasena.ts        # Componente principal
├── recuperar-contrasena.html      # Template con 3 pasos
└── recuperar-contrasena.css       # Estilos responsive
```

### Backend (Node.js)
```
src/backend/
├── controller/
│   └── recuperacionCtrl.js        # Lógica de recuperación
└── routes/
    └── recuperacion.js            # Endpoints API
```

### Archivos Modificados
- `app.routes.ts` - Agregada ruta /recuperar-contrasena
- `login.ts` - Redirige a recuperación en vez de alert
- `server.js` - Rutas de recuperación registradas
- `emailTemplates.js` - Template actualizado con código
- `emailService.js` - Función actualizada para enviar código

---

## 🌐 Endpoints API

### POST `/api/solicitar-recuperacion`
**Request:**
```json
{
  "correo": "usuario@example.com"
}
```

**Response (éxito):**
```json
{
  "success": true,
  "mensaje": "Se ha enviado un código de verificación a tu correo"
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "El correo no está registrado"
}
```

---

### POST `/api/verificar-codigo`
**Request:**
```json
{
  "correo": "usuario@example.com",
  "codigo": "123456"
}
```

**Response (éxito):**
```json
{
  "success": true,
  "mensaje": "Código verificado correctamente"
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "Código incorrecto",
  "intentosRestantes": 2
}
```

---

### POST `/api/cambiar-contrasena`
**Request:**
```json
{
  "correo": "usuario@example.com",
  "codigo": "123456",
  "nuevaContrasena": "nuevaPassword123"
}
```

**Response (éxito):**
```json
{
  "success": true,
  "mensaje": "Contraseña actualizada exitosamente"
}
```

---

## 📧 Correos Enviados

### 1. Correo de Código de Recuperación
- **Asunto:** "Código de Recuperación - Bank of Liberty"
- **Contenido:**
  - Saludo personalizado
  - Código de 6 dígitos en grande
  - Tiempo de expiración (10 minutos)
  - Advertencia de seguridad

### 2. Correo de Confirmación
- **Asunto:** "Contraseña Actualizada - Bank of Liberty"
- **Contenido:**
  - Confirmación de cambio
  - Fecha y hora del cambio
  - Enlace a soporte si no fue el usuario

---

## 🧪 Pruebas

### Probar el Flujo Completo

1. **Ve al login:** http://localhost:4200/login
2. **Haz clic en:** "¿Olvidaste tu contraseña?"
3. **Ingresa tu correo** (debe estar registrado en la BD)
4. **Revisa tu email** y copia el código de 6 dígitos
5. **Ingresa el código** en el Paso 2
6. **Crea una nueva contraseña** en el Paso 3
7. **Prueba el login** con la nueva contraseña

### Casos de Prueba

✅ **Caso 1:** Correo no registrado
- Ingresa email inexistente
- Debe mostrar: "El correo no está registrado"

✅ **Caso 2:** Código incorrecto
- Ingresa código equivocado
- Debe mostrar intentos restantes (máx 3)

✅ **Caso 3:** Código expirado
- Espera más de 10 minutos
- Debe mostrar: "El código ha expirado"

✅ **Caso 4:** Contraseñas no coinciden
- Ingresa contraseñas diferentes
- Debe validar antes de enviar

✅ **Caso 5:** Flujo exitoso
- Todo correcto → Redirige a login
- Email de confirmación enviado

---

## 🔧 Configuración

El sistema usa las mismas credenciales de email configuradas en `.env`:

```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
```

No requiere configuración adicional.

---

## 💾 Almacenamiento Temporal

Los códigos se almacenan en memoria (Map) con:
- **Código:** 6 dígitos
- **Expiración:** Timestamp
- **Intentos:** Contador (máx 3)

**Nota:** En producción, considerar usar:
- Redis (recomendado)
- Tabla en MySQL con limpieza automática
- JWT con expiración

---

## 🎯 Mejoras Futuras (Opcional)

1. **Rate limiting:** Limitar solicitudes por IP
2. **Captcha:** Prevenir bots
3. **Logs de auditoría:** Registrar intentos de recuperación
4. **SMS como alternativa:** Además de email
5. **Historial de contraseñas:** No permitir reusar últimas X contraseñas

---

## 🐛 Solución de Problemas

### No llega el correo
- Verifica configuración de email en `.env`
- Revisa carpeta de spam
- Verifica logs del servidor: `📧 [EMAIL] Código de verificación: XXXXXX`

### "Código incorrecto"
- Verifica que el código sea exactamente 6 dígitos
- Verifica que no hayan pasado más de 10 minutos
- Máximo 3 intentos, después solicita nuevo código

### Error al cambiar contraseña
- Verifica que la BD esté corriendo
- Verifica que el campo `Contrasena` exista en tabla `Usuarios`
- Revisa logs del servidor para más detalles

---

**Bank of Liberty** - Sistema de Recuperación de Contraseña  
Implementado: Noviembre 2025 ✅
