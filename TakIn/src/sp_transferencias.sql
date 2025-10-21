-- ==========================================
-- STORED PROCEDURE PARA TRANSFERENCIAS
-- Bank of Liberty
-- ==========================================

USE Liberty;

-- Eliminar el SP si existe
DROP PROCEDURE IF EXISTS sp_realizar_transferencia;

DELIMITER $$

CREATE PROCEDURE sp_realizar_transferencia(
    IN p_cuenta_remitente VARCHAR(20),
    IN p_cuenta_destino VARCHAR(20),
    IN p_monto DECIMAL(12, 2),
    IN p_motivo VARCHAR(255),
    OUT p_resultado VARCHAR(255),
    OUT p_id_transferencia INT
)
BEGIN
    DECLARE v_saldo_remitente DOUBLE;
    DECLARE v_saldo_destino DOUBLE;
    DECLARE v_existe_remitente INT;
    DECLARE v_existe_destino INT;
    DECLARE v_cuenta_cerrada_remitente INT;
    DECLARE v_cuenta_cerrada_destino INT;
    
    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = 'ERROR: Ocurrió un error durante la transferencia';
        SET p_id_transferencia = NULL;
    END;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Validar que el monto sea positivo
    IF p_monto <= 0 THEN
        SET p_resultado = 'ERROR: El monto debe ser mayor a 0';
        SET p_id_transferencia = NULL;
        ROLLBACK;
    ELSE
    
        -- Validar que las cuentas no sean la misma
        IF p_cuenta_remitente = p_cuenta_destino THEN
            SET p_resultado = 'ERROR: No puedes transferir a la misma cuenta';
            SET p_id_transferencia = NULL;
            ROLLBACK;
        ELSE
        
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
                ROLLBACK;
            ELSEIF v_existe_destino = 0 THEN
                SET p_resultado = 'ERROR: La cuenta destino no existe';
                SET p_id_transferencia = NULL;
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
                    ROLLBACK;
                ELSEIF v_cuenta_cerrada_destino > 0 THEN
                    SET p_resultado = 'ERROR: La cuenta destino está cerrada';
                    SET p_id_transferencia = NULL;
                    ROLLBACK;
                ELSE
                
                    -- Obtener saldo de la cuenta remitente
                    SELECT Dinero INTO v_saldo_remitente
                    FROM Cuentas
                    WHERE Numcuenta = p_cuenta_remitente
                    FOR UPDATE;
                    
                    -- Verificar saldo suficiente
                    IF v_saldo_remitente < p_monto THEN
                        SET p_resultado = 'ERROR: Saldo insuficiente';
                        SET p_id_transferencia = NULL;
                        ROLLBACK;
                    ELSE
                    
                        -- Obtener saldo de la cuenta destino (con bloqueo)
                        SELECT Dinero INTO v_saldo_destino
                        FROM Cuentas
                        WHERE Numcuenta = p_cuenta_destino
                        FOR UPDATE;
                        
                        -- Restar dinero de la cuenta remitente
                        UPDATE Cuentas
                        SET Dinero = Dinero - p_monto
                        WHERE Numcuenta = p_cuenta_remitente;
                        
                        -- Agregar dinero a la cuenta destino
                        UPDATE Cuentas
                        SET Dinero = Dinero + p_monto
                        WHERE Numcuenta = p_cuenta_destino;
                        
                        -- Registrar la transferencia
                        INSERT INTO Transferencia (
                            NumCuenta,
                            Monto,
                            CuentaDestino,
                            CuentaRemitente,
                            Motivo
                        )
                        VALUES (
                            p_cuenta_remitente,
                            p_monto,
                            p_cuenta_destino,
                            p_cuenta_remitente,
                            IFNULL(p_motivo, 'Transferencia')
                        );
                        
                        -- Obtener el ID de la transferencia
                        SET p_id_transferencia = LAST_INSERT_ID();
                        
                        -- Confirmar transacción
                        COMMIT;
                        
                        SET p_resultado = CONCAT('EXITO: Transferencia realizada. ID: ', p_id_transferencia);
                        
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;
    
END$$

DELIMITER ;

-- ==========================================
-- DATOS DE PRUEBA
-- ==========================================

-- Insertar clientes si no existen
INSERT IGNORE INTO Cliente (IDUsuario, CURP, RFC, FechaNacimiento, Nacionalidad, Telefono, Domicilio, Genero)
VALUES
(1, 'GORC850315HDFLRR01', 'GORC850315AB1', '1985-03-15', 'Mexicana', '5512345678', 'Calle Reforma 123, CDMX', 'Masculino'),
(2, 'LOHM900520MDFLPR02', 'LOHM900520CD2', '1990-05-20', 'Mexicana', '5587654321', 'Av. Insurgentes 456, CDMX', 'Femenino');

-- Insertar cuentas con saldo
INSERT IGNORE INTO Cuentas (Numcuenta, IDCliente, Banco, Dinero, Clabe, NumTelefono)
VALUES
('1234567890', 1, 'Liberty Bank', 15000.00, '012345678901234567', '5512345678'),
('0987654321', 2, 'Liberty Bank', 8000.00, '098765432109876543', '5587654321');

-- ==========================================
-- PRUEBAS DEL STORED PROCEDURE
-- ==========================================

-- PRUEBA 1: Transferencia exitosa
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    2500.00,
    'Pago de préstamo personal',
    @resultado,
    @id_transferencia
);

SELECT @resultado AS 'Resultado';
SELECT @id_transferencia AS 'ID Transferencia';

-- Ver la transferencia registrada
SELECT * FROM Transferencia WHERE IDTransferencia = @id_transferencia;

-- Ver saldos actualizados
SELECT 
    Numcuenta,
    Dinero AS Saldo,
    CASE 
        WHEN IDCliente = 1 THEN 'Carlos (Remitente)'
        WHEN IDCliente = 2 THEN 'María (Destino)'
    END AS Cliente
FROM Cuentas 
WHERE IDCliente IN (1, 2);

-- PRUEBA 2: Saldo insuficiente
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    50000.00,
    'Prueba saldo insuficiente',
    @resultado2,
    @id_trans2
);
SELECT @resultado2 AS 'Resultado Prueba 2';

-- PRUEBA 3: Cuenta inexistente
CALL sp_realizar_transferencia(
    '1234567890',
    '9999999999',
    500.00,
    'Prueba cuenta inexistente',
    @resultado3,
    @id_trans3
);
SELECT @resultado3 AS 'Resultado Prueba 3';

-- PRUEBA 4: Misma cuenta
CALL sp_realizar_transferencia(
    '1234567890',
    '1234567890',
    500.00,
    'Prueba misma cuenta',
    @resultado4,
    @id_trans4
);
SELECT @resultado4 AS 'Resultado Prueba 4';

-- Ver historial completo de transferencias
SELECT * FROM Transferencia ORDER BY FechaTransferencia DESC;
