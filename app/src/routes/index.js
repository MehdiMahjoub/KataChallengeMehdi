"use strict";

const express = require('../tools/express_tool');

const router = express.createRouter();

const product = require("../controllers/product_controllers");


// Gestion des routes & REST methode
router.get('/products/', product.findAllProducts); // find all products 


module.exports = router;