const express = require('express')
const authMiddleware = require('../middlewares/auth.js')

const router = express.Router()

router.get('/', authMiddleware, (req, res) => {
  res.status(200).json({
    status: 200,
    user: req.userId || {}
  })
})

router.get('/no-auth', (req, res) => {

  res.status(200).json({
    status: 200,
    message: "Deu certo!",
    user: req.userId || {}
  })

})

router.post('/no-auth', (req, res) => {
  let {username, password} = req.body

  res.status(200).json({
    body: {username, password},
    status: 200,
    message: "Deu certo!",
    user: req.userId || {}
  })

})

module.exports = router