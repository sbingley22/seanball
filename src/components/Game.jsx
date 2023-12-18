/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber'
import { Stars, KeyboardControls } from "@react-three/drei"
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react'
import Player from './Player'
import Map from './Map'

export default function Game(props) {

  return (
    <div className="canvas-container">
      <KeyboardControls
        map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "interact", keys: ["f", "F"] },
        ]}
      >
        <Canvas
          style={{ width: "100%", height: "100%" }}
          shadows
          camera={{ fov: 45, position: [0, 5, 5] }}
        >
          <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <ambientLight intensity={0.4} />

              <Physics gravity={[0, -10, 0]} >
                <Player resetGame={props.resetGame} />
                <Map />
              </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}