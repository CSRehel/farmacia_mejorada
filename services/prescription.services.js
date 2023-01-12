const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

class PrescriptionService {

    /**
     * @description obtiene todas las prescripciones registradas en la BD
     * @returns devuelve una lista de prescripciones
     */
    async getPrescriptions() {
        const result = await pool.query(
            `select p.*, s.total from prescriptions as p join stock as s on p.id_stock = s.id;`
        );

        const prescriptions = result.rows;
        return prescriptions;
    }
}

module.exports = PrescriptionService;