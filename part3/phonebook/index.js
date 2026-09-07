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

let persons = []

const baseUrl = '/api/persons'

app.get('/', (req, res) => {
    
    res.send('<h1>Hello World</h1>')
})

app.get(`${baseUrl}`, (req, res) => {
    
    Person.find({}).then(savedPerson => {
        res.json(savedPerson)
    })
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

app.post(`${baseUrl}`, (req, res) => {

    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }

    const nameExist = persons.some(
        n => n.name.trim().toLowerCase() === body.name.trim().toLowerCase()
    )

    if (nameExist) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    
    const {number} = req.body

    Person.findById(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }

            person.number = number
            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(err => next(err))
})

app.delete(`${baseUrl}/:id`, (req, res) => {

    const id = req.params.id
    Person.findOneAndDelete(id)
        .then(result => {
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
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (err, request, response, next) => {
  
  console.error(err.message)

  if (err.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'})
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})