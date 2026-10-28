import { useCounterControls } from './store'

const Controls = () => {
  const { increment, decrement, zero } = useCounterControls()

  return (
    <div>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}

export default Controls