const ADMIN = require("../models/adminSchema")
const GENRE = require("../models/bookGenreSchema")
const BOOK = require("../models/bookSchema")
const NOTIFY = require("../models/notificationSchema")
const RECOMMAND = require("../models/recommandationSchema")
const USER = require("../models/userSchema")
const RATING = require("../models/ratingSchema")
const ORDER = require("../models/orderSchema")
const PAYMENT = require("../models/paymentSchema")

const bcrypt = require("bcrypt")
const { successResponce, errorResponse } = require("../validators/handlers/handler")

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const bcryptedPass = await bcrypt.hash(password, 10);

    await ADMIN.create({
      email,
      password: bcryptedPass,
    });

    successResponce('admin registerd..',201,res)
  } catch (error) {
    errorResponse(error,401,res)
  }
}

exports.loginAdmin = async (req, res) => {
  successResponce('admin logged in..',200,res)
}
// ======================================== Books API =============================================

exports.createBookGenre = async (req, res) => {
  try {
    const genre = req.body.genre

    await GENRE.create({ genre })

    successResponce('genre created..',200,res)
  } catch (error) {
    errorResponse(error.error.message,error.status,res)
  }
}

exports.createBook = async (req, res) => {
  try {
    const image = req.file.filename
    const { title, author, price, genre, numbersOfBooks } = req.body
    const status = numbersOfBooks > 0 ? "Available" : "Unavailable"

    const book = await BOOK.create({
      title,
      author,
      genre,
      price,
      numbersOfBooks,
      status,
      image,
    })

    const allData = await RECOMMAND.aggregate([
      { $match: { recommandId: book.genre } },
    ])

    for (let i = 0; i < allData.length; i++) {
      const sendNotification = await NOTIFY.create({
        notification: `new book ${book.title} created in your recommandation..`,
        userId: allData[i].userId,
      })
    }

    successResponce('new book added..')
  } catch (error) {
    errorResponse(error.error.message,error.status,res)
  }
}

exports.findAllBooks = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1
    const actualpage = parseInt(page) - 1
    const record = actualpage * 3

    const searchData = req.query.search
      ? {
        $match: {
          $or: [
            { title: req.query.search },
            { author: req.query.search },
            { status: req.query.search },
          ],
        },
      }
      : { $match: {} }

    const book = await BOOK.aggregate([searchData])
      .skip(record)
      .limit(3)
      .project({ createdAt: 0, updatedAt: 0, __v: 0 })

    successResponce(book,200,res)
  } catch (error) {
    errorResponse(error.message,401,res)
  }
}

exports.findBookById = async (req, res) => {
  try {
    const id = req.params.id

    const book = await BOOK.findById(id)

    successResponce(book,200,res)
  } catch (error) {
    errorResponse(error.message,401,res)
  }
}

exports.updateBookById = async (req, res) => {
  try {
    const id = req.params.id
    const { title, author, genre, price, numbersOfBooks } = req.body
    const status = numbersOfBooks > 0 ? "Available" : "Unavailable"

    await BOOK.findByIdAndUpdate(id, {
      title,
      author,
      genre,
      price,
      numbersOfBooks,
      status,
    })

    successResponce('book updated..',200,res)
  } catch (error) {
    errorResponse(error.message,401,res)
  }
}

exports.deleteBookById = async (req, res) => {
  try {
    const id = req.params.id

    await BOOK.findByIdAndRemove(id)

    successResponce('book deleted..',200,res)
  } catch (error) {
    errorResponse(error.message,401,res)
  }
}

exports.bookGenreStatus = async (req, res) => {
  try {
    const { bookGenre , status } = req.body

    const updateGenre = await GENRE.findOneAndUpdate(
      { genre: bookGenre },
      { status }
    )

    successResponce('book genre status changed..',200,res)
  } catch (error) {
    errorResponse(error.message,401,res)
  }
}

// ======================================== Users API =============================================

exports.getaAllUsers = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1
    const actualpage = parseInt(page) - 1
    const record = actualpage * 2

    const searchData = req.query.search
      ? {
        $match: {
          $or: [{ fullname: req.query.search }, { email: req.query.search }],
        },
      }
      : { $match: {} }

    const allUsers = await USER.aggregate([searchData])
      .skip(record)
      .limit(3)
      .project({
        otpVerification: 0,
        createdAt: 0,
        password: 0,
        token: 0,
        updatedAt: 0,
        otp: 0,
        __v: 0,
      })

    successResponce({users:allUsers,msg:'All users found..'},200,res)
  } catch (error) {
    errorResponse(error.message,401,res)
  }
}

// ======================================== Orders API =============================================

exports.getAllOrders = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1
    const actualpage = parseInt(page) - 1
    const record = actualpage * 2

    const ordersList = await ORDER.aggregate()
      .skip(record)
      .limit(2)
      .project({ createdAt: 0, updatedAt: 0, __v: 0 })

    successResponce(ordersList,200,res)
  } catch (error) {
    errorResponse(error,401,res)
  }
}

// ======================================== Payment API =============================================

exports.getAllPaymentList = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1
    const actualpage = parseInt(page) - 1
    const record = actualpage * 2

    const paymentList = await PAYMENT.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ])
      .skip(record)
      .limit(2)
      .project({
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        "user._id": 0,
        "user.token": 0,
        "user.otpVerification": 0,
        "user.otp": 0,
        "user.password": 0,
        "user.createdAt": 0,
        "user.updatedAt": 0,
        "user.__v": 0,
      })

    successResponce(paymentList,200,res)
  } catch (error) {
    errorResponse(error.message,401,res)
  }
}
