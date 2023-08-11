const mongoose = require('mongoose')

const bookGenreSchema = new mongoose.Schema({
    genre: {
        type: String,
    },
    status: {
        type: Number,
        default: 1,
        enum:[0,1]
    }
})

const GENRE = mongoose.model('GENRE', bookGenreSchema)

module.exports = GENRE