# BACKEND REBUILD: Django API for Numeros

## CRITICAL CONTEXT

You are rebuilding `/apps/backend` (Django REST API) to support:
- `/apps/native` - React Native mobile app (primary)
- `/apps/web` - Next.js web app (future)

The backend must match the user flows defined in the BPMN specification.

---

## PHASE 1: FLOW ANALYSIS (Do FIRST)

Before writing any code:

```
1. Read the BPMN flow file completely
2. Extract ALL user actions that require backend support
3. Map each action to an API endpoint
4. Identify ALL data entities needed
5. Output an ENDPOINT MATRIX before proceeding
```

### Endpoint Matrix Template:

```markdown
| Flow Step | User Action | HTTP Method | Endpoint | Request Body | Response |
|-----------|-------------|-------------|----------|--------------|----------|
| Onboarding | Enter name | - | - | - | (client-side only) |
| Onboarding | Enter DOB | POST | /api/calculate | {name, dob, birth_time?, birth_place?} | {numerology} |
| Auth | Create account | POST | /api/auth/register | {email, password, numerology_data} | {token, user} |
| Scan | Find matches | POST | /api/scan | {filters?} | {matches[]} |
| ... | ... | ... | ... | ... | ... |
```

---

## PHASE 2: DATA MODELS

### Core Entities (based on CLAUDE.md)

```python
# users/models.py

class User(AbstractUser):
    """Extended user with numerology profile"""
    
    # Basic Info
    display_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    birth_time = models.TimeField(null=True, blank=True)  # Optional for chart levels
    birth_place = models.CharField(max_length=200, null=True, blank=True)
    birth_latitude = models.FloatField(null=True, blank=True)
    birth_longitude = models.FloatField(null=True, blank=True)
    
    # Numerology Numbers (calculated, stored for query performance)
    life_path = models.IntegerField()
    soul_urge = models.IntegerField()
    expression = models.IntegerField()
    personality = models.IntegerField()
    
    # Astrology (if birth_time provided)
    sun_sign = models.CharField(max_length=20, null=True, blank=True)
    moon_sign = models.CharField(max_length=20, null=True, blank=True)
    rising_sign = models.CharField(max_length=20, null=True, blank=True)
    chart_level = models.IntegerField(default=1)  # 1-4 based on data completeness
    
    # Profile
    bio = models.TextField(max_length=500, blank=True)
    photos = models.JSONField(default=list)  # URLs
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Resonance(models.Model):
    """User interactions (likes/passes)"""
    
    class Action(models.TextChoices):
        RESONATE = 'resonate', 'Resonate'  # Like
        DECLINE = 'decline', 'Decline'      # Pass
    
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_resonances')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_resonances')
    action = models.CharField(max_length=10, choices=Action.choices)
    compatibility_score = models.IntegerField(null=True)  # Stored at time of action
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('from_user', 'to_user')


class Match(models.Model):
    """Mutual resonances"""
    
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_user2')
    compatibility_data = models.JSONField()  # Full breakdown
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user1', 'user2')


class Message(models.Model):
    """Chat messages between matched users"""
    
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class DailyForecast(models.Model):
    """Cached daily numerology forecasts"""
    
    date = models.DateField()
    universal_day_number = models.IntegerField()  # 1-9
    forecast_data = models.JSONField()  # Descriptions, colors, etc.
    
    class Meta:
        unique_together = ('date',)
```

---

## PHASE 3: API ENDPOINTS

### Authentication

```python
# POST /api/auth/register
{
    "email": "user@example.com",
    "password": "securepassword",
    "display_name": "Sarah",
    "birth_date": "1990-05-15",
    "birth_time": "14:30",  # optional
    "birth_place": "New York, USA"  # optional
}
# Response: { "token": "...", "user": {...}, "numerology": {...} }

# POST /api/auth/login
{ "email": "...", "password": "..." }
# Response: { "token": "...", "user": {...} }

# POST /api/auth/logout
# (Authenticated) Deletes token

# POST /api/auth/refresh
# Refresh token if using JWT
```

### Profile

