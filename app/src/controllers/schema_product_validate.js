const Joi = require('joi')

const schemaProduct = Joi.object({
    name: Joi.string().min(3).max(50).trim().required(),
    category: Joi.string().min(3).max(50).trim().required(),
    sku: Joi.string().min(3).max(20).trim().required(),
    price: Joi.number().min(1).required(),
    quantity: Joi.number().min(1).required(),
})

module.exports = schemaProduct
