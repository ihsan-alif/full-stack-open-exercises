require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const baseUrl = '/api/persons'

app.get('/', (req, res) => {

  res.send('<h1>Hello World</h1>')
})

app.get(`${baseUrl}`, (req, res, next) => {

  Person.find({})
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(err => next(err))
})

app.get(`${baseUrl}/:id`, (req, res, next) => {

  const id = req.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post(`${baseUrl}`, (req, res, next) => {

  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {

  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete(`${baseUrl}/:id`, (req, res, next) => {

  const id = req.params.id
  Person.findOneAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {

  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, request, response, next) => {

  console.error(err.message)

  if (err.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (err.name === 'ValidationError') {
    return response.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})