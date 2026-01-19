# numEros Backend API

A Django-based REST API for the numEros dating application, featuring a deterministic multidimensional compatibility engine based on numerology and zodiac systems.

## Features

- **5-Axis Compatibility Engine**: Evaluates relationships across Structure, Dynamics, Culture, Affinity, and Time axes
- **Deterministic Calculations**: Same inputs always produce same outputs - no machine learning or randomness
- **Complete Explainability**: Every compatibility score includes detailed rule traces
- **Token-based Authentication**: Secure API access with Django REST Framework
- **Auto-calculated Profiles**: Numerology and zodiac automatically computed on registration
- **Intelligent Caching**: Compatibility scores cached for performance
- **Mutual Matching**: Resonance system for likes and mutual matches (Eros activation)

## Tech Stack

- Python 3.14
- Django 6.0
- Django REST Framework
- SQLite (development) / PostgreSQL (production recommended)
- Token Authentication

## Project Structure

```
apps/backend/
├── matching/
│   ├── numerology.py          # Numerology calculation service
│   ├── zodiac.py              # Zodiac calculation service
│   ├── compatibility.py       # 5-axis compatibility engine
│   ├── models.py              # CompatibilityCache, Resonance models
│   ├── serializers.py         # API serializers
│   ├── views.py               # API views
│   ├── urls.py                # URL routing
│   └── admin.py               # Django admin configuration
├── users/
│   ├── models.py              # Custom User model
│   ├── serializers.py         # User serializers
│   ├── views.py               # Authentication & profile views
│   ├── urls.py                # URL routing
│   └── admin.py               # Django admin configuration
├── numeros/
│   ├── settings.py            # Django settings
│   └── urls.py                # Main URL configuration
├── API.md                     # Complete API documentation
├── IMPLEMENTATION.md          # Implementation details
└── README.md                  # This file
```

## Setup

### 1. Activate Virtual Environment

```bash
cd apps/backend
source .venv/bin/activate
```

### 2. Install Dependencies

Dependencies are already installed in `.venv`, but if needed:

```bash
pip install -r requirements.txt
```

### 3. Run Migrations

```bash
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api`

## Quick Start

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "name": "John Doe",
    "birth_date": "1990-05-15",
    "gender": "male",
    "seeking": "female"
  }'
```

Response includes your authentication token and complete profile with calculated numerology and zodiac.

### 2. Get Your Profile

```bash
curl http://localhost:8000/api/profile/me \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 3. Scan for Matches

```bash
curl -X POST http://localhost:8000/api/match/scan \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 20,
    "min_score": 60
  }'
```

## API Endpoints

See [API.md](./API.md) for complete documentation.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile/me` - Get current user profile
- `PUT/PATCH /api/profile/me` - Update profile
- `POST /api/profile/calculate` - Calculate numerology (no auth required)
- `GET /api/profile/blueprint` - Get detailed numerology blueprint

### Matching
- `POST /api/match/scan` - Scan for compatible matches
- `POST /api/match/evaluate` - Evaluate compatibility with specific user
- `GET /api/match/candidates` - Get cached match candidates

### Resonance
- `POST /api/resonance/resonate` - Like/resonate with a user
- `POST /api/resonance/decline` - Decline a user
- `GET /api/resonance/all` - List all resonances
- `GET /api/resonance/mutual` - Get mutual matches only

## Compatibility System

### 5 Axes

1. **Structure** (Numerology heavy): Long-term stability based on life path, day, and month numbers
2. **Dynamics** (Directional): Power balance and role dynamics (asymmetric: A→B ≠ B→A)
3. **Culture** (Zodiac): Cultural compatibility based on Chinese/Turkish zodiac
4. **Affinity** (Auxiliary): Additional factors (Phase 2)
5. **Time** (Cycle alignment): Temporal compatibility based on life cycles

### Match Types

- **Twin Flame**: Cosmic alignment with rare number mirroring (85-100)
- **Magnetic Stability**: Strong attraction with emotional safety (75-84)
- **Passionate Tension**: High chemistry with growth edges (70-84)
- **Gentle Growth**: Nurturing connection that deepens (50-69)
- **Karmic Lesson**: Teaches through contrast (30-49)
- **Incompatible**: Fundamental incompatibilities (<30)

### Example Output

```json
{
  "axes": {
    "structure": 45,
    "dynamics": 0,
    "culture": 20,
    "affinity": 0,
    "time": -2
  },
  "total_score": 63,
  "dominant_axis": "structure",
  "labels": {
    "match_type": "gentle_growth",
    "risk_level": "medium",
    "headline": "Gentle Growth",
    "description": "A nurturing connection that deepens over time",
    "longevity_forecast": "Can last with mutual effort"
  },
  "rule_trace": [
    {
      "rule": "Life Path Compatibility",
      "triggered": true,
      "impact": 45,
      "explanation": "Life paths 3 and 5 are compatible"
    },
    ...
  ]
}
```

## Testing

### Run All Tests

```bash
python manage.py test
```

### Test Compatibility Engine

```bash
python test_compatibility.py
```

### Access Django Admin

1. Create superuser: `python manage.py createsuperuser`
2. Run server: `python manage.py runserver`
3. Visit: `http://localhost:8000/admin`

