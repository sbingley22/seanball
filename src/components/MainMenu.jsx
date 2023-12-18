/* eslint-disable react/prop-types */


export default function MainMenu({setMainMenu, setDifficulty}) {
    const startClicked = (mode) => {
        setDifficulty(mode)
        setMainMenu(false)
    }

    return (
        <div className="main-menu">
            <h1>Sean Balls guna get ya!</h1>
            <p>
                Sean ball wants to flatten you into a pancake then eat you. <strong>Dont let him!</strong>
            </p>
            <p>WASD = Move</p>
            <p>Spacebar = jump</p>
            <br />
            <p>Mobile Users: </p>
            <p>Touch top half of screen to move</p>
            <p>Touch bottom half of screen to jump</p>
            
            <button onClick={()=>startClicked(0)}>
                Easy Mode
            </button>
            <button onClick={()=>startClicked(1)}>
                Normal Mode
            </button>
        </div>
    )
}