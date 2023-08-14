
 //** ADMIN VALIDATION  */
const adminRegister = require('./adminValidation/adminregisterValidator')
const createBookGenre = require('../validators/adminValidation/createBookgenreValidator')
const createBook = require('./adminValidation/createBookValidator')
const updateBook = require('../validators/adminValidation/updateBookvalidator')
const updateGenreStatus = require('../validators/adminValidation/bookGenreStatusValidator')

 //** USER VALIDATION  */
const addToCart = require('../validators/userValidation/addToCartValidator')
const bookRating = require('./userValidation/giveRatingBooksValidators')
const payment = require('../validators/userValidation/paymentvalidation')
const updateRatings = require('../validators/userValidation/updateRatingsValidators')
const viewRatings = require('./userValidation/viewRatingsValidators')
const removeCart = require('../validators/userValidation/removeCartDataValidators')

module.exports = {
    adminRegister,
    createBook,
    createBookGenre,
    updateBook,
    updateGenreStatus,
    addToCart,
    bookRating,
    payment,
    updateRatings,
    viewRatings,
    removeCart
}