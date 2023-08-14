const express = require('express')
const { createUser, otpVerification, userLogin, findAllAvailableBooks, addToCart, getCartDetailByLoginUser, viewratingByBook, removeToCart, updateProfile, viewOrderDetail, viewProfile, makeOrder, ratingBooks, payment, recommandBooks, updateRecommandation, findAllRecommandation, getAllGenres, updateratingsByUser } = require('../../controllers/userControllers')
const router = express.Router()

const jwtAuth = require('../../middleware/jwtAuth')
const userAuth = require('../../middleware/userAuth')

const validator = require('../../utils/validaterequest');

router.post('/create', createUser)
router.post('/otp', otpVerification)
router.post('/login', userLogin)
router.get('/all-books', jwtAuth , userAuth , findAllAvailableBooks)

router.post('/add-cart', jwtAuth, userAuth, validator('addToCart'), addToCart)
router.post('/remove-cart', jwtAuth, userAuth, removeToCart)
router.get('/show-cart', jwtAuth, userAuth, getCartDetailByLoginUser)

router.put('/update', jwtAuth, userAuth, updateProfile)
router.get('/profile', jwtAuth, userAuth, viewProfile)
router.get('/order', jwtAuth, userAuth, makeOrder)
router.get('/view-order', jwtAuth, userAuth, viewOrderDetail)
router.post('/payment', jwtAuth, userAuth, payment)
router.post('/view-rating', jwtAuth, userAuth, viewratingByBook)
router.post('/recommand', jwtAuth, userAuth, recommandBooks)

router.post('/update-recommandation', jwtAuth, userAuth, updateRecommandation)
router.get('/all-recommandation', jwtAuth, userAuth, findAllRecommandation)
router.get('/all-genre', jwtAuth, userAuth, getAllGenres)

router.post('/rating', jwtAuth, userAuth, validator('bookRating'), ratingBooks)
router.put('/update-rating', jwtAuth, userAuth, updateratingsByUser)

module.exports = router