import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useClipping } from './ClippingManager'

interface StencilWallProps {
  /** The visible wall mesh to clone geometry from */
  wallMeshRef: React.RefObject<THREE.Mesh | null>
  position: THREE.Vector3
  rotation: THREE.Euler
}

/**
 * Renders 2 invisible stencil-write passes for a wall mesh:
 * - Pass 1 (renderOrder 1): Front-face stencil increment
 * - Pass 2 (renderOrder 2): Back-face stencil decrement
 *
 * These work with the cap plane in ClippingManager (renderOrder 3)
 * to produce filled cross-sections when the clipping plane slices through walls.
 */
export default function StencilWall({ wallMeshRef, position, rotation }: StencilWallProps) {
  const { frontStencilMaterial, backStencilMaterial } = useClipping()
  const frontRef = useRef<THREE.Mesh>(null)
  const backRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    const source = wallMeshRef.current
    if (!source?.geometry) return

    if (frontRef.current) {
      frontRef.current.geometry = source.geometry
    }
    if (backRef.current) {
      backRef.current.geometry = source.geometry
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Pass 1: Front-face stencil increment */}
      <mesh
        ref={frontRef}
        renderOrder={1}
        material={frontStencilMaterial}
      />

      {/* Pass 2: Back-face stencil decrement */}
      <mesh
        ref={backRef}
        renderOrder={2}
        material={backStencilMaterial}
      />
    </group>
  )
}
