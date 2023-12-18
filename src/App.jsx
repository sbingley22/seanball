import { useState } from 'react'
import './App.css'
import MainMenu from './components/MainMenu'
import Game from './components/Game'

function App() {
  const [mainMenu, setMainMenu] = useState(false)
  const [gameKey, setGameKey] = useState(0)

  const resetGame = () => {
    setGameKey(prev => prev + 1)
  }

  return (
    <>
      { mainMenu ? 
        <MainMenu setMainMenu={setMainMenu} /> 
        : 
        <Game key={gameKey} resetGame={resetGame} />
      }
    </>
  )
}

export default App
