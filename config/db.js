const mongoose = require('mongoose')
const chalk = require('chalk')

// database connection 
mongoose.connect(process.env.CONNECTION_URL)
    .then(() => {
        console.log(chalk.yellowBright('databse connection established...'))
    })
    .catch((error) => {
        console.log(error.message)
    })