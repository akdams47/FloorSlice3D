import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import { useAppStore } from '../../store/useAppStore'

const CAMERA_HEIGHT = 4
const LOOK_AHEAD_HEIGHT = 1.5

export default function CameraController() {
  const isAnimating = useAppStore((s) => s.isAnimating)
  const stopFlythrough = useAppStore((s) => s.stopFlythrough)
  const setActiveRoom = useAppStore((s) => s.setActiveRoom)
  const floorPlan = useAppStore((s) => s.floorPlan)
  const { camera } = useThree()

  const progressRef = useRef({ value: 0 })
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const orbitRef = useRef<any>(null)

  // Compute room centroids for the fly-through path
  const roomCentroids = useMemo(() => {
    return floorPlan.camera.flythrough.map((waypoint) => {
      const room = floorPlan.rooms.find((r) => r.id === waypoint.target)
      if (!room) return new THREE.Vector3(5, CAMERA_HEIGHT, 4)

      const cx =
        room.vertices.reduce((sum, v) => sum + v[0], 0) / room.vertices.length
      const cz =
        room.vertices.reduce((sum, v) => sum + v[1], 0) / room.vertices.length

      return new THREE.Vector3(cx, CAMERA_HEIGHT, cz)
    })
  }, [floorPlan])

  // Build Catmull-Rom curve through room centroids
  const curve = useMemo(() => {
    if (roomCentroids.length < 2) return null
    return new THREE.CatmullRomCurve3(roomCentroids, false, 'catmullrom', 0.5)
  }, [roomCentroids])

  // Total duration from all waypoints
  const totalDuration = useMemo(
    () => floorPlan.camera.flythrough.reduce((sum, wp) => sum + wp.duration, 0),
    [floorPlan.camera.flythrough],
  )

  useEffect(() => {
    if (!isAnimating || !curve) return

    progressRef.current.value = 0

    // Save camera state before animation
    const savedPos = camera.position.clone()

    const tl = gsap.timeline({
      onComplete: () => {
        stopFlythrough()
        setActiveRoom(null)
        // Restore to overview position
        camera.position.copy(savedPos)
      },
      onUpdate: () => {
        // Update active room based on progress
        const progress = progressRef.current.value
        const waypointIndex = Math.min(
          Math.floor(progress * floorPlan.camera.flythrough.length),
          floorPlan.camera.flythrough.length - 1,
        )
        const waypoint = floorPlan.camera.flythrough[waypointIndex]
        if (waypoint) setActiveRoom(waypoint.target)
      },
    })

    tl.to(progressRef.current, {
      value: 1,
      duration: totalDuration,
      ease: 'none',
    })

    timelineRef.current = tl

    return () => {
      tl.kill()
      timelineRef.current = null
    }
  }, [isAnimating, curve, totalDuration, camera, stopFlythrough, setActiveRoom, floorPlan.camera.flythrough])

  useFrame(() => {
    if (!isAnimating || !curve) return

    const progress = Math.max(0, Math.min(1, progressRef.current.value))
    const point = curve.getPointAt(progress)
    camera.position.copy(point)

    // Look slightly ahead on the curve for smooth direction
    const lookProgress = Math.min(1, progress + 0.05)
    const lookTarget = curve.getPointAt(lookProgress)
    lookTarget.y = LOOK_AHEAD_HEIGHT
    camera.lookAt(lookTarget)
  })

  // Only render OrbitControls when NOT animating
  if (isAnimating) return null

  return (
    <OrbitControls
      ref={orbitRef}
      target={[5, 0, 4]}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={3}
      maxDistance={40}
    />
  )
}
