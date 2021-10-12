"use strict";

const express = require('../tools/express_tool');

const router = express.createRouter();

const product = require("../controllers/product_controllers");


// Gestion des routes & REST methode
router.get('/products/', product.findProducts); // find all products 

router.post('/products/', product.createProduct); // create user

router.get('/products/categorys/', product.getAllCategorys); // get all category

module.exports = router;