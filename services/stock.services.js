const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');

class stockService {

    /**
     * @description obtiene la lista de medicamentos registrados en la BD
     * @returns devuelve la lista de medicamentos
     */
    async getMedicines() {
        const result = await pool.query(
            `select id, medicine from stock;`
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
}

module.exports = stockService;