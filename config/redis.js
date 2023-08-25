const { createClient }  = require('redis')
const chalk = require('chalk')

const client = createClient()

async function connection (){
    await client.connect()
    .then(() => {
        console.log(chalk.yellowBright("redis server connected.."));
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = {
    connection
}