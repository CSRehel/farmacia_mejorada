const { config } = require('./../config/config');
const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

const AuthService = require('../services/auth.services');
const service = new AuthService();

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

        // try {
        //     await pool.query('BEGIN');
        //     await pool.query(increaseStock);
        //     const users = await this.verifyReserve(query.rows[0].medicine);
        //     await this.sendMailStock(users);
        //     await pool.query('COMMIT');

        //     return true;

        // } catch (e) {
        //     await pool.query('ROLLBACK');
        //     console.log(e);
        //     throw boom.badRequest('Error en la actualización de stock');
        // }
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
            `select p.id_prescription, p.patient, p.email, p.medicine, p.weight_medicine, p.measure_medicine, p.amount
            from prescriptions as p join reserves as r
            on p.id = r.id_prescription
            where p.medicine = '${medicine.rows[0].medicine}' and r.reserve_option = 'notification';`
        );

        const verify = result.rows;
        return verify;
    }

    /**
     * @description envía notificación a los pacientes cuando se actualice el stock del medicamento que han reservado en sistema
     * @param {*} users lista de usuarios que tienen reserva del medicamento actualizado
     * @returns devuelve true si la lista de usuarios viene vacía
     */
    async sendMailStock(users) {

        if (users.length > 0) {

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
        }else{
            return true;
        }

    }
}

module.exports = stockService;