const mongoose = require('mongoose')
const chalk = require('chalk')
require('../utils/scripts.js')

let myConnection = ""

const { CONN_USER, CONN_PASSWORD, CONN_HOST, DATABASE_NAME, CONN_STRING } = process.env

// function parseConnectionString(connectionString) {
//   try {

//     if (!connectionString.includes("CONN_HOST") ||
//       !connectionString.includes("DATABASE_NAME")) {
//       throw new Error(`There was an error parsing the connection string! \n ${connectionString}`)
//     }

//     const parsedConnection = connectionString
//       .replace(/CONN_USER/gi, CONN_USER)
//       .replace(/CONN_PASSWORD/gi, CONN_PASSWORD)
//       .replace(/CONN_HOST/gi, CONN_HOST)
//       .replace(/DATABASE_NAME/gi, DATABASE_NAME)

//     myConnection = parsedConnection

//     return {
//       error: false,
//       return: parsedConnection
//     }

//   } catch (err) {
//     return {
//       error: true,
//       return: err.message,
//       errorDetails: err
//     }
//   }
// }

try {
  // let connectionString = parseConnectionString(CONN_STRING);

  // if (connectionString.error) {
  //   throw new Error(connectionString.errorDetails)
  // }

  mongoose.connect('mongodb+srv://nuggty:nuggty@cluster0.reuse.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
} catch (err) {
  console.log(chalk.bold.red("================================================================\n"))
  console.error(chalk.bold.red("Error:"), chalk.whiteBright(err.message.replace("Error: ", "")))
  console.error(chalk.hex("#828282").bold("Example:"), chalk.hex("#828282")("mongodb+srv://CONN_USER:CONN_PASSWORD@CONN_HOST/DATABASE_NAME?retryWrites=true"))
  console.error(chalk.hex("#b2ffc2").bold("TIP:"), chalk.hex("#b2ffc2")("Add this example in the CONN_STRING as an environment variable in the .env"))
  console.log(chalk.bold.red("\n======================[ERROR IN DETAIL]=========================\n"))
  console.error(err)
}

const db = mongoose.connection

module.exports = { db, myConnection }