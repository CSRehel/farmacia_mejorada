const isAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', isAuth, async(req, res) => {
    res.render('Reserve', { email: req.email });
});

module.exports = router;