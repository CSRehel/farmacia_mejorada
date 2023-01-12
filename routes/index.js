const express = require('express');

const homeRouter = require('./home.routes');
const authRouter = require('./auth.routes');
const prescriptionRouter = require('./prescription.routes');
const stockRouter = require('./stock.routes');

function routerApi(app) {
    const router = express.Router();
    app.use(router);
    router.use('/', homeRouter);
    router.use('/auth', authRouter);
    router.use('/prescription', prescriptionRouter);
    router.use('/stock', stockRouter);
}

module.exports = routerApi;