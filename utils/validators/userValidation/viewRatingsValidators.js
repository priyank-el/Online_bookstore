const Joi = require('joi')

const viewRatingsValidators = Joi.object({
    bookId:Joi.string()
    .required()
    .messages({
        'bookId.string':'BookId must be required..',
        'bookId.required':'BookId is not optinal..'
    })
})

module.exports = viewRatingsValidators