"use strict";

const express = require('../tools/express_tool');

const router = express.createRouter();
const app = express.createApp();

const product = require("../controllers/product_controllers");
const user = require('../controllers/user_controllers');
const getToken = require('../controllers/getToken').getToken;

//TOKEN
// Token parameters
const passport = require("passport");
router.use(passport.initialize());

router.get('/getToken/:email', getToken);

// Gestion des routes & REST methode
router.get('/products/', product.findProducts); // find all products 

// router.post('/products/', passport.authenticate('jwt', { session: false }), product.createProduct); // create product with token desactivé pour test (PS: Manque de temps)
router.post('/products/', product.createProduct); // create product


router.get('/products/categorys/', product.getAllCategorys); // get all category

// router.get('/products/name/:name', passport.authenticate('jwt', { session: false }), product.getProductByName); //find a product by name with token desactivé pour test (PS: Manque de temps)
router.get('/products/name/:name', product.getProductByName); //find a product by name

// router.put("/products/id/:id", passport.authenticate('jwt', { session: false }), product.updateProductById); //update product by id with token desactivé pour test (PS: Manque de temps)
router.put("/products/id/:id", product.updateProductById); //update product by id

// router.delete('/products/id/:id', passport.authenticate('jwt', { session: false }), product.removeProductById); // delete a product by id with token desactivé pour test (PS: Manque de temps)
router.delete('/products/id/:id',product.removeProductById); // delete a product by id



router.post('/seedImport/', user.seedImport) //seedImport data //TODO security
router.delete('/seedImport/', passport.authenticate('jwt', { session: false }), user.deleteAllDb) //delete All Db //TODO security

module.exports = router;