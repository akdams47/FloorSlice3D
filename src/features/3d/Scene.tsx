import { Grid } from '@react-three/drei'

export default function Scene() {
  return (
    <>
      <fog attach="fog" args={['#1a1a2e', 30, 60]} />
      <Grid
        position={[5, -0.01, 4]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#4a4a6a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#6a6a9a"
        fadeDistance={40}
        fadeStrength={1}
        infiniteGrid
      />
    </>
  )
}
