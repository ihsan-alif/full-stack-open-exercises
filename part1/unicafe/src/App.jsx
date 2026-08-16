import { useState } from "react"

const StatisticLine = (props) => {

  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, total, average, positive}) => {

  return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average.toFixed(1)} />
          <StatisticLine text="positive" value={`${positive.toFixed(1)} %`} />
        </tbody>
      </table>
  )
}

const Display = ({name}) => <div><h1>{name}</h1></div>

const History = (props) => {
  if (props.total === 0)  {
    return (
      <div>No feedback given</div>
    )
  }

  return <Statistics {...props} />
}

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = (pos) => {
    if (total === 0) {
      pos = 0
      return pos
    }
    return (good - bad) / total
  }
  const positive = (pos) => {
    if (total === 0) {
      pos = 0
      return pos
    }
    return (good / total) * 100
  }
  
  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <Display name="give feedback" />
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <Display name="statistics" />
      <History 
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average(0)}
        positive={positive(0)}
      />
    </div>
  )
}

export default App