```python
# GET /api/profile/me
# Returns full user profile with numerology + astrology

# PATCH /api/profile/me
{ "bio": "...", "photos": [...] }  # Partial updates

# POST /api/profile/calculate
# Anonymous - calculate without account
{
    "name": "Sarah",
    "birth_date": "1990-05-15",
    "birth_time": "14:30",
    "birth_place": "New York, USA"
}
# Response: { "numerology": {...}, "astrology": {...}, "chart_level": 3 }

# POST /api/profile/photos/upload
# Multipart form data for photo upload
```

### Scanning & Matching

```python
# POST /api/scan
# Get potential matches
{
    "limit": 10,
    "filters": {
        "age_min": 25,
        "age_max": 35,
        "distance_km": 50
    }
}
# Response: { "profiles": [...], "next_cursor": "..." }

# POST /api/scan/evaluate
# Get detailed compatibility with specific user
{ "target_user_id": 123 }
# Response: { "compatibility": {...}, "breakdown": {...} }

# POST /api/resonance
# Like or pass
{ "target_user_id": 123, "action": "resonate" }
# Response: { "is_match": true/false, "match": {...} if matched }

# GET /api/matches
# List all matches
# Response: { "matches": [...] }

# GET /api/matches/{match_id}
# Get specific match with messages
```

### Messaging

```python
# GET /api/matches/{match_id}/messages
# Paginated messages
# Query params: ?before=timestamp&limit=50

# POST /api/matches/{match_id}/messages
{ "content": "Hey! Our numbers align perfectly 💫" }

# WebSocket: /ws/chat/{match_id}/
# Real-time messaging
```

### Daily Forecast

```python
# GET /api/forecast/today
# Returns today's universal forecast + personalized if authenticated

# GET /api/forecast/{date}
# Historical forecast (YYYY-MM-DD)
```

---

## PHASE 4: NUMEROLOGY ENGINE

### Core Calculations (Pure Python, No ML)

```python
# numerology/engine.py

def reduce_to_single(n: int) -> int:
    """Reduce any number to 1-9 (or master 11, 22, 33)"""
    while n > 9 and n not in (11, 22, 33):
        n = sum(int(d) for d in str(n))
    return n

def calculate_life_path(birth_date: date) -> int:
    """Life Path from birth date"""
    total = birth_date.day + birth_date.month + birth_date.year
    return reduce_to_single(total)

def calculate_expression(full_name: str) -> int:
    """Expression number from full name"""
    LETTER_VALUES = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    total = sum(LETTER_VALUES.get(c.upper(), 0) for c in full_name)
    return reduce_to_single(total)

def calculate_soul_urge(full_name: str) -> int:
    """Soul Urge from vowels in name"""
    VOWELS = 'AEIOU'
    total = sum(LETTER_VALUES.get(c.upper(), 0) for c in full_name if c.upper() in VOWELS)
    return reduce_to_single(total)

def calculate_personality(full_name: str) -> int:
    """Personality from consonants in name"""
    VOWELS = 'AEIOU'
    total = sum(LETTER_VALUES.get(c.upper(), 0) for c in full_name if c.upper() not in VOWELS and c.isalpha())
    return reduce_to_single(total)

def calculate_compatibility(user1, user2) -> dict:
    """Full compatibility breakdown"""
    return {
        'overall_score': 85,
        'life_path_harmony': calculate_pair_harmony(user1.life_path, user2.life_path),
        'soul_connection': calculate_pair_harmony(user1.soul_urge, user2.soul_urge),
        'expression_sync': calculate_pair_harmony(user1.expression, user2.expression),
        'personality_match': calculate_pair_harmony(user1.personality, user2.personality),
        'challenges': [...],
        'strengths': [...],
    }
```

---

## PHASE 4B: ASTROLOGY ENGINE (Swiss Ephemeris)

### Installation

```bash
pip install pyswisseph
# OR
pip install swisseph

# Download ephemeris files (required for accuracy)
# Place in /apps/backend/ephe/ or set EPHE_PATH env var
# Download from: https://www.astro.com/ftp/swisseph/ephe/
# Required files: sepl_18.se1, semo_18.se1, seas_18.se1 (minimum)
```

