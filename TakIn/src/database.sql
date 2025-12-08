drop database Liberty;
CREATE DATABASE Liberty;
USE Liberty;

CREATE TABLE Usuarios (
    IDUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    ApellidoPaterno VARCHAR(50) NOT NULL,
    ApellidoMaterno VARCHAR(50),
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Rol ENUM('cliente','ejecutivo','gerente') NOT NULL
);


CREATE TABLE Cliente (
    IDCliente INT PRIMARY KEY AUTO_INCREMENT,
    IDUsuario INT NOT NULL,
    CURP VARCHAR(18) UNIQUE,
    RFC VARCHAR(13) UNIQUE,
    FechaNacimiento DATE,
    Nacionalidad VARCHAR(50),
    NumIdentificacion VARCHAR(50),
    Telefono VARCHAR(20),
    Domicilio VARCHAR(255),
    PuestoLaboral VARCHAR(100),
    NomEmpresa VARCHAR(100),
    DomEmpresa VARCHAR(255),
    FuenteIngresos VARCHAR(100),
    IngresoMensual DECIMAL(12, 2),
    Beneficiarios TEXT,
    Genero VARCHAR(20),

    FOREIGN KEY (IDUsuario) REFERENCES Usuarios(IDUsuario)
);


CREATE TABLE Ejecutivo (
    IDEjecutivo INT PRIMARY KEY AUTO_INCREMENT,
    IDUsuario INT NOT NULL,
    CURP CHAR(18) UNIQUE,
    RFC VARCHAR(13) UNIQUE,
    FechaNacimiento DATE,
    Nacionalidad VARCHAR(50),
    NumIdentificacion VARCHAR(50),
    Telefono VARCHAR(20),
    Domicilio VARCHAR(255),
    Genero VARCHAR(20),

    FOREIGN KEY (IDUsuario) REFERENCES Usuarios(IDUsuario)
);


CREATE TABLE Gerente (
    IDGerente INT PRIMARY KEY AUTO_INCREMENT,
    IDUsuario INT NOT NULL,
    CURP CHAR(18) UNIQUE,
    RFC VARCHAR(13) UNIQUE,
    FechaNacimiento DATE,
    Nacionalidad VARCHAR(50),
    NumIdentificacion VARCHAR(50),
    Telefono VARCHAR(20),
    Domicilio VARCHAR(255),
    Genero VARCHAR(20),

    FOREIGN KEY (IDUsuario) REFERENCES Usuarios(IDUsuario)
);


CREATE TABLE Tarjetas (
    IDCliente INT NOT NULL PRIMARY KEY,
    Banco VARCHAR(100),
    TarjetaDebito VARCHAR(16) UNIQUE,
    TarjetaCredito VARCHAR(16) UNIQUE,
    SaldoDebito DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    SaldoCredito DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    Adeudo DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (IDCliente) REFERENCES Cliente(IDCliente)
);

CREATE TABLE Cuentas(
	Numcuenta VARCHAR(10) PRIMARY KEY,
	IDCliente INT,
	Banco VARCHAR(100),
	Dinero DOUBLE,
	Clabe VARCHAR(18),
	NumTelefono VARCHAR(10),
	FOREIGN KEY (IDCliente) References Cliente(IDCliente)
);


CREATE TABLE Cuentas_Cerradas (
    IDCuentaCerrada INT PRIMARY KEY AUTO_INCREMENT,
    NumCuenta VARCHAR(20) NOT NULL,
    Motivo VARCHAR(100),
    FechaCierre DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (NumCuenta) REFERENCES Cuentas(NumCuenta)
);

-- Transferencias
CREATE TABLE Transferencia (
    IDTransferencia INT PRIMARY KEY AUTO_INCREMENT,
    NumCuenta VARCHAR(20) NOT NULL,
    Monto DECIMAL(12, 2) NOT NULL,
    CuentaDestino VARCHAR(20) NOT NULL,
    CuentaRemitente VARCHAR(20) NOT NULL,
    Motivo VARCHAR(255),
    FechaTransferencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (NumCuenta) REFERENCES Cuentas(NumCuenta)
);

-- Ingresos
CREATE TABLE Ingresar (
    IDIngreso INT PRIMARY KEY AUTO_INCREMENT,
    NumCuenta VARCHAR(20) NOT NULL,
    Monto DECIMAL(12, 2) NOT NULL,
    NombreTitular VARCHAR(150),
    ClaveReferencia VARCHAR(50),
    MetodoDeposito VARCHAR(50),
    FechaIngreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (NumCuenta) REFERENCES Cuentas(NumCuenta)
);

-- Retiros
CREATE TABLE Retirar (
    IDRetiro INT PRIMARY KEY AUTO_INCREMENT,
    NumCuenta VARCHAR(20) NOT NULL,
    Monto DECIMAL(12, 2) NOT NULL,
    NumeroReferencia VARCHAR(50) UNIQUE,
    DatosQR TEXT,
    Metodo VARCHAR(50),
    FechaRetiro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (NumCuenta) REFERENCES Cuentas(NumCuenta)
);

