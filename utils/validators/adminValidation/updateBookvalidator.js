const Joi = require('joi')

const updateBookvalidator = Joi.object({
    title:Joi.string().empty().required()
    .messages({
        'title.string':'Book title must required..',
        'title.empty':'You should insert your book title..'
    }),
    author:Joi.string().empty().required()
    .messages({
        'author.string':'Book author must required..',
        'author.empty':'You should insert your book author name if author not exist then wright valid publisher name..'
    }),
    genre:Joi.string().empty().required()
    .messages({
        'genre.string':'Book genre must required..',
        'genre.empty':'You should insert your book genre..'
    }),
    price:Joi.string().empty().required()
    .messages({
        'price.string':'Book price must required..',
        'price.empty':'You should insert your book actual price..'
    }),
    numbersOfBooks:Joi.number().empty().required()
    .messages({
        'numbersOfBooks.number':'Book quantity must required..',
        'numbersOfBooks.number':'You can not enter empty quntity book..'
    })
})

module.exports = updateBookvalidator