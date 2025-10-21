-- ==========================================
-- INSERTAR DATOS DE PRUEBA COMPLETOS
-- Bank of Liberty
-- ==========================================

USE Liberty;

-- Verificar usuarios existentes
SELECT 'USUARIOS EXISTENTES:' AS Info;
SELECT IDUsuario, Nombre, ApellidoPaterno, Correo, Rol FROM Usuarios;

-- ==========================================
-- PASO 1: INSERTAR CLIENTES (SI NO EXISTEN)
-- ==========================================

-- Insertar Cliente para Carlos (IDUsuario = 1)
INSERT IGNORE INTO Cliente (IDUsuario, CURP, RFC, FechaNacimiento, Nacionalidad, Telefono, Domicilio, Genero)
VALUES
(1, 'GORC850315HDFLRR01', 'GORC850315AB1', '1985-03-15', 'Mexicana', '5512345678', 'Calle Reforma 123, CDMX', 'Masculino');

-- Insertar Cliente para María (IDUsuario = 2)
INSERT IGNORE INTO Cliente (IDUsuario, CURP, RFC, FechaNacimiento, Nacionalidad, Telefono, Domicilio, Genero)
VALUES
(2, 'LOHM900520MDFLPR02', 'LOHM900520CD2', '1990-05-20', 'Mexicana', '5587654321', 'Av. Insurgentes 456, CDMX', 'Femenino');

-- Verificar clientes
SELECT 'CLIENTES CREADOS:' AS Info;
SELECT * FROM Cliente;

-- ==========================================
-- PASO 2: INSERTAR CUENTAS
-- ==========================================

-- Obtener el IDCliente de Carlos
SET @id_cliente_carlos = (SELECT IDCliente FROM Cliente WHERE IDUsuario = 1 LIMIT 1);
SET @id_cliente_maria = (SELECT IDCliente FROM Cliente WHERE IDUsuario = 2 LIMIT 1);

SELECT CONCAT('IDCliente Carlos: ', IFNULL(@id_cliente_carlos, 'NO ENCONTRADO')) AS Info;
SELECT CONCAT('IDCliente María: ', IFNULL(@id_cliente_maria, 'NO ENCONTRADO')) AS Info;

-- Insertar cuentas (usar REPLACE para actualizar si ya existen)
DELETE FROM Cuentas WHERE Numcuenta IN ('1234567890', '0987654321');

INSERT INTO Cuentas (Numcuenta, IDCliente, Banco, Dinero, Clabe, NumTelefono)
VALUES
('1234567890', @id_cliente_carlos, 'Liberty Bank', 15000.00, '012345678901234567', '5512345678'),
('0987654321', @id_cliente_maria, 'Liberty Bank', 8000.00, '098765432109876543', '5587654321');

-- Verificar cuentas creadas
SELECT 'CUENTAS CREADAS:' AS Info;
SELECT c.Numcuenta, c.IDCliente, c.Banco, c.Dinero, c.Clabe, c.NumTelefono,
       cl.IDUsuario, u.Nombre, u.ApellidoPaterno
FROM Cuentas c
INNER JOIN Cliente cl ON c.IDCliente = cl.IDCliente
INNER JOIN Usuarios u ON cl.IDUsuario = u.IDUsuario;

-- ==========================================
-- PASO 3: VERIFICAR LA CONSULTA QUE USA EL BACKEND
-- ==========================================

SELECT 'PRUEBA DE CONSULTA DEL BACKEND (Usuario Carlos, IDUsuario=1):' AS Info;
SELECT c.Numcuenta, c.Banco, c.Dinero, c.Clabe, c.NumTelefono
FROM Cuentas c
INNER JOIN Cliente cl ON c.IDCliente = cl.IDCliente
WHERE cl.IDUsuario = 1;

SELECT 'PRUEBA DE CONSULTA DEL BACKEND (Usuario María, IDUsuario=2):' AS Info;
SELECT c.Numcuenta, c.Banco, c.Dinero, c.Clabe, c.NumTelefono
FROM Cuentas c
INNER JOIN Cliente cl ON c.IDCliente = cl.IDCliente
WHERE cl.IDUsuario = 2;

-- ==========================================
-- RESUMEN FINAL
-- ==========================================
SELECT '============ RESUMEN FINAL ============' AS Info;
SELECT COUNT(*) AS 'Total Usuarios' FROM Usuarios;
SELECT COUNT(*) AS 'Total Clientes' FROM Cliente;
SELECT COUNT(*) AS 'Total Cuentas' FROM Cuentas;
SELECT COUNT(*) AS 'Total Transferencias' FROM Transferencia;
