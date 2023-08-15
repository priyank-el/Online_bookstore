const mongoose = require('mongoose')

const bookGenreSchema = new mongoose.Schema({
    genre: {
        type: String,
        // unique: true    // `genre` must be unique  => if you just check then its ohk, but you can not set custom error from here
    },
    status: {
        type: Number,
        default: 1
    }
})

//** With the help of Schema.pre we can check or throught our errors.. */
bookGenreSchema.pre('save', async function(next) {
    const genre = this.genre;
    const isGenre = await GENRE.findOne({ genre })
    if(isGenre){
        const error = new Error('Email already exist...');
        const status = 403;
        next({error , status});
    }else{
        next();
    }
})

const GENRE = mongoose.model('GENRE', bookGenreSchema)
module.exports = GENRE