"use strict";

const db = require('../models');
const Product = db.product;


exports.findAllProducts = async (req, res, next) => {
    try {

        const products = await db.findAllProducts();
        if (products && products.length > 0) {
            res.send(products);
        } else {
            res.status(200).send({
                message: "no data found"
            });
        }
        next()
    } catch (err) {
        console.log(err)
    }
}