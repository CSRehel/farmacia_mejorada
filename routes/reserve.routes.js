const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const reserveService = require('../services/reserve.services');
const service = new reserveService();

// renderiza vista Reserve
router.get('/', isAuth, async(req, res) => {
    const { id, id_prescription, rut, email_patient, patient, medicine, amount, days, state } = req.query;
    res.render('Reserve', {
        id,
        id_prescription,
        rut,
        email_patient,
        patient,
        medicine,
        amount,
        days,
        state,
        email: req.email
    });
});

// registro de reservas
router.post('/', async (req, res) => {
    const { reserve_option, amount, id, email } = req.body;

    try {

        // terminar registro y envio de correo
        await service.reserveRecord(reserve_option, amount, id);
        res.status(200).redirect(`/prescription/?email=${email}`);


    } catch (e) {
        console.log(e);
        res.render('Reserve', { message: `Error al guardar los datos`, code: 500 });
    }
})

module.exports = router;