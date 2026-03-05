import { useMemo } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'
import Wall from './Wall'

export default function FloorPlan() {
  const floorPlan = useAppStore((s) => s.floorPlan)
  const { walls, settings } = floorPlan

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
    <group>
      {walls.map((wall) => (
        <Wall
          key={wall.id}
          wall={wall}
          floorHeight={settings.floorHeight}
          wallMaterial={wallMaterial}
          revealMaterial={revealMaterial}
        />
      ))}
    </group>
  )
}
