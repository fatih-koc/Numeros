"""
Astrology calculation engine using Swiss Ephemeris (pyswisseph).

This produces chart data matching native/src/lib/scanOutput.ts interfaces.
"""

import os
from dataclasses import dataclass, asdict
from datetime import datetime, time, timezone
from typing import Dict, List, Optional, Tuple

try:
    import swisseph as swe
    SWISSEPH_AVAILABLE = True
except ImportError:
    SWISSEPH_AVAILABLE = False
    swe = None


# Initialize ephemeris path
def init_ephemeris():
    """Initialize Swiss Ephemeris with proper path."""
    if not SWISSEPH_AVAILABLE:
        return False

    # Try environment variable first, then default paths
    ephe_path = os.environ.get('EPHE_PATH')
    if not ephe_path:
        # Try common locations
        possible_paths = [
            '/Users/fatih/Documents/Works/Numeros/apps/backend/ephe',
            '/var/www/numeros/ephe',
            './ephe',
        ]
        for path in possible_paths:
            if os.path.exists(path):
                ephe_path = path
                break

    if ephe_path and os.path.exists(ephe_path):
        swe.set_ephe_path(ephe_path)
        return True

    return False


# Planet constants
PLANETS = {
    'sun': 0,      # swe.SUN
    'moon': 1,     # swe.MOON
    'mercury': 2,  # swe.MERCURY
    'venus': 3,    # swe.VENUS
    'mars': 4,     # swe.MARS
    'jupiter': 5,  # swe.JUPITER
    'saturn': 6,   # swe.SATURN
}

ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]


@dataclass
class PlanetPosition:
    """Planet position data matching scanOutput.ts PlanetData interface."""
    longitude: float
    sign: str
    degree_in_sign: float
    house: Optional[int] = None
    is_retrograde: bool = False


@dataclass
class AngleData:
    """Angle data matching scanOutput.ts AngleData interface."""
    longitude: float
    sign: str
    degree_in_sign: float


@dataclass
class ChartData:
    """
    Full chart data matching scanOutput.ts Astrology interface.

    Chart levels:
    - Level 1: Date only (Sun sign + approximate Moon)
    - Level 2: Date + time (precise Moon, all planets, no houses)
    - Level 3: Date + location (not commonly used)
    - Level 4: Date + time + location (full chart with houses)
    """
    chart_level: int
    planets: Dict[str, Optional[Dict]]
    angles: Dict[str, Optional[Dict]]
    houses: Optional[Dict] = None


def datetime_to_julian(dt: datetime) -> float:
    """Convert datetime to Julian Day Number for Swiss Ephemeris."""
    if not SWISSEPH_AVAILABLE:
        raise RuntimeError("Swiss Ephemeris not available")

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)

    return swe.julday(
        dt.year, dt.month, dt.day,
        dt.hour + dt.minute / 60.0 + dt.second / 3600.0
    )


def get_sign_from_longitude(longitude: float) -> Tuple[str, float]:
    """
    Convert ecliptic longitude to sign name and degree within sign.

    Args:
        longitude: Ecliptic longitude 0-360

    Returns:
        (sign_name, degree_in_sign)
    """
    # Normalize to 0-360
    norm_longitude = ((longitude % 360) + 360) % 360
    sign_index = int(norm_longitude / 30)
    degree_in_sign = norm_longitude % 30

    return ZODIAC_SIGNS[sign_index], round(degree_in_sign, 2)


def calculate_planet_position(planet_id: int, jd: float) -> PlanetPosition:
    """
    Calculate position of a single planet.

    Args:
        planet_id: Swiss Ephemeris planet constant
        jd: Julian Day Number

    Returns:
        PlanetPosition with longitude, sign, degree_in_sign, is_retrograde
    """
    if not SWISSEPH_AVAILABLE:
        raise RuntimeError("Swiss Ephemeris not available")

    # swe.calc_ut returns: (longitude, latitude, distance, speed_long, speed_lat, speed_dist)
    result, flag = swe.calc_ut(jd, planet_id, swe.FLG_SWIEPH)

    longitude = result[0]
    speed = result[3]
    is_retrograde = speed < 0

    sign, degree_in_sign = get_sign_from_longitude(longitude)

    return PlanetPosition(
        longitude=round(longitude, 4),
        sign=sign,
        degree_in_sign=degree_in_sign,
        is_retrograde=is_retrograde
    )


