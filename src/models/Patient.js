const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  cpf: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: false
  },
  occupation: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    default: ''
  },
  zipCode: {
    type: String,
    required: false,
    default: ''
  },
  street: {
    type: String,
    required: false,
    default: ''
  },
  number: {
    type: String,
    required: false,
    default: ''
  },
  addressDetails: {
    type: String,
    required: false,
    default: ''
  },
  district: {
    type: String,
    required: false,
    default: ''
  },
  city: {
    type: String,
    required: false,
    default: ''
  },
  state: {
    type: String,
    required: false,
    default: ''
  },
  observation: {
    type: String,
    required: false,
    default: ''
  },
}, {
  timestamps: true,
  versionKey: false
})

const Patient = mongoose.model('Patient', PatientSchema)

module.exports = Patient