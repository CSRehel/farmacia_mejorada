const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

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
     * @return
     */
    async updateStock(idMedicine, boxUp) {
        const query = await pool.query(`select unit from stock where id = '${idMedicine}'`);
        const unit = query.rows[0].unit
        const amount = (unit * boxUp);

        const increaseStock = {
            text: `UPDATE stock SET total = (total + $2), box = (box + $3) where id = $1`,
            values: [idMedicine, Number(amount), boxUp]
        }

        const query2 = await pool.query(increaseStock);
        return query2.rowCount;
    }
}

module.exports = stockService;