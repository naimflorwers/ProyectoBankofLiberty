# 💰 Sistema de Comisiones ACUMULATIVO - Bank of Liberty

## 📋 Reglas del Sistema

### Comisión BASE (siempre se aplica)
- **$5 por cada $100** transferidos

### Comisiones EXTRAS (se suman a la base)
- **+$10 extra** si el monto es **≥ $1,500**
- **+$20 extra** si el monto es **≥ $3,000** (reemplaza el +$10)

---

## 🧮 Ejemplos de Cálculo

### Ejemplo 1: $100
```
Comisión base: (100 / 100) × $5 = $5.00
Comisión extra: Ninguna (monto < $1,500)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $5.00
TOTAL A COBRAR: $100.00 + $5.00 = $105.00
```

### Ejemplo 2: $200
```
Comisión base: (200 / 100) × $5 = $10.00
Comisión extra: Ninguna (monto < $1,500)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $10.00
TOTAL A COBRAR: $200.00 + $10.00 = $210.00
```

### Ejemplo 3: $500
```
Comisión base: (500 / 100) × $5 = $25.00
Comisión extra: Ninguna (monto < $1,500)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $25.00
TOTAL A COBRAR: $500.00 + $25.00 = $525.00
```

### Ejemplo 4: $1,000
```
Comisión base: (1000 / 100) × $5 = $50.00
Comisión extra: Ninguna (monto < $1,500)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $50.00
TOTAL A COBRAR: $1,000.00 + $50.00 = $1,050.00
```

### Ejemplo 5: $1,500 ⭐
```
Comisión base: (1500 / 100) × $5 = $75.00
Comisión extra: +$10.00 (monto ≥ $1,500)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $75.00 + $10.00 = $85.00
TOTAL A COBRAR: $1,500.00 + $85.00 = $1,585.00
```

### Ejemplo 6: $2,000
```
Comisión base: (2000 / 100) × $5 = $100.00
Comisión extra: +$10.00 (monto ≥ $1,500)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $100.00 + $10.00 = $110.00
TOTAL A COBRAR: $2,000.00 + $110.00 = $2,110.00
```

### Ejemplo 7: $3,000 ⭐⭐
```
Comisión base: (3000 / 100) × $5 = $150.00
Comisión extra: +$20.00 (monto ≥ $3,000) [NO se suma el +$10]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $150.00 + $20.00 = $170.00
TOTAL A COBRAR: $3,000.00 + $170.00 = $3,170.00
```

### Ejemplo 8: $5,000
```
Comisión base: (5000 / 100) × $5 = $250.00
Comisión extra: +$20.00 (monto ≥ $3,000)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $250.00 + $20.00 = $270.00
TOTAL A COBRAR: $5,000.00 + $270.00 = $5,270.00
```

### Ejemplo 9: $10,000
```
Comisión base: (10000 / 100) × $5 = $500.00
Comisión extra: +$20.00 (monto ≥ $3,000)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMISIÓN TOTAL: $500.00 + $20.00 = $520.00
TOTAL A COBRAR: $10,000.00 + $520.00 = $10,520.00
```

---

## 📊 Tabla de Comisiones Rápida

| Monto        | Base    | Extra  | **Total Comisión** | Total a Cobrar |
|--------------|---------|--------|-------------------|----------------|
| $100         | $5      | -      | **$5**            | $105           |
| $200         | $10     | -      | **$10**           | $210           |
| $500         | $25     | -      | **$25**           | $525           |
| $1,000       | $50     | -      | **$50**           | $1,050         |
| **$1,500**   | $75     | +$10   | **$85**           | $1,585         |
| $2,000       | $100    | +$10   | **$110**          | $2,110         |
| **$3,000**   | $150    | +$20   | **$170**          | $3,170         |
| $5,000       | $250    | +$20   | **$270**          | $5,270         |
| $10,000      | $500    | +$20   | **$520**          | $10,520        |

---

## 🔍 Implementación

### Stored Procedure (MySQL)
```sql
-- Comisión base: $5 por cada $100
SET v_comision = ROUND((p_monto / 100) * 5, 2);

-- Agregar comisión extra según el monto
IF p_monto >= 3000.00 THEN
    SET v_comision = v_comision + 20.00;
    SET v_tipo_comision = 'Comisión $5 por cada $100 + $20 extra (≥$3,000)';
ELSEIF p_monto >= 1500.00 THEN
    SET v_comision = v_comision + 10.00;
    SET v_tipo_comision = 'Comisión $5 por cada $100 + $10 extra (≥$1,500)';
ELSE
    SET v_tipo_comision = 'Comisión $5 por cada $100';
END IF;
```

### Backend (JavaScript)
```javascript
const calcularComision = (monto) => {
  // Comisión base: $5 por cada $100
  let comision = Math.round((monto / 100) * 5 * 100) / 100;
  let descripcion = 'Comisión $5 por cada $100';
  
  // Agregar comisión extra
  if (monto >= 3000.00) {
    comision = comision + 20.00;
    descripcion = 'Comisión $5 por cada $100 + $20 extra (≥$3,000)';
  } else if (monto >= 1500.00) {
    comision = comision + 10.00;
    descripcion = 'Comisión $5 por cada $100 + $10 extra (≥$1,500)';
  }
  
  return { comision, descripcion };
};
```

---

## ✅ Validaciones

1. ✅ **La comisión base SIEMPRE se calcula** (sin importar el monto)
2. ✅ **Las comisiones extras NO se acumulan entre sí** (solo una se aplica)
3. ✅ **Si monto ≥ $3,000**: Se usa +$20 (NO se suma +$10)
4. ✅ **Si $1,500 ≤ monto < $3,000**: Se usa +$10
5. ✅ **Si monto < $1,500**: Solo comisión base

---

## 🎯 Casos de Prueba

### Test 1: Transferir $100
- ✅ Comisión esperada: $5.00
- ✅ Total esperado: $105.00

### Test 2: Transferir $1,500
- ✅ Comisión esperada: $85.00 ($75 + $10)
- ✅ Total esperado: $1,585.00

### Test 3: Transferir $3,000
- ✅ Comisión esperada: $170.00 ($150 + $20)
- ✅ Total esperado: $3,170.00

### Test 4: Transferir $200
- ✅ Comisión esperada: $10.00
- ✅ Total esperado: $210.00

---

**Última actualización:** 2025-10-20  
**Versión:** 2.0 - Sistema Acumulativo
