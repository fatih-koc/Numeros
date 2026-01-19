# numEros Backend Implementation

## Overview

This backend implements the **Multidimensional Compatibility Engine (MCE)** for numEros, a dating application based on numerology and zodiac compatibility.

## What Has Been Implemented

### 1. Project Documentation
- **Technical Specification v2.0** (`_project/Technical Specification.md`)
  - Complete formal mathematical specification
  - 5-axis compatibility system
  - Numerology and zodiac algorithms
  - Override rules and classification logic
  - API design and database schema

### 2. Core Services

#### Numerology Service (`matching/numerology.py`)
- Life Path, Day, Month, and Cycle number calculations
- Master number preservation (11, 22, 33)
- Name number calculations (Soul Urge, Expression, Challenge)
- Turkish letter support
- Number meanings and characteristics

#### Zodiac Service (`matching/zodiac.py`)
- Chinese/Turkish zodiac animal calculation
- 12-year cycle implementation
- Element groupings (Water, Metal, Wood, Fire)
- Opposition and trine harmony detection
- Zodiac characteristics and traits

#### Compatibility Engine (`matching/compatibility.py`)
- **5-Axis Compatibility System**:
  1. **Structure** - Numerology heavy, long-term stability
  2. **Dynamics** - Asymmetric/directional, power balance
  3. **Culture** - Zodiac compatibility
  4. **Affinity** - Auxiliary factors (Phase 2)
  5. **Time** - Cycle alignment
- Override rules (Structural Collapse, Temporal Suppression)
- Dominant axis classification
- Match type generation (Twin Flame, Magnetic Stability, etc.)
- Complete rule tracing for explainability

### 3. Database Models

#### User Model (`users/models.py`)
- Custom Django user model with authentication
- Precomputed numerology fields (life_path, day_number, month_number)
- Precomputed zodiac fields (animal, element, position)
- Helper methods for profile generation and compatibility calculation
- Indexed for fast matching queries

#### Compatibility Cache (`matching/models.py`)
- Stores precomputed compatibility scores
- All 5 axis scores + aggregates
- Match type and risk level classification
- Yearly recomputation (due to cycle numbers)

#### Resonance Model (`matching/models.py`)
- Tracks user interactions (resonances/likes)
- Mutual match detection (Eros activation)
- Status tracking (pending, mutual, declined, expired)
- Compatibility snapshot at creation time

## Architecture Highlights

### Deterministic System
- **No randomness** - Same inputs always produce same outputs
- **No machine learning** - Pure rule-based logic
- **Explainable** - Every score includes rule traces
- **Testable** - Deterministic guarantees enable comprehensive testing

### Multidimensional Analysis
- Not just a single score - provides 5 different compatibility perspectives
- Allows for nuanced matching (e.g., "high attraction + low stability")
- Captures asymmetric relationships (A→B ≠ B→A)
- Temporal component (cycle numbers change yearly)

### Performance Optimization
- Precomputed numerology and zodiac on user creation
- Compatibility cache for frequently accessed pairs
- Database indexes on common query patterns
- Efficient lookup tables for compatibility matrices

## Key Features

### 1. Numerology Calculations
```python
from matching.numerology import calculate_life_path, NumerologyProfile
from datetime import date

# Calculate life path
birth_date = date(1987, 7, 8)
life_path = calculate_life_path(birth_date)  # Returns: 4

# Create full profile
profile = NumerologyProfile.from_birth_date(
    birth_date=birth_date,
    current_year=2026,
    name="Fatih Koç",
    use_turkish=True
)
```

### 2. Zodiac Calculations
```python
from matching.zodiac import ZodiacProfile

# Create zodiac profile
zodiac = ZodiacProfile.from_birth_date(date(1987, 7, 8))
print(zodiac.animal)    # tavsan (Rabbit)
print(zodiac.element)   # fire
print(zodiac.position)  # 4
```

### 3. Compatibility Evaluation
```python
from matching.compatibility import evaluate_compatibility

# Calculate compatibility between two users
result = evaluate_compatibility(
    numerology_a=profile_a,
    numerology_b=profile_b,
    zodiac_a=zodiac_a,
    zodiac_b=zodiac_b
)

print(result.total_score)            # 75
print(result.dominant_axis)          # 'structure'
print(result.labels.match_type)      # 'magnetic_stability'
print(result.labels.headline)        # 'Magnetic Stability'
print(result.axes.structure)         # 45
print(result.axes.culture)           # 20
```

### 4. User Model Usage
```python
from users.models import User

# Create user (automatically calculates numerology and zodiac)
user = User.objects.create(
    email='user@example.com',
    name='Fatih Koç',
    birth_date=date(1987, 7, 8),
    # Numerology and zodiac are computed automatically
)

# Calculate compatibility with another user
other_user = User.objects.get(email='other@example.com')
compatibility = user.calculate_compatibility_with(other_user)

print(compatibility.to_dict())
```

## Data Flow

### 1. User Registration
```
User Input (name, birth_date)
    ↓
Calculate Life Path, Day, Month Numbers
    ↓
Calculate Zodiac Animal, Element, Position
    ↓
Store in User Model
    ↓
User Profile Created
```

