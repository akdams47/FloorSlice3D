import { Subtraction } from '@react-three/csg'
import type { Aperture as ApertureType } from '../../types/floorplan'

interface ApertureProps {
  aperture: ApertureType
  wallThickness: number
  wallLength: number
}

/**
 * CSG subtraction volume for a door or window.
 * Positioned in wall-local space where:
 *   - X axis runs along the wall length
 *   - Y axis is vertical (height)
 *   - Z axis is wall thickness direction
 *
 * The box is slightly deeper than wall thickness (+0.002)
 * to avoid coplanar z-fighting at boolean boundaries.
 */
export default function Aperture({ aperture, wallThickness }: ApertureProps) {
  const { offset, width, height, sillHeight } = aperture
  const depth = wallThickness + 0.002

  return (
    <Subtraction
      position={[
        offset,
        sillHeight + height / 2,
        wallThickness / 2,
      ]}
    >
      <boxGeometry args={[width, height, depth]} />
    </Subtraction>
  )
}
