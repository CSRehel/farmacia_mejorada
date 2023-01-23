const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

const PrescriptionService = require('../services/prescription.services');
const service = new PrescriptionService();

class deliveryService {

    /**
     * @description descuenta la cantidad de medicina entregada de los registros de stock
     * y cambia el estado de la prescripción de 'pendiente' a 'entregado'
     * @param {*} discount cantidad de medicamento a entregar
     * @param {*} id_prescription id de la prescripción
     * @param {*} medicine nombre del medicamento
     * @returns devuelve true si la transacción se ha llevado con éxito
     */
    async medicineDelivery(discount, id_prescription, medicine) {

        // obtener gramaje y unidad de medida del medicamento
        const getMedicine = await pool.query(
            `select weight_medicine, measure_medicine from prescriptions where id = '${id_prescription}'`
        );

        const { weight_medicine, measure_medicine } = getMedicine.rows[0];

        // descontar cantidad entregada en el registro de stock
        const discountStock = {
            text: `update stock set total = (total - $1) where medicine = ${medicine} and weight = '${weight_medicine}' and measure = '${measure_medicine}'`,
            values: [discount]
        }

        try {
            await pool.query('BEGIN');
            await pool.query(discountStock);
            await service.setState(id_prescription, 'entregado');
            await pool.query('COMMIT');

            return true;

        } catch (e) {
            await pool.query('ROLLBACK');
            console.log(e);
            throw boom.badRequest('Error en el registro de entrega');
        }
    }
}

module.exports = deliveryService;