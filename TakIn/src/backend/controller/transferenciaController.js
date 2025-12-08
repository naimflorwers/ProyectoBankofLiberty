// backend/controller/transferenciaController.js
const db = require('../db'); // Importamos la conexión que acabamos de editar

// Definimos la función que hará la transferencia
exports.realizarTransferencia = (req, res) => {
    
    // 1. Recibimos los datos que vienen desde la App (Ionic) o Postman
    // Deben coincidir con los nombres que envíes en el JSON
    const { cuentaRemitente, cuentaDestino, monto, motivo } = req.body;

    // 2. Preparamos la consulta SQL.
    // Usamos 'CALL' para llamar a tu Stored Procedure.
    // Los '?' son los datos de entrada.
    // Los '@' son variables temporales donde la BD guardará la respuesta.
    const query = `
        SET @p_resultado = '';
        SET @p_id = 0;
        SET @p_comision = 0;
        SET @p_total = 0;
        
        CALL sp_realizar_transferencia(?, ?, ?, ?, @p_resultado, @p_id, @p_comision, @p_total);
        
        SELECT @p_resultado AS mensaje, @p_id AS idTransferencia, @p_comision AS comision, @p_total AS montoTotal;
    `;

    // 3. Ejecutamos la consulta enviando los datos en el orden correcto
    db.query(query, [cuentaRemitente, cuentaDestino, monto, motivo], (error, results) => {
        
        if (error) {
            // Si falla la conexión o hay error de sintaxis SQL
            console.error('Error en el servidor:', error);
            return res.status(500).json({ 
                exito: false, 
                mensaje: 'Error interno del servidor al procesar la transferencia' 
            });
        }

        // 4. Extraemos los resultados
        // Al usar multipleStatements, los resultados vienen en un array de arrays.
        // El último array (índice 5) contiene nuestro SELECT final con las variables.
        const respuestaBD = results[5][0]; 

        // 5. Verificamos si la BD dijo "EXITO" o "ERROR" (Tu SP devuelve un string que empieza así)
        if (respuestaBD.mensaje && respuestaBD.mensaje.startsWith('EXITO')) {
            return res.status(200).json({
                exito: true,
                mensaje: respuestaBD.mensaje,
                datos: {
                    idTransferencia: respuestaBD.idTransferencia,
                    comision: respuestaBD.comision,
                    totalCobrado: respuestaBD.montoTotal
                }
            });
        } else {
            // Si el SP detectó saldo insuficiente, cuenta cerrada, etc.
            return res.status(400).json({
                exito: false,
                mensaje: respuestaBD.mensaje || 'Error desconocido en la transferencia'
            });
        }
    });
};