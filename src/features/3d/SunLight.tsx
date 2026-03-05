import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import { useBounds } from './FloorPlan'
import {
  getDayOfYear,
  getSunPosition,
  sunToCartesian,
  getSunColor,
} from '../../utils/sunPosition'

const SUN_DISTANCE = 20

export default function SunLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const sunTime = useAppStore((s) => s.sunTime)
  const sunConfig = useAppStore((s) => s.floorPlan.sun)
  const bounds = useBounds()

  const dayOfYear = useMemo(
    () => getDayOfYear(sunConfig.date),
    [sunConfig.date],
  )

  // Update light position and color every frame based on sunTime
  useFrame(() => {
    if (!lightRef.current) return

    const { altitude, azimuth } = getSunPosition(
      sunConfig.latitude,
      sunTime,
      dayOfYear,
    )

    // Only show light when sun is above horizon
    if (altitude <= 0) {
      lightRef.current.intensity = 0
      return
    }

    const [x, y, z] = sunToCartesian(altitude, azimuth, SUN_DISTANCE)

    // Offset to center of floor plan
    lightRef.current.position.set(
      bounds.centerX + x,
      y,
      bounds.centerZ + z,
    )

    // Intensity based on altitude (stronger at noon)
    lightRef.current.intensity = Math.min(1.5, altitude / 30)

    // Warm color at low altitude
    lightRef.current.color.set(getSunColor(altitude))
  })

  // Fit shadow camera to bounding box
  const shadowCamSize = Math.max(bounds.width, bounds.depth) / 2 + 2

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-shadowCamSize}
      shadow-camera-right={shadowCamSize}
      shadow-camera-top={shadowCamSize}
      shadow-camera-bottom={-shadowCamSize}
      shadow-camera-near={0.5}
      shadow-camera-far={50}
      shadow-bias={-0.0005}
      shadow-normalBias={0.02}
      target-position={[bounds.centerX, 0, bounds.centerZ]}
    />
  )
}