### Core Astrology Calculations

```python
# astrology/engine.py

import swisseph as swe
from datetime import datetime, timezone
from typing import Optional
from dataclasses import dataclass

# Initialize ephemeris path
swe.set_ephe_path('/apps/backend/ephe')  # Or use env var

# Planet constants
PLANETS = {
    'sun': swe.SUN,
    'moon': swe.MOON,
    'mercury': swe.MERCURY,
    'venus': swe.VENUS,
    'mars': swe.MARS,
    'jupiter': swe.JUPITER,
    'saturn': swe.SATURN,
    'uranus': swe.URANUS,
    'neptune': swe.NEPTUNE,
    'pluto': swe.PLUTO,
    'north_node': swe.TRUE_NODE,
    'chiron': swe.CHIRON,
}

ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

@dataclass
class PlanetPosition:
    planet: str
    longitude: float  # 0-360 degrees
    sign: str
    degree: int       # 0-29 within sign
    minute: int
    house: Optional[int] = None
    is_retrograde: bool = False


@dataclass
class ChartData:
    planets: dict[str, PlanetPosition]
    houses: list[float]  # 12 house cusps
    ascendant: float
    midheaven: float
    chart_level: int  # 1-4 based on data completeness


def datetime_to_julian(dt: datetime) -> float:
    """Convert datetime to Julian Day Number for Swiss Ephemeris"""
    # Ensure UTC
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    
    return swe.julday(
        dt.year, dt.month, dt.day,
        dt.hour + dt.minute / 60.0 + dt.second / 3600.0
    )


def get_sign_from_longitude(longitude: float) -> tuple[str, int, int]:
    """Convert ecliptic longitude to sign, degree, minute"""
    sign_num = int(longitude / 30)
    degree_in_sign = longitude % 30
    degree = int(degree_in_sign)
    minute = int((degree_in_sign - degree) * 60)
    return ZODIAC_SIGNS[sign_num], degree, minute


def calculate_planet_position(planet_id: int, jd: float) -> PlanetPosition:
    """Calculate position of a single planet"""
    # swe.calc_ut returns: (longitude, latitude, distance, speed_long, speed_lat, speed_dist)
    result, flag = swe.calc_ut(jd, planet_id, swe.FLG_SWIEPH)
    
    longitude = result[0]
    speed = result[3]
    is_retrograde = speed < 0
    
    sign, degree, minute = get_sign_from_longitude(longitude)
    
    planet_name = [k for k, v in PLANETS.items() if v == planet_id][0]
    
    return PlanetPosition(
        planet=planet_name,
        longitude=longitude,
        sign=sign,
        degree=degree,
        minute=minute,
        is_retrograde=is_retrograde
    )


def calculate_houses(
    jd: float,
    latitude: float,
    longitude: float,
    house_system: str = 'P'  # Placidus (default), 'K'=Koch, 'W'=Whole Sign, etc.
) -> tuple[list[float], float, float]:
    """
    Calculate house cusps, Ascendant, and Midheaven
    
    Returns: (house_cusps[12], ascendant, midheaven)
    """
    # swe.houses returns: (cusps[13], ascmc[10])
    # cusps[1-12] = house cusps, cusps[0] unused
    # ascmc[0] = Ascendant, ascmc[1] = MC
    cusps, ascmc = swe.houses(jd, latitude, longitude, house_system.encode())
    
    house_cusps = list(cusps[1:13])  # Houses 1-12
    ascendant = ascmc[0]
    midheaven = ascmc[1]
    
    return house_cusps, ascendant, midheaven


def get_house_for_planet(longitude: float, house_cusps: list[float]) -> int:
    """Determine which house a planet is in based on its longitude"""
    for i in range(12):
        cusp_start = house_cusps[i]
        cusp_end = house_cusps[(i + 1) % 12]
        
        # Handle wrap-around at 0°
        if cusp_start > cusp_end:
            if longitude >= cusp_start or longitude < cusp_end:
                return i + 1
        else:
            if cusp_start <= longitude < cusp_end:
                return i + 1
    
    return 1  # Fallback


def calculate_full_chart(
    birth_date: datetime,
    birth_time: Optional[datetime] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> ChartData:
    """
    Calculate complete birth chart
    
    Chart levels:
    - Level 1: Date only (Sun sign + approximate Moon)
    - Level 2: Date + location (more accurate Moon)
    - Level 3: Date + time (all planets, no houses)
    - Level 4: Date + time + location (full chart with houses)
    """
    # Determine chart level
    has_time = birth_time is not None
    has_location = latitude is not None and longitude is not None
    
    if has_time and has_location:
        chart_level = 4
    elif has_time:
        chart_level = 3
    elif has_location:
        chart_level = 2
    else:
        chart_level = 1
    
    # Combine date and time
    if has_time:
        dt = datetime.combine(birth_date.date(), birth_time.time())
    else:
        # Use noon as default for date-only charts
        dt = datetime.combine(birth_date.date(), datetime.min.time().replace(hour=12))
    
    jd = datetime_to_julian(dt)
    
    # Calculate planet positions
    planets = {}
    for planet_name, planet_id in PLANETS.items():
        try:
            planets[planet_name] = calculate_planet_position(planet_id, jd)
        except Exception as e:
            print(f"Error calculating {planet_name}: {e}")
            continue
    
    # Calculate houses if we have time and location
    houses = []
    ascendant = 0.0
    midheaven = 0.0
    
    if chart_level == 4:
        houses, ascendant, midheaven = calculate_houses(jd, latitude, longitude)
        
        # Assign houses to planets
        for planet in planets.values():
            planet.house = get_house_for_planet(planet.longitude, houses)
    
    return ChartData(
        planets=planets,
        houses=houses,
        ascendant=ascendant,
        midheaven=midheaven,
        chart_level=chart_level
    )


def get_sun_sign(birth_date: datetime) -> str:
    """Quick sun sign calculation (no time needed)"""
    jd = datetime_to_julian(birth_date.replace(hour=12))
    result, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH)
    sign, _, _ = get_sign_from_longitude(result[0])
    return sign


def get_moon_sign(birth_date: datetime, birth_time: Optional[datetime] = None) -> str:
    """Moon sign calculation (more accurate with time)"""
    if birth_time:
        dt = datetime.combine(birth_date.date(), birth_time.time())
    else:
        dt = birth_date.replace(hour=12)
    
    jd = datetime_to_julian(dt)
    result, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH)
    sign, _, _ = get_sign_from_longitude(result[0])
    return sign


# Clean up when done (call at app shutdown)
def close_ephemeris():
    swe.close()
```

