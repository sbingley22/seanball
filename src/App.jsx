import { useState } from 'react'
import './App.css'
import MainMenu from './components/MainMenu'
import Game from './components/Game'

function App() {
  const [mainMenu, setMainMenu] = useState(true)
  const [gameKey, setGameKey] = useState(0)
  const [difficulty, setDifficulty] = useState(0)

  const resetGame = () => {
    setGameKey(prev => prev + 1)
  }

  return (
    <>
      { mainMenu ? 
        <MainMenu setMainMenu={setMainMenu} setDifficulty={setDifficulty} /> 
        : 
        <Game key={gameKey} resetGame={resetGame} difficulty={difficulty} />
      }
    </>
  )
}

export default App
