const validation = require('../../middleware')

exports.registerUser = (req,res,next) => {
    const registerUser = {
        fullname:'required',
        email:'required|isUniqueemail:USER,email',
        password:'required'
    }

    validation.validaeWithCallback(registerUser , req , res , next)
}

exports.verifyOTP = (req,res,next) => {
    const otp = {
        otp:'required'
    }

    validation.validaeWithCallback(otp , req , res , next)
}

exports.loginUser = (req,res,next) => {
    const loginUser = {
        email:'required',
        password:'required'
    }

    validation.validaeWithCallback(loginUser , req , res , next)
}

exports.resetPassword = (req , res , next) => {
    const resetPassword = {
        oldPassword:'required',
        newPassword:'required'
    }

    validation.validaeWithCallback(resetPassword , req , res , next)
}

exports.createCart = (req,res,next) => {
    const cart = {
        bookId : 'required',
        quntity:'required|min:1'
    }

    validation.validaeWithCallback(cart , req, res, next)
}

exports.removeCart = (req,res,next) => {
    const cart = {
        cartId : 'required'
    }

    validation.validaeWithCallback(cart , req, res, next)
}

exports.payment = (req,res,next) => {
    const payment = {
       orderId:'required'
    }

    validation.validaeWithCallback(payment , req, res, next)
}

exports.bookRatings = (req,res,next) => {
    const ratings = {
        book : 'required',
        rating : 'required|min:1|max:5',
        review : 'required'
    }

    validation.validaeWithCallback(ratings,req,res,next)
}

exports.updateBookRatings = (req,res,next) => {
    const updateRatings = {
        book : 'required',
        rating : 'min:1|max:5'
    }

    validation.validaeWithCallback(updateRatings,req,res,next)
}

exports.updateBookRecommandation = (req,res,next) => {
    const deleteRecommandation  = {
        id:'required'
    }

    validation.validaeWithCallback(deleteRecommandation,req,res,next)
}

exports.removeBookQuntityFromCart = (req,res,next) => {
    const deleteRecommandation  = {
        bookId:'required',
        quntity:'required|min:1'
    }

    validation.validaeWithCallback(deleteRecommandation,req,res,next)
}
