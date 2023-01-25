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
    async reserveRecord(reserve_option, id_prescription) {

        let state = 'reservado';
        await reserve_option == 'no_reserve' ? state = 'descartado' : state;

        const reserveRegister = {
            text: `insert into reserves(reserve_option, id_prescription) values ('${reserve_option}', $1) RETURNING *`,
            values: [id_prescription]
        }

        try {
            await pool.query('BEGIN');
            await pool.query(reserveRegister);
            await service.setState(id_prescription, state);
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