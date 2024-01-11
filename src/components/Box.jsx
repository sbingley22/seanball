/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { CuboidCollider, RigidBody } from "@react-three/rapier"

export default function Box({ geo, position, scale }) {

  return (
    <RigidBody position={position} scale={scale} type="fixed" colliders={false}>
      <mesh
        geometry={geo}
        receiveShadow
        castShadow
        scale={[2,2,2]}
      >
        <meshStandardMaterial color="magenta" />
      </mesh>

      <CuboidCollider args={[1, 1, 1]} position={[0, 0, 0]} />
    </RigidBody>
  )
}