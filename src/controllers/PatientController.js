const { Router } = require('express')
const Patient = require('../models/Patient.js')
const authMiddleware = require('../middlewares/auth.js')
const {generateAccessToken} = require('../utils/functions')

const router = new Router()

//! Get all patient registered
router.get('/', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.find();

    return res.status(200).json({
      patient
    })
  } catch (err) {
    res.status(400).json({ error: 'There was some error while trying to find patients', message: err.message })
  }
})

//! Get 
router.get('/:id', async (req, res) => {
  const {id} = req.params
  try {
    const patient = await Patient.findOne({_id: id});

    if (!patient) throw new Error("Patient not found!")

    return res.status(200).json({
      patient
    })
  } catch (err) {
    res.status(400).json({ error: 'There was some error while trying to find patients', message: err.message })
  }
})


//! Update patient
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  let { name, lastname, birthDate, cpf, company, occupation, email, phone, zipCode, street, number, addressDetails, district, city, state, observation} = req.body

  try {

    const patient = await Patient.findById(id).select('+password')

    if (!patient) throw new Error("Patient not found!")

    const patientUpdated = await Patient.updateOne({ _id: id }, {
      name: name ? name : patient.name,
      lastname: lastname ? lastname : patient.lastname,
      birthDate: birthDate ? birthDate : patient.birthDate,
      cpf: cpf ? cpf : patient.cpf,
      company: company ? company : patient.company,
      occupation: occupation ? occupation : patient.occupation,
      email: email ? email : patient.email,
      phone: phone ? phone : patient.phone,
      zipCode: zipCode ? zipCode : patient.zipCode,
      street: street ? street : patient.street,
      number: number ? number : patient.number,
      addressDetails: addressDetails ? addressDetails : patient.addressDetails,
      district: district ? district : patient.district,
      city: city ? city : patient.city,
      state: state ? state : patient.state,
      observation: observation ? observation : patient.observation
    })

    return res.status(200).json({
      patientUpdated
    })

  } catch (err) {
    res.status(400).json({ error: 'There was some error while trying to update the patient', message: err.message })
  }
});

//! Delete a patient
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params

  try {

    const patient = await Patient.findById(id).select('+password')

    if (!patient) throw new Error("Patient not found!")

    const deletedPatient = await Patient.findOneAndDelete({_id: id}, {useFindAndModify: true})

    return res.status(200).json({
      patient: deletedPatient
    })

  } catch (err) {
    res.status(400).json({ error: 'There was some error while trying to deactivate the patient', message: err.message })
  }
});


//perguntar se esta rota é necessária ao Rafael

// router.post("/schedule", authMiddleware, async (req, res) => {

//   let { procedure, specification, date, hour, place } = req.body
//   let errorDetails = {
//     procedure: {
//       error: false,
//       message: "You need to provide a procedure name."
//     },
//     specification: {
//       error: false,
//       message: "You need to provide a specification name."
//     },
//     date: {
//       error: false,
//       message: "You need to provide a schedule date.",
//       validation: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/gm
//     },
//     hour: {
//       error: false,
//       message: "You need to provide what time you want to schedule.",
//       validation: /^(?:\d|[01]\d|2[0-3]):[0-5]\d$/gm
//     },
//     place: {
//       error: false,
//       message: "You need to provide the place where you want to visit."
//     }
//   }

//   let error = false

//   try {

//     if (!procedure || procedure.length <= 0) {
//       errorDetails.procedure.error = true
//       error = true
//     }

//     if (!specification || specification.length <= 0) {
//       errorDetails.specification.error = true
//       error = true
//     }

//     if (!date || !errorDetails.date.validation.test(date)) {
//       errorDetails.date.error = true
//       error = true
//     }

//     if (!hour || !errorDetails.hour.validation.test(hour)) {
//       errorDetails.hour.error = true
//       error = true
//     }

//     if (!place || place.length <= 0) {
//       errorDetails.place.error = true
//       error = true
//     }

//     if (error) throw new Error("Check all the obligatory fields.")

//     let newSchedule = { ...scheduleFactory(procedure, specification, date, hour, place), token: generateRandomToken() }

//     let patient = await Patient.findOne({ _id: req.patientId })

//     if (!patient) throw new Error("patient does not exist!")

//     let { schedules } = patient;

//     schedules.push(newSchedule)

//     let updatedpatient = await Patient.updateOne({ _id: patient._id }, { schedules })

//     res.status(200).json({
//       error: false,
//       message: "Scheduled successfully!",
//       data: {
//         patient: {
//           id: req.patientId,
//           role: req.patientRole,
//           name: req.patientName,
//         },
//         newSchedule,
//         updatedpatient
//       }
//     })
//   } catch (err) {
//     res.status(400).json({
//       error: true,
//       message: err.message,
//       data: {
//         errorDetails,
//         err
//       }
//     })
//   }
// })

//! Register patient
router.post('/create', async (req, res) => {
  let {name, lastname, birthDate, cpf, company, occupation, email, phone, zipCode, street, number, addressDetails, district, city, state, observation} = req.body
  try {

    let patientData = {
      name,
      lastname,
      birthDate,
      cpf,
      company,
      occupation,
      email,
      phone,
      zipCode,
      street,
      number,
      addressDetails,
      district,
      city,
      state,
      observation
    }

    if (await Patient.findOne({ email: patientData.email })) return res.status(400).json({ error: 'E-mail is already registered!' })
    if (await Patient.findOne({ cpf: patientData.cpf })) return res.status(400).json({ error: 'CPF is already registered!' })

    const patient = await Patient.create(patientData)

    return res.status(200).json({
      error: false,
      message: "Patient registered successfully!",
      data: {
        patient,
        token: generateAccessToken({ id: patient._id, name: patient.name })
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

module.exports = router