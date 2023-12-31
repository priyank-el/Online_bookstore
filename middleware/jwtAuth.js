const jwt = require('jsonwebtoken');
const USER = require('../models/userSchema')
const {createClient} = require('redis')

const client = createClient()

module.exports = async (req, res, next) => {
    try {
        // let decodedToken = await jwt.verify(req.cookies.JwtToken, process.env.SECRET)            => working with cookies
        await client.connect()
        const token  = await client.get('token')
        
        let decodedToken = await jwt.verify(token, process.env.SECRET)

        if (!decodedToken) {
            const error = new Error('Token not valid...')
            throw error
        }

        const user = await USER.findOne({ email: decodedToken.email })

        if (!user) {
            const error = new Error('USer not found...')
            throw error
        }

        req.user = user
        next()
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }

}