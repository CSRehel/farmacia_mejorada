const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/auth');

// renderiza la vista Home
router.get('/', isAuth, async (req, res) => {
    res.render('Home', { id_user: req.user });
});

module.exports = router;

// 10 + 1 hrs en total (vista - rutas - servicio - errores)
// 4 días = 6 + 2 + 2 + 1