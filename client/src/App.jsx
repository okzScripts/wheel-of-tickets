import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
       <form>
           <label for="testToMail">Input message</label>
           <input
           type="text"
           id="testToMail"
           />
       </form>
      </div>
     
    </>
  )
}

export default App
