const adminRegister = require('./adminValidation/adminregisterValidator')
const createBookGenre = require('../validators/adminValidation/createBookgenreValidator')
const createBook = require('./adminValidation/createBookValidator')
const updateBook = require('../validators/adminValidation/updateBookvalidator')
const updateGenreStatus = require('../validators/adminValidation/bookGenreStatusValidator')
const addToCart = require('../validators/userValidation/addToCartValidator')
const bookRating = require('./userValidation/giveRatingBooksValidators')

module.exports = {
    adminRegister,
    createBook,
    createBookGenre,
    updateBook,
    updateGenreStatus,
    addToCart,
    bookRating
}