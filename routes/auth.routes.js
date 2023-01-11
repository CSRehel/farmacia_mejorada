const express = require('express');
const router = express.Router();

const AuthService = require('../services/auth.services');
const service = new AuthService();

// renderiza la vista Login
router.get('/logout', async (req, res) => {
    res.render('Login');
});

// login
router.post('/', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await service.authenticateUser(email, password);
        const token = await service.signToken(user.id);
        // res.json(token);

        if (token) {
            res.redirect(`http://localhost:3000/?token=${token.token}`);
        }

    } catch (error) {
        res.render('Login', {
            message: error.output.payload.message
        });
    }
});

module.exports = router;