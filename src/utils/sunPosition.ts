const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

/**
 * Calculate the day of year from a date string (YYYY-MM-DD).
 */
export function getDayOfYear(dateStr: string): number {
  const date = new Date(dateStr)
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Solar declination angle in degrees.
 * δ = 23.45° × sin(360/365 × (284 + dayOfYear))
 */
export function getSolarDeclination(dayOfYear: number): number {
  return 23.45 * Math.sin(DEG_TO_RAD * (360 / 365) * (284 + dayOfYear))
}

/**
 * Calculate sun altitude and azimuth angles.
 * Returns angles in degrees.
 */
export function getSunPosition(
  latitude: number,
  hourOfDay: number,
  dayOfYear: number,
): { altitude: number; azimuth: number } {
  const declination = getSolarDeclination(dayOfYear)
  const hourAngle = 15 * (hourOfDay - 12) // degrees

  const latRad = latitude * DEG_TO_RAD
  const decRad = declination * DEG_TO_RAD
  const haRad = hourAngle * DEG_TO_RAD

  // Solar altitude
  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * RAD_TO_DEG

  // Solar azimuth
  const cosAlt = Math.cos(altitude * DEG_TO_RAD)
  if (cosAlt === 0) return { altitude, azimuth: 0 }

  const sinAz = (-Math.cos(decRad) * Math.sin(haRad)) / cosAlt
  const cosAz =
    (Math.sin(decRad) - Math.sin(latRad) * sinAlt) /
    (Math.cos(latRad) * cosAlt)

  let azimuth = Math.atan2(sinAz, cosAz) * RAD_TO_DEG
  // Normalize to 0-360
  if (azimuth < 0) azimuth += 360

  return { altitude, azimuth }
}

/**
 * Convert spherical sun position to Cartesian coordinates for DirectionalLight.
 * Y is up, X is east, Z is south.
 */
export function sunToCartesian(
  altitude: number,
  azimuth: number,
  distance: number,
): [number, number, number] {
  const altRad = altitude * DEG_TO_RAD
  const azRad = azimuth * DEG_TO_RAD

  const x = distance * Math.cos(altRad) * Math.sin(azRad)
  const y = distance * Math.sin(altRad)
  const z = distance * Math.cos(altRad) * Math.cos(azRad)

  return [x, y, z]
}

/**
 * Calculate a warm color temperature shift based on altitude.
 * Low sun = warm orange, high sun = neutral white.
 */
export function getSunColor(altitude: number): string {
  const t = Math.max(0, Math.min(1, altitude / 45))
  const r = 255
  const g = Math.round(200 + 55 * t)
  const b = Math.round(150 + 105 * t)
  return `rgb(${r}, ${g}, ${b})`
}
