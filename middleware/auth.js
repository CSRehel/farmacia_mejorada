const { config } = require('./../config/config');
const jwt = require('jsonwebtoken');

const AuthService = require('../services/auth.services');
const service = new AuthService();


// para acceder a rutas protegidas
async function isAuth(req, res, next) {

    if (!req.query.email) {
        return res
            .status(403)
            .render('Error', { message: "No autorizado", code: 403 });
    }

    const email = req.query.email;

    const { token } = await service.findByEmail(email);

    jwt.verify(token, config.jwtSecret, function (err, payload) {

        if (err) {
            switch (err.name) {
                case 'JsonWebTokenError':
                    return res.status(401).render('Error', { message: "Signatura incorrecta", code: '401' });
                case 'TokenExpiredError':
                    return res.status(401).render('Error', { message: "Token caducado", code: '401' });
                default:
                    return res.status(500).render('Error', { message: err, code: '500' });
            }
        }

        //carga de datos al payload para pasarlo a las vista
        req.email = payload.sub;
        next();
    });
}

module.exports = isAuth;