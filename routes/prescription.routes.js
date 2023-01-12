const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const PrescriptionService = require('../services/prescription.services');
const service = new PrescriptionService();

// renderiza la vista de prescripciones
router.get('/', isAuth, async (req, res) => {
    try {
        const prescriptions = await service.getPrescriptions(); //pendiente hasta crear modulo de stock ***

        res.render('Prescription', {
            prescriptions,
            helpers: {
                estado: function (estado, opts) {
                    return estado == 'pendiente' ? opts.fn(this) : opts.inverse(this);
                }
            }
        })

    } catch (e) {
        res.status(500).send({
            error: `Error en registro de prescripción: ${e}`,
            code: 500
        })
    }
});

router.post('/', async (req, res) => {

});

module.exports = router;