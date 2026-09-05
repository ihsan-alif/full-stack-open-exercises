const mongoose = require('mongoose')

if (process.argv.length > 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.hdbiwmg.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, {family: 4})

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({important: true}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})

// const note = new Note({
//     content: 'Mongoose makes thing easy',
//     important: false,
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })