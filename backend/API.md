# Numeros Backend API Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### Register
```
POST /auth/register/
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "display_name": "Jane Smith",
  "birth_date": "1990-05-15",
  "birth_time": "14:30",          // optional
  "birth_place": "New York, NY",  // optional
  "latitude": 40.7128,            // optional
  "longitude": -74.0060           // optional
}
```

**Response:** `201 Created`
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "display_name": "Jane Smith",
    "birth_date": "1990-05-15",
    "life_path": 3,
    "soul_urge": 7,
    "expression": 5,
    "personality": 8,
    "sun_sign": "Taurus",
    "moon_sign": "Capricorn",
    "rising_sign": null,
    "chart_level": 2,
    "numerology": {...},
    "astrology": {...}
  }
}
```

### Login
```
POST /auth/login/
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {...}
}
```

### Logout
```
POST /auth/logout/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "refresh": "eyJ..."
}
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

### Refresh Token
```
POST /auth/refresh/
```

**Request:**
```json
{
  "refresh": "eyJ..."
}
```

**Response:** `200 OK`
```json
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

---

## Profile Endpoints

### Get Profile
```
GET /profile/me/
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "display_name": "Jane Smith",
  "birth_date": "1990-05-15",
  "birth_time": "14:30:00",
  "birth_place": "New York, NY",
  "bio": "Love astrology and numerology",
  "photos": ["/media/photos/1/abc123.jpg"],
  "gender": "female",
  "interested_in": ["male"],
  "life_path": 3,
  "soul_urge": 7,
  "expression": 5,
  "personality": 8,
  "sun_sign": "Taurus",
  "moon_sign": "Capricorn",
  "rising_sign": "Leo",
  "chart_level": 4,
  "is_verified": false,
  "is_profile_complete": true,
  "numerology": {
    "life_path": 3,
    "soul_urge": 7,
    "expression": 5,
    "personality": 8,
    "master_numbers": []
  },
  "astrology": {
    "sun_sign": "Taurus",
    "moon_sign": "Capricorn",
    "rising_sign": "Leo",
    "chart_level": 4,
    "chart_data": {...}
  }
}
```

### Update Profile
```
PATCH /profile/me/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "display_name": "Jane S.",
  "bio": "Updated bio",
  "gender": "female",
  "interested_in": ["male", "non_binary"],
  "age_min_preference": 25,
  "age_max_preference": 40
}
```

**Response:** `200 OK` - Updated user object

### Calculate (Anonymous)
```
POST /profile/calculate/
```

Calculate numerology and astrology without creating an account. Used during onboarding.

**Request:**
```json
{
  "name": "Jane Smith",
  "birth_date": "1990-05-15",
  "birth_time": "14:30",    // optional
  "latitude": 40.7128,      // optional
  "longitude": -74.0060     // optional
}
```

**Response:** `200 OK`
```json
{
  "chart_level": 4,
  "numerology": {
    "life_path": 3,
    "soul_urge": 7,
    "expression": 5,
    "personality": 8,
    "master_numbers": []
  },
  "astrology": {
    "zodiac_system": "tropical",
    "ephemeris": "pyswisseph",
    "angles": {
      "ascendant": {"sign": "Leo", "degree": 15.5},
      "midheaven": {"sign": "Taurus", "degree": 2.3}
    },
    "houses": {
      "system": "placidus",
      "cusps": [15.5, 45.2, ...]
    },
    "planets": {
      "sun": {"sign": "Taurus", "degree_in_sign": 24.4, "house": 10},
      "moon": {"sign": "Capricorn", "degree_in_sign": 27.2, "house": 6},
      ...
    }
  }
}
```

---

## Photo Endpoints

### Upload Photo
```
POST /profile/photos/
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:** Form data with `photo` file field

**Constraints:**
- Max 6 photos per user
- Allowed types: JPEG, PNG, WebP
- Max size: 10MB

**Response:** `201 Created`
```json
{
  "photo_url": "/media/photos/1/abc123.jpg",
  "photos": ["/media/photos/1/abc123.jpg"]
}
```

### Delete Photo
```
DELETE /profile/photos/delete/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "photo_url": "/media/photos/1/abc123.jpg"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "photos": []
}
```

### Reorder Photos
```
PUT /profile/photos/reorder/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "photos": ["/media/photos/1/def456.jpg", "/media/photos/1/abc123.jpg"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "photos": ["/media/photos/1/def456.jpg", "/media/photos/1/abc123.jpg"]
}
```

---

## Matching Endpoints

### Scan for Matches
```
POST /scan/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "limit": 10,        // optional, default 10, max 50
  "age_min": 25,      // optional
  "age_max": 35       // optional
}
```

**Response:** `200 OK`
```json
{
  "profiles": [
    {
      "profile": {
        "id": 2,
        "display_name": "John Doe",
        "age": 32,
        "photos": [...],
        "bio": "...",
        "sun_sign": "Sagittarius",
        "chart_level": 2,
        "numerology": {...}
      },
      "compatibility": {
        "overall_score": 85,
        "match_type": "magnetic_stability",
        "match_description": "Strong attraction with solid foundation",
        "highlights": [
          "Your Life Paths (3 & 5) are in perfect harmony",
          "Moon Sextile: Emotional connection"
        ],
        "numerology": {...},
        "astrology": {...}
      }
    }
  ],
  "count": 1,
  "has_more": false
}
```

### Evaluate Compatibility
```
POST /scan/evaluate/
Authorization: Bearer <token>
```

Get detailed compatibility with a specific user.

**Request:**
```json
{
  "target_user_id": 2
}
```

**Response:** `200 OK`
```json
{
  "profile": {...},
  "compatibility": {
    "overall_score": 85,
    "match_type": "magnetic_stability",
    "match_description": "Strong attraction with solid foundation",
    "numerology": {
      "overall_score": 85,
      "life_path_harmony": 95,
      "soul_connection": 80,
      "expression_sync": 75,
      "personality_match": 90,
      "strengths": [...],
      "challenges": [...]
    },
    "astrology": {
      "aspects": [
        {
          "planet1": "sun",
          "planet2": "moon",
          "aspect": "trine",
          "orb": 2.5,
          "meaning": "Natural emotional harmony"
        }
      ],
      "harmony_score": 5,
      "tension_score": 2,
      "overall_compatibility": 85
    },
    "highlights": [...]
  }
}
```

### Send Resonance
```
POST /resonance/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "target_user_id": 2,
  "action": "resonate"  // "resonate" | "decline" | "maybe_later"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "is_match": true,
  "match": {
    "id": 1,
    "other_user": {...},
    "overall_score": 85,
    "compatibility": {...},
    "is_conversation_started": false,
    "created_at": "2026-01-27T12:00:00Z"
  }
}
```

### List Matches
```
GET /matches/
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "other_user": {
        "id": 2,
        "display_name": "John Doe",
        "age": 32,
        "photos": [...],
        "numerology": {...},
        "astrology": {...}
      },
      "overall_score": 85,
      "compatibility": {...},
      "is_conversation_started": true,
      "last_message_at": "2026-01-27T14:30:00Z",
      "created_at": "2026-01-27T12:00:00Z"
    }
  ]
}
```

### Get Match Detail
```
GET /matches/{id}/
Authorization: Bearer <token>
```

**Response:** `200 OK` - Full match object with detailed compatibility

### Incoming Resonances
```
GET /resonances/incoming/
Authorization: Bearer <token>
```

People who liked you but you haven't responded to.

**Response:** `200 OK`
```json
{
  "count": 1,
  "results": [
    {
      "id": 5,
      "user": {
        "id": 3,
        "display_name": "Emily Rose",
        "age": 28,
        "photos": [...],
        "sun_sign": "Pisces",
        "numerology": {...}
      },
      "compatibility_score": 76,
      "created_at": "2026-01-27T10:00:00Z"
    }
  ]
}
```

### Maybe Later Queue
```
GET /resonances/maybe-later/
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "count": 1,
  "results": [
    {
      "id": 3,
      "user": {...},
      "compatibility_score": 72,
      "expires_at": "2026-02-03T10:00:00Z",
      "days_remaining": 6,
      "created_at": "2026-01-27T10:00:00Z"
    }
  ]
}
```

### Convert Maybe Later
```
POST /resonances/maybe-later/{id}/convert/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "action": "resonate"  // "resonate" | "decline"
}
```

**Response:** `200 OK` - Same as resonance response

---

## Messaging Endpoints

### List Conversations
```
GET /conversations/
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "conversations": [
    {
      "match_id": 1,
      "other_user": {
        "id": 2,
        "display_name": "John Doe",
        "photos": [...]
      },
      "last_message": {
        "id": 5,
        "content": "Would you like to meet?",
        "is_mine": false,
        "read_at": null,
        "created_at": "2026-01-27T14:30:00Z"
      },
      "unread_count": 1,
      "is_conversation_started": true
    }
  ],
  "count": 1
}
```

### List Messages
```
GET /matches/{match_id}/messages/
Authorization: Bearer <token>
```

Automatically marks unread messages as read.

