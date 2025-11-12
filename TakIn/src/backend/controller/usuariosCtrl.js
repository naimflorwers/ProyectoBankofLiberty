const db = require('../db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const getUsuarios = (req, res) => {
  // CORREGIDO: 'usuarios' en minúscula
  db.query('SELECT IDUsuario, Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Rol FROM usuarios', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

const getClientes = (req, res) => {
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           c.IDCliente, c.CURP, c.RFC, c.FechaNacimiento, c.Nacionalidad, c.NumIdentificacion, c.Telefono, c.Domicilio,
           c.PuestoLaboral, c.NomEmpresa, c.DomEmpresa, c.FuenteIngresos, c.IngresoMensual, c.Beneficiarios, c.Genero
    FROM usuarios u
    INNER JOIN cliente c ON u.IDUsuario = c.IDUsuario
  `; // CORREGIDO: 'usuarios' y 'cliente'
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

const getEjecutivos = (req, res) => {
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           e.IDEjecutivo, e.CURP, e.RFC, e.FechaNacimiento, e.Nacionalidad, e.NumIdentificacion, e.Telefono, e.Domicilio, e.Genero
    FROM usuarios u
    INNER JOIN ejecutivo e ON u.IDUsuario = e.IDUsuario
  `; // CORREGIDO: 'usuarios' y 'ejecutivo'
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

const getGerentes = (req, res) => {
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           g.IDGerente, g.CURP, g.RFC, g.FechaNacimiento, g.Nacionalidad, g.NumIdentificacion, g.Telefono, g.Domicilio, g.Genero
    FROM usuarios u
    INNER JOIN gerente g ON u.IDUsuario = g.IDUsuario
  `; // CORREGIDO: 'usuarios' y 'gerente'
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

const getUsuario = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT u.IDUsuario, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, u.Correo, u.Rol,
           c.IDCliente, c.CURP AS ClienteCURP, e.IDEjecutivo, e.CURP AS EjecutivoCURP, g.IDGerente, g.CURP AS GerenteCURP
    FROM usuarios u
    LEFT JOIN cliente c ON u.IDUsuario = c.IDUsuario
    LEFT JOIN ejecutivo e ON u.IDUsuario = e.IDUsuario
    LEFT JOIN gerente g ON u.IDUsuario = g.IDUsuario
    WHERE u.IDUsuario = ?
  `; // CORREGIDO: 'usuarios', 'cliente', 'ejecutivo', 'gerente'
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0] || {});
  });
};

const login = (req, res) => {
  const correo = req.body.correo;
  const contrasena = req.body.contrasena;

  if (!correo || !contrasena) {
    return res.status(400).json({ msg: 'Faltan campos correo o contraseña' });
  }

  // CORREGIDO: 'usuarios' en minúscula
  const query = 'SELECT IDUsuario, Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Rol, Contrasena FROM usuarios WHERE Correo = ?';
  db.query(query, [correo], (err, results) => {
    if (err) return res.status(500).send(err);
    if (!results || results.length === 0) {
      return res.status(401).json({ success: false, msg: 'Usuario o contraseña incorrectos' });
    }

    const user = results[0];
    const stored = user.Contrasena || '';

    if (typeof stored === 'string' && stored.startsWith('$2')) {
      bcrypt.compare(contrasena, stored, (errCmp, same) => {
        if (errCmp) return res.status(500).send(errCmp);
        if (!same) return res.status(401).json({ success: false, msg: 'Usuario o contraseña incorrectos' });
        delete user.Contrasena;
        return res.json({ success: true, rol: user.Rol, user });
      });
    } else {
      if (contrasena === stored) {
        bcrypt.hash(contrasena, SALT_ROUNDS, (errHash, newHash) => {
          if (!errHash) {
            // CORREGIDO: 'usuarios' en minúscula
            const upd = 'UPDATE usuarios SET Contrasena = ? WHERE IDUsuario = ?';
            db.query(upd, [newHash, user.IDUsuario], (uErr) => {
              if (uErr) console.error('Error al actualizar hash de usuario:', uErr);
            });
          } else {
            console.error('Error al hashear para migración:', errHash);
          }
        });

        delete user.Contrasena;
        return res.json({ success: true, rol: user.Rol, user });
      }
      return res.status(401).json({ success: false, msg: 'Usuario o contraseña incorrectos' });
    }
  });
};

const registro = (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, correo, contrasena, rol, curp } = req.body;

  if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !contrasena) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios' });
  }

  // CORREGIDO: 'usuarios' en minúscula
  const checkQuery = 'SELECT IDUsuario FROM usuarios WHERE Correo = ?';
  db.query(checkQuery, [correo], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results && results.length > 0) {
      return res.status(409).json({ success: false, msg: 'El correo ya está registrado' });
    }

    bcrypt.hash(contrasena, SALT_ROUNDS, (err, hash) => {
      if (err) return res.status(500).send(err);

      // CORREGIDO: 'usuarios' en minúscula
      const insertQuery = 'INSERT INTO usuarios (Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Contrasena, Rol) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [nombre, apellidoPaterno, apellidoMaterno, correo, hash, rol || 'cliente'], (err, result) => {
        if (err) return res.status(500).send(err);
        const usuarioId = result.insertId;
        if (curp) {
          // CORREGIDO: 'cliente' en minúscula
          const insertCliente = 'INSERT INTO cliente (IDUsuario, CURP) VALUES (?, ?)';
          db.query(insertCliente, [usuarioId, curp], (err2, res2) => {
            if (err2) {
              return res.status(201).json({ success: true, id: usuarioId, warning: 'Usuario creado, pero no se pudo crear registro de Cliente', clienteError: err2 });
            }
            return res.status(201).json({ success: true, id: usuarioId, clienteId: res2.insertId, msg: 'Usuario y Cliente creados correctamente' });
          });
        } else {
          return res.status(201).json({ success: true, id: usuarioId, msg: 'Usuario creado correctamente' });
        }
      });
    });
  });
};

module.exports = { getUsuarios, getClientes, getEjecutivos, getGerentes, getUsuario, login, registro };