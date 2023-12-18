/* eslint-disable react/prop-types */


export default function MainMenu({setMainMenu}) {
    const startClicked = () => {
        setMainMenu(false)
    }

    return (
        <div className="main-menu">
            <h1>FPS Game</h1>
            <p>
                Simple FPS setup to get you started making FPS games.
            </p>
            <button onClick={startClicked}>
                Start Game
            </button>
        </div>
    )
}