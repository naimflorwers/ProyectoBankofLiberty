const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');

console.log('Iniciando server.js...');

process.on('uncaughtException', err => {
	console.error('uncaughtException:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, promise) => {
	console.error('unhandledRejection at:', promise, 'reason:', reason);
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', usuariosRoutes);

const server = app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

const shutdown = (code = 0) => {
	console.log('shutdown() invoked with code', code, '- closing server (no exit)');
	try {
		server.close(() => {
			console.log('Servidor cerrado (shutdown() callback)');
		});
	} catch (e) {
		console.error('Error durante cierre:', e);
	}
};

process.on('SIGINT', (sig) => {
	console.log('Recibida señal SIGINT:', sig);
	shutdown(0);
});
process.on('SIGTERM', (sig) => {
	console.log('Recibida señal SIGTERM:', sig);
	shutdown(0);
});

const path = require('path');


app.use(express.static(path.join(__dirname, '../dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});