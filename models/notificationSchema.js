const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    notification: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'USERS'
    }
},
{timestamps:true})

const NOTIFY = mongoose.model('NOTIFY', notificationSchema)
module.exports = NOTIFY