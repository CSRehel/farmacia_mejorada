const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// renderiza la vista de prescripciones
router.get('/', isAuth, async (req, res) => {
    res.render('Prescription');
});

module.exports = router;