import { createContext, useContext, useMemo } from 'react'
import * as THREE from 'three'
import { useAppStore } from '../../store/useAppStore'

interface ClippingContextValue {
  clippingPlane: THREE.Plane
  frontStencilMaterial: THREE.MeshStandardMaterial
  backStencilMaterial: THREE.MeshStandardMaterial
}

const ClippingContext = createContext<ClippingContextValue | null>(null)

export function useClipping() {
  const ctx = useContext(ClippingContext)
  if (!ctx) throw new Error('useClipping must be used within ClippingManager')
  return ctx
}

interface ClippingManagerProps {
  children: React.ReactNode
  bounds: { minX: number; minZ: number; width: number; depth: number; centerX: number; centerZ: number }
}

export default function ClippingManager({ children, bounds }: ClippingManagerProps) {
  const clippingHeight = useAppStore((s) => s.clippingHeight)
  const floorHeight = useAppStore((s) => s.floorPlan.settings.floorHeight)

  const clippingPlane = useMemo(() => new THREE.Plane(), [])

  // Update plane constant reactively (no new object allocation)
  clippingPlane.normal.set(0, -1, 0)
  clippingPlane.constant = clippingHeight

  const frontStencilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8e0d4',
        colorWrite: false,
        depthWrite: false,
        stencilWrite: true,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilZPass: THREE.IncrementWrapStencilOp,
        stencilFail: THREE.KeepStencilOp,
        stencilZFail: THREE.KeepStencilOp,
        side: THREE.FrontSide,
        clippingPlanes: [],
      }),
    [],
  )

  const backStencilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8e0d4',
        colorWrite: false,
        depthWrite: false,
        stencilWrite: true,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilZPass: THREE.DecrementWrapStencilOp,
        stencilFail: THREE.KeepStencilOp,
        stencilZFail: THREE.KeepStencilOp,
        side: THREE.BackSide,
        clippingPlanes: [],
      }),
    [],
  )

  const capMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b8b0a0',
        roughness: 0.9,
        metalness: 0.0,
        stencilWrite: false,
        stencilFunc: THREE.NotEqualStencilFunc,
        stencilRef: 0,
        stencilFail: THREE.KeepStencilOp,
        stencilZFail: THREE.KeepStencilOp,
        stencilZPass: THREE.KeepStencilOp,
      }),
    [],
  )

  // Assign clipping planes to stencil materials
  frontStencilMaterial.clippingPlanes = [clippingPlane]
  backStencilMaterial.clippingPlanes = [clippingPlane]

  const isClipping = clippingHeight < floorHeight

  const ctx = useMemo<ClippingContextValue>(
    () => ({ clippingPlane, frontStencilMaterial, backStencilMaterial }),
    [clippingPlane, frontStencilMaterial, backStencilMaterial],
  )

  return (
    <ClippingContext.Provider value={ctx}>
      {children}

      {/* Cap plane — only visible when clipping is active */}
      {isClipping && (
        <mesh
          renderOrder={3}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[bounds.centerX, clippingHeight, bounds.centerZ]}
          material={capMaterial}
        >
          <planeGeometry args={[bounds.width + 1, bounds.depth + 1]} />
        </mesh>
      )}
    </ClippingContext.Provider>
  )
}
