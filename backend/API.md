# numEros API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

All endpoints except registration, login, and profile calculation require authentication using token-based authentication.

Include the token in the request header:
```
Authorization: Token <your-token-here>
```

---

## Authentication Endpoints

### Register User

Create a new user account with automatic numerology and zodiac calculation.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "name": "John Doe",
  "birth_date": "1990-05-15",
  "gender": "male",
  "seeking": "female",
  "use_turkish_letters": false
}
```

**Response:** `201 Created`
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "birth_date": "1990-05-15",
    "numerology": {
      "life_path": 3,
      "day_number": 6,
      "month_number": 5,
      "cycle_number": 5,
      "soul_urge": 7,
      "expression": 1,
      "challenge": 1,
      "life_path_meaning": {
        "title": "The Creative Expresser",
        "description": "You bring joy through creation",
        "keywords": ["creativity", "expression", "joy"]
      }
    },
    "zodiac": {
      "animal": "at",
      "element": "wood",
      "position": 7,
      "name_en": "Horse",
      "name_tr": "At",
      "characteristics": {
        "traits": ["Energetic", "Independent", "Free-spirited"],
        "description": "The Horse is warm-hearted and enthusiastic, loving freedom"
      }
    },
    "gender": "male",
    "seeking": "female",
    "created_at": "2026-01-12T10:30:00Z",
    "last_active": "2026-01-12T10:30:00Z"
  }
}
```

---

### Login

Authenticate and receive access token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    ...
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "error": "Invalid credentials"
}
```

---

### Logout

Delete authentication token.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "message": "Successfully logged out"
}
```

---

## Profile Endpoints

### Get Current User Profile

Retrieve authenticated user's profile with calculated numerology and zodiac.

**Endpoint:** `GET /api/profile/me`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "birth_date": "1990-05-15",
  "numerology": { ... },
  "zodiac": { ... },
  "gender": "male",
  "seeking": "female",
  "created_at": "2026-01-12T10:30:00Z",
  "last_active": "2026-01-12T10:30:00Z"
}
```

---

### Update Profile

Update user profile information.

**Endpoint:** `PUT/PATCH /api/profile/me`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Smith",
  "gender": "male",
  "seeking": "female",
  "location_lat": 41.0082,
  "location_lng": 28.9784
}
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Smith",
  ...
}
```

---

### Calculate Profile

Calculate numerology and zodiac from birth data without creating an account.

**Endpoint:** `POST /api/profile/calculate`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "Jane Doe",
  "birth_date": "1992-08-22",
  "use_turkish_letters": false,
  "current_year": 2026
}
```

**Response:** `200 OK`
```json
{
  "numerology": {
    "life_path": 7,
    "day_number": 4,
    "month_number": 8,
    "cycle_number": 8,
    "soul_urge": 1,
    "expression": 9,
    "challenge": 4,
    "life_path_meaning": {
      "title": "The Deep Seeker",
      "description": "You find truth in silence",
      "keywords": ["depth", "mysticism", "introspection"]
    }
  },
  "zodiac": {
    "animal": "maymun",
    "element": "water",
    "position": 9,
    "name_en": "Monkey",
    "name_tr": "Maymun",
    "characteristics": {
      "traits": ["Clever", "Playful", "Curious"],
      "description": "The Monkey is intelligent and witty, always seeking fun"
    }
  }
}
```

---

### Get Blueprint

Get detailed numerology blueprint for current user.

**Endpoint:** `GET /api/profile/blueprint`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "core": {
    "number": 3,
    "meaning": {
      "title": "The Creative Expresser",
      "description": "You bring joy through creation",
      "keywords": ["creativity", "expression", "joy"]
    }
  },
  "desire": {
    "number": 7,
    "meaning": {
      "title": "The Deep Seeker",
      "description": "You find truth in silence",
      "keywords": ["depth", "mysticism", "introspection"]
    }
  },
  "bond": {
    "number": 1,
    "meaning": {
      "title": "The Independent Leader",
      "description": "You lead with vision and courage",
      "keywords": ["leadership", "independence", "initiative"]
    }
  },
  "friction": {
    "number": 1,
    "description": "Challenge number 1"
  },
  "cycle": {
    "number": 5,
    "year": 2026,
    "description": "You are in cycle 5 for 2026"
  },
  "zodiac": {
    "animal": "at",
    "element": "wood",
    "name_en": "Horse",
    "name_tr": "At"
  }
}
```

