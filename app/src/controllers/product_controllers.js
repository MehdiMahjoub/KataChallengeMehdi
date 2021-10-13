"use strict";

const db = require('../models');
const schemaProduct = require('./schema_product_validate');
const logger = require('../tools/logger_tools').getLogger();


const Product = db.product;


// allow to list all products in db
exports.findProducts = async (req, res, next) => {
    try {

        const products = await db.findProducts();

        if (products && products.length > 0) {

            logger.info("data send to get methode ", { tags: 'findAllProducts' });
            res.send(products);

        } else {

            logger.info("No data found", { tags: 'findAllProducts' });
            res.status(200).send({
                message: "no data found"
            });

        }

        next()

    } catch (err) {
        logger.error(err, { tags: 'findAllProducts' });
    }
}


// create new products if not exist
exports.createProduct = async (req, res, next) => {
    
    try {

        let body = req.body;
        const validBody = schemaProduct.validate(body);

        if (validBody.error) {
            
            logger.error("bad request body not conform", { tags: 'CreateProduct' });
            res.status(409).send({
                status: "failure",
                message: "bad request"
            });

        } else {

            const exist = await db.findProducts({
                name: validBody.value.name
            });

            if (exist && exist.length > 0) {

                logger.error("Product already exists", { tags: 'CreateProduct' });
                res.status(409).send({
                    status: "failure",
                    message: "product already exists"
                });

            } else {

                const product = new Product(validBody.value);
                let resultSave = await db.createProduct(product);

                if (resultSave._id !== undefined) {

                    logger.info("A new product is added to db", { tags: 'CreateProduct' });
                    res.send(resultSave);

                } else {

                    logger.error("Something is wrong when creating the product..500", { tags: 'CreateProduct' });
                    res.status(500).send({
                        message: "Something is wrong when creating the product"
                    });

                }
            }
        }
        next()
    } catch (err) {
        logger.error(err, { tags: 'CreateProduct' });
    }
}


// get all category of products
exports.getAllCategorys = async (req, res, next) => {

    try {

        const categorys = await db.findCategorys();
        if (categorys && categorys.length > 0) {

            var allCategorys = [];

            categorys.forEach((value) => {
                allCategorys.push(value.category);
            });

            var uniqueCategorys = [...new Set(allCategorys)]; // create a unique array without duplicates value 

            logger.info("aLL Categorys is sended", { tags: 'GetAllCategorys' });
            res.send(uniqueCategorys);

        } else {

            logger.info("no Categorys was found", { tags: 'GetAllCategorys' });
            res.status(200).send({
                message: "no data found"
            });

        }

        next()

    } catch (err) {
        logger.error(err, { tags: 'GetAllCategorys' });
    }
}

//get product by name
exports.getProductByName = async (req, res, next) => {
    
    try {

        const name = req.params.name;

        const product = await db.findProducts({ name: name });

        if (product) {
            
            logger.info("product is found", { tags: 'GetProductByName' });
            res.send(product)

        } else {

            logger.error("product is not found", { tags: 'GetProductByName' });
            res.status(404).send({
                message: "product not found"
            });
        }
        next()

    } catch (err) {
        logger.error(err, { tags: 'GetProductByName' });
    }

}

// update product by id
exports.updateProductById = async (req, res, next) => {
    
    try {

        const body = req.body;
        const id = req.params.id;

        const validBody = schemaProduct.validate(body);
        
        if (validBody.error) {

            logger.error("bad request body not conform", { tags: 'UpdateProductById' });
            res.status(409).send({
                status: "failure",
                message: "bad request"
            });

        } else {

            const product = await db.findProductById(id);
            
            if (product) {
                const updated = await db.updateProductById(id, validBody.value);
                const objUpdated = await db.findProductById(id);
                
                logger.info("product is updated", { tags: 'UpdateProductById' });
                res.status(200).send(objUpdated);

            } else {

                logger.error("product is not found", { tags: 'UpdateProductById' });
                res.status(404).send({
                    message: "product not found"
                });
            }
        }

        next()
    } catch (err) {
        logger.error(err, { tags: 'UpdateProductById' });
    }
}

//delete a product by id
exports.removeProductById = async (req, res, next) => {
    
    try {
        const id = req.params.id;
        const product = await db.findProductById(id);

        if (product) {
            const deleted = await db.removeProductById(id);
            if (deleted) {
                logger.info("product is deleted from db", { tags: 'RemoveProductById' });
                res.status(204).send({
                    message: "Product was deleted successfully!"
                });
            }
        } else {
            logger.error("product is not found", { tags: 'RemoveProductById' });
            res.status(404).send({
                message: "Product not found"
            });
        }
        next()
        
    } catch (err) {
        logger.error(err, { tags: 'RemoveProductById' });
    }


};
