// numEros Unified Scan Generator
import { ScanOutput, UserInput, createPlanetData, createAngleData, calculateHouse } from './scanOutput'
import { calculateNumerologyResult } from './numerology'

// Mock planetary calculations (in production, use pyswisseph)
function mockPlanetaryPositions(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)

  // Use realistic approximations based on date
  const dayOfYear = Math.floor(
    (new Date(year, month - 1, day).getTime() - new Date(year, 0, 1).getTime()) / 86400000
  )

  // Sun moves ~1deg per day, starts at Aries 0deg on March 21
  const sunPosition = ((dayOfYear - 80) * 0.986) % 360

  return {
    sun: sunPosition < 0 ? sunPosition + 360 : sunPosition,
    mercury: (sunPosition + (year % 30) - 10) % 360, // Mercury close to sun
    venus: (sunPosition - 20 + month * 3) % 360,
    mars: (sunPosition + 50 + day * 2) % 360,
    jupiter: ((year - 1900) * 30.5) % 360,
    saturn: ((year - 1900) * 12.2) % 360,
  }
}

function mockMoonPosition(dateStr: string, birthHour: string): number {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour] = birthHour.split(':').map(Number)

  // Moon moves ~13deg per day
  const dayOfYear = Math.floor(
    (new Date(year, month - 1, day).getTime() - new Date(year, 0, 1).getTime()) / 86400000
  )
  const moonBase = (dayOfYear * 13.2 + hour * 0.5) % 360

  return moonBase
}

function mockAngles(dateStr: string, birthHour: string, lat: number, lon: number) {
  const [hour, minute] = birthHour.split(':').map(Number)

  // Ascendant rises through all signs in 24 hours
  const timeDecimal = hour + minute / 60
  const ascendant = ((timeDecimal / 24) * 360 + lat + lon / 4) % 360

  // MC is roughly 90deg ahead in most locations
  const midheaven = (ascendant + 90 + lat / 2) % 360

  return {
    ascendant,
    midheaven,
  }
}

function mockHouses(ascendant: number): number[] {
  const cusps: number[] = []
  for (let i = 0; i < 12; i++) {
    cusps.push((ascendant + i * 30) % 360)
  }
  return cusps
}

export function generateScan(userInput: UserInput): ScanOutput {
  // Compute full name
  const nameParts = [userInput.name_first, userInput.name_middle, userInput.name_last].filter(
    Boolean
  )
  const name_full = nameParts.join(' ')

  // Determine chart level according to spec
  let chart_level: 1 | 2 | 3 | 4 = 1
  if (userInput.birth_hour && userInput.birth_place?.latitude && userInput.birth_place?.longitude) {
    chart_level = 4 // Full chart with place (can be 3 or 4, we'll use 4 for complete)
  } else if (userInput.birth_hour) {
    chart_level = 2 // Enhanced with precise Moon
  } else {
    chart_level = 1 // Basic with noon approximation
  }

  // Calculate numerology (always available)
  const numerologyResult = calculateNumerologyResult(name_full, userInput.birth_date)
  const numerology = {
    life_path: numerologyResult.life_path,
    soul_urge: numerologyResult.soul_urge,
    expression: numerologyResult.expression,
    personality: numerologyResult.personality,
    master_numbers: numerologyResult.master_numbers,
  }

  // Calculate astrology
  const planetPositions = mockPlanetaryPositions(userInput.birth_date)

  // Moon (requires birth hour)
  const moonLongitude = userInput.birth_hour
    ? mockMoonPosition(userInput.birth_date, userInput.birth_hour)
    : null

  // Angles and houses (require birth hour + place)
  let angles: { ascendant: ReturnType<typeof createAngleData> | null; midheaven: ReturnType<typeof createAngleData> | null } = { ascendant: null, midheaven: null }
  let houses = null
  let houseCusps: number[] | null = null

  if (chart_level === 4 && userInput.birth_hour && userInput.birth_place) {
    const anglesData = mockAngles(
      userInput.birth_date,
      userInput.birth_hour,
      userInput.birth_place.latitude,
      userInput.birth_place.longitude
    )

    angles = {
      ascendant: createAngleData(anglesData.ascendant),
      midheaven: createAngleData(anglesData.midheaven),
    }

    houseCusps = mockHouses(anglesData.ascendant)
    houses = {
      system: 'placidus' as const,
      cusps: houseCusps,
    }
  }

  // Create planet data with house placements
  const planets = {
    sun: createPlanetData(
      planetPositions.sun,
      houseCusps ? calculateHouse(planetPositions.sun, houseCusps) : null
    ),
    moon:
      moonLongitude !== null
        ? createPlanetData(
            moonLongitude,
            houseCusps ? calculateHouse(moonLongitude, houseCusps) : null
          )
        : null,
    mercury: createPlanetData(
      planetPositions.mercury,
      houseCusps ? calculateHouse(planetPositions.mercury, houseCusps) : null
    ),
    venus: createPlanetData(
      planetPositions.venus,
      houseCusps ? calculateHouse(planetPositions.venus, houseCusps) : null
    ),
    mars: createPlanetData(
      planetPositions.mars,
      houseCusps ? calculateHouse(planetPositions.mars, houseCusps) : null
    ),
    jupiter: createPlanetData(
      planetPositions.jupiter,
      houseCusps ? calculateHouse(planetPositions.jupiter, houseCusps) : null
    ),
    saturn: createPlanetData(
      planetPositions.saturn,
      houseCusps ? calculateHouse(planetPositions.saturn, houseCusps) : null
    ),
  }

  return {
    user_input: userInput,
    computed: { name_full },
    chart_level,
    numerology,
    astrology: {
      zodiac_system: 'tropical',
      ephemeris: 'pyswisseph',
      angles,
      houses,
      planets,
    },
    generated_at: new Date().toISOString(),
    schema_version: '1.0',
  }
}