def calculate_houses(
    jd: float,
    latitude: float,
    longitude: float,
    house_system: str = 'P'  # Placidus
) -> Tuple[List[float], float, float]:
    """
    Calculate house cusps, Ascendant, and Midheaven.

    Args:
        jd: Julian Day Number
        latitude: Birth location latitude
        longitude: Birth location longitude
        house_system: House system ('P'=Placidus, 'K'=Koch, 'W'=Whole Sign)

    Returns:
        (house_cusps[12], ascendant, midheaven)
    """
    if not SWISSEPH_AVAILABLE:
        raise RuntimeError("Swiss Ephemeris not available")

    # swe.houses returns: (cusps[12], ascmc) where ascmc is a tuple
    # cusps[0] = Ascendant (house 1 cusp), cusps[1-11] = house 2-12 cusps
    # Note: In pyswisseph, the first element of cusps IS the ascendant
    cusps, ascmc = swe.houses(jd, latitude, longitude, house_system.encode())

    # cusps is a 12-element tuple: [Asc/H1, H2, H3, ..., H12]
    house_cusps = [round(cusps[i], 4) for i in range(12)]
    ascendant = cusps[0]  # Ascendant is house 1 cusp
    midheaven = cusps[9]  # MC is house 10 cusp

    return house_cusps, ascendant, midheaven


def get_house_for_planet(planet_longitude: float, house_cusps: List[float]) -> int:
    """
    Determine which house a planet is in based on its longitude.

    This matches native/src/lib/scanOutput.ts calculateHouse function.
    """
    norm_planet = ((planet_longitude % 360) + 360) % 360

    for i in range(12):
        current_cusp = ((house_cusps[i] % 360) + 360) % 360
        next_cusp = ((house_cusps[(i + 1) % 12] % 360) + 360) % 360

        if current_cusp < next_cusp:
            if norm_planet >= current_cusp and norm_planet < next_cusp:
                return i + 1
        else:
            # Handle wrap-around at 0/360 degrees
            if norm_planet >= current_cusp or norm_planet < next_cusp:
                return i + 1

    return 1  # Fallback to 1st house


