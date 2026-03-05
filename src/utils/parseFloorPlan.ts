import type { FloorPlan } from '../types/floorplan'

/**
 * Extract and validate a FloorPlan JSON from an AI response string.
 * The AI may return raw JSON or JSON wrapped in markdown code fences.
 */
export function parseFloorPlan(responseText: string): {
  plan: FloorPlan | null
  error: string | null
} {
  // Try to extract JSON from markdown code fences if present
  let jsonStr = responseText.trim()

  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  }

  // Try to find JSON object boundaries
  const firstBrace = jsonStr.indexOf('{')
  const lastBrace = jsonStr.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1)
  }

  let parsed: any
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    return { plan: null, error: 'Failed to parse JSON from AI response' }
  }

  // Validate required top-level fields
  if (!parsed.settings || !parsed.rooms || !parsed.walls) {
    return { plan: null, error: 'Missing required fields: settings, rooms, or walls' }
  }

  if (!parsed.settings.wallThickness || !parsed.settings.floorHeight) {
    return { plan: null, error: 'Missing settings.wallThickness or settings.floorHeight' }
  }

  if (!Array.isArray(parsed.rooms) || parsed.rooms.length === 0) {
    return { plan: null, error: 'rooms must be a non-empty array' }
  }

  if (!Array.isArray(parsed.walls) || parsed.walls.length === 0) {
    return { plan: null, error: 'walls must be a non-empty array' }
  }

  // Validate each room has required fields
  for (const room of parsed.rooms) {
    if (!room.id || !room.label || !Array.isArray(room.vertices)) {
      return { plan: null, error: `Invalid room: ${JSON.stringify(room)}` }
    }
  }

  // Validate each wall has required fields
  for (const wall of parsed.walls) {
    if (!wall.id || !wall.start || !wall.end) {
      return { plan: null, error: `Invalid wall: missing id, start, or end` }
    }
    if (!wall.thickness) wall.thickness = parsed.settings.wallThickness
    if (!wall.type) wall.type = 'exterior'
    if (!wall.apertures) wall.apertures = []
  }

  // Ensure camera flythrough exists
  if (!parsed.camera?.flythrough) {
    parsed.camera = {
      flythrough: parsed.rooms.map((r: any) => ({
        target: r.id,
        duration: 2.0,
        easing: 'power2.inOut',
      })),
    }
  }

  // Ensure sun config exists
  if (!parsed.sun) {
    parsed.sun = { latitude: 40.7, longitude: -74.0, date: '2025-06-21' }
  }

  return { plan: parsed as FloorPlan, error: null }
}
