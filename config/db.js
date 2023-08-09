const mongoose = require('mongoose')

// This is a database connection method 
mongoose.connect(process.env.CONNECTION_URL)
    .then(() => {
        console.log('databse connection established...')
    })
    .catch((error) => {
        console.log(error.message)
    })