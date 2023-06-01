const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/Person')

const app = express()
const PORT = process.env.PORT || 3001
const contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('request', (req) => {
    if(req.method === 'POST') {
        return JSON.stringify(req.body, ["name", "number"])
    }
    return ''
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons',(request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(person => person.id === id)
    if(contact) {
        response.json(contact)
    }
    else {
        response.status(404).send('Invalid person id')
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contactIndex = contacts.findIndex(contact =>  contact.id === id)
    if(contactIndex === -1) {
        response.status(404).send('Invalid person id')
    }
    else {
        contacts.splice(contactIndex,1)
        response.status(204).send()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        response.status(400).json({error: 'Name and number must be specified'})
    }
    else {
        const addPerson = new Person({
            name: body.name,
            number: body.number
        })
        addPerson.save().then(result => {
            response.status(201).send('Entry created')
        })
    }
})

app.get('/info', (request,response) => {
    const now = new Date()
    const amount = contacts.length
    const responseHtml = `<p>There is ${amount} entries in phonebook<br/>${now}</p>`
    response.send(responseHtml)
})

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})

const generateID = () => Math.floor(Math.random() * 10000)