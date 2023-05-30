const express = require('express')

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

app.get('/info', (request,response) => {
    const now = new Date()
    const amount = contacts.length
    const responseHtml = `<p>There is ${amount} entries in phonebook<br/>${now}</p>`
    response.send(responseHtml)
})

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})