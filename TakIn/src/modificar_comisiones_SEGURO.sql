-- ==========================================
-- SISTEMA DE COMISIONES PARA TRANSFERENCIAS
-- Bank of Liberty - VERSIÓN SEGURA
-- ==========================================

USE Liberty;

-- ==========================================
-- PASO 1: MODIFICAR TABLA TRANSFERENCIA (SEGURO)
-- ==========================================

-- Verificar si las columnas ya existen antes de agregarlas
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'Liberty' 
     AND TABLE_NAME = 'Transferencia' 
     AND COLUMN_NAME = 'MontoSinComision') = 0,
    'ALTER TABLE Transferencia 
     ADD COLUMN MontoSinComision DECIMAL(12, 2) DEFAULT 0.00 COMMENT "Monto original antes de comisión",
     ADD COLUMN Comision DECIMAL(12, 2) DEFAULT 0.00 COMMENT "Comisión cobrada",
     ADD COLUMN MontoTotal DECIMAL(12, 2) DEFAULT 0.00 COMMENT "Monto + Comisión",
     ADD COLUMN TipoComision VARCHAR(50) DEFAULT NULL COMMENT "Descripción del tipo de comisión";',
    'SELECT "Las columnas ya existen" AS mensaje;'
));

PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Verificar cambios
DESCRIBE Transferencia;

-- ==========================================
-- PASO 2: CREAR TABLA DE CONFIGURACIÓN DE COMISIONES
-- ==========================================