-- Buró de Crédito
CREATE TABLE Buro_de_Credito (
    IDBuro INT PRIMARY KEY AUTO_INCREMENT,
    IDCliente INT NOT NULL,
    FechaConsulta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    HistorialCrediticio TEXT,
    NumeroCreditosActivos INT DEFAULT 0,
    NumeroCreditosCerrados INT DEFAULT 0,
    MontoTotalAdeudado DECIMAL(12, 2) DEFAULT 0.00,
    MontoMaximoHistorial DECIMAL(12, 2) DEFAULT 0.00,
    FraudeDetectado BOOLEAN DEFAULT FALSE,
    PersonaExpuesta BOOLEAN DEFAULT FALSE,
    HistorialDomicilios TEXT,
    HistorialConsultas TEXT,

    FOREIGN KEY (IDCliente) REFERENCES Cliente(IDCliente)
);

-- Score de Crédito
CREATE TABLE Score_de_Credito (
    IDScore INT PRIMARY KEY AUTO_INCREMENT,
    IDCliente INT NOT NULL,
    FechaConsulta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Score INT NOT NULL,

    FOREIGN KEY (IDCliente) REFERENCES Cliente(IDCliente)
);

-- Préstamos
CREATE TABLE Prestamos (
    IDPrestamo INT PRIMARY KEY AUTO_INCREMENT,
    IDCliente INT NOT NULL,
    IDEjecutivo INT,
    IDGerente INT,
    NumCuenta VARCHAR(20) NOT NULL,
    Descripcion TEXT,
    Monto DECIMAL(12, 2) NOT NULL,
    FechaSolicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Autorizado BOOLEAN DEFAULT FALSE,
    PlazoMeses INT,
    TasaInteres DECIMAL(5, 2),
    FechaInicio DATE,

    FOREIGN KEY (IDCliente) REFERENCES Cliente(IDCliente),
    FOREIGN KEY (IDEjecutivo) REFERENCES Ejecutivo(IDEjecutivo),
    FOREIGN KEY (IDGerente) REFERENCES Gerente(IDGerente),
    FOREIGN KEY (NumCuenta) REFERENCES Cuentas(NumCuenta)
);

INSERT INTO Usuarios (Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Contrasena, Rol)
VALUES
-- Clientes
('Carlos', 'González', 'Ramírez', 'carlos.gonzalez@example.com', 'cliente123', 'cliente'),
('María', 'López', 'Hernández', 'maria.lopez@example.com', 'cliente456', 'cliente'),

-- Ejecutivos
('Javier', 'Martínez', 'Sánchez', 'javier.martinez@example.com', 'ejecutivo123', 'ejecutivo'),
('Ana', 'Torres', 'Flores', 'ana.torres@example.com', 'ejecutivo456', 'ejecutivo'),

-- Gerentes
('Roberto', 'Ramírez', 'Castro', 'roberto.ramirez@example.com', 'gerente123', 'gerente'),
('Laura', 'Fernández', 'Mendoza', 'laura.fernandez@example.com', 'gerente456', 'gerente');

select * from usuarios;
show tables;
UPDATE Usuarios
SET Correo = 'yamirperezlopez800@gmail.com'
WHERE IDUsuario = 1;

select * from cuentas;
select * from usuarios;






DELIMITER $$

DROP PROCEDURE IF EXISTS sp_realizar_transferencia$$

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
                        
                        -- Registrar la transferencia (CORREGIDO)
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
-- PASO 1: INSERTAR CLIENTES
-- ==========================================
INSERT INTO Cliente (IDUsuario, CURP, RFC, FechaNacimiento, Nacionalidad, Telefono, Domicilio, Genero)
VALUES
(1, 'GORC850315HDFLRR01', 'GORC850315AB1', '1985-03-15', 'Mexicana', '5512345678', 'Calle Reforma 123, CDMX', 'Masculino'),
(2, 'LOHM900520MDFLPR02', 'LOHM900520CD2', '1990-05-20', 'Mexicana', '5587654321', 'Av. Insurgentes 456, CDMX', 'Femenino');

-- ==========================================
-- PASO 2: INSERTAR CUENTAS CON SALDO
-- ==========================================
INSERT INTO Cuentas (Numcuenta, IDCliente, Banco, Dinero, Clabe, NumTelefono)
VALUES
('1234567890', 1, 'Liberty Bank', 15000.00, '123456789012345678', '5512345678'),
('0987654321', 2, 'Liberty Bank', 8000.00, '987654321098765432', '5587654321');

-- ==========================================
-- PASO 3: VERIFICAR LOS DATOS INSERTADOS
-- ==========================================
SELECT 'USUARIOS' AS Tabla;
SELECT * FROM Usuarios WHERE Rol = 'cliente';

SELECT 'CLIENTES' AS Tabla;
SELECT * FROM Cliente;

SELECT 'CUENTAS' AS Tabla;
SELECT * FROM Cuentas;

