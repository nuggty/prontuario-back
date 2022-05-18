const express = require('express')
const Exam = require('../models/Exam.js')
const authMiddleware = require('../middlewares/auth.js')
const { parseSynonyms } = require('../utils/functions.js')
const LIMIT = parseInt(process.env.LIMIT)

const router = express.Router();

router.use(authMiddleware)

router.get('/', authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.find().populate('patient');

    return res.status(200).json(
      exam
    )
  } catch (err) {
    res.status(400).send({ error: 'There was some error while trying to find exams', message: err.message })
  }
})

// Register new exam
router.post('/create', authMiddleware, async (req, res) => {
  let { patient, type, date } = req.body
  try {
    let examData = {
      patient,
      type,
      date
    }

    const exam = await Exam.create(examData)

    return res.status(200).json({
      error: false,
      message: "Exam registered successfully!",
      data: {
        exam,
        token: generateAccessToken({ id: exam._id, name: exam.name })
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

router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    const exam = await Exam.findOne({ _id: id });

    return res.status(200).json({
      exam
    })
  } catch (err) {
    res.status(400).send({ error: 'Exam does not exist', err })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  const { name, price, description, synonyms } = req.body
  const { id } = req.params

  try {
    const examFound = await Exam.findOne({ _id: id })
    const examFoundName = await Exam.findOne({ name })

    if (!examFound) return res.status(400).send({ error: 'Was not able to find the exam mentioned.' })
    if (examFoundName && examFoundName._id !== id) return res.status(400).send({ error: 'Exam name already registered!' })

    const exam = await Exam.updateOne({ _id: id }, {
      name,
      price,
      description,
      synonyms
    });

    return res.status(200).json({
      message: "Exam updated succesfully!",
      exam
    })
  } catch (err) {
    res.status(400).send({ error: 'There was some error while trying to update an exam', err: err.message })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params

  try {
    const examFound = await Exam.findOne({ _id: id })

    if (!examFound) return res.status(400).send({ error: 'Exam does not exist!' })

    const exam = await Exam.deleteOne({ _id: id })

    return res.status(200).json({
      message: "Exam deleted succesfully!",
      exam
    })
  } catch (err) {
    res.status(400).send({ error: 'There was some error while trying to delete an exam', err })
  }
})

module.exports = router