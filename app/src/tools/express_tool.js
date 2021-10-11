"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

/**
 * Creates a simple default express application
 * @param {*} options  optional {
 *      helmet: optional helmet middleware, else helmet() is used
 * }
 */
const createApp = options => { // function createApp(options) { // ES5
    options = options || {};

    let app = express();

    // security
    app.use(options.helmet || helmet());

    return app;
};

/**
 * Creates a simple default express router
 * @param {*} options optional
 */
const createRouter = options => {
    options = options || {};

    const router = express.Router({ mergeParams: true });
    // body parsing
    if (options.bodyparsers == undefined) {
        router.use(bodyParser.json({ limit: '50mb', extended: true }));
        router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    }
    else if (options.bodyparsers) {
        options.bodyparsers.forEach(bodyparser => {
            router.use(bodyparser);
        });
    }

    return router;
};

module.exports = {
    createApp: createApp,
    createRouter: createRouter,
    express: express
}