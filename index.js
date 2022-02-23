const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))

app.get('/api/persons', (request, response) => {
  console.log('Get persons from Mongo Db')
  Person.find({}).then((persons) => {
    console.log('Get Data from MongoDB')
    response.json(persons)
  })
  //mongoose.connection.close()
})
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('Add or update Database')
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then((result) => {
    console.log(`added ${result}`)
  })
})
// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)

//   const person = persons.find((person) => person.id === id)

//   if (person) {
//     response.json(person)
//   } else {
//     response.status(404).end()
//   }
// })

// app.get('/info', (request, response) => {
//   const count = persons.length
//   const date = new Date()

//   response.send(`<p>Phonebook has info for ${count} people</p>
//   <p> ${date} </p>`)
// })

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter((person) => person.id !== id)

//   response.status(204).end()
// })
// const generateId = () => {
//   const id = Math.floor(Math.random() * 100) + 1
//   return id
// }
// app.post('/api/persons/', morgan(':body'), (request, response) => {
//   const body = request.body

//   if (!body.name || !body.number) {
//     console.log(body)
//     return response.status(400).json({
//       error: 'name or number is missing',
//     })
//   }
//   const person = persons.find((person) => person.name === body.name)

//   if (!person) {
//     let person = {
//       id: generateId(),
//       name: body.name,
//       number: body.number,
//     }
//     persons = persons.concat(person)
//     response.json(person)
//   } else {
//     return response.status(400).json({
//       error: 'name must be unique',
//     })
//   }
// })
const PORT = process.env.PORT || 3001 //
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
