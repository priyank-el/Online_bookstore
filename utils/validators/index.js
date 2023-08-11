const adminRegister = require('./adminValidation/adminregisterValidator')
const createBookGenre = require('../validators/adminValidation/createBookgenreValidator')
const createBook = require('./adminValidation/createBookValidator')
const updateBook = require('../validators/adminValidation/updateBookvalidator')

module.exports = {
    adminRegister,
    createBook,
    createBookGenre,
    updateBook
}