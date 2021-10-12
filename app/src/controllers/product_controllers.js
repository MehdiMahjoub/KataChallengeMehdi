"use strict";

const db = require('../models');
const schemaProduct = require('./schema_product_validate');
const Product = db.product;


// allow to list all products in db
exports.findProducts = async (req, res, next) => {
    try {

        const products = await db.findProducts();

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

// create new products if not exist
exports.createProduct = async (req, res, next) => {
    try {

        let body = req.body
        const validBody = schemaProduct.validate(body)
        if (validBody.error) {
            res.status(409).send({
                status: "failure",
                message: "bad request"
            });
        } else {

            const exist = await db.findProducts({
                name: validBody.value.name
            })

            if (exist && exist.length > 0) {
                res.status(409).send({
                    status: "failure",
                    message: "User already exists"
                });
            } else {

                const product = new Product(validBody.value);
                let resultSave = await db.create(product);

                if (resultSave._id !== undefined) {

                    res.send(resultSave);

                } else {

                    res.status(500).send({
                        message: "Something is wrong when creating the user"
                    });

                }
            }
        }
        next()
    } catch (err) {
        console.log(err)
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

            res.send(uniqueCategorys);

        } else {

            res.status(200).send({
                message: "no data found"
            });

        }

        next()

    } catch (error) {
        console.log(error);
    }
}

//get product by name
exports.getProductByName = async (req, res, next) => {
    try {
        const name = req.params.name;

        const product = await db.findProducts({name: name});

        if (product) {

            res.send(product)

        } else {
            res.status(404).send({
                message: "product not found"
            });
        }
        next()
    } catch (err) {
        console.log(err)
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
                res.status(204).send({
                    message: "Product was deleted successfully!"
                });
            }
        } else {
            res.status(404).send({
                message: "Product not found"
            });
        }
        next()
    } catch (err) {
        console.log(err)
    }


};
