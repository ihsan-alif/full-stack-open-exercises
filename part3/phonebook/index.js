const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const baseUrl = '/api/persons'

app.get('/', (req, res) => {
    
    res.send('<h1>Hello World</h1>')
})

app.get(`${baseUrl}`, (req, res) => {
    
    res.json(persons)
})

app.get(`${baseUrl}/:id`, (req, res) => {

    const id = req.params.id
    const person = persons.find(n => n.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

const genreateId = () => {
    
    const randomId = Math.floor(Math.random() * 100000) + 1

    const isExist = persons.some(n => Number(n.id) === randomId)
    if (isExist) {
        return genreateId()
    }
    
    return String(randomId)
}

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

    const person = {
        id: genreateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})