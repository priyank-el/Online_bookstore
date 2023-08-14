const Joi = require('joi');

const paymentvalidation = Joi.object({
    orderId:Joi.string()
    .required()
    .messages({
        'orderId.string':'orderId must be required..',
        'orderId.required':'orderId is not optinal..'
    })
})
module.exports = paymentvalidation