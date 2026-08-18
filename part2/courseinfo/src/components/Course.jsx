const Header = ({name}) => <h2>{name}</h2>

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Content = ({parts}) => {

  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Total = ({parts}) => {

  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <p><strong>total of {totalExercises} exercises</strong></p>
    </div>
  )
}

const Course = ({courses}) => {

    return (
      <div>
        <h1>Web development curriculum</h1>
        {courses.map(course => (
          <div key={course.id}>
            <Header name={course.name} />
            <Content parts={course.parts}/>
            <Total parts={course.parts} />
          </div>
        ))}
      </div>
    )
}

export default Course