### 2. Matching Process
```
Current User
    ↓
Query Potential Matches (filtered by preferences)
    ↓
Check Compatibility Cache
    ↓
If not cached: Calculate Compatibility
    ↓
Store in Cache
    ↓
Return Sorted Matches
```

### 3. Resonance (Match) Flow
```
User A Resonates with User B
    ↓
Create/Update Resonance Record
    ↓
Check if User B Already Resonated
    ↓
If Yes: Activate Eros (Mutual Match)
    ↓
Enable Chat
```

## Compatibility Matrix Reference

### Life Path Compatibility

From the founder's table (implemented in `matching/compatibility.py`):

| Life Path | Very Compatible | Medium | Challenging |
|-----------|----------------|---------|-------------|
| 1 | 3, 5 | 9, 11 | 2, 6 |
| 2 | 4, 6, 8 | 9, 11 | 1, 5 |
| 3 | 1, 5, 9 | 6, 11 | 4, 8 |
| 4 | 2, 6, 8, 22 | 9 | 3, 5 |
| 5 | 1, 3, 7 | 9 | 4, 6, 8 |
| 6 | 2, 4, 9, 33 | 11, 22 | 1, 5 |
| 7 | 5, 7, 9 | 11 | 2, 6, 8 |
| 8 | 2, 4, 6, 22 | 11 | 3, 5, 7 |
| 9 | 3, 6, 9, 33 | 1, 11 | 4, 8 |
| 11 | 2, 6, 9, 11 | 3, 8 | 4 |
| 22 | 4, 6, 8, 22 | 11 | 3, 5 |
| 33 | 6, 9, 33 | 11 | 1, 8 |

### Zodiac Compatibility

- **Same Element (Trine)**: +1 (harmony)
- **Opposition (6 apart)**: -1 (clash)
- **Adjacent**: 0 (neutral)
- **Other**: 0 (neutral)

## Next Steps

### Immediate (MVP)
1. Create API endpoints (serializers, views, URLs)
2. Implement authentication (registration, login)
3. Create profile endpoints (calculate, retrieve)
4. Create matching endpoints (scan, evaluate)
5. Create resonance endpoints (create, retrieve)
6. Run migrations and create database
7. Add admin panel configuration
8. Write unit tests

### Phase 2 (Enhancement)
1. Implement Affinity axis with auxiliary factors
2. Add WebSocket support for real-time notifications
3. Implement chat functionality
4. Add location-based filtering
5. Implement advanced caching strategies
6. Add analytics and insights
7. Performance optimization

## Running the Backend

### Setup
```bash
cd apps/backend

# Activate virtual environment
source .venv/bin/activate

# Install dependencies (if not already)
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Testing Compatibility Engine
```python
# In Django shell
python manage.py shell

from datetime import date
from matching.numerology import NumerologyProfile
from matching.zodiac import ZodiacProfile
from matching.compatibility import evaluate_compatibility

# Create test profiles
profile_a = NumerologyProfile.from_birth_date(
    date(1987, 7, 8),
    2026,
    "Fatih Koç",
    use_turkish=True
)
zodiac_a = ZodiacProfile.from_birth_date(date(1987, 7, 8))

profile_b = NumerologyProfile.from_birth_date(
    date(1984, 5, 7),
    2026,
    "Ayşe Yılmaz",
    use_turkish=True
)
zodiac_b = ZodiacProfile.from_birth_date(date(1984, 5, 7))

# Evaluate compatibility
result = evaluate_compatibility(profile_a, profile_b, zodiac_a, zodiac_b)
print(result.to_dict())
```

## File Structure

```
apps/backend/
├── matching/
│   ├── numerology.py        # Numerology calculations
│   ├── zodiac.py            # Zodiac calculations
│   ├── compatibility.py     # Compatibility engine
│   ├── models.py            # CompatibilityCache, Resonance
│   └── ...
├── users/
│   ├── models.py            # Custom User model
│   └── ...
├── chat/
│   └── ...                  # Chat functionality (TBD)
├── numeros/
│   ├── settings.py          # Django settings
│   ├── urls.py              # URL configuration
│   └── ...
├── IMPLEMENTATION.md        # This file
└── requirements.txt         # Python dependencies
```

## Design Principles

1. **Determinism First** - No probabilistic elements, always reproducible
2. **Explainability** - Every score includes rule traces
3. **Separation of Concerns** - Services, models, and API clearly separated
4. **Performance** - Precomputation and caching for speed
5. **Extensibility** - Easy to add new factors or axes
6. **Type Safety** - Using dataclasses and enums for clarity
7. **Documentation** - Every function has docstrings

## Technical Debt & Future Improvements

1. **API Implementation** - Not yet implemented
2. **Authentication** - Needs proper JWT or token-based auth
3. **Testing** - Need comprehensive unit and integration tests
4. **Validation** - Need input validation and error handling
5. **Caching Strategy** - Need Redis for session and query caching
6. **Background Tasks** - Need Celery for async compatibility calculations
7. **Monitoring** - Need logging and error tracking
8. **Documentation** - Need API documentation (OpenAPI/Swagger)

## References

- Technical Specification: `_project/Technical Specification.md`
- Research Documents: `_matching/*.md`
- Example Code: `_example/*.ts`
- Project Blueprints: `_project/*.md`