### Chart Serialization for API

```python
# astrology/serializers.py

def serialize_chart(chart: ChartData) -> dict:
    """Convert ChartData to JSON-serializable dict for API response"""
    
    planets_data = {}
    for name, pos in chart.planets.items():
        planets_data[name] = {
            'sign': pos.sign,
            'degree': pos.degree,
            'minute': pos.minute,
            'longitude': round(pos.longitude, 4),
            'house': pos.house,
            'is_retrograde': pos.is_retrograde,
        }
    
    result = {
        'chart_level': chart.chart_level,
        'planets': planets_data,
    }
    
    # Only include houses/angles for level 4 charts
    if chart.chart_level == 4:
        asc_sign, asc_deg, asc_min = get_sign_from_longitude(chart.ascendant)
        mc_sign, mc_deg, mc_min = get_sign_from_longitude(chart.midheaven)
        
        result['angles'] = {
            'ascendant': {
                'sign': asc_sign,
                'degree': asc_deg,
                'minute': asc_min,
                'longitude': round(chart.ascendant, 4),
            },
            'midheaven': {
                'sign': mc_sign,
                'degree': mc_deg,
                'minute': mc_min,
                'longitude': round(chart.midheaven, 4),
            },
        }
        result['houses'] = [round(h, 4) for h in chart.houses]
    
    return result
```

### Astrological Compatibility

