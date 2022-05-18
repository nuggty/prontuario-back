const validator = require('validator')
const cpfGV = require('gerador-validador-cpf')
const jwt = require('jsonwebtoken')
const {ENVIRONMENT, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE} = process.env

// Appointment Controller Functions
function parseSynonyms(synonyms = []) {
  let synonymsSplitted
  let synonymsArray = synonyms
  
  if (synonyms.includes(";")) {
    synonymsSplitted = synonyms.split(';')
    synonymsArray = synonymsSplitted.filter(synonym => synonym.trim() !== "").map(synonym => synonym.trim())
  }

  return synonymsArray
}

function scheduleFactory(procedure = "", specification = "", date = new Date(), hour = "", place = "", status = "Agendado") {
  return {
    procedure,
    specification,
    date: new Date(date),
    hour,
    place,
    status
  }
}

function validatePatient(patient = {}) {
  try {
    const {name, email, birthDate, password} = patient
    let {cpf, phone} = patient
    const wrongFields = []

    if (cpf === "00000000000" && ENVIRONMENT === "DEV") {
      cpf = cpfGV.generate({format: true})
      console.log(cpf)
    }

    if (phone === "00000000000" && ENVIRONMENT === "DEV") {
      phone = phoneGenerator()
    }

    if (!name || name === "" || name.split(" ").length < 2 || typeof name !== "string" || !/^[A-zÀ-ú]+((['. ][A-zÀ-ú ])?[A-zÀ-ú]*)*$/gi.test(name)) {
      wrongFields.push("name")
    }

    name.replace(/\s+/gi, " ")

    if (!email || email === "" || email.search(/\s+/i) !== -1 || typeof name !== "string" || !validator.isEmail(email)) {
      wrongFields.push("email")
    }

    if (!cpf || cpf === "" || cpf.search(/\s+/i) !== -1 || typeof name !== "string" || !cpfGV.validate(cpf)) {
      wrongFields.push("cpf")
    }

    if (!phone || phone === "" || phone.search(/\s+/i) !== -1 || typeof phone !== "string" || !/^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/gm.test(phone)) {
      wrongFields.push("phone")
    }
    
    if (!birthDate || birthDate === "" || birthDate.search(/\s+/i) !== -1 || typeof birthDate !== "string") {
      wrongFields.push("birthDate")
    }

    if (!password || password === "" || typeof password !== "string" || (password.length < 6 || password.length > 71)) {
      wrongFields.push("password")
    }

    if (wrongFields.length > 0) {
      
      let message = `You need to fix ${wrongFields.length > 1 ? "these fields" : "this field"}: ${wrongFields.join(", ")}`

      return {
        error: true,
        message: "You need to correct every field.",
        errorDetails: {
          message,
          wrongFields
        }
      }
    
    }

    return {
      error: false,
      data: {
        name, email, phone, birthDate, password, gender, cpf
      }
    }

  } catch (error) {
    return {
      error: true,
      message: "There was some error while trying to validate the patient.",
      errorDetails: {
        message: error.message,
        error
      }
    }
  }
}

function phoneGenerator() {

  return "1198#######".split("").map(number => {
    if (number === "#") return Math.floor(Math.random() * 10).toString()
    return number
  }).join("")

}

function generateAccessToken(params = {}) {
  return jwt.sign(params, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFE
  })
}

// Token: Letra e número de 6 caracteres.
function generateRandomToken() {
  let tokenSize = 6
  let tokenChars = [
    '0', 'A', '1', 'B', '2', 'C', '3', 'D', '4', 'E', '5', 'F', '6', 'G', '7', 'H', '8', 'I', '9', 'J', '0', 'K', '1', 'L', '2', 'M', '3', 'N', '4', 'O', '5', 'P', '6', 'Q', '7', 'R', '8', 'S', '9', 'T', '0', 'U', '1', 'V', '2', 'W', '3', 'X', '4', 'Y', '5', 'Z'
  ]
  let token = []

  for (let i = 0; i < tokenSize; i++) {
    let randomPosition = Math.floor(Math.random() * tokenChars.length)
    token.push(tokenChars[randomPosition])
  }
  
  return token.join('')
}

module.exports = {
  parseSynonyms,
  scheduleFactory,
  validatePatient,
  generateAccessToken,
  generateRandomToken
}