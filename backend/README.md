# Numeros Backend API

Django REST API for the Numeros love/compatibility matching app using numerology and astrology calculations.

## Quick Start

```bash
# Install dependencies
uv sync

# Run migrations
.venv/bin/python manage.py migrate

# Start development server
.venv/bin/python manage.py runserver
```

## API Documentation

See [API.md](./API.md) for complete endpoint documentation.

## Features

- **JWT Authentication** - Secure token-based auth with refresh tokens
- **Numerology Engine** - Life Path, Soul Urge, Expression, Personality calculations
- **Astrology Engine** - Swiss Ephemeris integration for accurate planetary positions
- **Compatibility Scoring** - Combined numerology (60%) + astrology (40%) scoring
- **Matching System** - Scan, resonance, and match creation
- **Messaging** - Real-time chat with read receipts
- **Daily Forecast** - Personalized numerology forecasts
- **Photo Management** - Upload, reorder, delete profile photos
- **Push Notifications** - Device registration for iOS/Android

## API Endpoints Overview

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register/` | POST | Register new user |
| `/api/v1/auth/login/` | POST | Login (returns JWT) |
| `/api/v1/auth/logout/` | POST | Logout (blacklist token) |
| `/api/v1/auth/refresh/` | POST | Refresh access token |

### Profile
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/profile/me/` | GET | Get current user profile |
| `/api/v1/profile/me/` | PATCH | Update profile |
| `/api/v1/profile/calculate/` | POST | Calculate without account |
| `/api/v1/profile/photos/` | POST | Upload photo |
| `/api/v1/profile/devices/` | POST | Register push device |

### Matching
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/scan/` | POST | Scan for matches |
| `/api/v1/scan/evaluate/` | POST | Detailed compatibility |
| `/api/v1/resonance/` | POST | Like/decline/maybe_later |
| `/api/v1/matches/` | GET | List matches |
| `/api/v1/resonances/incoming/` | GET | Who liked you |

### Messaging
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/conversations/` | GET | List conversations |
| `/api/v1/matches/{id}/messages/` | GET | Get messages |
| `/api/v1/matches/{id}/messages/send/` | POST | Send message |

### Forecast
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/forecast/today/` | GET | Today's forecast |
| `/api/v1/forecast/week/` | GET | 7-day forecast |
| `/api/v1/forecast/{date}/` | GET | Specific date |

## Project Structure

```
backend/
├── manage.py
├── pyproject.toml
├── API.md                    # Full API documentation
├── config/                   # Django settings
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── users/                # User model, auth, profile, photos
│   ├── matching/             # Resonance, Match, scan, compatibility
│   ├── messaging/            # Messages, conversations
│   ├── numerology/           # Calculation engine, forecast
│   └── astrology/            # Swiss Ephemeris calculations
├── core/                     # Shared utilities
│   ├── permissions.py
│   └── pagination.py
├── media/                    # Uploaded files
│   └── photos/
└── ephe/                     # Swiss Ephemeris data files
```

## Chart Levels

| Level | Data Required | Includes |
|-------|---------------|----------|
| 1 | Date only | Sun sign, approximate Moon |
| 2 | Date + time | Precise Moon, all planets |
| 3 | Date + location | (Not commonly used) |
| 4 | Date + time + location | Full chart with houses, Ascendant, MC |

## Match Types

| Type | Score | Description |
|------|-------|-------------|
| twin_flame | 90-100 | Rare cosmic alignment |
| magnetic_stability | 75-89 | Strong attraction + solid foundation |
| passionate_tension | 60-74 | Dynamic energy, growth through challenges |
| gentle_growth | 45-59 | Steady connection |
| karmic_lesson | 0-44 | Learning opportunity |

## Swiss Ephemeris

For accurate astrology calculations, download ephemeris files:

```bash
cd ephe
wget https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1
wget https://www.astro.com/ftp/swisseph/ephe/semo_18.se1
```

The API works without these files using fallback calculations.

## Development

```bash
# Run tests
.venv/bin/python -m pytest

# Create superuser
.venv/bin/python manage.py createsuperuser

# Check for issues
.venv/bin/python manage.py check

# Make migrations
.venv/bin/python manage.py makemigrations

# Shell
.venv/bin/python manage.py shell
```

## Environment Variables

Create `.env` for production:

```bash
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:pass@host:5432/numeros
ALLOWED_HOSTS=api.numeros.app
CORS_ALLOWED_ORIGINS=https://numeros.app
```

## Tech Stack

- **Django 5.2** - Web framework
- **Django REST Framework** - API toolkit
- **SimpleJWT** - JWT authentication
- **pyswisseph** - Swiss Ephemeris bindings
- **PostgreSQL** - Production database (SQLite for dev)
- **uv** - Package manager
