# 💰 SISTEMA DE COMISIONES PARA TRANSFERENCIAS
## Bank of Liberty

---

## 📋 RESUMEN DE CAMBIOS

### **Comisiones Implementadas (Proporcionales):**
- **$5 por cada $100** transferidos
- **$10 por cada $1,500** transferidos
- **El sistema aplica LA MENOR comisión** (más justo para el cliente)

### **Ejemplos de Cálculo:**
| Monto         | Comisión por $100 | Comisión por $1,500 | Comisión Aplicada |
|---------------|-------------------|---------------------|-------------------|
| $100          | $5                | $10                 | **$5**            |
| $500          | $25               | $10                 | **$10**           |
| $1,000        | $50               | $10                 | **$10**           |
| $1,500        | $75               | $10                 | **$10**           |
| $3,000        | $150              | $20                 | **$20**           |
| $5,000        | $250              | $40                 | **$40**           |

### **Funcionamiento:**
- Al usuario se le cobra: **Monto a transferir + Comisión**
- Al destinatario le llega: **Solo el monto (sin comisión)**
- La comisión se retiene en el banco

---

## 🗂️ ARCHIVOS MODIFICADOS

### **Base de Datos (SQL)**
1. ✅ `modificar_comisiones.sql` - Script completo con:
   - Alter table para agregar columnas
   - Stored procedure actualizado
   - Pruebas

### **Backend (Node.js)**
2. ✅ `backend/controller/transferenciasCtrl.js`
   - Función `calcularComision()`
   - Función `realizarTransferencia()` actualizada
   - Nueva función `getInfoComision()`

3. ✅ `backend/routes/transferencias.js`
   - Nueva ruta `GET /api/comision`

### **Frontend (Angular)**
4. ✅ `services/transferencias.service.ts`
   - Interface `TransferenciaResponse` actualizada
   - Nueva interface `InfoComision`
   - Método `getInfoComision()`

5. ✅ `app/transferencia-destino/transferencia-destino.ts`
   - Campos `comision`, `montoTotal`, `mostrarDetalleComision`
   - Método `onMontoChange()` para calcular comisión en tiempo real

6. ✅ `app/transferencia-destino/transferencia-destino.html`
   - Input con `(ngModelChange)="onMontoChange()"`
   - Sección de desglose de comisión

7. ✅ `app/transferencia-destino/transferencia-destino.css`
   - Estilos para `.comision-desglose`

8. ✅ `app/transferencia-exitosa/transferencia-exitosa.ts`
   - Interface actualizada con `comision` y `montoTotal`

9. ✅ `app/transferencia-exitosa/transferencia-exitosa.html`
   - Muestra monto, comisión y total cobrado

10. ✅ `app/transferencia-exitosa/transferencia-exitosa.css`
    - Estilos para resaltar total cobrado

---

## 🚀 PASOS PARA IMPLEMENTAR

### **1. Ejecutar el Script SQL** ⚠️ IMPORTANTE
```bash
mysql -u root -p Liberty < modificar_comisiones.sql
```

O ejecutar manualmente en MySQL Workbench/phpMyAdmin.

**El script hace:**
- ✅ Agrega columnas a tabla `Transferencia`
- ✅ Crea tabla `Configuracion_Comisiones`
- ✅ Actualiza el Stored Procedure
- ✅ Ejecuta pruebas automáticas

### **2. Reiniciar el Servidor Backend**
```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
cd TakIn/src/backend
node server.js
```

### **3. Recompilar Angular** (si es necesario)
```bash
# Si Angular no detecta los cambios:
cd TakIn
npm start
```

---

## 🧪 PRUEBAS

### **Prueba 1: Transferencia de $100**

**SQL:**
```sql
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    100.00,
    'Prueba $100',
    @resultado,
    @id,
    @comision,
    @total
);
SELECT @resultado, @comision, @total;
```

**Cálculo:**
- Comisión por $100: CEILING(100/100) * $5 = 1 * $5 = **$5**
- Comisión por $1,500: CEILING(100/1500) * $10 = 1 * $10 = **$10**
- Comisión aplicada: **$5** (la menor)

