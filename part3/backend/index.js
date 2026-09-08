require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (req, res, next) => {
  console.log('Methods:   ', req.method)
  console.log('Path:      ', req.path)
  console.log('Body:      ', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/', (request, response) => {

  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {

  Note.find({}).then(result => {
    response.json(result)
  })
})

app.post('/api/notes', (request, response, next) => {

  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(err => next(err))
})

app.get('/api/notes/:id', (request, response, next) => {

  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {

  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then(updatedNote => {
        response.json(updatedNote)
      })
    })
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {

  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
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