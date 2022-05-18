const jwt = require('jsonwebtoken')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).send({error: 'No token provided'})

  const parts = authHeader.split(' ')
  if (!(parts.length === 2)) return res.status(401).send({error: 'Token length is incorrect'})

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) return res.status(401).send({error: 'Token malformatted'})

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {

    if (err) return res.status(401).send({error: 'Token is invalid', err})

    req.userId = decoded.id
    req.userName = decoded.name

    return next()

  })
}