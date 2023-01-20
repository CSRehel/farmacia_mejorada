const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const deliveryService = require('../services/delivery.services');
const service = new deliveryService();

// renderiza vista de entrega
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

// descuento de stock y cambio de estado de prescripción
router.post('/', async(req, res) => {
    const { discount, id_prescription, medicine, email } = req.body;

    try {
        await service.medicineDelivery(discount, id_prescription, medicine);
        res.redirect(`/prescription/?email=${email}`);

    } catch (e) {
        res.render('Delivery', { message: `Error al guardar los datos`, code: 500 });
    }

});

module.exports = router;