const mongoose = require('mongoose')

const TreatmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  procedure: {
    type: String,
    required: false,
    default: ''
  },
  fee: {
    type: String,
    required: false,
    default: ''
  },
  formOfPayment: {
    type: String,
    required: false,
    default: ''
  },
  company: {
    type: String,
    required: false
  },
  evolution: {
    type: String,
    required: false
  },
  cid: {
    type: String,
    required: false,
    default: ''
  },
  doctor: {
    type: String,
    required: false,
    default: ''
  },
}, {
  timestamps: true,
  versionKey: false
})

const Treatment = mongoose.model('Treatment', TreatmentSchema)

module.exports = Treatment