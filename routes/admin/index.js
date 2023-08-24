const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const validator = require('../../validators/middleware')
const validation = require('../../validators/rulesRoutes/adminValidation/adminRules')

// const { regiser , BookGenre , book , genreStatus , updateBook } = require('../../validators/rulesRoutes/adminValidation/adminRules')

const { registerAdmin, loginAdmin, createBook, findAllBooks, findBookById, updateBookById, deleteBookById, getaAllUsers, createBookGenre, getAllOrders, getAllPaymentList, bookGenreStatus, getAllGenres } = require('../../controllers/adminController')
const ADMIN = require('../../models/adminSchema')

const adminAuth = require('../../middleware/adminAuth')

// ====================================== PASSPORT LOCAL STRATEGY ===========================================
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const admin = await ADMIN.findById(id);

        if (admin) {
            return done(null, admin)
        }
    } catch (error) {
        return done(error, false)
    }
});

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    async function (username, password, done) {
        try {
            const admin = await ADMIN.findOne({ email: username })
            const bcryptedPass = await bcrypt.compare(password, admin.password)
            if (!admin) return done(null, false)
            if (!bcryptedPass) return done(null, false)
            if (admin) return done(null, admin)
        } catch (error) {
            return done(error, false)
        }
    }
))

router.use(passport.initialize())
router.use(passport.session())

const valid = require('../../utils/validaterequest')

router.post('/register', validation.registerValidation ,registerAdmin)
router.post('/login', passport.authenticate('local'), loginAdmin)

// ========================================= BOOKS API ========================================= //
router.post('/create-book', adminAuth ,validation.createBookValidation , createBook)
router.post('/genre', adminAuth ,validation.createBookGenre, createBookGenre)
router.get('/find-all-books', adminAuth ,findAllBooks)
router.get('/find-book/:id', adminAuth ,findBookById)
router.put('/update-book/:id', adminAuth , updateBookById)
router.delete('/delete-book/:id', adminAuth ,deleteBookById)
router.post('/genre-status', adminAuth ,validation.updateBookGenreStatus, bookGenreStatus)

// ========================================= USERS API ========================================= //
router.get('/all-users', adminAuth ,getaAllUsers)

// ========================================= ORDER API ========================================= //

router.get('/all-orders', adminAuth ,getAllOrders)

// ========================================= PAYMENT API ========================================= //

router.get('/payment-list', adminAuth ,getAllPaymentList)
module.exports = router