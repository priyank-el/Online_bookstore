const Joi = require('joi')

const adminregisterValidator = Joi.object({
    email:Joi.string().required()
    .messages({
        'email.string':'Email must required..',
        'email.required':'Email is not optinal..'
    }),
    password:Joi.string().required()
    .messages({
        'password.string':'password must required..',
        'password.required':'password is not optinal..'
    }),
})

module.exports = adminregisterValidator