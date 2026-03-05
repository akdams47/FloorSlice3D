import { useMemo } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'
import { useBounds } from './FloorPlan'

export default function Floor() {
  const settings = useAppStore((s) => s.floorPlan.settings)
  const bounds = useBounds()

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4c8b0',
        roughness: 0.9,
        metalness: 0.0,
      }),
    [],
  )

  const ceilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f0ece4',
        roughness: 0.95,
        metalness: 0.0,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      }),
    [],
  )

  return (
    <>
      {/* Floor plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[bounds.centerX, 0, bounds.centerZ]}
        receiveShadow
        material={floorMaterial}
      >
        <planeGeometry args={[bounds.width, bounds.depth]} />
      </mesh>

      {/* Ceiling plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[bounds.centerX, settings.floorHeight, bounds.centerZ]}
        material={ceilingMaterial}
      >
        <planeGeometry args={[bounds.width, bounds.depth]} />
      </mesh>
    </>
  )
}
