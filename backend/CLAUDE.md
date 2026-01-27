# Numeros Backend - Claude Context

## Overview

Django REST API for the Numeros dating app. Uses numerology and astrology for compatibility matching.

**Stack:** Django 5.2, DRF 3.15, SimpleJWT, pyswisseph
**Database:** SQLite (dev), PostgreSQL (prod)

## Quick Reference

```bash
# Start server
.venv/bin/python manage.py runserver

# Run migrations
.venv/bin/python manage.py migrate

# Make migrations
.venv/bin/python manage.py makemigrations

# Shell
.venv/bin/python manage.py shell
```

## Project Structure

```
backend/
├── config/settings/{base,development,production}.py
├── apps/
│   ├── users/          # User, Device, auth, profile, photos
│   ├── matching/       # Resonance, Match, scan, compatibility
│   ├── messaging/      # Message, conversations
│   ├── numerology/     # Engine, compatibility, forecast
│   └── astrology/      # Engine (pyswisseph), synastry
├── core/               # Permissions, pagination
├── media/photos/       # Uploaded photos
└── ephe/               # Swiss Ephemeris data
```

## Key Files

| File | Purpose |
|------|---------|
| `apps/numerology/engine.py` | Core numerology calculations (MUST match TypeScript) |
| `apps/astrology/engine.py` | Swiss Ephemeris planet/house calculations |
| `apps/matching/services.py` | Combined compatibility (60% num + 40% astro) |
| `apps/numerology/forecast.py` | Daily forecast calculations |
| `config/urls.py` | Main URL routing |

## API Endpoints

**Auth:** `/api/v1/auth/{register,login,logout,refresh}/`
**Profile:** `/api/v1/profile/{me,calculate,photos,devices}/`
**Matching:** `/api/v1/{scan,resonance,matches,resonances}/`
**Messaging:** `/api/v1/{conversations,matches/{id}/messages}/`
**Forecast:** `/api/v1/forecast/{today,week,{date}}/`

See `API.md` for full documentation.

## Models

**User:** email (login), display_name, birth_date/time/place, numerology numbers (life_path, soul_urge, expression, personality), astrology (sun/moon/rising_sign, chart_level, chart_data), photos, gender, interested_in

**Resonance:** from_user → to_user, action (resonate/decline/maybe_later), compatibility_score, expires_at

**Match:** user1, user2, compatibility_data, overall_score, is_conversation_started, last_message_at

**Message:** match, sender, content, read_at

**Device:** user, platform (ios/android), token, notification preferences

## Compatibility Scoring

**Overall = 60% numerology + 40% astrology**

**Numerology Harmony Matrix:** Based on life_path, soul_urge, expression, personality number comparisons

**Astrology Synastry:** Planet aspects (conjunction, trine, sextile = harmony; square, opposition = tension)

**Match Types:**
- twin_flame (90-100)
- magnetic_stability (75-89)
- passionate_tension (60-74)
- gentle_growth (45-59)
- karmic_lesson (0-44)

## Chart Levels

| Level | Data | Includes |
|-------|------|----------|
| 1 | Date only | Sun, approx Moon |
| 2 | Date + time | All planets, precise Moon |
| 3 | Date + location | (Uncommon) |
| 4 | Full | Houses, Ascendant, Midheaven |

## Numerology Calculations

**CRITICAL:** Must match `/apps/native/src/lib/numerology.ts` exactly!

```python
LETTER_VALUES = {
    'a': 1, 'j': 1, 's': 1,
    'b': 2, 'k': 2, 't': 2,
    'c': 3, 'l': 3, 'u': 3,
    'd': 4, 'm': 4, 'v': 4,
    'e': 5, 'n': 5, 'w': 5,
    'f': 6, 'o': 6, 'x': 6,
    'g': 7, 'p': 7, 'y': 7,
    'h': 8, 'q': 8, 'z': 8,
    'i': 9, 'r': 9,
}
VOWELS = {'a', 'e', 'i', 'o', 'u'}
MASTER_NUMBERS = {11, 22, 33}

# Life Path: Reduce birth date (YYYY-MM-DD) to single digit
# Soul Urge: Sum of vowels in name
# Expression: Sum of all letters in name
# Personality: Sum of consonants in name
```

## Testing

```bash
# Login and get token
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "pass"}'

# Use token
curl http://localhost:8000/api/v1/profile/me/ \
  -H "Authorization: Bearer <token>"
```

## Common Issues

**"Cannot resolve keyword 'created'"**
- Cause: CursorPagination expects `created` field
- Fix: Use PageNumberPagination (already fixed in base.py)

**Swiss Ephemeris "tuple index out of range"**
- Cause: cusps array is 0-indexed (12 elements), not 1-indexed
- Fix: Use `range(12)` not `range(1, 13)`

**JWT token expired**
- Access token: 60 minutes
- Refresh token: 7 days
- Use `/api/v1/auth/refresh/` to get new access token

## Environment

Development settings auto-loaded via `DJANGO_SETTINGS_MODULE=config.settings.development`

For production:
```
DEBUG=False
SECRET_KEY=<secret>
DATABASE_URL=postgres://...
ALLOWED_HOSTS=api.numeros.app
CORS_ALLOWED_ORIGINS=https://numeros.app
```
