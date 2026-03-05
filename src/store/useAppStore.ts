import { create } from 'zustand'
import type { FloorPlan } from '../types/floorplan'
import sampleData from '../data/sample-floorplan.json'

interface AppState {
  floorPlan: FloorPlan
  /** Time of day in hours (6.0 = 6:00 AM, 18.5 = 6:30 PM) */
  sunTime: number
  /** Clipping plane height (0 = floor, floorHeight = no clip) */
  clippingHeight: number
  isAnimating: boolean
  activeRoom: string | null

  setSunTime: (time: number) => void
  setClippingHeight: (height: number) => void
  startFlythrough: () => void
  stopFlythrough: () => void
  setActiveRoom: (roomId: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  floorPlan: sampleData as FloorPlan,
  sunTime: 12,
  clippingHeight: (sampleData as FloorPlan).settings.floorHeight,
  isAnimating: false,
  activeRoom: null,

  setSunTime: (time) => set({ sunTime: time }),
  setClippingHeight: (height) => set({ clippingHeight: height }),
  startFlythrough: () => set({ isAnimating: true }),
  stopFlythrough: () => set({ isAnimating: false, activeRoom: null }),
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
}))
