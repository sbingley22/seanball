/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import Box from "./Box"
import Enemy from "./Enemy"
import Collectable from "./Collectable"
import useCollectableStore from "../stores/CollectableStore"

export default function Map({difficulty}) {
  const collectables = useCollectableStore((state) => state.collectables)

  const width = difficulty==1 ? 1 : 2
  const height = difficulty==1 ? 1 : 1.2

  const threeBox = new THREE.BoxGeometry()

  return (
    <>      
      <group position={[0,0,0]}>
        {/* <pointLight position={[0,50,20]} intensity={2500} castShadow/> */}
        <pointLight position={[0,50,65]} intensity={7500} castShadow/>
        {/* <pointLight position={[0,50,100]} intensity={2500} castShadow/> */}
      </group>

      <group position={[0,0,0]}>
        <Box geo={threeBox} position={[0,-1,-20]} scale={[1*width,1,24*height]} />
        <Box geo={threeBox} position={[0,-1,12]} scale={[1*width,1,4*height]} />
        <Box geo={threeBox} position={[1,-1,20]} scale={[1*width,1,2*height]} />
        <Box geo={threeBox} position={[-1,-1,30]} scale={[1*width,1,1*height]} />
        <Box geo={threeBox} position={[-1,-1,36]} scale={[1*width,1,2*height]} />
        <Box geo={threeBox} position={[2,-1,43]} scale={[1*width,1,1.5*height]} />
        <Box geo={threeBox} position={[0,-1,55]} scale={[1*width,1,6*height]} />
        <Box geo={threeBox} position={[0,-1,75]} scale={[1*width,1,8*height]} />
        <Box geo={threeBox} position={[-1,-1,92]} scale={[0.5*width,1,4*height]} />
        <Box geo={threeBox} position={[1,-1,100]} scale={[1*width,1,2*height]} />
        <Box geo={threeBox} position={[-2,-1,110]} scale={[0.75*width,1,1.75*height]} />
        <Box geo={threeBox} position={[1,-1,120]} scale={[0.75*width,1,2*height]} />
        <Box geo={threeBox} position={[-2,-1,126]} scale={[1*width,1,1.75*height]} />
        <Box geo={threeBox} position={[1,-1,135]} scale={[0.85*width,1,8.5*height]} />
        <Box geo={threeBox} position={[1,-1,155]} scale={[4*width,1,6*height]} />
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