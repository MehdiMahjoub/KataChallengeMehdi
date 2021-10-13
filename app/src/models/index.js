"use strict";

const path = require('path');
const config = require('../tools/config_tool')(path.join(__dirname, 'config/env'));
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = config.get("db:url");
db.product = require("./product.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);


// //function to add a user
// db.addUser = async (user) => {
//     await user.save(function (err) {
//         if (err) return handleError(err);
//     })
//     return user;
// }

//function add arary of users
db.addUsers = async (users) => {
    try {
        await db.user.create(users);
        console.log('data is imported');
    } catch (error) {
        console.error(error);
    }
}

//function add arary of products
db.addProducts = async (products) => {
    try {
        await db.product.create(products);
        console.log('data is imported');
    } catch (error) {
        console.error(error);
    }

}

// function delete all users (use it in test)
db.deleteAllUsers = async () => {
    return await db.user.deleteMany();
};
//find a user by email
db.findUser = async (params) => {
    if (!params) {
        return await db.user.find()
    }
    return await db.user.find(params)
};

// function to save a new product
db.createProduct = async (product) => {
    await product.save(function (err) {
        if (err) return handleError(err);
    })
    return product;
}

//find all or one product by params
db.findProducts = async (params) => {
    if (!params) {
        return await db.product.find()
    }
    return await db.product.find(params)
};


// find all catogery
db.findCategorys = async () => {
    return await db.product.find().select('category');
}

// function find product by id
db.findProductById = async (id) => {
    return await db.product.findById(id);
};

// function update product by id
db.updateProductById = async (id, obj) => {
    return await db.product.findByIdAndUpdate(id, obj, { useFindAndModify: false })
}

// function remove product by id
db.removeProductById = async (id) => {
    return await db.product.findByIdAndRemove(id, { useFindAndModify: false });
};

// function delete all products (use it in test)
db.deleteAllProducts = async () => {
    return await db.product.deleteMany();
};

// function init db with some data
db._initDb = async () => {
    const data = [
        {
            "name": "my init product 1",
            "category": "my category test 1",
            "sku": "skuTest1",
            "price": 300,
            "quantity": 10
        },
        {
            "name": "my init product 2",
            "category": "my category test 2",
            "sku": "skuTest2",
            "price": 200,
            "quantity": 20
        },
        {
            "name": "my init product 3",
            "category": "my category test 3",
            "sku": "skuTest3",
            "price": 100,
            "quantity": 30
        }
    ]
    let dataDb = await db.product.find();
    if (!(dataDb && dataDb.length > 0)) {
        await db.product.create(data);
    }

    return data;

};

module.exports = db;