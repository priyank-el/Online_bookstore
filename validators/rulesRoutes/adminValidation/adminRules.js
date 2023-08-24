
const validate = require('../../middleware')

exports.registerValidation = async (req,res,next) => {
    const regiser = {
        email:'required|isUniqueemail:ADMIN,email',
        password:'required'
    }

    validate.validaeWithCallback(regiser , req , res , next)
}
exports.createBookValidation = async (req,res,next) => {

    req.body.numbersOfBooks = parseInt(req.body.numbersOfBooks)
    req.body.price = parseInt(req.body.price)

    const book = {
        title:'required|isUniqueTitle',
        author:'required',
        price:'required|min:1',
        numbersOfBooks:'required|min:1',
        genre:'required'
    }

    validate.validaeWithCallback(book , req , res , next)
}

exports.createBookGenre = async (req,res,next) => {
    const genre = {
        genre:'required|isGenreExist'
    }

    validate.validaeWithCallback(genre , req , res , next)
}

exports.updateBookGenreStatus = async (req,res,next) => {
    req.body.status = parseInt(req.body.status)
    const updateGenre = {
        genre:'required',
        status:'required|min:0|max:1'
    }

    validate.validaeWithCallback(updateGenre , req , res , next)
}
