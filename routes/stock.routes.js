const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const stockService = require('../services/stock.services');
const service = new stockService();

const AuthService = require('../services/auth.services');
const serviceAuth = new AuthService();

// renderiza la vista stock
router.get('/', isAuth, async (req, res) => {
    const medicines = await service.getMedicines();
    res.render('Stock', { medicines, email: req.email });
});

// registro de stock
router.post('/', async (req, res) => {
    const { medicine, code, description, manufacturer, weight, measure, unit, box, email } = req.body;

    try {
        const { id: id_user } = await serviceAuth.findByEmail(email);
        await service.stockRecord(medicine, code, description, manufacturer, weight, measure, unit, box, id_user);
        res.redirect(`/?email=${email}`);

    } catch (e) {
        res.status(500).render('Stock', {message: `Error al guardar los datos`, code: 500});
    }
});

// actualización de stock
router.put('/', async (req, res) => {
    const { idMedicine, boxUp } = req.body;

    try {
        const stock = await service.updateStock(idMedicine, boxUp);
        res.sendStatus(200).send(stock);
        // const verify = await verificarReserva(medicine); // pendiente nodemailer***

    } catch (e) {
        res.sendStatus(500).render('Stock', {message: `Error al guardar los datos`, code: 500})
    }
})

module.exports = router;