# 📊 Sistema de Estado de Cuenta - Bank of Liberty

## ✅ Implementación Completa

Sistema completo de **Estado de Cuenta** bancario con todas las funcionalidades profesionales que un banco requiere.

---

## 🎯 Características Principales

### 1. **Visualización de Movimientos**
- ✅ Lista completa de transacciones en el periodo seleccionado
- ✅ Transferencias (enviadas y recibidas)
- ✅ Depósitos en sucursal
- ✅ Retiros en sucursal
- ✅ Préstamos otorgados
- ✅ Saldo después de cada movimiento

### 2. **Filtros Avanzados**
- ✅ **Por Fechas:** Seleccionar rango específico (inicio y fin)
- ✅ **Por Tipo:** Todos, Ingresos, Egresos
- ✅ **Periodo por defecto:** Último mes automáticamente

### 3. **Resumen Financiero**
- ✅ **Saldo Inicial:** Al inicio del periodo
- ✅ **Total Ingresos:** Suma de todos los ingresos
- ✅ **Total Egresos:** Suma de todos los egresos
- ✅ **Saldo Final:** Saldo actual de la cuenta

### 4. **Información de Cuenta**
- ✅ Nombre del titular
- ✅ Número de cuenta
- ✅ Tipo de cuenta (Ahorro/Corriente)
- ✅ Periodo consultado

### 5. **Generación de PDF**
- ✅ Descarga del estado de cuenta completo
- ✅ Formato profesional estilo bancario
- ✅ Encabezado con logo del banco
- ✅ Tabla detallada de movimientos
- ✅ Resumen de saldos
- ✅ Pie de página con información de contacto

---

## 📁 Archivos Creados

### Frontend (Angular)
```
src/app/estado-cuenta/
├── estado-cuenta.ts          # Componente principal con lógica
├── estado-cuenta.html        # Template con tabla y filtros
├── estado-cuenta.css         # Estilos responsive
└── estado-cuenta.spec.ts     # Tests unitarios
```

### Backend (Node.js)
```
src/backend/
├── controller/
│   ├── estadoCuentaCtrl.js      # Lógica para obtener datos
│   └── estadoCuentaPDFCtrl.js   # Generación de PDF
└── routes/
    └── estadoCuenta.js          # Endpoints API
```

### Rutas
- **Modificado:** `app.routes.ts` - Ruta agregada con guard de cliente
- **Modificado:** `server.js` - Endpoints registrados
- **Modificado:** `menu-cliente.html` - Botón agregado al menú

---

## 🌐 Endpoints API

### 1. Obtener Estado de Cuenta
```
POST /api/estado-cuenta
```

**Request:**
```json
{
  "idUsuario": 1,
  "fechaInicio": "2024-10-01",
  "fechaFin": "2024-10-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "inicio": "2024-10-01",
      "fin": "2024-10-31"
    },
    "cuenta": {
      "numero": "1234567890",
      "titular": "Juan Pérez",
      "tipo": "Ahorro"
    },
    "saldos": {
      "inicial": 10000.00,
      "ingresos": 5000.00,
      "egresos": 2000.00,
      "final": 13000.00
    },
    "movimientos": [
      {
        "fecha": "2024-10-15",
        "tipo": "Transferencia Recibida",
        "descripcion": "Recibido de María López",
        "referencia": "TRF-123456",
        "monto": 1500.00,
        "saldo": 11500.00
      }
    ]
  }
}
```

---

### 2. Generar PDF
```
POST /api/estado-cuenta/pdf
```

**Request:** (mismo que anterior)

**Response:** Archivo PDF descargable

---

## 🎨 Interfaz de Usuario

### Secciones de la Pantalla:

1. **Header**
   - Logo del banco
   - Título "Estado de Cuenta"
   - Botón "Volver"

2. **Filtros**
   - Fecha Inicio (input type="date")
   - Fecha Fin (input type="date")
   - Tipo de Movimiento (select)
   - Botón "Buscar"
   - Botón "Descargar PDF"

3. **Información de Cuenta**
   - Datos del titular
   - Número y tipo de cuenta
   - Periodo consultado

4. **Resumen de Saldos (4 Cards)**
   - Saldo Inicial
   - Total Ingresos (verde)
   - Total Egresos (rojo)
   - Saldo Final (azul destacado)

5. **Tabla de Movimientos**
   - Columnas: Fecha | Tipo | Descripción | Referencia | Monto | Saldo
   - Badge con color según tipo
   - Números formateados con moneda mexicana
   - Scroll horizontal en móviles

---

## 💾 Consultas SQL

El sistema realiza consultas complejas que incluyen:

