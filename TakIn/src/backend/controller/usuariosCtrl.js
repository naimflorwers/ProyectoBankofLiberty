const db = require('../db');

// Obtener todos los usuarios
const getUsuarios = (req, res) => {
  db.query('SELECT IDUsuario, Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Rol FROM Usuarios', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener todos los clientes
const getClientes = (req, res) => {
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           c.IDCliente, c.CURP, c.RFC, c.FechaNacimiento, c.Nacionalidad, c.NumIdentificacion, c.Telefono, c.Domicilio,
           c.PuestoLaboral, c.NomEmpresa, c.DomEmpresa, c.FuenteIngresos, c.IngresoMensual, c.Beneficiarios, c.Genero
    FROM Usuarios u
    INNER JOIN Cliente c ON u.IDUsuario = c.IDUsuario
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener todos los ejecutivos
const getEjecutivos = (req, res) => {
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           e.IDEjecutivo, e.CURP, e.RFC, e.FechaNacimiento, e.Nacionalidad, e.NumIdentificacion, e.Telefono, e.Domicilio, e.Genero
    FROM Usuarios u
    INNER JOIN Ejecutivo e ON u.IDUsuario = e.IDUsuario
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener todos los gerentes
const getGerentes = (req, res) => {
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           g.IDGerente, g.CURP, g.RFC, g.FechaNacimiento, g.Nacionalidad, g.NumIdentificacion, g.Telefono, g.Domicilio, g.Genero
    FROM Usuarios u
    INNER JOIN Gerente g ON u.IDUsuario = g.IDUsuario
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener un usuario por id
const getUsuario = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           c.IDCliente, c.CURP AS ClienteCURP, e.IDEjecutivo, e.CURP AS EjecutivoCURP, g.IDGerente, g.CURP AS GerenteCURP
    FROM Usuarios u
    LEFT JOIN Cliente c ON u.IDUsuario = c.IDUsuario
    LEFT JOIN Ejecutivo e ON u.IDUsuario = e.IDUsuario
    LEFT JOIN Gerente g ON u.IDUsuario = g.IDUsuario
    WHERE u.IDUsuario = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0] || {});
  });
};

// Login
const login = (req, res) => {
  const correo = req.body.correo;
  const contrasena = req.body.contrasena;

  if (!correo || !contrasena) {
    return res.status(400).json({ msg: 'Faltan campos correo o contraseña' });
  }

  const query = 'SELECT IDUsuario, Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Rol FROM Usuarios WHERE Correo = ? AND Contrasena = ?';
  db.query(query, [correo, contrasena], (err, results) => {
    if (err) return res.status(500).send(err);
    if (!results || results.length === 0) {
      return res.status(401).json({ success: false, msg: 'Usuario o contraseña incorrectos' });
    }
    const user = results[0];
    res.json({ success: true, rol: user.Rol, user });
  });
};

module.exports = { getUsuarios, getClientes, getEjecutivos, getGerentes, getUsuario, login };