**Response:** `200 OK`
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "sender": {
        "id": 1,
        "display_name": "Jane Smith",
        "photos": [...]
      },
      "content": "Hey! Our compatibility looks amazing.",
      "is_mine": true,
      "read_at": null,
      "created_at": "2026-01-27T12:00:00Z"
    },
    {
      "id": 2,
      "sender": {
        "id": 2,
        "display_name": "John Doe",
        "photos": [...]
      },
      "content": "I know! The Life Path harmony is great.",
      "is_mine": false,
      "read_at": "2026-01-27T12:05:00Z",
      "created_at": "2026-01-27T12:02:00Z"
    }
  ]
}
```

### Send Message
```
POST /matches/{match_id}/messages/send/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Hello! Nice to match with you."
}
```

**Response:** `201 Created`
```json
{
  "id": 6,
  "sender": {...},
  "content": "Hello! Nice to match with you.",
  "is_mine": true,
  "read_at": null,
  "created_at": "2026-01-27T15:00:00Z"
}
```

### Mark Messages Read
```
POST /matches/{match_id}/messages/read/
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "messages_marked_read": 2
}
```

---

## Forecast Endpoints

### Today's Forecast
```
GET /forecast/today/
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "date": "2026-01-27",
  "universal_day": {
    "number": 2,
    "theme": "Partnership",
    "energy": "Cooperation & Sensitivity",
    "color": "#F472B6",
    "glow": "#F472B640"
  },
  "personal_day": {
    "number": 4,
    "theme": "Foundation",
    "energy": "Stability & Hard Work",
    "color": "#10B981",
    "glow": "#10B98140",
    "advice": "Build something lasting. Focus on practical matters.",
    "love": "Security and commitment are themes. Show reliability.",
    "challenge": "Don't become too rigid or resistant to change."
  },
  "life_path": 3,
  "harmony_score": 75,
  "harmony_description": "Strong harmony - favorable conditions for your goals"
}
```

### Week Forecast
```
GET /forecast/week/
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "forecasts": [
    {"date": "2026-01-27", "personal_day": {...}, ...},
    {"date": "2026-01-28", "personal_day": {...}, ...},
    ...
  ],
  "life_path": 3
}
```

### Specific Date Forecast
```
GET /forecast/{date}/
Authorization: Bearer <token>
```

Date format: `YYYY-MM-DD`

**Response:** `200 OK` - Same as today's forecast

---

## Device / Notification Endpoints

### Register Device
```
POST /profile/devices/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "platform": "ios",           // "ios" | "android"
  "token": "push_token_here",
  "device_id": "unique-device-uuid",
  "app_version": "1.0.0",      // optional
  "os_version": "17.2"         // optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "device_id": "unique-device-uuid",
  "created": true
}
```

### Unregister Device
```
DELETE /profile/devices/unregister/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "device_id": "unique-device-uuid"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "deleted": true
}
```

### Update Notification Settings
```
PATCH /profile/devices/settings/
Authorization: Bearer <token>
```

**Request:**
```json
{
  "device_id": "unique-device-uuid",
  "notifications_enabled": true,
  "match_notifications": true,
  "message_notifications": true,
  "forecast_notifications": false
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "settings": {
    "notifications_enabled": true,
    "match_notifications": true,
    "message_notifications": true,
    "forecast_notifications": false
  }
}
```

---

## Match Types

| Type | Score Range | Description |
|------|-------------|-------------|
| `twin_flame` | 90-100 | Rare cosmic alignment |
| `magnetic_stability` | 75-89 | Strong attraction with solid foundation |
| `passionate_tension` | 60-74 | Dynamic energy, growth through challenges |
| `gentle_growth` | 45-59 | Steady connection, gradual deepening |
| `karmic_lesson` | 0-44 | Learning opportunity, contrasting energies |

---

## Chart Levels

| Level | Data Required | Includes |
|-------|---------------|----------|
| 1 | Birth date only | Sun sign, approximate Moon |
| 2 | Date + time | Precise Moon, all planets |
| 3 | Date + location | (Uncommon) |
| 4 | Date + time + location | Full chart with houses, Ascendant, Midheaven |

---

## Error Responses

```json
{
  "error": "Error message here"
}
```

or

```json
{
  "detail": "Error detail from DRF"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Numerology Numbers

| Number | Theme |
|--------|-------|
| 1 | New Beginnings, Initiative |
| 2 | Partnership, Cooperation |
| 3 | Expression, Creativity |
| 4 | Foundation, Stability |
| 5 | Change, Freedom |
| 6 | Harmony, Love |
| 7 | Reflection, Wisdom |
| 8 | Abundance, Power |
| 9 | Completion, Compassion |
| 11 | Master Number - Intuition |
| 22 | Master Number - Builder |
| 33 | Master Number - Teacher |

---

## Energy Colors

```javascript
const energyColors = {
  1: '#DC2626',  // Red
  2: '#F472B6',  // Pink
  3: '#F59E0B',  // Amber
  4: '#10B981',  // Emerald
  5: '#06B6D4',  // Cyan
  6: '#FBBF24',  // Yellow
  7: '#6366F1',  // Indigo
  8: '#8B5CF6',  // Violet
  9: '#F5F5F5',  // White/Silver
}
```
