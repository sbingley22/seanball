/* eslint-disable react/no-unknown-property */
import * as THREE from "three"
import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls, useGLTF, useAnimations, Sphere } from "@react-three/drei"
import { CapsuleCollider, RigidBody } from "@react-three/rapier"
import useCollectableStore from "../stores/CollectableStore"

/*
Animation Names:
Happy
Idle
Run
*/

const SPEED = 6;
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export default function Player(props) {
  const refBody = useRef()
  const [, getKeys] = useKeyboardControls()
  const jumpBoost = useRef(0)
  const gameWon = useRef(false)
  const seanBlob = useRef(undefined)

  // Fetch model
  const { nodes, animations } = useGLTF("/LeeTinker.glb")
  // Set shadow on nodes
  for (const key in nodes) {
      setShadow(nodes[key]);
    }
  //console.log(nodes)

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

  // Collectables
  const score = useRef(0)
  const collectables = useCollectableStore((state) => state.collectables)
  const pickupCollectable = (collectableId) => {
    useCollectableStore.setState( state => ({
      collectables: state.collectables.filter( collectable => collectable.id != collectableId)
    }))
    score.current += 1
    console.log(score)
  }


  // Game Logic
  useFrame((state, delta) => {
    if (refBody.current === null) return

    if (seanBlob.current === undefined) {
      seanBlob.current = findSceneObject(state, "SeanBlob")
    }
    //console.log(seanBlob.current)

    if (gameWon.current) {
      updateAnimation("Happy", animName, setAnimName)
      return
    }

    //Keep Physics awake
    refBody.current.wakeUp()

    const { forward, backward, left, right, jump, interact } = getKeys()

    // jumping
    const grounded = jumping(state, delta, refBody, jump, jumpBoost, animName, setAnimName)

    // movement
    movement(state, delta, animName, setAnimName, refBody, forward, backward, left, right, grounded)
      
    // update camera
    cameraUpdate(state, delta, refBody)
    
    // Interactable button press
    if (interact) {
      //console.log()
      props.resetGame()
    }

    // Pickup collectables
    collectableUpdate(state, refBody, collectables, pickupCollectable)

    // Check game over conditions
    checkGameOver(state, seanBlob, props.resetGame, gameWon, refBody)

  })

  return (
    <group ref={ref} {...props} dispose={null} >
      <RigidBody 
        ref={refBody}
        colliders={false} 
        mass={1} 
        type="dynamic" 
        position={[0, 2, 0]} 
        enabledRotations={[false, false, false]}
      >
        <primitive
          object={nodes.rig}
        />

        <CapsuleCollider 
          args={[0.5, 0.25]}
          position={[0,0.75,0]} 
        />

        <Sphere args={[0.3,16,16]} position={[0,0.4,0]} castShadow name="Invisible">
          <shadowMaterial transparent opacity={0.2} />
        </Sphere>
      </RigidBody>
    </group>
  )
}

function findSceneObject(state, name){
  let object = undefined
  state.scene.children.forEach(child => {
    if (child.name == name) {
      object = child
    }
  })
  
  return object
}

function checkGameOver(state, seanBlob, resetGame, gameWon, refBody) {
  const trans = refBody.current.translation()

  if (seanBlob.current.position.z > trans.z) {
    resetGame()
    return
  }
  if (trans.y < -3) {
    resetGame()
    return
  }

  if (trans.z > 155) {
    gameWon.current = true
    setTimeout(() => {
      window.location.reload(true);
    }, 5000)
  }
}


function updateAnimation(newName, animName, setAnimName) {
  if (animName != newName) setAnimName(newName)
}


function jumping(state, delta, refBody, jump, jumpBoost, animName, setAnimName) {
  const trans = refBody.current.translation()
  const rayDir = new THREE.Vector3(0, -1, 0);
  trans.y += 0.1

  // grounded
  state.raycaster.set(trans, rayDir);
  state.raycaster.far = 0.15;
  const intersects = state.raycaster.intersectObjects(state.scene.children, true);
  let grounded = false
  intersects.forEach(intersect => {
    if (intersect.object.type === "Mesh") {
      if (intersect.object.name != "Invisible") {
        grounded = true
      }
    }
  })

  // Allow for a boost to jump at the start
  if (grounded){
    jumpBoost.current = 20
  }
  else {
    jumpBoost.current -= 1
    if (jumpBoost.current < 0) jumpBoost.current = 0
    
    updateAnimation("Midair", animName, setAnimName)
  }

  // jumping
  if (jump && grounded) {
    const linvel = refBody.current.linvel()
    linvel.y = 4
    refBody.current.setLinvel(linvel)
  }

  // boost jump
  if (jump && jumpBoost.current > 0) {
    const linvel = refBody.current.linvel()
    linvel.y += 0.2
    refBody.current.setLinvel(linvel)
  }

  return grounded
}


function movement(state, delta, animName, setAnimName, refBody, forward, backward, left, right, grounded) {
  //Move in the direction pressed
  frontVector.set(0, 0, backward - forward)
  sideVector.set(left - right, 0, 0)
  direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED)
  //direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)

  refBody.current.setLinvel({ x: direction.x, y: refBody.current.linvel().y, z: direction.z })

  if (direction.length() > 1) {
    //console.log(grounded)
    if (grounded) updateAnimation("Run", animName, setAnimName)

    // Rotate to the correct direction
    const angle = Math.atan2(direction.x, direction.z);
    const rotation = new THREE.Quaternion();
    rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

    // Smooth rotation with lerp
    const lerpedRotation = new THREE.Quaternion(
      refBody.current.rotation().x,
      refBody.current.rotation().y,
      refBody.current.rotation().z,
      refBody.current.rotation().w,
    );
    lerpedRotation.slerp(rotation, 0.1)

    // Set the rotation of the body
    refBody.current.setRotation(lerpedRotation, true);
  }
  else {
    if (grounded) updateAnimation("Idle", animName, setAnimName)
  }
}

function cameraUpdate(state, delta, refBody) {
  // camera offsets
  const viewY = 5
  const viewZ = 15
  // player translation
  const trans = new THREE.Vector3(
    refBody.current.translation().x,
    refBody.current.translation().y,
    refBody.current.translation().z,
  )
  // look infront of movement direction
  trans.addScaledVector(direction, 1.0)
  // add camera offsets
  const targetPosition = new THREE.Vector3(trans.x, trans.y + viewY, trans.z + viewZ);
  // look infront of cameras current position
  const lookAt = new THREE.Vector3(
    state.camera.position.x,
    state.camera.position.y - viewY,
    state.camera.position.z -viewZ
  )
  state.camera.lookAt(lookAt)
  //only move camera when player is sufficiently far away from center
  if (targetPosition.distanceTo(state.camera.position) > 1) {
    state.camera.position.lerp(targetPosition, 0.014);
  }
}

function collectableUpdate(state, refBody, collectables, pickupCollectable) {
  const trans = new THREE.Vector3(
    refBody.current.translation().x,
    refBody.current.translation().y,
    refBody.current.translation().z,
  )
  collectables.forEach(collectable => {
    const pos = new THREE.Vector3(
      collectable.pos[0],
      collectable.pos[1],
      collectable.pos[2],
    )
    if (pos.distanceTo(trans) < 1.5){
      pickupCollectable(collectable.id)
      return
    }
  })
}

// Set model node attributes
const setShadow = (object) => {
  if (object.isMesh || object.isSkinnedMesh) {
    //object.castShadow = true;
    object.receiveShadow = true;
  }
  if (object.children) {
    object.children.forEach((child) => {
      setShadow(child);
    });
  }
};