import {useState} from 'react'

const Header = (props) => {
  console.log(props.course.name)

  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Part = (props) => {
  console.log(props.part.name)
  console.log(props.part.exercises)

  return (
    <div>
      <p>{props.part.name} {props.part.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  console.log(props.course)

  return (
    <div>
      {props.parts.map( (part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
  )
}

const Total = (props) => {

  const totalExercises = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  console.log(totalExercises)

  return (
    <div>
      <p>Number of exercises {totalExercises}</p>
    </div>
  )
}

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of component',
        exercises: 14
      }
    ],
  }
  
  return (
    <div>
      <Header course={course}/>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App