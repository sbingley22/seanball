/* eslint-disable react/no-unknown-property */
import Box from "./Box"
import Enemy from "./Enemy"
import Collectable from "./Collectable"
import useCollectableStore from "../stores/CollectableStore"

export default function Map({difficulty}) {
  const collectables = useCollectableStore((state) => state.collectables)

  return (
    <>      
      <group position={[0,0,0]}>
        {/* <pointLight position={[0,50,20]} intensity={2500} castShadow/> */}
        <pointLight position={[0,50,65]} intensity={7500} castShadow/>
        {/* <pointLight position={[0,50,100]} intensity={2500} castShadow/> */}
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

      <Enemy position={[0,0,-11]} difficulty={difficulty} />

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