const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

class deliveryService {

    async medicineDelivery(discount, id_prescription, medicine) {

        const getMedicine = await pool.query(
            `select weight_medicine, measure_medicine from prescriptions where id = '${id_prescription}'`
        );

        const { weight_medicine, measure_medicine } = getMedicine.rows[0];

        //  error de sintaxis en o cerca de «diclofenaco» ARREGLAR
        const discountStock = {
            text: `update stock set total = (total - $1) where medicine = '${medicine}' and weight = '${weight_medicine}' and measure = '${measure_medicine}'`,
            values: [discount]
        }

        const setState = {
            text: "update prescriptions set state = 'entregado' where id = $1",
            values: [id_prescription]
        }

        try {
            await pool.query('BEGIN');
            await pool.query(discountStock);
            await pool.query(setState);
            await pool.query('COMMIT');

            return true;

        } catch (e) {
            await pool.query('ROLLBACK');
            console.log(e);
            throw boom.badRequest('Error al guardar registro de entrega');
        }
    }
}

module.exports = deliveryService;