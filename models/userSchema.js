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

userSchema.pre('save', async function(next) {
    const email = this.email;
    const isUser = await USER.findOne({ email })
    if(isUser){
        console.log("User found..");
        const error = new Error('Email already exist...');
        const status = 403;
        next({error , status});
    }else{
        next();
    }
})

const USER = mongoose.model('USER', userSchema)
module.exports = USER