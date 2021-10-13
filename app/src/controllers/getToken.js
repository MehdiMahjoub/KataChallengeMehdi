'use strict';

const logger = require('../tools/logger_tools').getLogger();
const path = require('path');
const config = require('../tools/config_tool')(path.join(__dirname, 'config/env'));
const db = require('../models');

// -- JWT implementation
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
jwtOptions.secretOrKey = config.get("jwt:jwtSecretKey")
jwtOptions.passReqToCallback = true;

let strategy = new JwtStrategy(jwtOptions, function (req, jwt_payload, next) {

    let authorizedUser = jwt_payload.emails;
    let mailInRequest = ''
    if (req.params && req.params.email) {
        mailInRequest = req.params.email
    }
    else if (req.body && req.body.mail) {
        mailInRequest = req.body.mail
    }

    if (authorizedUser) {
        next(null, {});
    } else {
        next(null, false);
    }

});
passport.use(strategy);
// -- JWT implementation

module.exports.getToken = (req, res) => {
    (async () => {

        let email = req.params.email;

        let exists = await db.findUser({ email: email });
        if (!exists) {
            logger.error(`API called with email = ${email} & result status = 400 Unauthorized`, { tags: 'getToken' });
            res.status(400).json("Unauthorized");
            return
        }
        
        let payload = { emails: [email] };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        logger.info(`API called with email = ${email} & result status = 200`, { tags: 'getToken' });
        res.send(token);

    })().catch(function (err) {
        let err_str = (err.message || err.toString() || "unknown error");
        logger.error(err_str, { tags: 'getToken' });
        res.status(err.statusCode || 500).send(err_str);
    });
};