CREATE TABLE IF NOT EXISTS Configuracion_Comisiones (
    IDComision INT PRIMARY KEY AUTO_INCREMENT,
    MontoMinimo DECIMAL(12, 2) NOT NULL COMMENT 'Monto mínimo para aplicar esta comisión',
    MontoMaximo DECIMAL(12, 2) DEFAULT NULL COMMENT 'Monto máximo (NULL = sin límite)',
    Comision DECIMAL(12, 2) NOT NULL COMMENT 'Monto de la comisión',
    Descripcion VARCHAR(100),
    Activo BOOLEAN DEFAULT TRUE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuración de comisiones (solo si no existen)
INSERT IGNORE INTO Configuracion_Comisiones (MontoMinimo, MontoMaximo, Comision, Descripcion)
VALUES
(0.01, NULL, 5.00, 'Comisión base: $5 por cada $100 (siempre se aplica)'),
(1500.00, 2999.99, 10.00, 'Comisión extra: +$10 para montos entre $1,500 y $2,999.99'),
(3000.00, NULL, 20.00, 'Comisión extra: +$20 para montos de $3,000 o más');

-- Verificar configuración
SELECT * FROM Configuracion_Comisiones;

-- ==========================================
-- PASO 3: ACTUALIZAR STORED PROCEDURE
-- ==========================================

DROP PROCEDURE IF EXISTS sp_realizar_transferencia;

DELIMITER $$

CREATE PROCEDURE sp_realizar_transferencia(
    IN p_cuenta_remitente VARCHAR(20),
    IN p_cuenta_destino VARCHAR(20),
    IN p_monto DECIMAL(12, 2),
    IN p_motivo VARCHAR(255),
    OUT p_resultado VARCHAR(255),
    OUT p_id_transferencia INT,
    OUT p_comision DECIMAL(12, 2),
    OUT p_monto_total DECIMAL(12, 2)
)
BEGIN
    -- Declarar todas las variables al inicio
    DECLARE v_saldo_remitente DOUBLE;
    DECLARE v_saldo_destino DOUBLE;
    DECLARE v_existe_remitente INT;
    DECLARE v_existe_destino INT;
    DECLARE v_cuenta_cerrada_remitente INT;
    DECLARE v_cuenta_cerrada_destino INT;
    DECLARE v_comision DECIMAL(12, 2);
    DECLARE v_comision_alternativa DECIMAL(12, 2);
    DECLARE v_monto_total DECIMAL(12, 2);
    DECLARE v_tipo_comision VARCHAR(50);
    
    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = 'ERROR: Ocurrió un error durante la transferencia';
        SET p_id_transferencia = NULL;
        SET p_comision = 0;
        SET p_monto_total = 0;
    END;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Validar que el monto sea positivo
    IF p_monto <= 0 THEN
        SET p_resultado = 'ERROR: El monto debe ser mayor a 0';
        SET p_id_transferencia = NULL;
        SET p_comision = 0;
        SET p_monto_total = 0;
        ROLLBACK;
    ELSE
    
        -- Validar que las cuentas no sean la misma
        IF p_cuenta_remitente = p_cuenta_destino THEN
            SET p_resultado = 'ERROR: No puedes transferir a la misma cuenta';
            SET p_id_transferencia = NULL;
            SET p_comision = 0;
            SET p_monto_total = 0;
            ROLLBACK;
        ELSE
        
            -- Calcular comisión ACUMULATIVA según el monto
            -- BASE: $5 por cada $100 (siempre)
            -- EXTRA: +$10 si monto >= $1,500
            -- EXTRA: +$20 si monto >= $3,000 (reemplaza el +$10)
            
            -- Comisión base: $5 por cada $100
            SET v_comision = ROUND((p_monto / 100) * 5, 2);
            
            -- Agregar comisión extra según el monto
            IF p_monto >= 3000.00 THEN
                -- Agregar $20 extra para montos >= $3,000
                SET v_comision = v_comision + 20.00;
                SET v_tipo_comision = 'Comisión $5 por cada $100 + $20 extra (≥$3,000)';
            ELSEIF p_monto >= 1500.00 THEN
                -- Agregar $10 extra para montos >= $1,500
                SET v_comision = v_comision + 10.00;
                SET v_tipo_comision = 'Comisión $5 por cada $100 + $10 extra (≥$1,500)';
            ELSE
                SET v_tipo_comision = 'Comisión $5 por cada $100';
            END IF;
            
            -- Calcular monto total (monto + comisión)
            SET v_monto_total = p_monto + v_comision;
            
            -- Verificar que la cuenta remitente existe
            SELECT COUNT(*) INTO v_existe_remitente
            FROM Cuentas
            WHERE Numcuenta = p_cuenta_remitente;
            
            -- Verificar que la cuenta destino existe
            SELECT COUNT(*) INTO v_existe_destino
            FROM Cuentas
            WHERE Numcuenta = p_cuenta_destino;
            
            IF v_existe_remitente = 0 THEN
                SET p_resultado = 'ERROR: La cuenta remitente no existe';
                SET p_id_transferencia = NULL;
                SET p_comision = 0;
                SET p_monto_total = 0;
                ROLLBACK;
            ELSEIF v_existe_destino = 0 THEN
                SET p_resultado = 'ERROR: La cuenta destino no existe';
                SET p_id_transferencia = NULL;
                SET p_comision = 0;
                SET p_monto_total = 0;
                ROLLBACK;
            ELSE
            
                -- Verificar que las cuentas no estén cerradas
                SELECT COUNT(*) INTO v_cuenta_cerrada_remitente
                FROM Cuentas_Cerradas
                WHERE NumCuenta = p_cuenta_remitente;
                
                SELECT COUNT(*) INTO v_cuenta_cerrada_destino
                FROM Cuentas_Cerradas
                WHERE NumCuenta = p_cuenta_destino;
                
                IF v_cuenta_cerrada_remitente > 0 THEN
                    SET p_resultado = 'ERROR: La cuenta remitente está cerrada';
                    SET p_id_transferencia = NULL;
                    SET p_comision = 0;
                    SET p_monto_total = 0;
                    ROLLBACK;
                ELSEIF v_cuenta_cerrada_destino > 0 THEN
                    SET p_resultado = 'ERROR: La cuenta destino está cerrada';
                    SET p_id_transferencia = NULL;
                    SET p_comision = 0;
                    SET p_monto_total = 0;
                    ROLLBACK;
                ELSE
                
                    -- Obtener saldo de la cuenta remitente
                    SELECT Dinero INTO v_saldo_remitente
                    FROM Cuentas
                    WHERE Numcuenta = p_cuenta_remitente
                    FOR UPDATE;
                    
                    -- Verificar saldo suficiente (monto + comisión)
                    IF v_saldo_remitente < v_monto_total THEN
                        SET p_resultado = CONCAT('ERROR: Saldo insuficiente. Necesitas $', v_monto_total, ' (Monto: $', p_monto, ' + Comisión: $', v_comision, ')');
                        SET p_id_transferencia = NULL;
                        SET p_comision = v_comision;
                        SET p_monto_total = v_monto_total;
                        ROLLBACK;
                    ELSE
                    
                        -- Obtener saldo de la cuenta destino (con bloqueo)
                        SELECT Dinero INTO v_saldo_destino
                        FROM Cuentas
                        WHERE Numcuenta = p_cuenta_destino
                        FOR UPDATE;
                        
                        -- Restar monto TOTAL (monto + comisión) de la cuenta remitente
                        UPDATE Cuentas
                        SET Dinero = Dinero - v_monto_total
                        WHERE Numcuenta = p_cuenta_remitente;
                        
                        -- Agregar SOLO el monto (sin comisión) a la cuenta destino
                        UPDATE Cuentas
                        SET Dinero = Dinero + p_monto
                        WHERE Numcuenta = p_cuenta_destino;
                        
                        -- Registrar la transferencia CON comisión
                        INSERT INTO Transferencia (
                            NumCuenta,
                            Monto,
                            CuentaDestino,
                            CuentaRemitente,
                            Motivo,
                            MontoSinComision,
                            Comision,
                            MontoTotal,
                            TipoComision
                        )
                        VALUES (
                            p_cuenta_remitente,
                            p_monto,
                            p_cuenta_destino,
                            p_cuenta_remitente,
                            IFNULL(p_motivo, 'Transferencia'),
                            p_monto,
                            v_comision,
                            v_monto_total,
                            v_tipo_comision
                        );
                        
                        -- Obtener el ID de la transferencia
                        SET p_id_transferencia = LAST_INSERT_ID();
                        SET p_comision = v_comision;
                        SET p_monto_total = v_monto_total;
                        
                        -- Confirmar transacción
                        COMMIT;
                        
                        SET p_resultado = CONCAT('EXITO: Transferencia realizada. ID: ', p_id_transferencia, ' | Monto: $', p_monto, ' | Comisión: $', v_comision, ' | Total cobrado: $', v_monto_total);
                        
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;
    
END$$

DELIMITER ;

SELECT '✅ Stored Procedure creado correctamente' AS Resultado;

-- ==========================================
-- PASO 4: PRUEBAS DEL NUEVO SISTEMA
-- ==========================================

SELECT '📊 Iniciando pruebas...' AS Info;

-- Verificar saldos antes de las pruebas
SELECT 'SALDOS INICIALES:' AS Info;
SELECT Numcuenta, Dinero FROM Cuentas WHERE Numcuenta IN ('1234567890', '0987654321');

-- ==========================================
-- PRUEBA 1: $100 → Comisión $5.00
-- (100/100) * 5 = $5.00
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890', '0987654321', 100.00, 'Prueba $100',
    @r1, @id1, @com1, @tot1
);
SELECT '✅ PRUEBA 1: $100' AS Info;
SELECT @r1 AS Resultado, @com1 AS Comision, @tot1 AS Total;

