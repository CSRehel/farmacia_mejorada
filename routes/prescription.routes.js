const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const PrescriptionService = require('../services/prescription.services');
const service = new PrescriptionService();

// renderiza la vista de prescripciones
router.get('/', isAuth, async (req, res) => {
    try {
        const prescriptions = await service.getPrescriptions();

        res.render('Prescription', {
            prescriptions,
            admin: req.email,
            helpers: {
                state: function (state, opts) {
                    return state == 'pendiente' ? opts.fn(this) : opts.inverse(this); // estudiar***
                }
            }
        })

    } catch (e) {
        res.status(500).send({
            error: `Error en modulo prescripción: ${e}`,
            code: 500
        })
    }
});

// registro prescripción
router.post('/', async (req, res) => {
    const { id_prescription,
            rut,
            email,
            patient,
            medicine,
            weight_medicine,
            measure_medicine,
            amount, days,
            state
        } = req.body;

    try {
        const { id: id_stock } = await service.getIdStock(medicine, weight_medicine, measure_medicine);

        await service.PrescriptionRecord(id_prescription, rut, email, patient, medicine, weight_medicine, measure_medicine, amount, days, state, id_stock);

        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: `Error en registro de prescripción: ${e}`,
            code: 500
        })
    }
});

module.exports = router;
