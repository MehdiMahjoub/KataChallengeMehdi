"use strict";

const path = require('path');
const config = require('../tools/config_tool')(path.join(__dirname, 'config/env'));
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = config.get("db:url");
db.product = require("./product.model.js")(mongoose);

// function to save a new product
db.create = async (product) => {
    await product.save(function (err) {
        if (err) return handleError(err);
    })
    return product;
}


//find all or one product by params
db.findProducts  = async (params) => {
    if (!params) {
        return await db.product.find()
    }
    return await db.product.find(params)
};


// find all catogery
db.findCategorys = async () => {
    return await db.product.find().select('category');
}

module.exports = db;