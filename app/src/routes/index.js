"use strict";

const express = require('../tools/express_tool');

const router = express.createRouter();

const product = require("../controllers/product_controllers");


// Gestion des routes & REST methode
router.get('/products/', product.findProducts); // find all products 

router.post('/products/', product.createProduct); // create product

router.get('/products/categorys/', product.getAllCategorys); // get all category

router.get('/products/name/:name', product.getProductByName); //find a product by name

router.put("/products/id/:id", product.updateProductById); //update product by id

router.delete('/products/id/:id', product.removeProductById); // delete a product by id

module.exports = router;