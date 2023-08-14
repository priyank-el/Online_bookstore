const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    otp: {
        type: String
    },
    token: {
        type: String
    },
    otpVerification: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        get: function (image) {
            let modifiedImage = image ? `http://localhost:4000/images/${image}` : null
            return modifiedImage
        }
    }
},
    { toJSON: { getters: true } },
    { timestamps: true })

const USER = mongoose.model('USER', userSchema)
module.exports = USER