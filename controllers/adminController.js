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

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const bcryptedPass = await bcrypt.hash(password, 10)

    const admin = await ADMIN.create({
      email,
      password: bcryptedPass,
    })

    return res.status(201).json({
      success: true,
      message: "admin created successfully...",
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "admin not created successfully...",
    })
  }
}

exports.loginAdmin = async (req, res) => {
  return res.json({
    success: true,
    message: "Admin login successfully...",
  })
};
// ======================================== Books API =============================================

exports.createBookGenre = async (req, res) => {
  try {
    const genre = req.body.genre

    const isAvailable = await GENRE.findOne({ genre })

    if (isAvailable) {
      const error = new Error("Book genre already exist..")
      throw error
    }

    const createGenre = await GENRE.create({
      genre,
    })

    return res.json({
      success: true,
      message: "Genre created successfully...",
    })
  } catch (error) {
    return res.json({
      success: false,
      message: "Book genre not created...",
    })
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

    console.log(allData)

    for (let i = 0; i < allData.length; i++) {
        const sendNotification = await NOTIFY.create({
          notification: `new book ${book.title} created in your recommandation..`,
          userId: allData[i].userId,
        })
    }

    return res.status(201).json({
      success: true,
      message: "Book Created successfully...",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Book not created by user..",
    })
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

    return res.status(200).json({
      success: true,
      message: "All books found...",
      book,
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Book not found..",
    })
  }
}

exports.findBookById = async (req, res) => {
  try {
    const id = req.params.id

    const book = await BOOK.findById(id)

    return res.status(200).json({
      success: true,
      message: "All users found...",
      book,
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Book not found..",
    })
  }
}

exports.updateBookById = async (req, res) => {
  try {
    const id = req.params.id
    const { title, author, genre, price, numbersOfBooks } = req.body

    const status = numbersOfBooks > 0 ? "Available" : "Unavailable"

    const book = await BOOK.findByIdAndUpdate(id, {
      title,
      author,
      genre,
      price,
      numbersOfBooks,
      status,
    })

    return res.json({
      success: true,
      message: "book Updated successfully...",
    })
  } catch (error) {
    return res.json({
      success: false,
      message: "Book not updated..",
    })
  }
}

exports.deleteBookById = async (req, res) => {
  try {
    const id = req.params.id

    const book = await BOOK.findByIdAndRemove(id)

    return res.json({
      success: true,
      message: "book Deleted successfully...",
    })
  } catch (error) {
    return res.json({
      success: false,
      message: 'Book not  deleted..'
    })
  }
}

exports.bookGenreStatus = async (req, res) => {
  try {
    const bookGenre = req.body.genre
    const status = req.body.status

    const updateGenre = await GENRE.findOneAndUpdate(
      { genre: bookGenre },
      { status }
    )

    return res.json({
      success: true,
      message: "Book genre status changed...",
    })
  } catch (error) {
    return res.json({
      success: false,
      messsage: "Filed to change status of book genres..",
    })
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

    return res.json({
      success: true,
      messsage: "All users found...",
      allUsers,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: "can not found all users data..",
    })
  }
}

// ======================================== Orders API =============================================

exports.getAllOrders = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 2;

    const allOrders = await ORDER.find().count();
    const totalPage = parseInt(allOrders / 2);

    const ordersList = await ORDER.aggregate()
      .skip(record)
      .limit(2)
      .project({ createdAt: 0, updatedAt: 0, __v: 0 });

    if (!ordersList) {
      const error = new Error("All orders not found...");
      throw error;
    }

    const orders = allOrders.length > 0 ? allOrders : "Not any pending oredrs available...";

    return res.json({
      success: true,
      data: orders,
      totalPage,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
};

// ======================================== Payment API =============================================

exports.getAllPaymentList = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 2;

    const allPayment = await PAYMENT.find().count();
    const totalPage = parseInt(allPayment / 2);

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
      });

    return res.json({
      success: true,
      list: paymentList,
      totalPage,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: 'Some error occurs..',
    })
  }
}
