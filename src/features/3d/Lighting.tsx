export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight
        args={['#b1e1ff', '#b97a20', 0.5]}
        position={[0, 10, 0]}
      />
    </>
  )
}
