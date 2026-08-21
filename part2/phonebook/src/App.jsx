import {useState, useEffect} from 'react'
import axios from 'axios'

const Filter = ({value, onChange}) => {

  return (
    <div>filter shown with <input value={value} onChange={onChange} /></div>
  )
}

const PersonForm = ({onSubmit, newName, handleNameChange, newNumber, handleNumberChange}) => {

  return (
    <form onSubmit={onSubmit}>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({personsToShow}) => {

  return (
    <div>
      {personsToShow.map((person) => (
        <div key={person.id}>{person.name} {person.number}</div>
      ))}
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addName = (e) => {
    e.preventDefault()
    
    const cleanName = newName
    const cleanNumber = newNumber
    const isExist = persons.some(person => person.name.toLowerCase() === cleanName.toLowerCase())
    
    if (isExist) {
      alert(`${cleanName} is already added to phonebook`)
      return
    }
    
    const nameObject = {
      name: cleanName,
      number: cleanNumber,
      id: String(persons.length + 1)
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleSearchFilterChange = (e) => {
    setSearchFilter(e.target.value)
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchFilter} onChange={handleSearchFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        onSubmit={addName} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}  
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App