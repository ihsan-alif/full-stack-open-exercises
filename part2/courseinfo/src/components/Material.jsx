// const Hello = ({name, age}) => {

//   const yearBorn = () => new Date().getFullYear() - age

//   return (
//     <div>
//       <p>Hello {name}, you are {age} years old</p>
//       <p>So you probably born in {yearBorn()}</p>
//     </div>
//   )
// }

// const Display = ({counter}) => <div>{counter}</div>

// const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

// const History = (props) => {
//   if (props.onClicks.length === 0) {
//     return (
//       <div>
//         the apps is used by pressing the buttons
//       </div>
//     )
//   }

//   return (
//     <div>
//       button press history: {props.onClicks.join(' ')}
//     </div>
//   )
// }

// const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

// const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

  // const [value, setValue] = useState(10)

  // const setToValue = (newValue) => {
  //   console.log('value now', newValue)
  //   setValue(newValue)
  // }

  // return (
  //   <div>
  //     {value}
  //     <Button onClick={() => setToValue(1000)} text="thousand" />
  //     <Button onClick={() => setToValue(0)} text="zero" />
  //     <Button onClick={() => setToValue(value + 1)} text="increment" />
  //   </div>
  // )

  // const [left, setLeft] = useState(0)
  // const [right, setRight] = useState(0)
  // const [allClicks, setAll] = useState([])
  // const [total, setTotal] = useState(0)

  // const handleLeftClick = () => {
  //   setAll(allClicks.concat('L'))
  //   const updatedLeft = left + 1
  //   setLeft(updatedLeft)
  //   setTotal(updatedLeft + right)
  // }
  
  // const handleRightClick = () => {
  //   setAll(allClicks.concat('R'))
  //   const updatedRight = right + 1
  //   setRight(updatedRight)
  //   setTotal(left + updatedRight)
  // }

  // return (
  //   <div>
  //     {left}
  //     <Button onClick={handleLeftClick} text="left" />
  //     <Button onClick={handleRightClick} text="right" />
  //     {right}
  //     <History onClicks={allClicks} />
  //     <p>Total {total}</p>
  //   </div>
  // )
  
  // const [counter, setCounter] = useState(0)
  // console.log('rendering with counter value', counter)

  // const increaseByOne = () => {
  //   console.log('increasing, value before', counter)
  //   setCounter(counter+1)
  // }
  // const decreaseByOne = () => {
  //   console.log('decreasing, value before', counter)
  //   setCounter(counter-1)
  // }
  // const resetToZero = () => {
  //   console.log('restting to zero, value before', counter)
  //   setCounter(0)
  // }

  // return (
  //   <div>
  //     <Display counter={counter} />
  //     <Button onClick={increaseByOne} text="Increase" />
  //     <Button onClick={decreaseByOne} text="Decrease" />
  //     <Button onClick={resetToZero} text="Reset" />
  //   </div>

  // setTimeout(
  //   () => setCounter(counter+1),
  //   1000
  // )

  // return (
  //   <div>{counter}</div>
  // )

  // const {counter} = props

  // return (
  //   <div>{counter}</div>
  // )

  // const name = 'Peter'
  // const age = 25

  // return (
  //   <div>
  //     <h1>Greetings</h1>
  //     <Hello name="Maya" age={25-5} />
  //     <Hello name={name} age={age} />
  //   </div>
  // )