---

## Matching Endpoints

### Scan for Matches

Scan the database for compatible matches based on numerology and zodiac.

**Endpoint:** `POST /api/match/scan`

**Authentication:** Required

**Request Body:**
```json
{
  "limit": 50,
  "min_score": 50,
  "match_types": ["magnetic_stability", "passionate_tension", "twin_flame"],
  "gender": "female"
}
```

**Parameters:**
- `limit` (optional): Maximum number of matches to return (default: 50, max: 100)
- `min_score` (optional): Minimum compatibility score (default: 50)
- `match_types` (optional): Filter by match types
- `gender` (optional): Filter by gender

**Response:** `200 OK`
```json
{
  "scanned_count": 245,
  "rejected_count": 180,
  "resonances_found": 3,
  "matches": [
    {
      "user": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Jane Smith",
        "age": 32,
        "numerology": { ... },
        "zodiac": { ... },
        "gender": "female"
      },
      "compatibility": {
        "total_score": 85,
        "match_type": "magnetic_stability",
        "risk_level": "low",
        "headline": "Magnetic Stability",
        "axes": {
          "structure": 45,
          "dynamics": 0,
          "culture": 20,
          "affinity": 0,
          "time": -2
        }
      }
    }
  ]
}
```

---

### Evaluate Compatibility

Calculate detailed compatibility with a specific user.

**Endpoint:** `POST /api/match/evaluate`

**Authentication:** Required

**Request Body:**
```json
{
  "target_user_id": "660e8400-e29b-41d4-a716-446655440001",
  "include_trace": true
}
```

**Response:** `200 OK`
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
    {
      "rule": "Day Number Compatibility",
      "triggered": true,
      "impact": 0,
      "explanation": "Day numbers 6 and 7 are neutral"
    },
    {
      "rule": "Month Number Match",
      "triggered": false,
      "impact": 0,
      "explanation": "Different birth months"
    },
    {
      "rule": "Directional Life Path Compatibility",
      "triggered": true,
      "impact": 0,
      "explanation": "Symmetric power dynamic - balanced relationship"
    },
    {
      "rule": "Zodiac Compatibility",
      "triggered": true,
      "impact": 20,
      "explanation": "at and kaplan are harmonious"
    },
    {
      "rule": "Affinity Axis",
      "triggered": false,
      "impact": 0,
      "explanation": "Auxiliary factors not implemented in MVP"
    },
    {
      "rule": "Cycle Alignment",
      "triggered": true,
      "impact": -2,
      "explanation": "Close cycle alignment (distance: 2)"
    },
    {
      "rule": "Structural Collapse Override",
      "triggered": false,
      "impact": 0,
      "explanation": "No double clash detected"
    },
    {
      "rule": "Temporal Suppression Override",
      "triggered": false,
      "impact": 0,
      "explanation": "Cycle distance within acceptable range"
    }
  ]
}
```

---

### Get Match Candidates

Retrieve cached match candidates sorted by compatibility.

**Endpoint:** `GET /api/match/candidates?limit=20&min_score=60`

**Authentication:** Required

**Query Parameters:**
- `limit` (optional): Number of candidates (default: 20)
- `min_score` (optional): Minimum score (default: 50)

**Response:** `200 OK`
```json
[
  {
    "user": { ... },
    "compatibility": {
      "total_score": 85,
      "match_type": "magnetic_stability",
      ...
    }
  }
]
```

---

## Resonance Endpoints

### Resonate with User

Like/resonate with another user. Creates mutual match if both users resonate.

**Endpoint:** `POST /api/resonance/resonate`

**Authentication:** Required

**Request Body:**
```json
{
  "target_user_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response:** `201 Created`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user1": { ... },
  "user2": { ... },
  "status": "pending",
  "is_mutual": false,
  "can_chat": false,
  "user1_resonated_at": "2026-01-12T11:00:00Z",
  "user2_resonated_at": null,
  "eros_activated_at": null,
  "compatibility_score": 75,
  "match_type": "gentle_growth",
  "created_at": "2026-01-12T11:00:00Z"
}
```

**Mutual Match Response:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user1": { ... },
  "user2": { ... },
  "status": "mutual",
  "is_mutual": true,
  "can_chat": true,
  "user1_resonated_at": "2026-01-12T11:00:00Z",
  "user2_resonated_at": "2026-01-12T11:30:00Z",
  "eros_activated_at": "2026-01-12T11:30:00Z",
  "compatibility_score": 75,
  "match_type": "gentle_growth",
  "created_at": "2026-01-12T11:00:00Z"
}
```

