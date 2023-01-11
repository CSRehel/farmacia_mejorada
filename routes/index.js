const express = require('express');

const homeRouter = require('./home.routes');
const authRouter = require('./auth.routes');

function routerApi(app) {
    const router = express.Router();
    app.use(router);
    router.use('/', homeRouter);
    router.use('/auth', authRouter);
}

module.exports = routerApi;