```python
# astrology/compatibility.py

def calculate_aspect(long1: float, long2: float) -> tuple[str, float]:
    """
    Calculate aspect between two planets
    Returns: (aspect_name, orb)
    """
    ASPECTS = {
        'conjunction': (0, 8),    # 0° ±8°
        'sextile': (60, 6),      # 60° ±6°
        'square': (90, 8),       # 90° ±8°
        'trine': (120, 8),       # 120° ±8°
        'opposition': (180, 8),  # 180° ±8°
    }
    
    diff = abs(long1 - long2)
    if diff > 180:
        diff = 360 - diff
    
    for aspect_name, (angle, max_orb) in ASPECTS.items():
        orb = abs(diff - angle)
        if orb <= max_orb:
            return aspect_name, orb
    
    return None, None


def calculate_synastry(chart1: ChartData, chart2: ChartData) -> dict:
    """Calculate compatibility aspects between two charts"""
    
    aspects = []
    key_planets = ['sun', 'moon', 'venus', 'mars', 'mercury']
    
    for p1 in key_planets:
        if p1 not in chart1.planets:
            continue
        for p2 in key_planets:
            if p2 not in chart2.planets:
                continue
            
            aspect, orb = calculate_aspect(
                chart1.planets[p1].longitude,
                chart2.planets[p2].longitude
            )
            
            if aspect:
                aspects.append({
                    'planet1': p1,
                    'planet2': p2,
                    'aspect': aspect,
                    'orb': round(orb, 2),
                })
    
    # Score calculation
    harmony_aspects = ['trine', 'sextile', 'conjunction']
    tension_aspects = ['square', 'opposition']
    
    harmony_score = sum(1 for a in aspects if a['aspect'] in harmony_aspects)
    tension_score = sum(1 for a in aspects if a['aspect'] in tension_aspects)
    
    return {
        'aspects': aspects,
        'harmony_score': harmony_score,
        'tension_score': tension_score,
        'overall_compatibility': max(0, min(100, 50 + (harmony_score * 10) - (tension_score * 5))),
    }
```

### Requirements Update

```
# requirements.txt additions

pyswisseph>=2.10.0  # Swiss Ephemeris Python bindings
# OR
swisseph>=2.10.0    # Alternative package name

pytz>=2024.1        # Timezone handling
timezonefinder>=6.0 # Get timezone from coordinates
```

### Ephemeris Files Setup

```bash
# Download required ephemeris files
mkdir -p /apps/backend/ephe
cd /apps/backend/ephe

# Download from astro.com (free for non-commercial use)
wget https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1   # Planets 1800-2400
wget https://www.astro.com/ftp/swisseph/ephe/semo_18.se1   # Moon 1800-2400
wget https://www.astro.com/ftp/swisseph/ephe/seas_18.se1   # Asteroids

# For higher precision (optional):
wget https://www.astro.com/ftp/swisseph/ephe/seplm18.se1   # Outer planets
```

### Integration with User Model

```python
# users/services.py

from astrology.engine import calculate_full_chart, get_sun_sign
from numerology.engine import calculate_life_path, calculate_expression, calculate_soul_urge, calculate_personality

def calculate_user_profile(
    name: str,
    birth_date: date,
    birth_time: Optional[time] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> dict:
    """Calculate complete numerology + astrology profile"""
    
    # Numerology (always available)
    numerology = {
        'life_path': calculate_life_path(birth_date),
        'expression': calculate_expression(name),
        'soul_urge': calculate_soul_urge(name),
        'personality': calculate_personality(name),
    }
    
    # Astrology
    birth_datetime = datetime.combine(birth_date, birth_time or time(12, 0))
    
    chart = calculate_full_chart(
        birth_date=birth_datetime,
        birth_time=birth_datetime if birth_time else None,
        latitude=latitude,
        longitude=longitude,
    )
    
    astrology = serialize_chart(chart)
    
    return {
        'numerology': numerology,
        'astrology': astrology,
        'chart_level': chart.chart_level,
    }
```

---

## PHASE 5: PROJECT STRUCTURE

