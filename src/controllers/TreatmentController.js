const { Router } = require('express')
const Treatment = require('../models/Treatment.js')
const authMiddleware = require('../middlewares/auth.js')
const { generateAccessToken } = require('../utils/functions')

const router = new Router()


//! Register treatment
router.post('/create', authMiddleware, async (req, res) => {
    let { patient, date, procedure, fee, formOfPayment, company, evolution, cid, doctor } = req.body
    try {

        let treatmentData = {
            patient,
            date,
            procedure,
            fee,
            formOfPayment,
            company,
            evolution,
            cid,
            doctor,
        }

        const treatment = await Treatment.create(treatmentData)

        return res.status(200).json({
            error: false,
            message: "Treatment registered successfully!",
            data: {
                treatment,
                token: generateAccessToken({ id: treatment._id, name: treatment.name })
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

//! Get all treatment registered
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const treatment = await Treatment.find().populate('patient');

        return res.status(200).json(
            treatment
        )
    } catch (err) {
        res.status(400).json({ error: 'There was some error while trying to find treatments', message: err.message })
    }
})

//! Get all treatment registered
router.get('/get/:id', authMiddleware, async (req, res) => {
    try {
        const treatment = await Treatment.findOne({ _id: id });

        if (!treatment) throw new Error("treatment not found!")

        return res.status(200).json({
            treatment
        })
    } catch (err) {
        res.status(400).json({ error: 'There was some error while trying to find treatments', message: err.message })
    }
})


//! Update treatment
router.put('/put/:id', authMiddleware, async (req, res) => {
    const { id } = req.params
    let { patient, date, fee, formOfPayment, company, evolution, cid, doctor } = req.body

    try {

        const treatment = await Treatment.findById(id).select('+password')

        if (!treatment) throw new Error("treatment not found!")

        const treatmentUpdated = await treatment.updateOne({ _id: id }, {
            patient: patient ? patient : treatment.patient,
            date: date ? date : treatment.date,
            procedure: procedure ? procedure : treatment.procedure,
            fee: fee ? fee : treatment.fee,
            formOfPayment: formOfPayment ? formOfPayment : treatment.formOfPayment,
            company: company ? company : treatment.company,
            evolution: evolution ? evolution : treatment.evolution,
            cid: cid ? cid : treatment.cid,
            doctor: doctor ? doctor : treatment.doctor,
        })

        return res.status(200).json({
            treatmentUpdated
        })

    } catch (err) {
        res.status(400).json({ error: 'There was some error while trying to update the treatment', message: err.message })
    }
});

//! Delete a treatment
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params

    try {

        const treatment = await Treatment.findById(id).select('+password')

        if (!treatment) throw new Error("Treatment not found!")

        const treatmentDelete = await Treatment.findOneAndDelete({ _id: id }, { useFindAndModify: true })

        return res.status(200).json({
            treatment: treatmentDelete
        })

    } catch (err) {
        res.status(400).json({ error: 'There was some error while trying to deactivate the treatment', message: err.message })
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

//     let treatment = await treatment.findOne({ _id: req.treatmentId })

//     if (!treatment) throw new Error("treatment does not exist!")

//     let { schedules } = treatment;

//     schedules.push(newSchedule)

//     let treatment = await treatment.updateOne({ _id: treatment._id }, { schedules })

//     res.status(200).json({
//       error: false,
//       message: "Scheduled successfully!",
//       data: {
//         treatment: {
//           id: req.treatmentId,
//           role: req.treatmentRole,
//           name: req.treatmentName,
//         },
//         newSchedule,
//         treatment
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


module.exports = router