const Joi = require('joi');

const addToCartValidator = Joi.object({
    bookId:Joi.string()
    .required()
    .messages({
        'bookId.string':'BookId must be required..',
        'bookId.required':'BookId is not optinal..'
    }),
    quntity:Joi.number()
    .min(1)
    .required()
    .messages({
        'quntity.string':'quntity must required..',
        'quntity.required':'quntity is not optinal..',
        'quntity.min':'you can not insert less than 1..'
    }),
})
module.exports = addToCartValidator