// numEros Unified Scan Output Schema v1.0

export interface UserInput {
  name_first: string;
  name_middle: string | null;
  name_last: string;
  birth_date: string; // ISO date YYYY-MM-DD
  birth_hour: string | null; // HH:MM 24h format
  birth_place: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null;
}

export interface Computed {
  name_full: string;
}

export interface Numerology {
  life_path: number;
  soul_urge: number;
  expression: number;
  personality: number;
  master_numbers: number[];
}

export interface AngleData {
  longitude: number;
  sign: string;
  degree_in_sign: number;
}

export interface Angles {
  ascendant: AngleData | null;
  midheaven: AngleData | null;
}

export interface Houses {
  system: 'placidus';
  cusps: number[];
}

export interface PlanetData {
  longitude: number;
  sign: string;
  degree_in_sign: number;
  house: number | null;
}

export interface Planets {
  sun: PlanetData;
  moon: PlanetData | null;
  mercury: PlanetData;
  venus: PlanetData;
  mars: PlanetData;
  jupiter: PlanetData;
  saturn: PlanetData;
}

export interface Astrology {
  zodiac_system: 'tropical';
  ephemeris: 'pyswisseph';
  angles: Angles;
  houses: Houses | null;
  planets: Planets;
}

export interface ScanOutput {
  user_input: UserInput;
  computed: Computed;
  chart_level: 1 | 2 | 3 | 4;
  numerology: Numerology;
  astrology: Astrology;
  generated_at: string; // ISO 8601 timestamp
  schema_version: '1.0';
}

// Helper to create planet data
export function createPlanetData(
  longitude: number,
  house: number | null = null
): PlanetData {
  const signIndex = Math.floor(longitude / 30);
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  return {
    longitude,
    sign: signs[signIndex % 12],
    degree_in_sign: longitude % 30,
    house
  };
}

// Helper to create angle data
export function createAngleData(longitude: number): AngleData {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  // Normalize longitude to 0-360
  const normLongitude = ((longitude % 360) + 360) % 360;
  const normSignIndex = Math.floor(normLongitude / 30);

  return {
    longitude: normLongitude,
    sign: signs[normSignIndex],
    degree_in_sign: normLongitude % 30
  };
}

// Calculate which house a planet is in based on house cusps
export function calculateHouse(planetLongitude: number, houseCusps: number[]): number {
  // Normalize longitude to 0-360
  const normPlanet = ((planetLongitude % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const currentCusp = ((houseCusps[i] % 360) + 360) % 360;
    const nextCusp = i < 11
      ? ((houseCusps[i + 1] % 360) + 360) % 360
      : ((houseCusps[0] % 360) + 360) % 360;

    // Handle wrap-around at 0°/360°
    if (currentCusp < nextCusp) {
      if (normPlanet >= currentCusp && normPlanet < nextCusp) {
        return i + 1;
      }
    } else {
      if (normPlanet >= currentCusp || normPlanet < nextCusp) {
        return i + 1;
      }
    }
  }

  return 1; // Fallback to 1st house
}
