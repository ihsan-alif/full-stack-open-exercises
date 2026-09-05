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

app.get(`${baseUrl}/:id`, (req, res) => {

    const id = req.params.id
    
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
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

app.delete(`${baseUrl}/:id`, (req, res) => {

    const id = req.params.id
    persons = persons.filter(n => n.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    
    const totalEntries = persons.length

    const requestTime = new Date()

    res.send(`
        <p>Phonebook has info for ${totalEntries} people</p>
        <p>${requestTime}</p>
    `)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})