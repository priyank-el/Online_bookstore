const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'USER'
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'ORDER'
    },
    totalPrice: {
        type: String
    }
}, {
    timestamps:true
})

const PAYMENT = mongoose.model('PAYMENT', paymentSchema)

module.exports = PAYMENT