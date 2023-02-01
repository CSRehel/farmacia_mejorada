const { config } = require('./../config/config');
const pool = require('../libs/postgres.pool');

const AuthService = require('../services/auth.services');
const service = new AuthService();

const PrescriptionService = require('../services/prescription.services');
const servicePresc = new PrescriptionService();

class stockService {

    /**
     * @description obtiene la lista de medicamentos registrados en la BD
     * @returns devuelve la lista de medicamentos con su id, nombre, gramaje y unidad medida
     */
    async getMedicines() {
        const result = await pool.query(
            `select id, medicine, weight, measure from stock;`
        );

        const medicines = result.rows;
        return medicines;
    }

    /**
     * @description registro de stock
     * @param {*} medicine nombre del medicamento
     * @param {*} code código del medicamento
     * @param {*} description descripción del medicamento
     * @param {*} manufacturer fabricante del medicamento
     * @param {*} weight peso del medicamento
     * @param {*} measure medida del medicamento (mg, gr, ml)
     * @param {*} unit cantidad de unidades del medicamento
     * @param {*} box cantidad de cajas del medicamento
     * @param {*} id_user id del usuario
     * @returns devuelve 1 si el proceso fue satisfactorio
     */
    async stockRecord(medicine, code, description, manufacturer, weight, measure, unit, box, id_user) {

        let total = (box * unit);

        const result = await pool.query(
            `insert into stock(medicine, code, description, manufacturer, weight, measure, unit, box, total, id_user)
        values ('${medicine}', '${code}', '${description}', '${manufacturer}', '${weight}', '${measure}', '${unit}', '${box}', '${total}', '${id_user}') RETURNING *`
        );

        const stock = result.rowCount;
        return stock;
    }

    /**
     * @description actualiza el stock, sumando las unidades y cajas ingresadas en el formulario a las unidades
     * y cajas ya registradas en el sistema.
     * @param {*} idMedicine id del medicamento
     * @param {*} boxUp número de cajas
     * @return devuelve 1 si todo salio bien
     */
    async updateStock(idMedicine, boxUp) {
        const query = await pool.query(`select medicine, unit from stock where id = '${idMedicine}'`);
        const unit = query.rows[0].unit
        const amount = (unit * boxUp);

        // actualiza stock
        const increaseStock = {
            text: `UPDATE stock SET total = (total + $2), box = (box + $3) where id = $1`,
            values: [idMedicine, Number(amount), boxUp]
        }

        const result = await pool.query(increaseStock);
        return result.rowCount;
    }

    /**
     * @description obtiene la lista de pacientes que han reservado el medicamento que se ha actualizado en sistema
     * @param {*} medicine medicamento que se ha actualizado en sistema
     * @returns devuelve la lista de pacientes con su respectiva información
     */
    async verifyReserve(idMedicine) {

        const medicine = await pool.query(
            `select medicine from stock where id = ${idMedicine}`
        );

        const result = await pool.query(
            `select p.id, p.patient, p.email, p.medicine, p.weight_medicine, p.measure_medicine, p.amount
            from prescriptions as p join reserves as r
            on p.id = r.id_prescription
            where p.medicine = '${medicine.rows[0].medicine}' and r.reserve_option = 'notification';`
        );

        const verify = result.rows;
        return verify;
    }

    /**
     * @description actualiza el estado de los usuarios que tienen reserva de medicamento
     * @param {*} users lista de usuarios que tienen reserva del medicamento actualizado
     */
    async updateStatePrescriptions(users) {
        const idPrescriptions = users.map(u => u.id);

        for (let i = 0; i < idPrescriptions.length; i++) {
            console.log(idPrescriptions[i]);
            await servicePresc.setState(idPrescriptions[i], 'pendiente');
        }
    }

    /**
     * @description envía notificación a los pacientes cuando se actualice el stock del medicamento que han reservado en sistema
     * @param {*} users lista de usuarios que tienen reserva del medicamento actualizado
     * @returns
     */
    async sendMailStock(users) {

        const emails = users.map(u => u.email);

        const mail = {
            from: config.smtpEmail,
            to: emails,
            subject: "Actualización de medicamento - Sistema de Farmacia",
            html: `<p>Se ha actualizado stock del medicamento <b>${users[0].medicine} ${users[0].weight_medicine}${users[0].measure_medicine}</b>
                        asociado a su reserva en nuestro sistema.</p></br><small>Recuerde que este correo es meramente informativo y no asegura
                        que haya disponibilidad de stock al momento de realizar su compra</small>`,
        }

        const result = await service.sendMail(mail);
        return result;

    }
}

module.exports = stockService;

// actualizar estado de prescripciones al actualizar stock