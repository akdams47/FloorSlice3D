import { useMemo } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'
import Wall from './Wall'
import ClippingManager from './ClippingManager'

export function useBounds() {
  const walls = useAppStore((s) => s.floorPlan.walls)

  return useMemo(() => {
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
}

export default function FloorPlan() {
  const floorPlan = useAppStore((s) => s.floorPlan)
  const { walls, settings } = floorPlan
  const bounds = useBounds()

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8e0d4',
        roughness: 0.85,
        metalness: 0.05,
      }),
    [],
  )

  const revealMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c4b8a8',
        roughness: 0.9,
        metalness: 0.0,
      }),
    [],
  )

  return (
    <ClippingManager bounds={bounds}>
      {walls.map((wall) => (
        <Wall
          key={wall.id}
          wall={wall}
          floorHeight={settings.floorHeight}
          wallMaterial={wallMaterial}
          revealMaterial={revealMaterial}
        />
      ))}
    </ClippingManager>
  )
}
