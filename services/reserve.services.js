const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

class reserveService {
    async reserveRecord(reserve_option, amount, id) {
        // const registrarReserva = {
        //     text: `insert into reserves(amout, reserve_option, id_prescription) values ($1, $2, $3) RETURNING *`,
        //     values: [reserve_option, amount, id]
        // }

        // const editarEstado = {
        //     text: "UPDATE prescripciones SET estado = 'reservado' where id = $1",
        //     values: [id_prescripcion]
        // }

        // try {
        //     await pool.query('BEGIN')
        //     await pool.query(registrarReserva)
        //     await pool.query(editarEstado)
        //     await pool.query('COMMIT')

        //     return true

        // } catch (e) {
        //     await pool.query('ROLLBACK')
        //     console.log(e)
        //     throw e
        // }
    }
}

module.exports = reserveService;