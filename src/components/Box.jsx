/* eslint-disable react/no-unknown-property */

import { CuboidCollider, RigidBody } from "@react-three/rapier"

export default function Box(props) {

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="magenta" />
      </mesh>

      <CuboidCollider args={[1, 1, 1]} position={[0, 0, 0]} />
    </RigidBody>
  )
}