---

### Decline User

Decline a potential match.

**Endpoint:** `POST /api/resonance/decline`

**Authentication:** Required

**Request Body:**
```json
{
  "target_user_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response:** `200 OK`
```json
{
  "message": "User declined"
}
```

---

### List Resonances

Get all resonances for current user.

**Endpoint:** `GET /api/resonance/list?status=pending`

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status (pending, mutual, declined, expired)

**Response:** `200 OK`
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "user1": { ... },
    "user2": { ... },
    "status": "pending",
    "is_mutual": false,
    "can_chat": false,
    "user1_resonated_at": "2026-01-12T11:00:00Z",
    "user2_resonated_at": null,
    "eros_activated_at": null,
    "compatibility_score": 75,
    "match_type": "gentle_growth",
    "created_at": "2026-01-12T11:00:00Z"
  }
]
```

---

### Get Mutual Matches

Get only mutual matches (Eros activated).

**Endpoint:** `GET /api/resonance/mutual`

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "user1": { ... },
    "user2": { ... },
    "status": "mutual",
    "is_mutual": true,
    "can_chat": true,
    "user1_resonated_at": "2026-01-12T11:00:00Z",
    "user2_resonated_at": "2026-01-12T11:30:00Z",
    "eros_activated_at": "2026-01-12T11:30:00Z",
    "compatibility_score": 85,
    "match_type": "magnetic_stability",
    "created_at": "2026-01-12T11:00:00Z"
  }
]
```

---

## Match Types

The system classifies matches into the following types:

- **twin_flame**: Cosmic alignment with rare number mirroring (85-100 score)
- **magnetic_stability**: Strong attraction with emotional safety (75-84 score)
- **passionate_tension**: High chemistry with growth edges (70-84 score)
- **gentle_growth**: Nurturing connection that deepens over time (50-69 score)
- **karmic_lesson**: Teaches through contrast (30-49 score)
- **incompatible**: Fundamental incompatibilities (<30 score)

## Risk Levels

- **low**: High compatibility with good stability
- **medium**: Moderate compatibility, requires effort
- **high**: Low compatibility, challenging relationship

## Compatibility Axes

The 5-axis compatibility system:

1. **Structure** (Numerology heavy): Long-term stability based on life path, day, and month numbers
2. **Dynamics** (Directional): Power balance and role dynamics (asymmetric)
3. **Culture** (Zodiac): Cultural compatibility based on Chinese/Turkish zodiac
4. **Affinity** (Auxiliary factors): Additional compatibility factors (Phase 2)
5. **Time** (Cycle alignment): Temporal compatibility based on life cycles

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "field_name": ["Error message"]
}
```

**401 Unauthorized**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error message"
}
```

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "password_confirm": "Test123!",
    "name": "Test User",
    "birth_date": "1990-05-15",
    "gender": "male",
    "seeking": "female"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Get Profile:**
```bash
curl http://localhost:8000/api/profile/me \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

**Scan for Matches:**
```bash
curl -X POST http://localhost:8000/api/match/scan \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 20,
    "min_score": 60
  }'
```

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000/api"

# Register
response = requests.post(f"{BASE_URL}/auth/register", json={
    "email": "test@example.com",
    "password": "Test123!",
    "password_confirm": "Test123!",
    "name": "Test User",
    "birth_date": "1990-05-15",
    "gender": "male",
    "seeking": "female"
})

data = response.json()
token = data['token']

# Get profile
headers = {"Authorization": f"Token {token}"}
response = requests.get(f"{BASE_URL}/profile/me", headers=headers)
print(response.json())

# Scan for matches
response = requests.post(
    f"{BASE_URL}/match/scan",
    headers=headers,
    json={"limit": 20, "min_score": 60}
)
print(response.json())
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- Special limits for scan endpoint (10 requests per minute)

## Pagination

Currently not implemented. All list endpoints return full results within the specified limit.

## WebSocket Support

Real-time features (chat, notifications) are planned for Phase 2 and will use WebSocket connections.
