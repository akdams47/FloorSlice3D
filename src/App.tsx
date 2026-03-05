import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import Scene from './features/3d/Scene'
import Lighting from './features/3d/Lighting'
import FloorPlan from './features/3d/FloorPlan'
import Floor from './features/3d/Floor'
import SunLight from './features/3d/SunLight'
import CameraController from './features/3d/CameraController'
import ControlPanel from './features/ui/ControlPanel'
import ChatPanel from './features/ui/ChatPanel'

function LoadingFallback() {
  return (
    <mesh position={[5, 1.4, 4]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  )
}

export default function App() {
  return (
    <div className="w-full h-full relative bg-gray-950">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ localClippingEnabled: true, stencil: true }}
        camera={{ position: [5, 12, 16], fov: 50, near: 0.1, far: 100 }}
      >
        <PerformanceMonitor
          onDecline={() => {
            // Reduce DPR if performance drops
            const canvas = document.querySelector('canvas')
            if (canvas) {
              const ctx = (canvas as any).__r3f
              if (ctx) ctx.gl.setPixelRatio(1)
            }
          }}
        />
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
          <Lighting />
          <FloorPlan />
          <Floor />
          <SunLight />
          <CameraController />
        </Suspense>
      </Canvas>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <ChatPanel />
        <ControlPanel />
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <span className="text-white/50 text-xs font-mono">FloorSlice3D</span>
        </div>
      </div>
    </div>
  )
}
