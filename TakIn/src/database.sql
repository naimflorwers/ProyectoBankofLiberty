CREATE DATABASE TakIn;
USE TakIn;

CREATE TABLE Usuarios (
    IDUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    ApellidoPaterno VARCHAR(50) NOT NULL,
    ApellidoMaterno VARCHAR(50),
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Rol ENUM('cliente','ejecutivo','gerente') NOT NULL
);

-- Tabla de Clientes (datos adicionales del usuario con rol cliente)
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

-- Tabla de Ejecutivo
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

-- Tabla de Gerente
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

-- Cuentas
CREATE TABLE Cuenta (
    NumCuenta VARCHAR(20) PRIMARY KEY,
    IDCliente INT NOT NULL,
    TarjetaDebito VARCHAR(16) UNIQUE,
    TarjetaCredito VARCHAR(16) UNIQUE,
    SaldoDebito DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    SaldoCredito DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    Adeudo DECIMAL(12, 2) NOT NULL DEFAULT 0.00,

    FOREIGN KEY (IDCliente) REFERENCES Cliente(IDCliente)
);

-- Cuentas cerradas
CREATE TABLE Cuentas_Cerradas (
    IDCuentaCerrada INT PRIMARY KEY AUTO_INCREMENT,
    NumCuenta VARCHAR(20) NOT NULL,
    Motivo VARCHAR(100),
    FechaCierre DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (NumCuenta) REFERENCES Cuenta(NumCuenta)
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

    FOREIGN KEY (NumCuenta) REFERENCES Cuenta(NumCuenta)
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

    FOREIGN KEY (NumCuenta) REFERENCES Cuenta(NumCuenta)
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

    FOREIGN KEY (NumCuenta) REFERENCES Cuenta(NumCuenta)
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
    FOREIGN KEY (NumCuenta) REFERENCES Cuenta(NumCuenta)
);
 