```
/apps/backend/
├── manage.py
├── requirements.txt
├── .env.example
├── ephe/                            # Swiss Ephemeris data files
│   ├── sepl_18.se1                  # Planets 1800-2400
│   ├── semo_18.se1                  # Moon 1800-2400
│   └── seas_18.se1                  # Asteroids
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py              # Profile calculation orchestration
│   │   ├── urls.py
│   │   └── tests.py
│   ├── matching/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── messaging/
│   │   ├── models.py
│   │   ├── consumers.py             # WebSocket
│   │   └── routing.py
│   ├── numerology/
│   │   ├── engine.py                # Core calculations
│   │   ├── meanings.py              # Number meanings/descriptions
│   │   ├── compatibility.py         # Number pair harmony
│   │   └── tests.py
│   └── astrology/
│       ├── engine.py                # Swiss Ephemeris calculations
│       ├── serializers.py           # Chart to JSON conversion
│       ├── compatibility.py         # Synastry aspects
│       ├── meanings.py              # Planet/sign interpretations
│       └── tests.py
├── core/
│   ├── permissions.py
│   ├── pagination.py
│   └── exceptions.py
└── tests/
```

---

## PHASE 6: IMPLEMENTATION ORDER

### Sprint 1: Foundation
1. [ ] Project setup with settings split
2. [ ] User model with numerology + astrology fields
3. [ ] Download and configure Swiss Ephemeris files
4. [ ] Numerology engine with all 4 calculations + tests
5. [ ] Astrology engine with planet positions + tests
6. [ ] Registration endpoint with auto-calculation
7. [ ] Login/Logout endpoints
8. [ ] Profile GET/PATCH endpoints
9. [ ] Anonymous calculate endpoint

### Sprint 2: Matching Core
1. [ ] Resonance model and endpoint
2. [ ] Match detection logic
3. [ ] Scan endpoint with basic filtering
4. [ ] Numerology compatibility calculation
5. [ ] Astrological synastry calculation
6. [ ] Combined compatibility scoring
7. [ ] Match list endpoint

### Sprint 3: Messaging
1. [ ] Message model
2. [ ] REST endpoints for messages
3. [ ] WebSocket consumer setup
4. [ ] Real-time message delivery

### Sprint 4: Polish
1. [ ] Photo upload with S3/Cloudinary
2. [ ] Push notification hooks
3. [ ] Daily forecast endpoint (numerology + astrology transits)
4. [ ] Rate limiting
5. [ ] Admin dashboard
6. [ ] Caching for expensive calculations

---

## MANDATORY BEHAVIORS

1. **READ the BPMN flow** before implementing any endpoint - ensure every user action is covered

2. **Write tests first** for calculation functions - numerology must be deterministic

3. **Document every endpoint** with request/response examples

4. **Use serializers** for all data validation - never trust client input

5. **Keep calculations pure** - numerology engine should have no Django dependencies (testable in isolation)

6. **Version the API** from day one - `/api/v1/...`

---

## QUICK START COMMAND

```
Read the BPMN flow file first. Then:

1. Create the ENDPOINT MATRIX mapping every flow step to API endpoints
2. Set up the Django project structure as specified in PHASE 5
3. Download Swiss Ephemeris files to /apps/backend/ephe/
4. Implement User model with all numerology + astrology fields
5. Create numerology/engine.py with pure calculation functions
6. Create astrology/engine.py with Swiss Ephemeris integration
7. Write tests for BOTH calculation engines - verify deterministic outputs
8. Implement auth endpoints (register, login, logout)
9. Test the full registration flow with chart generation end-to-end

Show your work for each step. Do not skip to the next step without completing the current one.
```

---

## PHASE 7: DEPLOYMENT CONFIGURATION

### Domain & Server

```
Domain: numeros.app
Server IP: 164.92.233.197
API Base URL: https://api.numeros.app
WebSocket URL: wss://api.numeros.app/ws/
```

### DNS Records (Configure at your registrar)

