const Joi = require('joi')

const createBookGenreValidator = Joi.object({
    genre:Joi.string().empty().required()
    .messages({
        'genre.string':'Book genre must required..',
        'genre.empty':'You can not send empty book genre please enter genre of book..'
    })
})

module.exports = createBookGenreValidator