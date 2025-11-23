import { MoveLeft } from 'lucide-react'

const buttonVal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -1]
const Calculator = ({ setValue }) => {
  function handleInput(item: number) {
    if (item === -1) {
      setValue((prev) => Math.floor(prev / 10))
      return
    }
    setValue((prev) => prev * 10 + item)
  }

  return (
    <div className={`mb-4 mt-8 grid grid-cols-3 justify-items-center text-xl`}>
      {buttonVal.map((item, index) => (
        <button
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-full text-gray-800 transition-colors focus:bg-gray-100`}
          key={index}
          onClick={() => handleInput(item)}
        >
          {item === -1 ? <MoveLeft></MoveLeft> : item}
        </button>
      ))}
    </div>
  )
}
export default Calculator