**Resultado esperado:**
- Comisión: $5.00
- Total cobrado: $105.00
- Monto que llega al destino: $100.00

---

### **Prueba 2: Transferencia de $500**

**SQL:**
```sql
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    500.00,
    'Prueba $500',
    @resultado,
    @id,
    @comision,
    @total
);
SELECT @resultado, @comision, @total;
```

**Cálculo:**
- Comisión por $100: CEILING(500/100) * $5 = 5 * $5 = **$25**
- Comisión por $1,500: CEILING(500/1500) * $10 = 1 * $10 = **$10**
- Comisión aplicada: **$10** (la menor)

**Resultado esperado:**
- Comisión: $10.00
- Total cobrado: $510.00
- Monto que llega al destino: $500.00

---

### **Prueba 3: Transferencia de $3,000**

**SQL:**
```sql
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    3000.00,
    'Prueba $3,000',
    @resultado,
    @id,
    @comision,
    @total
);
SELECT @resultado, @comision, @total;
```

**Cálculo:**
- Comisión por $100: CEILING(3000/100) * $5 = 30 * $5 = **$150**
- Comisión por $1,500: CEILING(3000/1500) * $10 = 2 * $10 = **$20**
- Comisión aplicada: **$20** (la menor)

**Resultado esperado:**
- Comisión: $20.00
- Total cobrado: $3,020.00
- Monto que llega al destino: $3,000.00

---

### **Prueba 3: Desde la Aplicación Web**

1. Login con un usuario
2. Ir a Transferencias
3. Seleccionar cuenta origen
4. Ingresar monto (ej: $800)
5. Ver que aparece el desglose:
   ```
   Monto a transferir: $800.00
   Comisión:          $5.00
   Total a cobrar:    $805.00
   ```
6. Completar transferencia
7. Verificar en pantalla de éxito

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

### **Tabla Transferencia (Actualizada)**
```sql
Transferencia
├── IDTransferencia (INT)
├── NumCuenta (VARCHAR)
├── Monto (DECIMAL) -- Monto que recibe el destinatario
├── CuentaDestino (VARCHAR)
├── CuentaRemitente (VARCHAR)
├── Motivo (VARCHAR)
├── FechaTransferencia (DATETIME)
├── MontoSinComision (DECIMAL) -- Monto original antes de comisión
├── Comision (DECIMAL) -- ⭐ NUEVO: Comisión cobrada
├── MontoTotal (DECIMAL) -- ⭐ NUEVO: Monto + Comisión
└── TipoComision (VARCHAR) -- ⭐ NUEVO: Descripción
```

### **Tabla Configuracion_Comisiones (Nueva)**
```sql
Configuracion_Comisiones
├── IDComision (INT)
├── MontoMinimo (DECIMAL)
├── MontoMaximo (DECIMAL)
├── Comision (DECIMAL)
├── Descripcion (VARCHAR)
├── Activo (BOOLEAN)
└── FechaCreacion (TIMESTAMP)
```

---

## 🔍 VERIFICACIÓN

### **Verificar columnas agregadas:**
```sql
DESCRIBE Transferencia;
```

### **Ver configuración de comisiones:**
```sql
SELECT * FROM Configuracion_Comisiones;
```

### **Ver historial con comisiones:**
```sql
SELECT 
    IDTransferencia,
    CuentaRemitente,
    CuentaDestino,
    MontoSinComision AS 'Monto',
    Comision,
    MontoTotal AS 'Total Cobrado',
    FechaTransferencia
FROM Transferencia
ORDER BY FechaTransferencia DESC;
```

---

## 🎯 FLUJO COMPLETO DEL USUARIO

1. **Usuario ingresa monto**: $1,000
2. **Sistema calcula comisión**:
   - Opción A: CEILING(1000/100) * $5 = 10 * $5 = $50
   - Opción B: CEILING(1000/1500) * $10 = 1 * $10 = $10
   - Comisión aplicada: **$10** (la menor)
   - Total a cobrar: $1,010
