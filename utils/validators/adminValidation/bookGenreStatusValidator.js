const Joi = require('joi')

const bookGenreStatusValidators = Joi.object({
    genre:Joi.string().empty().required()
    .messages({
        'genre.string':'Book genre must required..',
        'genre.empty':'You can not send empty book genre please enter genre of book..'
    }),
    status:Joi.number().empty().required()
    .messages({
        'status.string':'Book genre must required..',
        'status.empty':'You can not send empty book genre please enter genre of book..'
    })
})

module.exports = bookGenreStatusValidators