-- ==========================================
-- PRUEBA 2: $500 → Comisión $25.00
-- (500/100) * 5 = $25.00
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890', '0987654321', 500.00, 'Prueba $500',
    @r2, @id2, @com2, @tot2
);
SELECT '✅ PRUEBA 2: $500' AS Info;
SELECT @r2 AS Resultado, @com2 AS Comision, @tot2 AS Total;

-- ==========================================
-- PRUEBA 3: $1,500 → Comisión $85.00
-- (1500/100) * 5 + 10 = $75 + $10 = $85.00
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890', '0987654321', 1500.00, 'Prueba $1,500',
    @r3, @id3, @com3, @tot3
);
SELECT '✅ PRUEBA 3: $1,500' AS Info;
SELECT @r3 AS Resultado, @com3 AS Comision, @tot3 AS Total;

-- ==========================================
-- PRUEBA 4: $3,000 → Comisión $170.00
-- (3000/100) * 5 + 20 = $150 + $20 = $170.00
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890', '0987654321', 3000.00, 'Prueba $3,000',
    @r4, @id4, @com4, @tot4
);
SELECT '✅ PRUEBA 4: $3,000' AS Info;
SELECT @r4 AS Resultado, @com4 AS Comision, @tot4 AS Total;

-- Saldos finales
SELECT 'SALDOS FINALES:' AS Info;
SELECT Numcuenta, Dinero FROM Cuentas WHERE Numcuenta IN ('1234567890', '0987654321');

-- Historial de transferencias
SELECT 'HISTORIAL CON COMISIONES:' AS Info;
SELECT 
    IDTransferencia AS ID,
    MontoSinComision AS Monto,
    Comision,
    MontoTotal AS Total,
    TipoComision,
    FechaTransferencia AS Fecha
FROM Transferencia
ORDER BY FechaTransferencia DESC
LIMIT 10;

SELECT '🎉 ¡Pruebas completadas exitosamente!' AS Resultado;
