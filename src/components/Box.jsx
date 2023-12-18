/* eslint-disable react/no-unknown-property */
import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import dirt from "../assets/dirt.jpg"
import { CuboidCollider, RigidBody } from "@react-three/rapier"

export default function Box(props) {
  const texture = useTexture(dirt)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial map={texture} map-repeat={[240, 240]} color="yellow" />
      </mesh>

      <CuboidCollider args={[1, 1, 1]} position={[0, 0, 0]} />
    </RigidBody>
  )
}