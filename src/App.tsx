import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './features/3d/Scene'
import Lighting from './features/3d/Lighting'
import FloorPlan from './features/3d/FloorPlan'
import Floor from './features/3d/Floor'
import SunLight from './features/3d/SunLight'
import CameraController from './features/3d/CameraController'
import ControlPanel from './features/ui/ControlPanel'

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
          <FloorPlan />
          <Floor />
          <SunLight />
          <CameraController />
        </Suspense>
      </Canvas>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <ControlPanel />
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <span className="text-white/50 text-sm font-mono">FloorSlice3D</span>
        </div>
      </div>
    </div>
  )
}
