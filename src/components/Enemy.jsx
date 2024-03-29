/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations, Sphere } from "@react-three/drei"

// Preload the GLB model
useGLTF.preload('/SeanBlob2.glb');

/*
Animation Names:
Idle
Angry
Rolling
*/

export default function Enemy(props) {
    const refBody = useRef()

    // Fetch model
    const { nodes, animations } = useGLTF("/SeanBlob2.glb")
    for (const key in nodes) {
        setShadow(nodes[key]);
    }
  
    // Extract animation actions
    const { ref, actions, names } = useAnimations(animations)
    //console.log( actions )
  
    // Animation-index states
    const [animName, setAnimName] = useState("Idle")

    // Change animation
    useEffect(() => {
        // Change Animation
        actions[animName].reset().fadeIn(0.5).play()
  
        //console.log(names)
        // In clean-up fade it out
        return () => actions[animName].fadeOut(0.5)
    }, [animName, actions, names])

    // Game Logic
    useFrame((state, delta) => {
        if (ref.current === null) return
        //console.log(ref)
        // movement
        movement(state, delta, animName, setAnimName, ref, props.difficulty)
    })

    return (
      <group ref={ref} {...props} dispose={null} name="SeanBlob" >
        <group ref={refBody} position={[0,0,0]}>
          <primitive
            object={nodes.Scene}
          />
        </group>
      </group>
    )    
}

function movement(state, delta, animName, setAnimName, ref, difficulty) {
    //console.log(ref.current.position)
    const pos = ref.current.position
    if (pos.z < -10) {
        setAnimName("Angry")
        ref.current.position.z += 0.005
    }
    else if (pos.z < 145) {
        setAnimName("Rolling")
        if (difficulty === 1) ref.current.position.z += 0.09
        else ref.current.position.z += 0.08
    }
    else {
        ref.current.position.y -= 0.1
    }
}

// Set model node attributes
const setShadow = (object) => {
    if (object.isMesh || object.isSkinnedMesh) {
      object.castShadow = false;
      object.receiveShadow = false;
    }
    if (object.children) {
      object.children.forEach((child) => {
        setShadow(child);
      });
    }
  };