```
Type    Name    Value               TTL
A       @       164.92.233.197      300
A       api     164.92.233.197      300
A       www     164.92.233.197      300
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/numeros

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name numeros.app www.numeros.app api.numeros.app;
    return 301 https://$server_name$request_uri;
}

# API server
server {
    listen 443 ssl http2;
    server_name api.numeros.app;

    ssl_certificate /etc/letsencrypt/live/api.numeros.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.numeros.app/privkey.pem;

    client_max_body_size 10M;  # For photo uploads

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    # Static files
    location /static/ {
        alias /var/www/numeros/static/;
    }

    # Media files (uploaded photos)
    location /media/ {
        alias /var/www/numeros/media/;
    }
}

# Main website (for future Next.js web app)
server {
    listen 443 ssl http2;
    server_name numeros.app www.numeros.app;

    ssl_certificate /etc/letsencrypt/live/numeros.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/numeros.app/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;  # Next.js
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Django Production Settings

```python
# config/settings/production.py

import os
from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    'numeros.app',
    'www.numeros.app',
    'api.numeros.app',
    '164.92.233.197',
]

# CORS for React Native app
CORS_ALLOWED_ORIGINS = [
    'https://numeros.app',
    'https://www.numeros.app',
]
# Allow mobile app requests (no origin header)
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

# CSRF
CSRF_TRUSTED_ORIGINS = [
    'https://numeros.app',
    'https://api.numeros.app',
]

# Security
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'numeros'),
        'USER': os.environ.get('DB_USER', 'numeros'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Static/Media
STATIC_ROOT = '/var/www/numeros/static/'
MEDIA_ROOT = '/var/www/numeros/media/'

# Swiss Ephemeris
EPHE_PATH = '/var/www/numeros/ephe/'

# Email (for password reset, etc.)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')
DEFAULT_FROM_EMAIL = 'Numeros <noreply@numeros.app>'
```

### Environment Variables (.env)

```bash
# /var/www/numeros/.env

SECRET_KEY=your-production-secret-key-here
DEBUG=False
DJANGO_SETTINGS_MODULE=config.settings.production

# Database
DB_NAME=numeros
DB_USER=numeros
DB_PASSWORD=secure-password-here
DB_HOST=localhost
DB_PORT=5432

# Email (use your provider)
EMAIL_HOST=smtp.mailgun.org
EMAIL_USER=postmaster@numeros.app
EMAIL_PASSWORD=email-password-here

# File storage (optional - for S3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=numeros-media
AWS_S3_REGION_NAME=eu-central-1
```

### Systemd Service

```ini
# /etc/systemd/system/numeros.service

[Unit]
Description=Numeros Django API
After=network.target postgresql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/numeros/backend
Environment="PATH=/var/www/numeros/venv/bin"
EnvironmentFile=/var/www/numeros/.env
ExecStart=/var/www/numeros/venv/bin/gunicorn \
    --workers 4 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    config.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh - Run on server after pushing code

set -e

cd /var/www/numeros/backend
source ../venv/bin/activate

# Pull latest
git pull origin main

# Install dependencies
pip install -r requirements.txt

# Migrations
python manage.py migrate --no-input

# Static files
python manage.py collectstatic --no-input

# Restart service
sudo systemctl restart numeros

echo "✅ Deployed successfully"
```

### Server Setup Checklist

```markdown
## Initial Server Setup (164.92.233.197)

### 1. System
- [ ] Update packages: `apt update && apt upgrade -y`
- [ ] Install essentials: `apt install -y nginx postgresql python3-venv certbot python3-certbot-nginx`
- [ ] Configure firewall: `ufw allow 22,80,443/tcp && ufw enable`

### 2. Database
- [ ] Create PostgreSQL user and database
- [ ] `sudo -u postgres createuser numeros`
- [ ] `sudo -u postgres createdb numeros -O numeros`

### 3. SSL Certificates
- [ ] `certbot --nginx -d numeros.app -d www.numeros.app -d api.numeros.app`

### 4. Application
- [ ] Create directories: `mkdir -p /var/www/numeros/{backend,static,media,ephe}`
- [ ] Clone repo: `git clone <repo> /var/www/numeros/backend`
- [ ] Create venv: `python3 -m venv /var/www/numeros/venv`
- [ ] Install deps: `pip install -r requirements.txt`
- [ ] Download ephemeris files to /var/www/numeros/ephe/
- [ ] Set permissions: `chown -R www-data:www-data /var/www/numeros`

### 5. Services
- [ ] Enable Nginx: `systemctl enable nginx`
- [ ] Enable Numeros: `systemctl enable numeros`
- [ ] Start both: `systemctl start nginx numeros`
```

---

## SYNC WITH NATIVE APP

The native app expects these response shapes (from CLAUDE.md):

```typescript
// After registration/login
interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    display_name: string;
    // ...
  };
  numerology: {
    life_path: number;
    soul_urge: number;
    expression: number;
    personality: number;
  };
  astrology: {
    chart_level: number;  // 1-4
    planets: {
      sun: PlanetPosition;
      moon: PlanetPosition;
      mercury: PlanetPosition;
      venus: PlanetPosition;
      mars: PlanetPosition;
      jupiter: PlanetPosition;
      saturn: PlanetPosition;
      // ...
    };
    angles?: {  // Only for chart_level 4
      ascendant: AnglePosition;
      midheaven: AnglePosition;
    };
    houses?: number[];  // Only for chart_level 4
  };
}

