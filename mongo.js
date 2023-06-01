const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Password is needed')
    process.exit(1)
}

const password = process.argv[2]
const mongoUrl = `mongodb+srv://user1:${password}@cluster0.mz2z6o4.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    console.log(`saving person...`)
    const addPerson = new Person({name: name, number: number})
    addPerson.save().then(result => {
        console.log(`Added ${name} with number ${number} to phonebook`)
        mongoose.connection.close()
        process.exit(0)
    })
}
else if(process.argv.length === 3) {
    console.log('Phonebook:\n----------')
    Person.find({}).then(result => {
        if(result.length === 0) {
            console.log('<No entries>')
        }
        else {
            result.map(person => console.log(`${person.name} ${person.number}`))
        }
        mongoose.connection.close()
        process.exit(0)
    })
}
else {
    process.exit(1)
}