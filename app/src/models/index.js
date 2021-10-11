"use strict";

const path = require('path');
const config = require('../tools/config_tool')(path.join(__dirname, 'config/env'));
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = config.get("db:url");
db.product = require("./product.model.js")(mongoose);

db.findAllProducts = async () => {
    return await db.product.find()
};

module.exports = db;