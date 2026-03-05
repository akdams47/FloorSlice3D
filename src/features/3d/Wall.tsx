import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Geometry, Base } from '@react-three/csg'
import type { Wall as WallType } from '../../types/floorplan'
import Aperture from './Aperture'

interface WallProps {
  wall: WallType
  floorHeight: number
  wallMaterial: THREE.MeshStandardMaterial
  revealMaterial: THREE.MeshStandardMaterial
}

export default function Wall({ wall, floorHeight, wallMaterial, revealMaterial }: WallProps) {
  const geometryRef = useRef<any>(null)

  const { position, rotation, length } = useMemo(() => {
    const [sx, sz] = wall.start
    const [ex, ez] = wall.end
    const dx = ex - sx
    const dz = ez - sz
    const len = Math.sqrt(dx * dx + dz * dz)
    const angle = -Math.atan2(dz, dx)

    return {
      position: new THREE.Vector3(sx, 0, sz),
      rotation: new THREE.Euler(0, angle, 0),
      length: len,
    }
  }, [wall.start, wall.end])

  const wallShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(length, 0)
    shape.lineTo(length, floorHeight)
    shape.lineTo(0, floorHeight)
    shape.closePath()
    return shape
  }, [length, floorHeight])

  const hasApertures = wall.apertures.length > 0

  return (
    <group position={position} rotation={rotation}>
      <mesh
        castShadow
        receiveShadow
      >
        {hasApertures ? (
          <Geometry
            ref={geometryRef}
            useGroups
            computeVertexNormals
          >
            <Base>
              <extrudeGeometry
                args={[
                  wallShape,
                  { depth: wall.thickness, bevelEnabled: false },
                ]}
              />
              <primitive object={wallMaterial} attach="material" />
            </Base>
            {wall.apertures.map((aperture, i) => (
              <Aperture
                key={`${wall.id}-aperture-${i}`}
                aperture={aperture}
                wallThickness={wall.thickness}
                wallLength={length}
              />
            ))}
          </Geometry>
        ) : (
          <extrudeGeometry
            args={[
              wallShape,
              { depth: wall.thickness, bevelEnabled: false },
            ]}
          />
        )}
        {!hasApertures && <primitive object={wallMaterial} attach="material" />}
      </mesh>
    </group>
  )
}
