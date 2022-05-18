const express = require('express')
const chalk = require('chalk')
require('./utils/scripts.js')
const {db, myConnection} = require('./database/index.js') // Run the database
const pm2 = require('pm2')
const cors = require('cors')

pm2.describe()

// Create the express application
const app = express()

// Uses bodyParser in order to parse the response
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

// Get the .env variables
const PORT = process.env.PORT
const CLEAR_CONSOLE = process.env.CLEAR_CONSOLE === "true" ? true : false

// Import controllers
const ExamController = require('./controllers/ExamController.js')
const TestController = require('./controllers/TestController.js')
const UserController = require('./controllers/UserController.js')
const PatientController = require('./controllers/PatientController.js')
const TreatmentController = require('./controllers/TreatmentController.js')

// Use controllers
app.use('/exam', ExamController)
app.use('/test', TestController)
app.use('/user', UserController)
app.use('/patient', PatientController)
app.use('/treatment', TreatmentController)

app.get("/*", (req, res) => {
    res.status(404).json({
      error: true,
      message: "Page does not exist",
    })
})

db.on('error', err => { console.log(myConnection) })

db.once('open', () => {
  // Run the application
  app.listen(PORT, () => {
    if (CLEAR_CONSOLE) {
      console.clear()
    }

    let modelsLength = db.modelNames().length

    console.log("▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀")

    console.log(chalk.bold(`Application is running in the port ${PORT}!`.toUpperCase()))
    console.log(chalk.green.bold(`Link:`), chalk.green.dim(`http://localhost:${PORT}`))
    
    console.log("▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n")

    console.log(chalk.bold.magenta(`MODELS (LOADED ${modelsLength} ${modelsLength > 1 ? "MODELS" : "MODEL"})`.toUpperCase()))
    console.log(chalk.bold.magenta('------\n'))
  
    db.modelNames().forEach(modelName => {
      console.log(chalk.bold(`${modelName}:`), chalk.green('OK'))
    })
  })
})