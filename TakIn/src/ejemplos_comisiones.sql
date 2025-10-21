-- ==========================================
-- EJEMPLOS DE CÁLCULO DE COMISIONES
-- Bank of Liberty
-- ==========================================

-- REGLA: $5 por cada $100 O $10 por cada $1,500
-- El sistema usa LA MENOR comisión para ser justo con el cliente

-- ==========================================
-- EJEMPLOS PRÁCTICOS
-- ==========================================

-- Ejemplo 1: Transferencia de $100
-- Comisión por $100: CEILING(100/100) * $5 = 1 * $5 = $5
-- Comisión por $1,500: CEILING(100/1500) * $10 = 1 * $10 = $10
-- Comisión aplicada: $5 (la menor)

-- Ejemplo 2: Transferencia de $500
-- Comisión por $100: CEILING(500/100) * $5 = 5 * $5 = $25
-- Comisión por $1,500: CEILING(500/1500) * $10 = 1 * $10 = $10
-- Comisión aplicada: $10 (la menor)

-- Ejemplo 3: Transferencia de $1,000
-- Comisión por $100: CEILING(1000/100) * $5 = 10 * $5 = $50
-- Comisión por $1,500: CEILING(1000/1500) * $10 = 1 * $10 = $10
-- Comisión aplicada: $10 (la menor)

-- Ejemplo 4: Transferencia de $1,500
-- Comisión por $100: CEILING(1500/100) * $5 = 15 * $5 = $75
-- Comisión por $1,500: CEILING(1500/1500) * $10 = 1 * $10 = $10
-- Comisión aplicada: $10 (la menor)

-- Ejemplo 5: Transferencia de $3,000
-- Comisión por $100: CEILING(3000/100) * $5 = 30 * $5 = $150
-- Comisión por $1,500: CEILING(3000/1500) * $10 = 2 * $10 = $20
-- Comisión aplicada: $20 (la menor)

-- Ejemplo 6: Transferencia de $50
-- Comisión por $100: CEILING(50/100) * $5 = 1 * $5 = $5
-- Comisión por $1,500: CEILING(50/1500) * $10 = 1 * $10 = $10
-- Comisión aplicada: $5 (la menor)

-- ==========================================
-- TABLA DE COMISIONES POR MONTO
-- ==========================================

/*
MONTO        | COMISIÓN POR $100 | COMISIÓN POR $1,500 | COMISIÓN APLICADA
-------------|-------------------|---------------------|------------------
$50          | $5                | $10                 | $5
$100         | $5                | $10                 | $5
$200         | $10               | $10                 | $10
$500         | $25               | $10                 | $10
$1,000       | $50               | $10                 | $10
$1,500       | $75               | $10                 | $10
$2,000       | $100              | $20                 | $20
$3,000       | $150              | $20                 | $20
$4,500       | $225              | $30                 | $30
$5,000       | $250              | $40                 | $40
$10,000      | $500              | $70                 | $70
*/

-- ==========================================
-- PUNTO DE EQUILIBRIO
-- ==========================================

-- Las dos fórmulas dan la misma comisión cuando:
-- CEILING(monto/100) * 5 = CEILING(monto/1500) * 10
-- 
-- Para montos hasta $200, se usa $5 por cada $100
-- Para montos de $200 en adelante, se usa $10 por cada $1,500

-- ==========================================
-- VENTAJAS PARA EL CLIENTE
-- ==========================================

-- El sistema SIEMPRE usa la comisión más baja
-- A mayor monto, más conveniente resulta la tarifa de $10 por $1,500
-- Ejemplo: 
--   - Transferir $10,000 con tarifa de $100 = $500 de comisión
--   - Transferir $10,000 con tarifa de $1,500 = $70 de comisión
--   - Sistema aplica: $70 (ahorro de $430)
