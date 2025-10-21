# Sistema de Transferencias - Bank of Liberty

## 📋 Descripción
Sistema completo de transferencias bancarias usando un Stored Procedure de MySQL para garantizar la integridad transaccional.

## 🗂️ Archivos Creados/Modificados

### Backend (Node.js + Express)
1. **`backend/controller/transferenciasCtrl.js`** - Controlador con las funciones:
   - `getCuentasCliente()` - Obtener cuentas de un cliente
   - `realizarTransferencia()` - Ejecutar el SP de transferencia
   - `getHistorialTransferencias()` - Historial de transferencias
   - `getDetalleTransferencia()` - Detalle de una transferencia específica

2. **`backend/routes/transferencias.js`** - Rutas API:
   - `GET /api/cuentas/:idUsuario` - Obtener cuentas
   - `POST /api/transferencia` - Realizar transferencia
   - `GET /api/historial/:idUsuario` - Historial
   - `GET /api/transferencia/:idTransferencia` - Detalle

3. **`backend/server.js`** - Actualizado para incluir las rutas de transferencias

### Frontend (Angular)
4. **`services/transferencias.service.ts`** - Servicio Angular con interfaces y métodos HTTP

5. **`app/transferencia/transferencia.ts`** - Componente para seleccionar cuenta origen
   - Carga cuentas del usuario
   - Permite seleccionar cuenta
   - Guarda selección en sessionStorage

6. **`app/transferencia/transferencia.html`** - Vista actualizada con:
   - Lista dinámica de cuentas
   - Selección visual de cuenta
   - Validaciones

7. **`app/transferencia/transferencia.css`** - Estilos para selección de cuenta

8. **`app/transferencia-destino/transferencia-destino.ts`** - Componente para completar transferencia
   - Formulario de destino y monto
   - Validaciones de saldo
   - Llamada al servicio de transferencia

9. **`app/transferencia-destino/transferencia-destino.html`** - Formulario completo
   - Input de cuenta destino
   - Input de monto
   - Input de concepto (opcional)

10. **`app/transferencia-destino/transferencia-destino.css`** - Estilos actualizados

11. **`app/transferencia-exitosa/transferencia-exitosa.ts`** - Pantalla de confirmación
    - Muestra datos de la transferencia
    - Formatea fecha y hora
    - Muestra folio

12. **`app/transferencia-exitosa/transferencia-exitosa.html`** - Vista de éxito actualizada

### Base de Datos
13. **`sp_transferencias.sql`** - Script completo con:
    - Stored Procedure `sp_realizar_transferencia`
    - Datos de prueba
    - Casos de prueba

## 🚀 Instalación y Configuración

### 1. Base de Datos
```bash
# Ejecutar el script SQL
mysql -u root -p Liberty < src/sp_transferencias.sql
```

O ejecutar manualmente en MySQL Workbench/phpMyAdmin.

### 2. Backend
```bash
# Instalar dependencias si no están instaladas
cd TakIn/src/backend
npm install express cors mysql2

# El servidor ya está configurado, solo reinícialo si está corriendo
```

### 3. Frontend
```bash
# Las dependencias de Angular ya deben estar instaladas
cd TakIn
npm install

# Compilar y ejecutar
npm start
```

## 🎯 Flujo de Uso

### Para el Usuario:
1. **Seleccionar Cuenta Origen** (`/transferencia`)
   - Ve lista de sus cuentas con saldos
   - Selecciona la cuenta desde la que transferirá
   - Click en "CONTINUAR"

2. **Ingresar Datos de Transferencia** (`/transferencia-destino`)
   - Ve su cuenta seleccionada y saldo
   - Ingresa número de cuenta destino
   - Ingresa monto (validado contra saldo)
   - Opcionalmente ingresa concepto
   - Click en "TRANSFERIR"

3. **Confirmación** (`/transferencia-exitosa`)
   - Ve detalles de la transferencia exitosa
   - Monto, cuenta destino, fecha/hora, folio
   - Click en "ACEPTAR" para volver al menú

## 🔧 API Endpoints

