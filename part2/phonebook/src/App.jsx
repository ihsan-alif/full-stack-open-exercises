import {useState, useEffect} from 'react'
import axios from 'axios'
import phoneService from './services/phonebook'
import Filter from './components/FIlter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    phoneService
      .getAll()
      .then(initialPhonebook => {
        setPersons(initialPhonebook)
      })
  }, [])

  const addName = (e) => {
    e.preventDefault()
    
    const cleanName = newName
    const cleanNumber = newNumber
    const existingPerson = persons.find(
      person => person.name.toLowerCase() === cleanName.toLowerCase()
    )
    
    if (existingPerson) {
      const ok = window.confirm(`${cleanName} is already added to phonebook, replace the old number with a new one?`)
      
      if (ok) {

        const updatedPerson = {...existingPerson, number: cleanNumber}

        phoneService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }
    
    const nameObject = {
      name: cleanName,
      number: cleanNumber
    }

    phoneService
      .create(nameObject)
      .then(phoneObject => {
        setPersons(persons.concat(phoneObject))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = id => {

    const person = persons.find(n => n.id === id)
    const ok = window.confirm(`Delete ${person.name} ?`)

    if (ok) {
      phoneService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(n => n.id !== id))
        })
    }
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
      <Persons personsToShow={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App