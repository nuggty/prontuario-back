const mongoose = require('mongoose')

const ExamSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    required: true,
    default: ''
  },
  date: {
    type: String,
    required: true,
    default: ''
  }
}, {
  timestamps: true
})

ExamSchema.index({
  name: 'text',
  description: 'text',
  synonyms: 'text'
}, {
  weights: {
    name: 7,
    description: 1,
    synonyms: 10
  }
})

const Exam = mongoose.model('Exam', ExamSchema)

module.exports = Exam