### Obtener Cuentas
```http
GET http://localhost:3000/api/cuentas/1
```
**Response:**
```json
[
  {
    "Numcuenta": "1234567890",
    "Banco": "Liberty Bank",
    "Dinero": 15000.00,
    "Clabe": "012345678901234567",
    "NumTelefono": "5512345678"
  }
]
```

### Realizar Transferencia
```http
POST http://localhost:3000/api/transferencia
Content-Type: application/json

{
  "cuentaRemitente": "1234567890",
  "cuentaDestino": "0987654321",
  "monto": 2500.00,
  "motivo": "Pago de servicios"
}
```

**Response (Éxito):**
```json
{
  "success": true,
  "mensaje": "EXITO: Transferencia realizada. ID: 1",
  "idTransferencia": 1,
  "data": {
    "cuentaRemitente": "1234567890",
    "cuentaDestino": "0987654321",
    "monto": 2500.00,
    "motivo": "Pago de servicios",
    "fecha": "2025-10-20T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "ERROR: Saldo insuficiente"
}
```

### Historial de Transferencias
```http
GET http://localhost:3000/api/historial/1
```

### Detalle de Transferencia
```http
GET http://localhost:3000/api/transferencia/1
```

## ✅ Validaciones del Stored Procedure

1. ✅ Monto mayor a 0
2. ✅ Cuentas diferentes (no a la misma cuenta)
3. ✅ Cuenta remitente existe
4. ✅ Cuenta destino existe
5. ✅ Cuenta remitente no está cerrada
6. ✅ Cuenta destino no está cerrada
7. ✅ Saldo suficiente
8. ✅ Transacción atómica (COMMIT/ROLLBACK)
9. ✅ Bloqueo de registros (FOR UPDATE) para evitar race conditions

## 🧪 Pruebas

### Desde SQL:
```sql
-- Transferencia exitosa
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    2500.00,
    'Pago de préstamo',
    @resultado,
    @id
);
SELECT @resultado, @id;

-- Ver transferencia registrada
SELECT * FROM Transferencia WHERE IDTransferencia = @id;

-- Ver saldos
SELECT Numcuenta, Dinero FROM Cuentas WHERE Numcuenta IN ('1234567890', '0987654321');
```

## 📝 Notas Importantes

1. **sessionStorage**: El flujo usa `sessionStorage` para pasar datos entre componentes
2. **Autenticación**: Actualmente usa `idUsuario = 1` de prueba. Debes integrar con tu servicio de autenticación
3. **Números de cuenta**: La tabla `Cuentas` tiene `Numcuenta VARCHAR(10)`. Si necesitas CLABEs de 18 dígitos, ejecuta:
   ```sql
   ALTER TABLE Cuentas MODIFY COLUMN Numcuenta VARCHAR(18);
   ```

## 🔐 Seguridad

- ✅ Stored Procedure previene inyección SQL
- ✅ Validaciones en backend y frontend
- ✅ Transacciones ACID garantizadas
- ✅ Manejo de errores robusto
- ⚠️ TODO: Agregar autenticación JWT
- ⚠️ TODO: Validar que el usuario es dueño de la cuenta remitente

## 🐛 Troubleshooting

### El SP no guarda en la tabla Transferencia
- Verifica que no haya ROLLBACK ejecutándose
- Revisa `@resultado` para ver el mensaje de error
- Verifica que las cuentas existan y tengan saldo

### Error de conexión al backend
- Verifica que el servidor esté corriendo en puerto 3000
- Revisa la configuración de CORS
- Verifica credenciales de MySQL en `db.js`

### Componentes no muestran datos
- Verifica que el servicio esté importado correctamente
- Revisa la consola del navegador para errores
- Verifica que HttpClient esté configurado en los providers

## 👨‍💻 Desarrollo

Para agregar nuevas funcionalidades:
1. Agrega la ruta en `backend/routes/transferencias.js`
2. Agrega el controlador en `backend/controller/transferenciasCtrl.js`
3. Agrega el método en `services/transferencias.service.ts`
4. Usa el método en tus componentes

## 📧 Soporte

Para dudas o problemas, revisa:
- Los logs del servidor Node.js
- La consola del navegador (F12)
- Los errores en MySQL con `SHOW WARNINGS;`
