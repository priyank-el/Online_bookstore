const mongoose = require('mongoose')

const bookSchema = new mongoose
    .Schema({
        title: String,
        author: String,
        genre: {
            type: mongoose.Types.ObjectId,
            ref: 'GENRE'
        },
        image: {
            type: String,
            get: (image) => image ? `http://localhost:4000/images/${image}` : null
        },
        price: {
            type: String
        },
        numbersOfBooks: {
            type: Number
        },
        ratingId: {
            type: mongoose.Types.ObjectId,
            ref: 'RATING'
        },
        status: {
            type: String,
            enum: ['Available', 'Unavailable'],
            default: 'Unavailable'
        }
    },
        { timestamps: true })


bookSchema.pre('save', async function(next) {
    const title = this.title;
    const isBook = await BOOK.findOne({ title })
    if(isBook){
        const error = new Error('Same name Book already exist...');
        const status = 403;
        next({error , status});
    }else{
        next();
    }
})

const BOOK = mongoose.model('BOOK', bookSchema)
module.exports = BOOK