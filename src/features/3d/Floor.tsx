import { useMemo } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'

export default function Floor() {
  const floorPlan = useAppStore((s) => s.floorPlan)
  const { walls, settings } = floorPlan

  const bounds = useMemo(() => {
    let minX = Infinity, minZ = Infinity
    let maxX = -Infinity, maxZ = -Infinity
    for (const wall of walls) {
      for (const pt of [wall.start, wall.end]) {
        minX = Math.min(minX, pt[0])
        minZ = Math.min(minZ, pt[1])
        maxX = Math.max(maxX, pt[0])
        maxZ = Math.max(maxZ, pt[1])
      }
    }
    const margin = 0.3
    return {
      minX: minX - margin,
      minZ: minZ - margin,
      maxX: maxX + margin,
      maxZ: maxZ + margin,
      width: maxX - minX + margin * 2,
      depth: maxZ - minZ + margin * 2,
      centerX: (minX + maxX) / 2,
      centerZ: (minZ + maxZ) / 2,
    }
  }, [walls])

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
