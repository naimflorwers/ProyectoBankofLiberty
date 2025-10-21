-- ==========================================
-- SISTEMA DE COMISIONES PARA TRANSFERENCIAS
-- Bank of Liberty
-- ==========================================

USE Liberty;

-- ==========================================
-- PASO 1: MODIFICAR TABLA TRANSFERENCIA
-- ==========================================

-- Agregar columnas para el sistema de comisiones
ALTER TABLE Transferencia 
ADD COLUMN MontoSinComision DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Monto original antes de comisión',
ADD COLUMN Comision DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Comisión cobrada',
ADD COLUMN MontoTotal DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Monto + Comisión',
ADD COLUMN TipoComision VARCHAR(50) DEFAULT NULL COMMENT 'Descripción del tipo de comisión';

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

-- Insertar configuración de comisiones
INSERT INTO Configuracion_Comisiones (MontoMinimo, MontoMaximo, Comision, Descripcion)
VALUES
(0.01, 999.99, 5.00, 'Comisión para montos menores a $1,000'),
(1000.00, 1499.99, 5.00, 'Comisión para montos de $1,000 a $1,499.99'),
(1500.00, NULL, 10.00, 'Comisión para montos de $1,500 en adelante');

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
        
            -- Calcular comisión proporcional según el monto
            -- Comisión: $5 por cada $100 o $10 por cada $1,500
            -- Se usa la tasa más favorable para el usuario
            
            -- Calcular con tasa de $5 por cada $100 (5%)
            SET v_comision = ROUND((p_monto / 100) * 5, 2);
            
            -- Calcular con tasa de $10 por cada $1,500 (aproximadamente 0.67%)
            -- Si el monto es >= $1,500, usar esta tasa si es menor
            IF p_monto >= 1500.00 THEN
                SET v_comision_alternativa = ROUND((p_monto / 1500) * 10, 2);
                
                -- Usar la comisión menor (más favorable para el cliente)
                IF v_comision_alternativa < v_comision THEN
                    SET v_comision = v_comision_alternativa;
                    SET v_tipo_comision = 'Comisión $10 por cada $1,500';
                ELSE
                    SET v_tipo_comision = 'Comisión $5 por cada $100';
                END IF;
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

-- ==========================================
-- PASO 4: PRUEBAS DEL NUEVO SISTEMA
-- ==========================================

-- Verificar saldos antes de la prueba
SELECT 'SALDOS ANTES DE TRANSFERENCIA:' AS Info;
SELECT Numcuenta, Dinero FROM Cuentas WHERE Numcuenta IN ('1234567890', '0987654321');

-- ==========================================
-- PRUEBA 1: Transferencia de $100
-- Esperado: Comisión = $5.00, Total = $105.00
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    100.00,
    'Prueba $100 (comisión $5)',
    @resultado,
    @id_trans,
    @comision,
    @total
);

SELECT 'RESULTADO PRUEBA 1 ($100 → Comisión $5.00):' AS Info;
SELECT @resultado AS Resultado, @id_trans AS ID, @comision AS Comision, @total AS Total;
SELECT * FROM Transferencia WHERE IDTransferencia = @id_trans;

-- ==========================================
-- PRUEBA 2: Transferencia de $500
-- Esperado: Comisión = $25.00, Total = $525.00
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    500.00,
    'Prueba $500 (comisión $25)',
    @resultado2,
    @id_trans2,
    @comision2,
    @total2
);

SELECT 'RESULTADO PRUEBA 2 ($500 → Comisión $25.00):' AS Info;
SELECT @resultado2 AS Resultado, @id_trans2 AS ID, @comision2 AS Comision, @total2 AS Total;
SELECT * FROM Transferencia WHERE IDTransferencia = @id_trans2;

-- ==========================================
-- PRUEBA 3: Transferencia de $1,500
-- Esperado: Comisión = $10.00, Total = $1,510.00
-- (Usa tasa de $10 por $1,500 porque es menor)
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    1500.00,
    'Prueba $1,500 (comisión $10)',
    @resultado3,
    @id_trans3,
    @comision3,
    @total3
);

SELECT 'RESULTADO PRUEBA 3 ($1,500 → Comisión $10.00):' AS Info;
SELECT @resultado3 AS Resultado, @id_trans3 AS ID, @comision3 AS Comision, @total3 AS Total;
SELECT * FROM Transferencia WHERE IDTransferencia = @id_trans3;

-- ==========================================
-- PRUEBA 4: Transferencia de $3,000
-- Esperado: Comisión = $20.00, Total = $3,020.00
-- (Usa tasa de $10 por $1,500)
-- ==========================================
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    3000.00,
    'Prueba $3,000 (comisión $20)',
    @resultado4,
    @id_trans4,
    @comision4,
    @total4
);

SELECT 'RESULTADO PRUEBA 4 ($3,000 → Comisión $20.00):' AS Info;
SELECT @resultado4 AS Resultado, @id_trans4 AS ID, @comision4 AS Comision, @total4 AS Total;
SELECT * FROM Transferencia WHERE IDTransferencia = @id_trans4;

-- Verificar saldos finales
SELECT 'SALDOS FINALES:' AS Info;
SELECT Numcuenta, Dinero FROM Cuentas WHERE Numcuenta IN ('1234567890', '0987654321');

-- ==========================================
-- PASO 5: VERIFICAR HISTORIAL COMPLETO
-- ==========================================

SELECT 'HISTORIAL DE TRANSFERENCIAS CON COMISIONES:' AS Info;
SELECT 
    IDTransferencia,
    CuentaRemitente,
    CuentaDestino,
    MontoSinComision AS 'Monto Original',
    Comision,
    MontoTotal AS 'Total Cobrado',
    TipoComision,
    FechaTransferencia
FROM Transferencia
ORDER BY FechaTransferencia DESC;
