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

    /**
     * @description obtiene el id de un medicamento
     * @param {*} medicine nombre del medicamento
     * @param {*} weight_medicine gramaje del medicamento
     * @param {*} measure_medicine unidad de medida del medicamento
     * @returns retorna el id del medicamento
     */
    async getIdStock(medicine, weight_medicine, measure_medicine) {
        const result = await pool.query(
            `SELECT id FROM stock WHERE medicine = '${medicine}' AND weight = '${weight_medicine}' AND measure = '${measure_medicine}'`
        );

        return result.rows[0];
    }

    /**
     * @description registro de prescripción enviada desde sistema de medicos
     * @param {*} id_prescription id de la prescripción en sistema medico
     * @param {*} rut rut del paciente
     * @param {*} email correo del paciente
     * @param {*} patient nombre del paciente
     * @param {*} medicine nombre del medicamento
     * @param {*} weight_medicine gramaje del medicamento
     * @param {*} measure_medicine unidad de medida del medicamento
     * @param {*} amount cantidad de medicamento recetada
     * @param {*} days cantidad de días a tomar medicamento
     * @param {*} id_stock id del medicamento
     * @returns devuelve la data del registro
     */
    async PrescriptionRecord(id_prescription, rut, email, patient, medicine, weight_medicine, measure_medicine, amount, days, id_stock) {
        const result = await pool.query(
            `insert into prescriptions(id_prescription, rut, email, patient, medicine, weight_medicine, measure_medicine, amount, days, state, id_stock)
            values ('${id_prescription}', '${rut}', '${email}', '${patient}', '${medicine}', '${weight_medicine}', '${measure_medicine}', '${amount}', '${days}', 'pendiente', '${id_stock}') RETURNING *`
        );

        return result.rows[0];
    }
}

module.exports = PrescriptionService;