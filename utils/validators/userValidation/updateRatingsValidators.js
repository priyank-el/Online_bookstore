const Joi = require('joi')

const updateBookRatingsValidators = Joi.object({
    book:Joi.string()
    .required()
    .messages({
        'book.string':'BookId must be required..',
        'book.required':'BookId is not optinal..'
    }),
    rating:Joi.number()
    .min(0)
    .max(5)
    .required()
    .messages({
        'quntity.string':'quntity must required..',
        'quntity.required':'quntity is not optinal..',
        'quntity.min':'you can not give rating less than 0..',
        'quntity.max':'you can not insert more than 5..'
    }),
    review:Joi.string()
    .required()
    .messages({
        'review.string':'review must be required..',
        'review.required':'review is not optinal..'
    }),
})
module.exports = updateBookRatingsValidators