-- ==========================================
-- PASO 4: PROBAR EL STORED PROCEDURE
-- ==========================================
-- Transferencia de Carlos (cuenta 1234567890) a María (cuenta 0987654321)
CALL sp_realizar_transferencia(
    '1234567890',                    -- Cuenta de Carlos (remitente)
    '0987654321',                    -- Cuenta de María (destino)
    2500.00,                         -- Monto a transferir
    'Pago de préstamo personal',     -- Motivo
    @resultado,                      -- Variable de salida para resultado
    @id_transferencia                -- Variable de salida para ID
);

-- ==========================================
-- PASO 5: VER EL RESULTADO DE LA TRANSFERENCIA
-- ==========================================
SELECT @resultado AS 'Resultado de la Transferencia';
SELECT @id_transferencia AS 'ID de Transferencia';

-- ==========================================
-- PASO 6: VERIFICAR LA TRANSFERENCIA EN LA BD
-- ==========================================
SELECT 'REGISTRO EN TABLA TRANSFERENCIA' AS Info;
SELECT * FROM Transferencia WHERE IDTransferencia = @id_transferencia;

SELECT 'SALDOS ACTUALIZADOS' AS Info;
SELECT 
    Numcuenta,
    IDCliente,
    Dinero AS Saldo_Actual,
    CASE 
        WHEN Numcuenta = '1234567890' THEN 'Carlos (Remitente)'
        WHEN Numcuenta = '0987654321' THEN 'María (Destino)'
    END AS Cliente
FROM Cuentas 
WHERE Numcuenta IN ('1234567890', '0987654321');

-- ==========================================
-- PASO 7: PRUEBAS ADICIONALES (OPCIONAL)
-- ==========================================
-- Prueba: Saldo insuficiente
CALL sp_realizar_transferencia(
    '1234567890',
    '0987654321',
    50000.00,  -- Monto mayor al saldo
    'Prueba de saldo insuficiente',
    @resultado2,
    @id_trans2
);
SELECT @resultado2 AS 'Resultado Prueba 2';

-- Prueba: Cuenta inexistente
CALL sp_realizar_transferencia(
    '1234567890',
    '9999999999',  -- Cuenta que no existe
    500.00,
    'Prueba cuenta inexistente',
    @resultado3,
    @id_trans3
);
SELECT @resultado3 AS 'Resultado Prueba 3';

-- Prueba: Transferencia a la misma cuenta
CALL sp_realizar_transferencia(
    '1234567890',
    '1234567890',  -- Misma cuenta
    500.00,
    'Prueba misma cuenta',
    @resultado4,
    @id_trans4
);
SELECT @resultado4 AS 'Resultado Prueba 4';

-- ==========================================
-- PASO 8: VER HISTORIAL COMPLETO
-- ==========================================
SELECT 'HISTORIAL DE TRANSFERENCIAS' AS Info;
SELECT 
    t.IDTransferencia,
    t.CuentaRemitente,
    t.CuentaDestino,
    t.Monto,
    t.Motivo,
    t.FechaTransferencia,
    u1.Nombre AS Remitente,
    u2.Nombre AS Destinatario
FROM Transferencia t
LEFT JOIN Cuentas c1 ON t.CuentaRemitente = c1.Numcuenta
LEFT JOIN Cliente cl1 ON c1.IDCliente = cl1.IDCliente
LEFT JOIN Usuarios u1 ON cl1.IDUsuario = u1.IDUsuario
LEFT JOIN Cuentas c2 ON t.CuentaDestino = c2.Numcuenta
LEFT JOIN Cliente cl2 ON c2.IDCliente = cl2.IDCliente
LEFT JOIN Usuarios u2 ON cl2.IDUsuario = u2.IDUsuario
ORDER BY t.FechaTransferencia DESC;

select * from Transferencia;
select * from Cuentas;



-- Insertar Cliente para el usuario con ID 1
INSERT IGNORE INTO Cliente (IDUsuario, CURP, RFC, FechaNacimiento, Nacionalidad, Telefono, Domicilio, Genero)
VALUES (1, 'GORC850315HDFLRR01', 'GORC850315AB1', '1985-03-15', 'Mexicana', '5512345678', 'Calle Reforma 123, CDMX', 'Masculino');

-- Obtener el IDCliente que se acaba de crear
SET @id_cliente = (SELECT IDCliente FROM Cliente WHERE IDUsuario = 1 LIMIT 1);

-- Crear cuentas para ese cliente
INSERT INTO Cuentas (Numcuenta, IDCliente, Banco, Dinero, Clabe, NumTelefono)
VALUES
('1234567890', @id_cliente, 'Liberty Bank', 15000.00, '012345678901234567', '5512345678'),
('9876543210', @id_cliente, 'Liberty Bank', 25000.00, '098765432109876543', '5512345678');

-- Verificar que se crearon
SELECT c.Numcuenta, c.Banco, c.Dinero, cl.IDUsuario
FROM Cuentas c
INNER JOIN Cliente cl ON c.IDCliente = cl.IDCliente
WHERE cl.IDUsuario = 1;


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