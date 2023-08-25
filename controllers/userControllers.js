
const USER = require("../models/userSchema");
const BOOK = require("../models/bookSchema");
const CART = require("../models/cartSchema");
const RECOMMAND = require("../models/recommandationSchema");
const GENRE = require("../models/bookGenreSchema");
const ORDER = require("../models/orderSchema");
const RATING = require("../models/ratingSchema");
const PAYMENT = require("../models/paymentSchema");
// const {createClient} = require('redis')
// const client = createClient()

const bcrypt = require("bcrypt");
const fs = require("fs");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
var jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const {errorResponse , successResponce} =require('../validators/handlers/handler');
const { required } = require("joi");

const TokenGenerator = require("token-generator")({
  salt: "your secret ingredient for this magic recipe",
  timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
});

exports.createUser = async (req, res) => {
  try {
    const { fullname, email } = req.body;
    const pass = req.body.password;

    var token = TokenGenerator.generate();
    const password = await bcrypt.hash(pass, 10);

    // ========================================== OTP GENERATOR =============================================
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const user = await USER.create({
      fullname,
      email,
      password,
      otp,
      token,
    });

    // ========================================== TRANSPORTER FOR NODEMAILER =============================================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    // send mail with defined transport object
    try {
      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL, // sender address
        to: user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `Hello ${user.username}, Your otp is ${otp} `, // plain text body
      });
    } catch (error) {
      console.log(error);
    }

    successResponce({token:token , success:'User registered..'},201,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.otpVerification = async (req, res) => {
  try {
    const token = req.headers.token;
    const otp = req.body.otp;

    const user = await USER.findOne({ token });

    if (otp !== user.otp) {
      throw 'otp not correct..'
    }

    const userUpdate = await USER.findByIdAndUpdate(user.id, {
      otpVerification: true,
    });

    successResponce('otp verified..',200,res)
  } catch (error) {
    errorResponse(error,401,res)
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await USER.findOne({ email });

    if (!user.otpVerification) {
      throw 'otp verification fail..'
    }

    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      throw "Wrong password..."
    }

    const jwtToken = jwt.sign({ email }, process.env.SECRET, {
      expiresIn: "12h",
    });

    if (!jwtToken) {
      throw "Token not found..."
    }

    // res.cookie("JwtToken", jwtToken);                          => Working with cookies..
    
    // await client.connect()
    await client.set('token',jwtToken)

    successResponce("user login done.." , 200 , res)
  } catch (error) {
    errorResponse(error , 400 , res)
  }
};

exports.logout = async (req,res) => {
try {
    res.clearCookie("JwtToken")
  
    successResponce('user logout..',200,res)
} catch (error) {
  errorResponse(error.message,400,res)
}
}

exports.findAllRecommandation = async (req, res) => {
  try {
    const user = req.user;

    const allRecommandation = await RECOMMAND.aggregate([
      { $match: { userId: user.id } },
      {
        $lookup: {
          from: "genres",
          localField: "recommandId",
          foreignField: "_id",
          as: "recommandId.genre",
        },
      },
    ]).project({
      _id: 0,
      __v: 0,
      "recommandId.genre._id": 0,
      "recommandId.genre.__v": 0,
      "recommandId.genre.status": 0,
    });

    const message =
      allRecommandation.length > 0
        ? "All available recommandation fetched..."
        : "right now no recommandation found..";

    successResponce(allRecommandation[0].recommandId , 200 , res)
  } catch (error) {
    errorResponse(error , 400 , res)
  }
};

exports.getAllGenres = async (req, res) => {
  try {
    const allGenre = await GENRE.aggregate([{ $match: { status: 1 } }]).project(
      {
        _id: 1,
        genre: 1,
      }
    );

    successResponce(allGenre , 200 , res)
  } catch (error) {
    errorResponse(error , 400 , res)
  }
};

