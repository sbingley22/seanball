/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import * as THREE from "three"
import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls, useGLTF, useAnimations, Sphere } from "@react-three/drei"
import { CapsuleCollider, RigidBody } from "@react-three/rapier"
import useCollectableStore from "../stores/CollectableStore"

// Preload the GLB model
useGLTF.preload('/LeeTinker2.glb');

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
  const gamePaused = useRef(false)

  // Fetch model
  const { nodes, animations } = useGLTF("/LeeTinker2.glb")
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

  const vec3 = new THREE.Vector3()
  const vec3b = new THREE.Vector3()
  const quat = new THREE.Quaternion()
  const quat2 = new THREE.Quaternion()

  // Game Logic
  useFrame((state, delta) => {
    if (refBody.current === null) return

    //if (gamePaused.current) return

    //console.log(props.touchJump.current)

    if (seanBlob.current === undefined) {
      seanBlob.current = findSceneObject(state, "SeanBlob")
    }

    if (gameWon.current) {
      updateAnimation("Happy", animName, setAnimName)
      return
    }

    //Keep Physics awake
    refBody.current.wakeUp()

    const { forward, backward, left, right, jump, interact, pause } = getKeys()

    // jumping
    const grounded = jumping(state, delta, vec3, refBody, jump, props.touchJump, jumpBoost, animName, setAnimName)

    // movement
    movement(state, delta, vec3, quat, quat2, animName, setAnimName, refBody, forward, backward, left, right, props.touchRef, grounded)
      
    // update camera
    cameraUpdate(state, delta, refBody, vec3, vec3b)
    
    // Interactable button press
    if (interact) {
      //console.log()
      props.resetGame()
    }

    // Pause Game
    if (pause) {
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


function jumping(state, delta, vec3, refBody, jump, touchJump, jumpBoost, animName, setAnimName) {
  const trans = refBody.current.translation()
  const rayDir = vec3.set(0, -1, 0);
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

  const jumping = jump || touchJump.current;

  // jumping
  if (jumping && grounded) {
    const linvel = refBody.current.linvel()
    linvel.y = 4
    refBody.current.setLinvel(linvel)
  }

  // boost jump
  if (jumping && jumpBoost.current > 0) {
    const linvel = refBody.current.linvel()
    linvel.y += 0.2
    refBody.current.setLinvel(linvel)
  }

  return grounded
}

function getTouchMovement(touchRef) {
  const wH = window.innerHeight;
  const wW = window.innerWidth;
  let up = false
  let down = false
  let left = false
  let right = false

  if (touchRef.current.x != null){
    if (touchRef.current.y < wH /2){
      if (touchRef.current.y < wH / 5) up = true
      else if (touchRef.current.y > wH / 4) down = true  
      if (touchRef.current.x < wW / 2.5) left = true
      else if (touchRef.current.x > wW / 1.5) right = true  
    }
  }

  return [up, down, left, right]
}

function movement(state, delta, vec3, quat, quat2, animName, setAnimName, refBody, forward, backward, left, right, touchRef, grounded) {
  const [tUp, tDown, tLeft, tRight] = getTouchMovement(touchRef)

  const bk = backward || tDown
  const fwd = forward || tUp
  const lft = left || tLeft
  const rht = right || tRight
  
  //Move in the direction pressed
  frontVector.set(0, 0, bk - fwd)
  sideVector.set(lft - rht, 0, 0)
  direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED)

  refBody.current.setLinvel({ x: direction.x, y: refBody.current.linvel().y, z: direction.z })

  if (direction.length() > 1) {
    //console.log(grounded)
    if (grounded) updateAnimation("Run", animName, setAnimName)

    // Rotate to the correct direction
    const angle = Math.atan2(direction.x, direction.z);
    const rotation = quat;
    rotation.setFromAxisAngle(vec3.set(0, 1, 0), angle);

    // Smooth rotation with lerp
    const lerpedRotation = quat2.set(
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

function cameraUpdate(state, delta, refBody, vec3, vec3b) {
  // camera offsets
  const viewY = 5
  const viewZ = 15
  // player translation
  const trans = vec3.set(
    refBody.current.translation().x,
    refBody.current.translation().y,
    refBody.current.translation().z,
  )
  // look infront of movement direction
  trans.addScaledVector(direction, 1.0)
  // add camera offsets
  const targetPosition = vec3b.set(trans.x, trans.y + viewY, trans.z + viewZ);
  // look infront of cameras current position
  const lookAt = vec3.set(
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