3. **Sistema valida**:
   - ¿Saldo suficiente? ($1,010)
   - ✅ Sí → Continuar
   - ❌ No → Error "Saldo insuficiente"
4. **Sistema ejecuta**:
   - Resta $1,010 de cuenta origen
   - Suma $1,000 a cuenta destino
   - Guarda comisión de $10 en el banco
5. **Usuario ve confirmación**:
   ```
   ✓ Transferencia exitosa
   Monto Transferido: $1,000.00
   Comisión:          $10.00
   Total Cobrado:     $1,010.00
   ```

---

## 🔐 SEGURIDAD

✅ Validación de saldo incluyendo comisión
✅ Transacción atómica (todo o nada)
✅ Comisión calculada en backend (no se puede manipular desde frontend)
✅ Registro completo en BD con desglose

---

## 📝 NOTAS IMPORTANTES

1. **Saldo insuficiente**: El sistema ahora valida que el usuario tenga saldo para cubrir **monto + comisión**

2. **Visualización**: El usuario ve el desglose ANTES de confirmar la transferencia

3. **Registro**: Todas las transferencias quedan registradas con:
   - Monto original
   - Comisión cobrada
   - Total cobrado
   - Tipo de comisión aplicada

4. **Flexibilidad**: Puedes cambiar las comisiones editando la tabla `Configuracion_Comisiones` o modificando la lógica en el SP

---

## 🛠️ CAMBIAR COMISIONES EN EL FUTURO

### **Opción 1: Modificar el Stored Procedure**
```sql
-- En el SP, cambiar estas líneas:
IF p_monto < 1500.00 THEN
    SET v_comision = 5.00;  -- ← Cambiar aquí
ELSE
    SET v_comision = 10.00; -- ← Cambiar aquí
END IF;
```

### **Opción 2: Usar tabla de configuración**
```sql
-- Actualizar comisiones en la tabla
UPDATE Configuracion_Comisiones 
SET Comision = 7.50 
WHERE MontoMinimo = 0.01;

UPDATE Configuracion_Comisiones 
SET Comision = 15.00 
WHERE MontoMinimo = 1500.00;
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Ejecutar `modificar_comisiones.sql` en MySQL
- [ ] Verificar que las columnas se agregaron (`DESCRIBE Transferencia`)
- [ ] Verificar que el SP se creó (`SHOW PROCEDURE STATUS WHERE Db = 'Liberty'`)
- [ ] Reiniciar servidor backend
- [ ] Probar transferencia < $1,500 (debe cobrar $5)
- [ ] Probar transferencia ≥ $1,500 (debe cobrar $10)
- [ ] Verificar en tabla Transferencia que se guarden las comisiones
- [ ] Probar desde la interfaz web
- [ ] Verificar que aparezca el desglose de comisión
- [ ] Verificar pantalla de éxito con detalles

---

## 🐛 TROUBLESHOOTING

### **Error: Column already exists**
```sql
-- Si ya ejecutaste el script antes, elimina las columnas:
ALTER TABLE Transferencia 
DROP COLUMN MontoSinComision,
DROP COLUMN Comision,
DROP COLUMN MontoTotal,
DROP COLUMN TipoComision;

-- Luego ejecuta de nuevo el script
```

### **Error: Procedure already exists**
```sql
-- El script ya incluye DROP PROCEDURE IF EXISTS
-- Si persiste el error, ejecuta manualmente:
DROP PROCEDURE IF EXISTS sp_realizar_transferencia;
```

### **No aparece el desglose de comisión**
- Verifica que el servidor backend esté reiniciado
- Abre la consola del navegador (F12) y busca errores
- Verifica que la ruta `/api/comision` funcione:
  ```
  http://penyrphf.icu:3000/api/comision?monto=1000
  ```

---

## 📧 SOPORTE

Si tienes dudas:
1. Revisa los logs del servidor Node.js
2. Revisa la consola del navegador (F12)
3. Ejecuta las pruebas SQL incluidas en el script
4. Verifica que todas las columnas existan en la tabla

---

**¡Sistema de Comisiones Implementado Exitosamente! 💰✅**
