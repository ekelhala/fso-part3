const express = require('express')
const morgan = require('morgan')

const app = express()
const PORT = 3001
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

app.get('/api/persons',(request, response) => {
    response.json(contacts)
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
    let id = 0
    do {
        id = generateID()
    } while(contacts.find(person => person.id === id))
    const addPerson = request.body
    addPerson.id = id
    if(!addPerson.name || !addPerson.number) {
        response.status(400).json({error: 'Name and number must be specified'})
    }
    else if(contacts.find(person => person.name === addPerson.name)) {
        response.status(400).json({error: 'Name must be unique'})
    }
    else {
        contacts.push(addPerson)
        response.status(201).send('Entry created')
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