const Joi = require('joi')
const GENRE = require('../../../models/bookGenreSchema')

async function checkGenre(genre){
    const isAvailable = await GENRE.findOne({ genre })
    return isAvailable
}

const createBookGenreValidator = Joi.object({
    genre:Joi.string()
    .empty()
    .required()
    .external(async (genre) => {
        const isgenre = await checkGenre(genre)
        if(isgenre) {
            const error = new Error('Genre already has..');
            throw error;
        }
        return genre
    })
    .messages({
        'genre.string':'Book genre must required..',
        'genre.empty':'You can not send empty book genre please enter genre of book..'
    })
})

module.exports = createBookGenreValidator