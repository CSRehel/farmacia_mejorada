const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// renderiza la vista Home
router.get('/', isAuth, async (req, res) => {
    res.render('Home', { email: req.email });
});

module.exports = router;