def calculate_full_chart(
    birth_date: str,
    birth_time: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> ChartData:
    """
    Calculate complete birth chart.

    Args:
        birth_date: Date in YYYY-MM-DD format
        birth_time: Time in HH:MM format (optional)
        latitude: Birth location latitude (optional)
        longitude: Birth location longitude (optional)

    Returns:
        ChartData with planets, angles, houses based on available data
    """
    # Determine chart level
    has_time = birth_time is not None
    has_location = latitude is not None and longitude is not None

    if has_time and has_location:
        chart_level = 4
    elif has_time:
        chart_level = 2
    elif has_location:
        chart_level = 3
    else:
        chart_level = 1

    # Parse date
    year, month, day = map(int, birth_date.split('-'))

    # Combine date and time
    if has_time:
        hour, minute = map(int, birth_time.split(':'))
        dt = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
    else:
        # Use noon as default for date-only charts
        dt = datetime(year, month, day, 12, 0, tzinfo=timezone.utc)

    # Check if Swiss Ephemeris is available
    if not SWISSEPH_AVAILABLE:
        # Return fallback data without actual calculations
        return _fallback_chart(birth_date, birth_time, chart_level)

    jd = datetime_to_julian(dt)

    # Calculate planet positions
    planets: Dict[str, Optional[Dict]] = {}
    for planet_name, planet_id in PLANETS.items():
        try:
            pos = calculate_planet_position(planet_id, jd)
            planets[planet_name] = asdict(pos)
            # Remove house for now (added later if level 4)
            planets[planet_name]['house'] = None
        except Exception as e:
            print(f"Error calculating {planet_name}: {e}")
            planets[planet_name] = None

    # Calculate houses and angles if we have full data
    angles: Dict[str, Optional[Dict]] = {'ascendant': None, 'midheaven': None}
    houses = None

    if chart_level == 4 and has_location:
        try:
            house_cusps, asc, mc = calculate_houses(jd, latitude, longitude)

            asc_sign, asc_degree = get_sign_from_longitude(asc)
            mc_sign, mc_degree = get_sign_from_longitude(mc)

            angles = {
                'ascendant': {
                    'longitude': round(asc, 4),
                    'sign': asc_sign,
                    'degree_in_sign': asc_degree,
                },
                'midheaven': {
                    'longitude': round(mc, 4),
                    'sign': mc_sign,
                    'degree_in_sign': mc_degree,
                },
            }

            houses = {
                'system': 'placidus',
                'cusps': house_cusps,
            }

            # Assign houses to planets
            for planet_name in planets:
                if planets[planet_name]:
                    planets[planet_name]['house'] = get_house_for_planet(
                        planets[planet_name]['longitude'],
                        house_cusps
                    )
        except Exception as e:
            print(f"Error calculating houses: {e}")
            chart_level = 2  # Downgrade if house calculation fails

    return ChartData(
        chart_level=chart_level,
        planets=planets,
        angles=angles,
        houses=houses,
    )


def _fallback_chart(birth_date: str, birth_time: Optional[str], chart_level: int) -> ChartData:
    """
    Create fallback chart data when Swiss Ephemeris is not available.
    Uses simple sun sign calculation based on date ranges.
    """
    year, month, day = map(int, birth_date.split('-'))
    sun_sign = _simple_sun_sign(month, day)

    return ChartData(
        chart_level=chart_level,
        planets={
            'sun': {
                'longitude': 0.0,
                'sign': sun_sign,
                'degree_in_sign': 15.0,
                'house': None,
                'is_retrograde': False,
            },
            'moon': None,
            'mercury': None,
            'venus': None,
            'mars': None,
            'jupiter': None,
            'saturn': None,
        },
        angles={'ascendant': None, 'midheaven': None},
        houses=None,
    )


def _simple_sun_sign(month: int, day: int) -> str:
    """Simple sun sign calculation based on date ranges."""
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return 'Aries'
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return 'Taurus'
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return 'Gemini'
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return 'Cancer'
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return 'Leo'
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return 'Virgo'
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return 'Libra'
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return 'Scorpio'
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return 'Sagittarius'
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return 'Capricorn'
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return 'Aquarius'
    else:
        return 'Pisces'


def get_sun_sign(birth_date: str) -> str:
    """
    Quick sun sign calculation.

    Args:
        birth_date: Date in YYYY-MM-DD format

    Returns:
        Zodiac sign name
    """
    if not SWISSEPH_AVAILABLE:
        year, month, day = map(int, birth_date.split('-'))
        return _simple_sun_sign(month, day)

    year, month, day = map(int, birth_date.split('-'))
    dt = datetime(year, month, day, 12, 0, tzinfo=timezone.utc)
    jd = datetime_to_julian(dt)

    result, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH)
    sign, _ = get_sign_from_longitude(result[0])
    return sign


def get_moon_sign(birth_date: str, birth_time: Optional[str] = None) -> Optional[str]:
    """
    Moon sign calculation (more accurate with time).

    Args:
        birth_date: Date in YYYY-MM-DD format
        birth_time: Time in HH:MM format (optional)

    Returns:
        Zodiac sign name or None if calculation not possible
    """
    if not SWISSEPH_AVAILABLE:
        return None

    year, month, day = map(int, birth_date.split('-'))

    if birth_time:
        hour, minute = map(int, birth_time.split(':'))
        dt = datetime(year, month, day, hour, minute, tzinfo=timezone.utc)
    else:
        dt = datetime(year, month, day, 12, 0, tzinfo=timezone.utc)

    jd = datetime_to_julian(dt)
    result, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH)
    sign, _ = get_sign_from_longitude(result[0])
    return sign


def serialize_chart(chart: ChartData) -> Dict:
    """
    Convert ChartData to JSON-serializable dict for API response.

    This matches the native/src/lib/scanOutput.ts Astrology interface.
    """
    return {
        'zodiac_system': 'tropical',
        'ephemeris': 'pyswisseph',
        'angles': chart.angles,
        'houses': chart.houses,
        'planets': chart.planets,
    }


def close_ephemeris():
    """Clean up Swiss Ephemeris resources."""
    if SWISSEPH_AVAILABLE:
        swe.close()


# Initialize on module load
_initialized = init_ephemeris()
