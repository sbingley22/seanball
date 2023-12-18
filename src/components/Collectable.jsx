/* eslint-disable react/no-unknown-property */

export default function Collectable(props) {
  
  return (
    <mesh
        {...props}
        receiveShadow
        castShadow
    >
      <sphereGeometry args={[0.25]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  )
}