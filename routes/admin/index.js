const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const { registerAdmin, loginAdmin, createBook, findAllBooks, findBookById, updateBookById, deleteBookById, getaAllUsers, createBookGenre, getAllOrders, getAllPaymentList, bookGenreStatus, getAllGenres } = require('../../controllers/adminController')
const ADMIN = require('../../models/adminSchema')

const adminAuth = require('../../middleware/adminAuth')
const validators = require('../../utils/validaterequest')

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


router.post('/register', validators('adminRegister') ,registerAdmin)
router.post('/login', passport.authenticate('local'), loginAdmin)

// ========================================= BOOKS API ========================================= //
router.post('/create-book', adminAuth , validators('createBook') ,createBook)
router.post('/genre', adminAuth , validators('createBookGenre'), createBookGenre)
router.get('/find-all-books', adminAuth ,findAllBooks)
router.get('/find-book/:id', adminAuth ,findBookById)
router.put('/update-book/:id', adminAuth , validators('updateBook') , updateBookById)
router.delete('/delete-book/:id', adminAuth ,deleteBookById)
router.post('/genre-status', adminAuth , validators('updateGenreStatus') , bookGenreStatus)

// ========================================= USERS API ========================================= //
router.get('/all-users', adminAuth ,getaAllUsers)

// ========================================= ORDER API ========================================= //

router.get('/all-orders', adminAuth ,getAllOrders)

// ========================================= PAYMENT API ========================================= //

router.get('/payment-list', adminAuth ,getAllPaymentList)
module.exports = router