const { config } = require('./../config/config');
const jwt = require('jsonwebtoken');

// para acceder a rutas protegidas
async function isAuth(req, res, next) {

    if (!req.query.token) {
        return res
            .status(403)
            .render('Error', { message: "No autorizado", code: 403 });
    }

    const token = req.query.token;

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
        req.user = payload.sub; //carga de datos al payload para pasarlo a la vista home
        next();
    });
}

module.exports = isAuth;