exports.recommandBooks = async (req, res) => {
  try {
    const user = req.user;
    const id = req.body.id;

    const isAvailable = await RECOMMAND.findOne({ userId: user._id });

    if (isAvailable) {
      let array = [];
      array = isAvailable.recommandId;
      array = array.concat(id);
      try {
        await RECOMMAND.findByIdAndUpdate(
          isAvailable._id,
          {
            recommandId: array,
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await RECOMMAND.create({
          userId: user._id,
          recommandId: id,
        });
      } catch (error) {
        console.log(error);
      }
    }

    successResponce('Add as recommad Id..' , 200 , res)
  } catch (error) {
    errorResponse(error , 202  , res)
  }
};

exports.updateRecommandation = async (req, res) => {
  try {
    const user = req.user;
    const id = req.body.id;

    const findRecommandation = await RECOMMAND.findOne({ userId: user._id });

    for (let i = 0; i < findRecommandation.recommandId.length; i++) {
      if (id == findRecommandation.recommandId[i]) {
        const updatedIds = findRecommandation.recommandId.splice(i - 1, 1);
        try {
          const updateRecommandation = await RECOMMAND.findOneAndUpdate(
            { userId: user._id },
            {
              recommandId: updatedIds,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    }

    successResponce("book removed from recommandation..." , 200 , res)
  } catch (error) {
    errorResponse(error , 400 , res)
  }
};

exports.findAllAvailableBooks = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 5;

    const totalBook = await BOOK.find().count();
    const totalPages = totalBook / 5;

    const searchData = req.query.search
      ? {
          $match: {
            $or: [
              { title: req.query.search },
              { author: req.query.search },
              { "genre.genre": req.query.search },
            ],
          },
        }
      : { $match: {} };

    const books = await BOOK.aggregate([
      { $match: { status: "Available" } },
      {
        $lookup: {
          from: "ratings",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$bookId", "$$id"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                let: { userId: "$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$userId"],
                      },
                    },
                  },
                ],
                as: "user",
              },
            },
            { $unwind: "$user" },
            {
              $project: {
                "user._id": 0,
                "user.password": 0,
                "user.otp": 0,
                "user.token": 0,
                "user.otpVerification": 0,
                "user.createdAt": 0,
                "user.updatedAt": 0,
                "user.__v": 0,
              },
            },
          ],
          as: "ratings_and_reviews",
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genre",
        },
      },
      {
        $unwind: {
          path: "$genre",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: [
          "ratings_and_reviews._id",
          "ratings_and_reviews.__v",
          "ratings_and_reviews.bookId",
        ],
      },
      searchData,
    ])
      .skip(record)
      .limit(5)
      .project({
        genre: "$genre.genre",
        rating_and_reviews: "$ratings_and_reviews",
        title: 1,
        author: 1,
        image: 1,
        price: 1,
        numbersOfBooks: 1,
        avg: { $avg: "$ratings_and_reviews.rating" },
      });

    successResponce(books,200,res)
  } catch (error) {
    errorResponse(error,202,res)
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { bookId, quntity } = req.body;

    const book = await BOOK.findById(bookId);

    if (book.numbersOfBooks < quntity) {
      throw "book not add to cart bcz of low quntity.."
    }

    const oldCart = await CART.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: ["$bookId", { $toObjectId: bookId }] } },
            { $expr: { $eq: ["$userId", { $toObjectId: req.user._id }] } },
          ],
        },
      },
    ]);

    const userCart =
      oldCart.length > 0
        ? await CART.findByIdAndUpdate(oldCart[0]._id, {
            quntity: oldCart[0].quntity + quntity,
          })
        : await CART.create({
            bookId,
            userId: req.user.id,
            quntity,
          });

    successResponce("Cart creeated successfully...",200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.getCartDetailByLoginUser = async (req, res) => {
  try {
    const cartDetail = await CART.aggregate([
      { $match: { userId: req.user._id } },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "detail",
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "detail.genre",
          foreignField: "_id",
          as: "genre_of_book",
        },
      },
      { $unset: ["_id"] },
      { $unwind: "$detail" },
      { $unwind: "$genre_of_book" },
    ]).project({
      genre: "$genre_of_book.genre",
      title: "$detail.title",
      author: "$detail.author",
      price: "$detail.price",
      bookId: "$detail._id",
      quntity: 1,
      total_price_Of_book: {
        $multiply: [{ $toInt: "$quntity" }, { $toDouble: "$detail.price" }],
      },
    });

    successResponce(cartDetail,200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.removeToCart = async (req, res) => {
  try {
    const { cartId } = req.body;

    const removeCart = await CART.findByIdAndDelete(cartId)

    successResponce('Remove cart data..',200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.removeBookQuntityInCart = async (req,res) => {
  try {
    const { bookId , quntity } = req.body
  
    const bookid = new mongoose.Types.ObjectId(bookId)
  
    const cartData = await CART.aggregate([
      { $match : { $and : [ { userId : req.user._id }, {bookId:bookid} ] }  }
    ])
  
    if(quntity > cartData[0].quntity){
      throw 'invalid quntity input..'
    }
  
    const result = cartData.map((book) => {
      book.quntity = book.quntity - quntity
    })
  
    if(cartData[0].quntity == 0){
      await CART.findOneAndDelete({ userId:req.user._id })
    }else{
      await CART.findOneAndUpdate({ userId : req.user._id } , {
        quntity : cartData[0].quntity
      })
    }
  
    successResponce('Book quantity updated..',200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { fullname, email } = req.body;
    const image = req.file.filename;

    if (req.user.image) {
      fs.unlink(`public/images/${req.user.image}`, (e) => {
        if (e) {
          console.log(e);
        } else {
          console.log("file deleted success..");
        }
      });
    }

    const updateUser = await USER.findByIdAndUpdate(req.user._id, {
      fullname,
      email,
      image,
    });

    successResponce('User profile updated successfully..',200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const isCorrect = await bcrypt.compare(oldPassword, req.user.password);

    if (isCorrect) {
      const bcryptPassword = await bcrypt.hash(newPassword, 10);
      const resetPassword = await USER.findByIdAndUpdate(req.user._id, {
        password: bcryptPassword,
      });
    }

    if (!isCorrect) {
      throw "Password wrong.."
    }

    successResponce('Password updated..',200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.viewProfile = async (req, res) => {
  try {
    const viewUser = await USER.findById(req.user._id, {
      fullname: 1,
      email: 1,
      image: 1,
    });

    successResponce(viewUser,200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.deleteUser = async (req,res) => {
try {
    await USER.findByIdAndDelete(req.user._id)
  
    successResponce('user deleted..',200,res)
} catch (error) {
  errorResponse(error,400,res)
}
}

exports.makeOrder = async (req, res) => {
  try {
    const cartdata = await CART.aggregate([
      { $match: { userId: req.user._id } },
      { $unset: ["__v", "_id", "userId"] },
    ]);

    const order = await ORDER.create({
      about_book: cartdata,
      userId: req.user._id,
    })

    const detail = await ORDER.aggregate([
      {
        $match: {
          $and: [{ userId: req.user._id }, { paymentStatus: "Pending" }],
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "about_book.bookId",
          foreignField: "_id",
          as: "book_details",
        },
      },
      {
        $addFields: {
          about_book: {
            $map: {
              input: "$about_book",
              as: "book",
              in: {
                $let: {
                  vars: {
                    matchedBook: {
                      $arrayElemAt: [
                        "$book_details",
                        {
                          $indexOfArray: ["$book_details._id", "$$book.bookId"],
                        },
                      ],
                    },
                  },
                  in: {
                    $mergeObjects: [
                      "$$book",
                      {
                        total_price_Of_book: {
                          $multiply: [
                            { $toInt: "$$book.quntity" },
                            { $toDouble: "$$matchedBook.price" },
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          book_details: {
            $map: {
              input: "$book_details",
              as: "row",
              in: {
                price: "$$row.price",
                quntity: "$$row.quntity",
                total: {
                  $multiply: [
                    { $toInt: "$$row.quntity" },
                    { $toDouble: "$$row.price" },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          book_details: 0,
        },
      },
    ]).project({
      "book_details.title": 1,
      "book_details.author": 1,
      "book_details.price": 1,
      "book_details._id": 1,
      userId: 1,
      about_book: 1,
      total_amount: { $sum: "$about_book.total_price_Of_book" },
    });

    const findUser = await ORDER.findOne({ userId: req.user._id });

    const dataCart = await CART.aggregate([
      { $match: { userId: req.user._id } },
    ]);

    const bookFind = await BOOK.findById(dataCart[0].bookId);
    const number = parseInt(bookFind.numbersOfBooks);
    const quntity = parseInt(dataCart[0].quntity);
    const result = number - quntity;

    if (number < quntity) {
      throw 'not valid..'
    }

    const status = result > 0 ? "Available" : "Unavailable";

    const updateBook = await BOOK.findByIdAndUpdate(dataCart[0].bookId, {
      numbersOfBooks: number - quntity,
      status,
    });

    const deleteData = dataCart.map(async (data) => {
      const rem = await CART.findByIdAndDelete(data._id);
    });

    successResponce(detail,200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.viewOrderDetail = async (req, res) => {
  try {
    const orders = await ORDER.aggregate([
      { $match: { userId: req.user._id } },
    ]).project({
      _id: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    let totalPrice = 0;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].paymentStatus == "Pending") {
        for (let j = 0; j < orders[i].about_book.length; j++) {
          const id = orders[i].about_book[j].bookId;

          const book = await BOOK.findById(id);

          const price = book.price;
          const p = parseInt(price) * orders[i].about_book[j].quntity;

          totalPrice += p;
        }
      }
    }
    successResponce({orders , totalPrice},200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.ratingBooks = async (req, res) => {
  try {
    const user = req.user;
    var { book, rating, review } = req.body;
    const bookid = new mongoose.Types.ObjectId(book);

    const userOrderModel = await ORDER.aggregate([
      {$match:{"about_book.bookId":bookid}}
    ]);
   
    const books = await RATING.aggregate([
      {
        $match: {
          $and: [
            { $expr: { $eq: ["$userId", { $toObjectId: user._id }] } },
            { $expr: { $eq: ["$bookId", { $toObjectId: book }] } },
          ],
        },
      },
    ]);

    if (books.length > 0) {
      throw "You only give one rate of each book..."
    }
    
      for (let i = 0; i < userOrderModel[0].about_book.length; i++) {
        if (book == userOrderModel[0].about_book[i].bookId) {
          try {
            const ratingBook = await RATING.create({
              rating,
              review,
              bookId: book,
              userId: user._id,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    
    successResponce("Give book rating or review...",200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.updateratingsByUser = async (req, res) => {
  try {
    const { book, rating, review } = req.body;
    const rate = parseInt(rating);

    const books = await RATING.aggregate([
      {
        $match: { $and : [
          { $expr: { $eq: ["$userId", { $toObjectId: req.user._id }] } },
          { $expr: { $eq: ["$bookId", { $toObjectId: book }] } },
        ],
      }
      },
    ]);

    await RATING.findOneAndUpdate(
      { bookId: books[0].bookId },
      {
        rating: rate,
        review,
      }
    );

    successResponce('Book ratings and review updated..',200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.viewratingByBook = async (req, res) => {
  try {
    const book = req.body.bookId;

    const page = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 3;

    const bookData = await RATING.aggregate([
      { $match: { $expr: { $eq: ["$bookId", { $toObjectId: book }] } } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user_details",
        },
      },
      {
        $unwind: {
          path: "$user_details",
        },
      },
    ])
      .project({
        rating: 1,
        review: 1,
        bookId: 1,
        "user_details.name": "$user_details.fullname",
        "user_details.email": 1,
        _id: 0,
      })
      .skip(record)
      .limit(3);

    successResponce(bookData,200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};

exports.payment = async (req, res) => {
  try {
    const orderId = req.body.orderId;

    const orderDetail = await ORDER.aggregate([
      {
        $match: { $expr: { $eq: ["$userId", { $toObjectId: req.user._id }] } },
      },
    ]);

    const findOrder = await ORDER.findById(orderId);

    if (findOrder) {
      let totalPrice = 0;

      for (let i = 0; i < findOrder.about_book.length; i++) {
        const id = findOrder.about_book[i].bookId;

        const book = await BOOK.findById(id);

        const price = book.price;
        const p = parseInt(price) * findOrder.about_book[i].quntity;

        totalPrice += p;
      }

      totalPrice = totalPrice ? totalPrice : 0;

      const payment = await PAYMENT.create({
        userId: req.user._id,
        orderId: findOrder._id,
        totalPrice: `${totalPrice}$`,
      });

      const updateOrderStatus = await ORDER.findByIdAndUpdate(findOrder._id, {
        paymentStatus: "Done",
      });
    }
    successResponce('Payment done..',200,res)
  } catch (error) {
    errorResponse(error,400,res)
  }
};
