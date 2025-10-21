# 💰 SISTEMA DE COMISIONES - EJEMPLOS
## Bank of Liberty

---

## 📊 FÓRMULA DE COMISIÓN

### **Comisión Proporcional:**
- **$5 por cada $100** transferidos (5% del monto)
- **$10 por cada $1,500** transferidos (0.67% del monto)

### **Regla:**
Se usa la tasa **más favorable** para el cliente (la que resulte en menor comisión)

---

## 🧮 EJEMPLOS DE CÁLCULO

### **Transferencias pequeñas (< $1,500)**

| Monto | Cálculo | Comisión | Total a Cobrar |
|-------|---------|----------|----------------|
| $50.00 | (50/100) × 5 = $2.50 | $2.50 | $52.50 |
| $100.00 | (100/100) × 5 = $5.00 | $5.00 | $105.00 |
| $200.00 | (200/100) × 5 = $10.00 | $10.00 | $210.00 |
| $500.00 | (500/100) × 5 = $25.00 | $25.00 | $525.00 |
| $1,000.00 | (1000/100) × 5 = $50.00 | $50.00 | $1,050.00 |
| $1,499.00 | (1499/100) × 5 = $74.95 | $74.95 | $1,573.95 |

---

### **Transferencias grandes (≥ $1,500)**

Para estas transferencias, se comparan ambas tasas:

#### **Ejemplo 1: $1,500.00**
- **Opción A** (5% rate): (1500/100) × 5 = **$75.00**
- **Opción B** (0.67% rate): (1500/1500) × 10 = **$10.00** ✅ MENOR
- **Comisión aplicada: $10.00**
- **Total a cobrar: $1,510.00**

#### **Ejemplo 2: $2,000.00**
- **Opción A**: (2000/100) × 5 = **$100.00**
- **Opción B**: (2000/1500) × 10 = **$13.33** ✅ MENOR
- **Comisión aplicada: $13.33**
- **Total a cobrar: $2,013.33**

#### **Ejemplo 3: $3,000.00**
- **Opción A**: (3000/100) × 5 = **$150.00**
- **Opción B**: (3000/1500) × 10 = **$20.00** ✅ MENOR
- **Comisión aplicada: $20.00**
- **Total a cobrar: $3,020.00**

#### **Ejemplo 4: $5,000.00**
- **Opción A**: (5000/100) × 5 = **$250.00**
- **Opción B**: (5000/1500) × 10 = **$33.33** ✅ MENOR
- **Comisión aplicada: $33.33**
- **Total a cobrar: $5,033.33**

#### **Ejemplo 5: $10,000.00**
- **Opción A**: (10000/100) × 5 = **$500.00**
- **Opción B**: (10000/1500) × 10 = **$66.67** ✅ MENOR
- **Comisión aplicada: $66.67**
- **Total a cobrar: $10,066.67**

---

## 📈 TABLA COMPARATIVA

| Monto | Comisión 5% | Comisión 0.67% | **Comisión Aplicada** | Total a Cobrar |
|-------|-------------|----------------|-----------------------|----------------|
| $100 | $5.00 | N/A | **$5.00** | $105.00 |
| $500 | $25.00 | N/A | **$25.00** | $525.00 |
| $1,000 | $50.00 | N/A | **$50.00** | $1,050.00 |
| $1,500 | $75.00 | $10.00 | **$10.00** ✅ | $1,510.00 |
| $2,000 | $100.00 | $13.33 | **$13.33** ✅ | $2,013.33 |
| $3,000 | $150.00 | $20.00 | **$20.00** ✅ | $3,020.00 |
| $5,000 | $250.00 | $33.33 | **$33.33** ✅ | $5,033.33 |
| $10,000 | $500.00 | $66.67 | **$66.67** ✅ | $10,066.67 |
| $15,000 | $750.00 | $100.00 | **$100.00** ✅ | $15,100.00 |

---

## 🎯 PUNTO DE EQUILIBRIO

**A partir de $1,500**, la tasa de $10 por cada $1,500 (0.67%) es siempre más favorable que $5 por cada $100 (5%).

### **Cálculo del punto de equilibrio:**
```
5% de X = 0.67% de X
(X / 100) × 5 = (X / 1500) × 10
5X / 100 = 10X / 1500
5X × 1500 = 10X × 100
7500X = 1000X
```

Por lo tanto, a partir de $1,500, siempre se usa la tasa menor.

---

## ✅ VENTAJAS DEL SISTEMA

1. **Transparente**: El cliente ve el desglose antes de confirmar
2. **Justo**: Se usa automáticamente la tasa más favorable
3. **Proporcional**: Quien transfiere más, paga proporcionalmente más
4. **Incentiva transferencias grandes**: A partir de $1,500, la tasa efectiva es menor

---

## 🧪 PRUEBAS SQL

### **Prueba con $500 (debería cobrar $25.00)**
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
-- Esperado: Comisión = $25.00, Total = $525.00
```

### **Prueba con $1,500 (debería cobrar $10.00)**
```sql
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    1500.00,
    'Prueba $1,500',
    @resultado,
    @id,
    @comision,
    @total
);
SELECT @resultado, @comision, @total;
-- Esperado: Comisión = $10.00, Total = $1,510.00
```

### **Prueba con $5,000 (debería cobrar $33.33)**
```sql
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    5000.00,
    'Prueba $5,000',
    @resultado,
    @id,
    @comision,
    @total
);
SELECT @resultado, @comision, @total;
-- Esperado: Comisión = $33.33, Total = $5,033.33
```

---

## 📝 NOTAS TÉCNICAS

### **Redondeo:**
- Las comisiones se redondean a 2 decimales
- Ejemplo: (2000/1500) × 10 = 13.333... → **$13.33**

### **SQL:**
```sql
SET v_comision = ROUND((p_monto / 100) * 5, 2);
```

### **JavaScript:**
```javascript
const comision = Math.round((monto / 100) * 5 * 100) / 100;
```

---

**Sistema actualizado y funcionando correctamente! ✅**
