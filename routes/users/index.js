const express = require('express')
const { createUser, otpVerification, userLogin, findAllAvailableBooks, addToCart, getCartDetailByLoginUser, viewratingByBook, removeToCart, updateProfile, viewOrderDetail, viewProfile, makeOrder, ratingBooks, payment, recommandBooks, updateRecommandation, findAllRecommandation, getAllGenres, updateratingsByUser , updateUserPassword} = require('../../controllers/userControllers')
const router = express.Router()

const jwtAuth = require('../../middleware/jwtAuth')
const userAuth = require('../../middleware/userAuth')

const validator = require('../../utils/validaterequest');

router.post('/create', createUser)
router.post('/otp', otpVerification)
router.post('/login', userLogin)
router.put('/update', jwtAuth, userAuth, updateProfile)
router.put('/reset-password', jwtAuth, userAuth, updateUserPassword)
router.get('/profile', jwtAuth, userAuth, viewProfile)

router.get('/all-books', jwtAuth , userAuth , findAllAvailableBooks)
router.post('/add-cart', jwtAuth, userAuth, validator('addToCart'), addToCart)
router.post('/remove-cart', jwtAuth, userAuth, validator('removeCart'), removeToCart)
router.get('/show-cart', jwtAuth, userAuth, getCartDetailByLoginUser)

router.get('/order', jwtAuth, userAuth, makeOrder)
router.get('/view-order', jwtAuth, userAuth, viewOrderDetail)

router.get('/all-genre', jwtAuth, userAuth, getAllGenres)

router.post('/recommand', jwtAuth, userAuth, recommandBooks)
router.post('/update-recommandation', jwtAuth, userAuth, updateRecommandation)
router.get('/all-recommandation', jwtAuth, userAuth, findAllRecommandation)

router.post('/rating', jwtAuth, userAuth, validator('bookRating'), ratingBooks)
router.put('/update-rating', jwtAuth, userAuth, validator('updateRatings'), updateratingsByUser)
router.post('/view-rating', jwtAuth, userAuth, validator('viewRatings'), viewratingByBook)

router.post('/payment', jwtAuth, userAuth, validator('payment'), payment)

module.exports = router