const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

const PrescriptionService = require('../services/prescription.services');
const service = new PrescriptionService();

class reserveService {

    /**
     * @description registra reserva de medicamentos
     * @param {*} reserve_option opción notification/no_reserve
     * @param {*} amount cantidad de medicamento reservado
     * @param {*} id_prescription id de la prescripción
     * @returns retorna true si todo ha salido bien
     */
    async reserveRecord(reserve_option, amount, id_prescription) {

        const reserveRegister = {
            text: `insert into reserves(amount, reserve_option, id_prescription) values ($1, '${reserve_option}', $2) RETURNING *`,
            values: [amount, id_prescription]
        }

        try {
            await pool.query('BEGIN');
            await pool.query(reserveRegister);
            await service.setState(id_prescription, 'reservado');
            await pool.query('COMMIT');
            return true;

        } catch (e) {
            await pool.query('ROLLBACK');
            console.log(e);
            throw boom.badRequest('Error en el registro de reservas');
        }
    }
}

module.exports = reserveService;