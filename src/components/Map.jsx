/* eslint-disable react/no-unknown-property */
import Box from "./Box"
import Enemy from "./Enemy"
import Collectable from "./Collectable"
import useCollectableStore from "../stores/CollectableStore"

export default function Map() {
  const collectables = useCollectableStore((state) => state.collectables)

  return (
    <>      
      <directionalLight
        intensity={1.0}
        position={[0, 5000, -5000]}
        castShadow
        shadow-mapSize={1024}
      />

      <group position={[0,0,0]}>
        <pointLight position={[0,10,0]} intensity={100} castShadow/>
        <pointLight position={[0,10,30]} intensity={100} castShadow/>
        <pointLight position={[0,10,45]} intensity={100} castShadow/>
        <pointLight position={[0,10,60]} intensity={100} castShadow/>
        <pointLight position={[0,10,75]} intensity={100} castShadow/>
        <pointLight position={[0,10,90]} intensity={100} castShadow/>
        <pointLight position={[0,10,120]} intensity={100} castShadow/>
        <pointLight position={[0,10,150]} intensity={100} castShadow/>
      </group>

      <group position={[0,0,0]}>
        <Box position={[0,-1,-20]} scale={[1,1,24]} />
        <Box position={[0,-1,12]} scale={[1,1,4]} />
        <Box position={[1,-1,20]} scale={[1,1,2]} />
        <Box position={[-1,-1,30]} scale={[1,1,1]} />
        <Box position={[-1,-1,36]} scale={[1,1,2]} />
        <Box position={[2,-1,43]} scale={[1,1,1.5]} />
        <Box position={[0,-1,55]} scale={[1,1,6]} />
        <Box position={[0,-1,75]} scale={[1,1,8]} />
        <Box position={[-1,-1,92]} scale={[0.5,1,4]} />
        <Box position={[1,-1,100]} scale={[1,1,2]} />
        <Box position={[-2,-1,110]} scale={[0.75,1,1.75]} />
        <Box position={[1,-1,120]} scale={[0.75,1,2]} />
        <Box position={[-2,-1,126]} scale={[1,1,1.75]} />
        <Box position={[1,-1,135]} scale={[0.85,1,8.5]} />
        <Box position={[1,-1,155]} scale={[4,1,6]} />
      </group>

      <Enemy position={[0,0,-11]} />

      {collectables.map((collectable) => (
        <Collectable 
          key={collectable.id} 
          position={collectable.pos}
          type="collectable"
        />
      ))}

    </>
  )
}