## Database Schema

### Users
- Custom user model with email authentication
- Precomputed numerology (life_path, day_number, month_number, etc.)
- Precomputed zodiac (animal, element, position)
- Gender preferences
- Location (optional)

### CompatibilityCache
- Stores precomputed 5-axis compatibility scores
- Match type and risk level classification
- Computed per year (cycle numbers change annually)
- Indexed for fast querying

### Resonance
- Tracks user likes/resonances
- Mutual match detection (Eros activation)
- Status tracking (pending, mutual, declined, expired)
- Compatibility snapshot at creation

## Key Design Principles

1. **Deterministic**: No randomness, always reproducible
2. **Explainable**: Every score includes rule traces
3. **Separation of Concerns**: Services, models, and API clearly separated
4. **Performance**: Precomputation and caching for speed
5. **Extensibility**: Easy to add new factors or axes
6. **Type Safety**: Using dataclasses and enums for clarity

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

### Production Considerations

For production deployment:

1. Set `DEBUG=False`
2. Use PostgreSQL instead of SQLite
3. Configure proper `ALLOWED_HOSTS`
4. Use environment variables for secrets
5. Enable HTTPS
6. Configure proper CORS origins
7. Add rate limiting
8. Set up Redis for caching
9. Use Celery for background tasks

## Documentation

- **[API.md](./API.md)**: Complete API documentation with examples
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)**: Implementation details and architecture
- **[Technical Specification.md](../../_project/Technical%20Specification.md)**: Formal mathematical specification

## Development

### Code Style

- Follow PEP 8
- Use type hints
- Write docstrings for all functions
- Keep functions focused and testable

### Adding New Endpoints

1. Create serializer in `serializers.py`
2. Create view in `views.py`
3. Add URL in `urls.py`
4. Update `API.md` documentation
5. Write tests

### Debugging

Enable debug toolbar:

```python
# settings.py
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
INTERNAL_IPS = ['127.0.0.1']
```

## Troubleshooting

### Authentication Issues

Ensure token is included in header:
```
Authorization: Token YOUR_TOKEN_HERE
```

### CORS Issues

Check `CORS_ALLOWED_ORIGINS` in `settings.py`

### Migration Issues

Reset database (development only):
```bash
rm db.sqlite3
python manage.py migrate
```

## Contributing

1. Create feature branch
2. Make changes
3. Write/update tests
4. Update documentation
5. Submit pull request

## License

Proprietary - All rights reserved

## Contact

For questions or support, contact the development team.

---

## MVP Status

✅ Complete and functional:
- User registration and authentication
- Numerology and zodiac calculations
- 5-axis compatibility engine
- Match scanning and evaluation
- Resonance system (likes and mutual matches)
- Admin panel
- API documentation

🚧 Phase 2 (Planned):
- Affinity axis with auxiliary factors
- Chat functionality
- Real-time notifications (WebSockets)
- Advanced caching (Redis)
- Background task processing (Celery)
- Location-based filtering
- Analytics and insights