1. **UNION de múltiples tablas:**
   - Transferencias (enviadas y recibidas)
   - Depósitos
   - Retiros
   - Préstamos

2. **Cálculo de saldo inicial:**
   - Resta movimientos del periodo al saldo actual
   - Maneja casos sin movimientos (IFNULL)

3. **Ordenamiento cronológico:**
   - Todos los movimientos ordenados por fecha
   - Cálculo progresivo de saldos

---

## 📄 Formato del PDF

### Estructura:
```
┌─────────────────────────────────────────┐
│         BANK OF LIBERTY                 │
│       ESTADO DE CUENTA                  │
├─────────────────────────────────────────┤
│ Titular: Juan Pérez                     │
│ Número de Cuenta: 1234567890            │
│ Tipo: Ahorro                            │
│ Periodo: 01/10/2024 - 31/10/2024       │
├─────────────────────────────────────────┤
│        RESUMEN DE SALDOS                │
│ Saldo Inicial:      $10,000.00         │
│ Total Ingresos:   + $ 5,000.00         │
│ Total Egresos:    - $ 2,000.00         │
│ Saldo Final:        $13,000.00         │
├─────────────────────────────────────────┤
│     DETALLE DE MOVIMIENTOS              │
│ [Tabla con todos los movimientos]       │
└─────────────────────────────────────────┘
```

---

## 🎯 Casos de Uso

### **Cliente:**
1. Ingresa al menú de cliente
2. Click en "Estado de Cuenta"
3. Selecciona periodo (o usa el último mes por defecto)
4. Click en "Buscar"
5. Visualiza resumen y movimientos
6. Aplica filtros si desea (ingresos/egresos)
7. Descarga PDF si necesita

### **PDF Generado:**
- Se descarga automáticamente con nombre: `estado-cuenta-YYYY-MM-DD-YYYY-MM-DD.pdf`
- Formato profesional listo para imprimir
- Válido como comprobante bancario

---

## 🔒 Seguridad

- ✅ **Autenticación requerida:** Guard de cliente
- ✅ **Usuario en localStorage:** Verificación en ngOnInit
- ✅ **IdUsuario validado:** Solo accede a sus propios datos
- ✅ **Datos sensibles protegidos:** No se exponen a otros usuarios

---

## 📱 Responsive Design

### Desktop (> 768px):
- Grid de 4 columnas para cards de saldos
- Tabla completa con todas las columnas
- Filtros en una sola línea

### Tablet (768px):
- Grid de 2 columnas para saldos
- Tabla con scroll horizontal
- Filtros apilados

### Mobile (< 480px):
- Cards de saldos en 1 columna
- Tabla compacta con scroll
- Botones de tamaño completo

---

## 🚀 Uso

### Iniciar Backend:
```bash
cd src/backend
node server.js
```

### Iniciar Frontend:
```bash
ng serve
```

### Acceder:
```
http://localhost:4200/estado-cuenta
```

---

## 🧪 Testing

### Probar Flujo Completo:

1. **Login como cliente**
2. **Ir a Estado de Cuenta**
3. **Verificar datos:**
   - Nombre correcto
   - Número de cuenta
   - Saldo final coincide con DB
4. **Cambiar fechas y buscar**
5. **Filtrar por ingresos/egresos**
6. **Descargar PDF**
7. **Verificar PDF:**
   - Datos correctos
   - Tabla completa
   - Formato profesional

---

## 📊 Datos que se Muestran

| Tipo de Movimiento | Descripción | Monto |
|-------------------|-------------|-------|
| Transferencia Enviada | Envío a [Nombre Destinatario] | Negativo (-) |
| Transferencia Recibida | Recibido de [Nombre Origen] | Positivo (+) |
| Depósito | Depósito en [Sucursal] | Positivo (+) |
| Retiro | Retiro en [Sucursal] | Negativo (-) |
| Préstamo | Préstamo - [Tipo] | Positivo (+) |

---

## 🎨 Colores y Estilos

- **Azul (#2a6bb2):** Banco, saldo final, títulos
- **Verde (#27ae60):** Ingresos
- **Rojo (#e74c3c):** Egresos
- **Gris (#95a5a6):** Saldo inicial
- **Fondo:** #f5f7fa (gris claro)

---

## ✨ Mejoras Futuras (Opcional)

- [ ] Exportar a Excel
- [ ] Gráficas de ingresos/egresos
- [ ] Comparación de periodos
- [ ] Estados de cuenta históricos guardados
- [ ] Envío automático por email mensual
- [ ] Categorización de gastos
- [ ] Búsqueda por descripción/referencia

---

**Bank of Liberty** - Sistema de Estado de Cuenta Profesional  
Implementado: Noviembre 2025 ✅
