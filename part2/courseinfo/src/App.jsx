import {useState} from 'react'
import Course from './components/Course'

const App = () => {

  const course = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { 
          id: 1,
          name: 'Fundamentals of React',
          exercises: 10
        },
        {
          id: 2,
          name: 'Using props to pass data',
          exercises: 7
        },
        {
          id: 3,
          name: 'State of component',
          exercises: 14
        },
        {
          id: 4,
          name: 'Redux',
          exercises: 11
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          id: 1,
          name: 'Routing',
          exercises: 3
        },
        {
          id: 2,
          name: 'Middleware',
          exercises: 7
        }
      ]
    }
  ]
  
  return <Course courses={course} />
}

export default App