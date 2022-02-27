const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))
app.use(express.json())
//app.use(requestLogger)

morgan.token('body', (req) => JSON.stringify(req.body))

app.get('/api/persons', (request, response, next) => {
  console.log('Get persons from Mongo Db')
  Person.find({})
    .then((persons) => {
      console.log('Get Data from MongoDB')
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  Person.findOne({ name: body.name }).then((person) => {
    if (!person) {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person
        .save()
        .then((savedPerson) => {
          console.log(`added ${savedPerson}`)
          response.json(savedPerson)
        })
        .catch((error) => next(error))
    }
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log('post')
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))

  // Person.findOne({ name: `${body.name}` })
  //   .then((persons) => {
  //     if (persons) {
  //       //update existing number
  //       app.put('/api/persons/:id', (request, response, next) => {
  //         console.log('id:', request.params.id)
  //         const person = {
  //           name: body.name,
  //           number: body.number,
  //         }
  //         console.log('findbyid')
  //         Person.findByIdAndUpdate(request.params.id, person)
  //           .then((updatedPerson) => {
  //             response.json(updatedPerson)
  //           })
  //           .catch((error) => next(error))
  //       })
  //     } else {
  //       console.log('Add new')
  //       const person = new Person({
  //         name: body.name,
  //         number: body.number,
  //       })
  //       person
  //         .save()
  //         .then((savedPerson) => {
  //           console.log(`added ${savedPerson}`)
  //           response.json(savedPerson)
  //         })
  //         .catch((error) => next(error))
  //     }
  //   })
  //   .catch((error) => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.estimatedDocumentCount({})
    .then((count) => {
      const date = new Date()
      response.send(`<p>Phonebook has info for ${count} people</p>
     <p> ${date} </p>`)
    })
    .catch((error) => next(error))
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

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