interface PlanetPosition {
  sign: string;
  degree: number;
  minute: number;
  longitude: number;
  house: number | null;
  is_retrograde: boolean;
}

interface AnglePosition {
  sign: string;
  degree: number;
  minute: number;
  longitude: number;
}

// Scan response
interface ScanResponse {
  profiles: Array<{
    id: number;
    display_name: string;
    age: number;
    photos: string[];
    compatibility: {
      overall_score: number;
      numerology_score: number;
      astrology_score: number;
      highlights: string[];  // "Your Moons are in harmony"
    };
    numerology: {...};
    astrology: {...};
  }>;
  next_cursor?: string;
}

// Compatibility detail
interface CompatibilityResponse {
  overall_score: number;
  numerology: {
    life_path_harmony: number;
    soul_connection: number;
    expression_sync: number;
    personality_match: number;
    challenges: string[];
    strengths: string[];
  };
  astrology: {
    aspects: Array<{
      planet1: string;
      planet2: string;
      aspect: string;  // "trine", "square", etc.
      orb: number;
    }>;
    harmony_score: number;
    tension_score: number;
    interpretation: string;
  };
}
```

**Ensure backend responses match these shapes exactly.**

---

## NATIVE APP API CLIENT

Add this to the React Native app for backend connectivity:

```typescript
// /apps/native/src/lib/api.ts

const API_BASE = __DEV__ 
  ? 'http://localhost:8000/api/v1'
  : 'https://api.numeros.app/api/v1';

const WS_BASE = __DEV__
  ? 'ws://localhost:8000/ws'
  : 'wss://api.numeros.app/ws';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error);
    }

    return response.json();
  }

  // Auth
  async register(data: RegisterInput) {
    return this.request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout/', { method: 'POST' });
  }

  // Profile
  async getProfile() {
    return this.request<UserProfile>('/profile/me/');
  }

  async calculateAnonymous(data: CalculateInput) {
    return this.request<CalculateResponse>('/profile/calculate/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Matching
  async scan(filters?: ScanFilters) {
    return this.request<ScanResponse>('/scan/', {
      method: 'POST',
      body: JSON.stringify(filters || {}),
    });
  }

  async resonate(targetUserId: number, action: 'resonate' | 'decline') {
    return this.request<ResonateResponse>('/resonance/', {
      method: 'POST',
      body: JSON.stringify({ target_user_id: targetUserId, action }),
    });
  }

  async getMatches() {
    return this.request<MatchesResponse>('/matches/');
  }

  // Daily forecast
  async getTodayForecast() {
    return this.request<ForecastResponse>('/forecast/today/');
  }
}

export const api = new ApiClient();
```

```typescript
// /apps/native/src/lib/apiTypes.ts

export interface RegisterInput {
  email: string;
  password: string;
  display_name: string;
  birth_date: string;  // YYYY-MM-DD
  birth_time?: string; // HH:MM
  birth_place?: string;
  latitude?: number;
  longitude?: number;
}

export interface CalculateInput {
  name: string;
  birth_date: string;
  birth_time?: string;
  birth_place?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  numerology: NumerologyData;
  astrology: AstrologyData;
}

// ... etc
```
