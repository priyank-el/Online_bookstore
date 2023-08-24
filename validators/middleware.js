
const Validator = require('validatorjs')
const BOOK = require('../models/bookSchema')
const GENRE = require('../models/bookGenreSchema')

const mongoose = require('mongoose')

Validator.registerAsync('isUniqueTitle', async function (username , attribute , req , passes) {
        const isBook = await BOOK.findOne( {title : username} )
    
        if(!isBook){
          return passes()
        }
        await passes(false , 'same title book found..')
})

Validator.registerAsync('isGenreExist', async function (username , attribute , req , passes) {
        const isGenre = await GENRE.findOne( {genre : username} )
    
        if(!isGenre){
          return passes()
        }
        await passes(false , 'genre already exist please try with diffrent genre..')
})

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< user validation >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Validator.registerAsync('isUniqueemail', async function (username , attribute , req , passes) {
  
  const array = attribute.split(',')
  const {0:model,1:field} = array

  const isUser = await mongoose.model(model).findOne( { [field]:username } )

  if(!isUser){
    return passes()
  }
  await passes(false , 'This email is already in use try with another email..')
})

// main function for do validation
exports.validaeWithCallback = (rules,req,res,next) => {
    const validation = new Validator(req.body, rules, {});
    validation.passes(() => next());
    validation.fails(() => {
        sendError(req,res, formattedErrors(validation.errors.errors) )  }
    );
}

//** function for error handling */ 
async function sendError(req, res, data, statusCode = 422) {
  return res.status(statusCode).json({errors:data})
}

function formattedErrors(err) {
  let transformed = {};
  Object.keys(err).forEach(function (key) {
      transformed[key] = err[key][0];
  })
  return transformed
}