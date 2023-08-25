const express = require('express')

const { createUser, otpVerification, userLogin,deleteUser,logout, findAllAvailableBooks, addToCart, getCartDetailByLoginUser, viewratingByBook, removeToCart,removeBookQuntityInCart, updateProfile, viewOrderDetail, viewProfile, makeOrder, ratingBooks, payment, recommandBooks, updateRecommandation, findAllRecommandation, getAllGenres, updateratingsByUser , updateUserPassword} = require('../../controllers/userControllers')
const router = express.Router()

const validation = require('../../validators/rulesRoutes/usersvalidation/userRules')

const jwtAuth = require('../../middleware/jwtAuth')
const userAuth = require('../../middleware/userAuth')

router.post('/create',validation.registerUser,createUser)
router.post('/otp', validation.verifyOTP , otpVerification)
router.post('/login',validation.loginUser,userLogin)
router.put('/update', jwtAuth, userAuth,updateProfile)
router.put('/reset-password', jwtAuth, userAuth, validation.resetPassword,updateUserPassword)
router.get('/profile', jwtAuth, userAuth, viewProfile)
router.delete('/delete',jwtAuth,userAuth,deleteUser)
// router.post('/logout',userAuth,logout)
router.post('/logout',jwtAuth,userAuth,logout)

router.get('/all-books', jwtAuth , userAuth , findAllAvailableBooks)
router.post('/add-cart', jwtAuth, userAuth,validation.createCart,addToCart)
router.post('/remove-cart', jwtAuth, userAuth,validation.removeCart,removeToCart)
router.post('/removebook-quntity' ,jwtAuth , userAuth , validation.removeBookQuntityFromCart, removeBookQuntityInCart)
router.get('/show-cart', jwtAuth, userAuth, getCartDetailByLoginUser)

router.get('/order', jwtAuth, userAuth, makeOrder)
router.get('/view-order', jwtAuth, userAuth, viewOrderDetail)

router.get('/all-genre', jwtAuth, userAuth, getAllGenres)

router.post('/recommand', jwtAuth, userAuth, recommandBooks)
router.post('/update-recommandation', jwtAuth, userAuth, validation.updateBookRecommandation, updateRecommandation)
router.get('/all-recommandation', jwtAuth, userAuth, findAllRecommandation)

router.post('/rating', jwtAuth, userAuth, validation.bookRatings,  ratingBooks)
router.put('/update-rating', jwtAuth, userAuth, validation.updateBookRatings, updateratingsByUser)
router.post('/view-rating', jwtAuth, userAuth, viewratingByBook)

router.post('/payment', jwtAuth, userAuth , validation.payment,payment)

//?<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Empliment cron jobs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



module.exports = router