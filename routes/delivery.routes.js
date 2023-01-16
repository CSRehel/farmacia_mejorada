const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', isAuth, async(req, res) => {
    const { id, id_prescription, rut, patient, medicine, amount, days, state } = req.query;
    res.render('Delivery', {
        email: req.email,
        id,
        id_prescription,
        rut,
        patient,
        medicine,
        amount,
        days,
        state
    });
});

// terminar descuento de stock en formulario vista delivery

module.exports = router;