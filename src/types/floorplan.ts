export interface Aperture {
  type: 'door' | 'window'
  /** Distance along the wall from the start point */
  offset: number
  width: number
  height: number
  /** Height of the sill above the floor (0 for doors) */
  sillHeight: number
}

export interface Wall {
  id: string
  type: 'exterior' | 'interior'
  start: [number, number]
  end: [number, number]
  thickness: number
  apertures: Aperture[]
}

export interface Room {
  id: string
  label: string
  /** 2D vertices defining the room boundary (floor plane, XZ) */
  vertices: [number, number][]
}

export interface CameraWaypoint {
  target: string
  duration: number
  easing: string
}

export interface SunConfig {
  latitude: number
  longitude: number
  date: string
}

export interface FloorPlanSettings {
  wallThickness: number
  floorHeight: number
}

export interface FloorPlan {
  settings: FloorPlanSettings
  rooms: Room[]
  walls: Wall[]
  camera: {
    flythrough: CameraWaypoint[]
  }
  sun: SunConfig
}
