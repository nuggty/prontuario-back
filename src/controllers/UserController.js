const { Router } = require('express')
const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const authMiddleware = require('../middlewares/auth.js')
const { scheduleFactory, validatePatient, validateRole, generateAccessToken, generateRandomToken } = require('../utils/functions')
const { validate: cpfValidate } = require('gerador-validador-cpf')

const router = new Router()

//! Authenticate user
router.post('/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) throw new Error('Usuário não encontrado')

    if (!await bcrypt.compare(password, user.password)) throw new Error('Senha inválida')
    user.password = undefined

    return res.status(200).json({
      error: false,
      message: "Usuário autenticado com sucesso!",
      data: {
        user,
        token: generateAccessToken({ id: user._id, name: user.name })
      }
    })

  } catch (error) {
    res.status(400).json({
      error: true,
      message: "Houve algum problema ao autenticar o usuário.",
      data: {
        message: error.message,
        error
      }
    })
  }

})

//! Check auth
router.get("/auth", authMiddleware, async (req, res) => {
  const user = await User.findOne()
  res.status(200).json({
    user: user.name,
    error: false,
    message: "Usuário está autenticado"
  })
});

//! Register user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    let userData = {}

    userData = { name, email, password }

    if (await User.findOne({ email: userData.email })) return res.status(400).json({ error: 'E-mail is already registered!' })


    const user = await User.create(userData)

    user.password = undefined;
    console.log(user)
    return res.status(200).json({
      error: false,
      message: "User registered successfully!",
      data: {
        user,
        token: generateAccessToken({ id: user._id, name: user.name })
      }
    })
  } catch (err) {
    res.status(400).json({
      error: true,
      message: "Registration failed!",
      data: {
        message: err.message,
        err
      }
    })
  }
})

//! Get all user registered
// router.get('/', authAdminMiddleware, async (req, res) => {
//   try {
//     const user = await User.find();

//     return res.status(200).json({
//       user
//     })
//   } catch (err) {
//     res.status(400).json({ error: 'There was some error while trying to find users', message: err.message })
//   }
// })

// ! Get an specific user by id
// router.get('/:id', authMiddleware, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const loggedInUser = await User.findById(req.userId)
//     const user = await User.findOne({ _id: id })

//     if (user) {
//       return res.status(200).json({
//         user
//       })
//     } else {
//       return res.status(400).json({ error: 'User not found' })
//     }
//   } catch (err) {
//     res.status(400).json({ error: 'There was some error while trying to find the user', message: err.message })
//   }
// })


//! Update user
// TODO: Melhoria: Armazenar o nome de quem fez a alteração no atributo "logAlteracao".
// router.put('/:id', authMiddleware, async (req, res) => {
//   const { id } = req.params
//   let { name, email, phone, password } = req.body

//   try {
//     /* 
//     * Required fields:
//     * name, email, birthDate, gender,
//     * password
//     *
//     * Optional fields:
//     * phone, height, weight, disabledPerson, street
//     * number, city, state, district, zipCode
//     * 
//     */

//     if (!cpfValidate(cpf)) throw new Error("CPF number is invalid.")

//     const loggedInUser = await User.findById(req.userId)
//     const user = await User.findById(id).select('+password')

//     // Caso seja "administrator" ou "developer"
//     // - Pode ser alterado qualquer usuário
//     // Caso seja qualquer outro cargo
//     // - Pode ser alterado apenas o próprio usuário
//     if (loggedInUser._id.toString() !== user._id.toString() && (loggedInUser.role !== "administrator" || loggedInUser.role !== "developer"))
//       throw new Error("You're not an administrator and is trying to update a different user, you can only update your own user.")

//     if (!user) throw new Error("User not found!")

//     if (password) {
//       const hash = await bcrypt.hash(password, 10)
//       password = hash
//     }

//     const userUpdated = await User.updateOne({ _id: id }, {
//       name: name ? name : user.name,
//       email: email ? email : user.email,
//       password: password ? password : user.password,
//       phone: phone ? phone : user.phone
//     })

//     return res.status(200).json({
//       userUpdated
//     })

//   } catch (err) {
//     res.status(400).json({ error: 'There was some error while trying to update the user', message: err.message })
//   }
// });

// TODO: Ao usar a rota DELETE será realizado a desativação da conta caso ainda ativa.
// TODO: Armazenar o nome de quem fez a alteração no atributo "logAlteracao".
// {user: _id, action: UPDATE || DELETE, updatedAt: new Date()}
// router.delete('/:id', authMiddleware, async (req, res) => {
//   const { id } = req.params

//   try {

//     const loggedInUser = await User.findById(req.userId)
//     const user = await User.findById(id).select('+password')

//     // Caso seja "administrator" ou "developer"
//     // - Pode ser alterado qualquer usuário
//     // Caso seja qualquer outro cargo
//     // - Pode ser alterado apenas o próprio usuário

//     if (!user) throw new Error("User not found!")

//     const userDeactivated = await User.updateOne({ _id: id }, {
//       active: false
//     })

//     return res.status(200).json({
//       userDeactivated
//     })

//   } catch (err) {
//     res.status(400).json({ error: 'There was some error while trying to deactivate the user', message: err.message })
//   }
// });





module.exports = router