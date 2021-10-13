'use strict';

const logger = require('../tools/logger_tools').getLogger();
const fs = require("fs");
const db = require('../models');

// Load models
const User = db.user;

const catalog = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/electronic-catalog.json`, 'utf-8')
);


const usersData = catalog.users;
const productsData = catalog.products;


// import all data from json file
exports.seedImport = async (req, res, next) => {

    try {

        let [resultSaveUsers, resultSaveProducts] = await Promise.all([db.addUsers(usersData), db.addProducts(productsData)]);


        if ((resultSaveUsers == undefined) && (resultSaveProducts == undefined)) {
            logger.info('data is imported', { tags: 'addData' });
            res.status(200).send({
                message: 'data is imported'
            })
        } else {
            logger.error('data is not imported or not imported completely', { tags: 'addData' });
        }

        next()
    } catch (err) {
        logger.error(err, { tags: 'addData' });
    }
}

// delete All db for test
exports.deleteAllDb = async (req, res, next) => {

    try {

        let [resultDeleteUsers, resultDeleteProducts] = await Promise.all([db.deleteAllUsers(), db.deleteAllProducts()]);

        console.log(resultDeleteUsers);
        console.log(resultDeleteProducts);
        
        if ((resultDeleteUsers.deletedCount != 0) && (resultDeleteProducts.deletedCount != 0)) {
            
            logger.info('data is deleted', { tags: 'deletedData' });
            res.status(204);
        } else {
            logger.error('data is not deleted or not deleted completely', { tags: 'deletedData' });
        }

        next()
    } catch (err) {
        logger.error(err, { tags: 'deletedData' });
    }


}