import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Scene from './features/3d/Scene'
import Lighting from './features/3d/Lighting'

export default function App() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{ localClippingEnabled: true, stencil: true }}
        camera={{ position: [5, 12, 16], fov: 50, near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <Scene />
          <Lighting />
          <OrbitControls
            target={[5, 0, 4]}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={3}
            maxDistance={40}
          />
        </Suspense>
      </Canvas>

      {/* UI overlay - populated in Commit 9 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <span className="text-white/50 text-sm font-mono">FloorSlice3D</span>
        </div>
      </div>
    </div>
  )
}
