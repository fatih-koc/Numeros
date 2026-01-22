# Numeros - Claude Code Context & Skills

## Project Overview

**Numeros** is a love/compatibility matching application using numerology and zodiac calculations. The system is deterministic (no ML) - same inputs always produce same outputs.

### Architecture

```
apps/
├── backend/          # Django REST API (Python)
├── native/           # React Native app (Expo) - TARGET
├── prototype/        # React prototype (Vite) - SOURCE for conversion
└── web/              # Next.js web app (starter template)
```

### Primary Goal
Convert the **prototype** (React/Vite) to **native** (React Native/Expo) while integrating with the **backend** Django API.

---

## Backend (Django)

**Location:** `/apps/backend`
**Framework:** Django 4.2+ with Django REST Framework
**Database:** SQLite (dev) / PostgreSQL (prod)
**Auth:** Token-based (DRF TokenAuthentication)

### Django Apps

| App | Purpose |
|-----|---------|
| `numeros/` | Main project settings, URLs |
| `users/` | Custom User model, auth endpoints |
| `matching/` | Compatibility engine, resonance system |
| `chat/` | Placeholder for Phase 2 |

### Key Models

**User** (`users/models.py`):
```python
# Core fields
email (USERNAME_FIELD), name, birth_date

# Numerology (precomputed on registration)
life_path, day_number, month_number, soul_urge, expression, challenge

# Zodiac (precomputed)
zodiac_animal, zodiac_element, zodiac_position

# Preferences
gender, seeking, location_lat, location_lng, use_turkish_letters
```

**CompatibilityCache** (`matching/models.py`):
- Stores precomputed compatibility between user pairs
- 5 axis scores: structure, dynamics, culture, affinity, time
- Classification: match_type, risk_level, dominant_axis
- Labels: headline, description, longevity_forecast

**Resonance** (`matching/models.py`):
- Tracks likes between users
- Status: pending, mutual, declined, expired
- `eros_activated_at` when mutual match occurs

### API Endpoints

**Auth:**
- `POST /api/auth/register` - Register with auto-calculated numerology
- `POST /api/auth/login` - Returns token
- `POST /api/auth/logout` - Deletes token

**Profile:**
- `GET /api/profile/me` - Full user profile
- `PUT /api/profile/me` - Update profile
- `POST /api/profile/calculate` - Calculate numerology without account
- `GET /api/profile/blueprint` - Detailed numerology meanings

**Matching:**
- `POST /api/match/scan` - Scan for matches (limit, min_score, match_types)
- `POST /api/match/evaluate` - Evaluate specific user compatibility
- `GET /api/match/candidates` - Cached candidates

**Resonance:**
- `POST /api/resonance/resonate` - Like a user
- `POST /api/resonance/decline` - Decline a user
- `GET /api/resonance/all` - All resonances (filter by status)
- `GET /api/resonance/mutual` - Mutual matches only

### Numerology Engine (`matching/numerology.py`)

**Life Path:** `R(day + month + year)` - Core identity
**Day Number:** `R(day)` - Personal rhythm
**Month Number:** `R(month)` - Emotional baseline
**Soul Urge:** Sum of vowels in name - Desire axis
**Expression:** Sum of all letters - Bond axis
**Challenge:** `|month - day|` - Friction axis

Master numbers preserved: 11, 22, 33

### Zodiac Engine (`matching/zodiac.py`)

12-year cycle (Chinese/Turkish zodiac):
- Animals: Fare, Öküz, Kaplan, Tavşan, Ejderha, Yılan, At, Koyun, Maymun, Horoz, Köpek, Domuz
- Elements: Water, Metal, Wood, Fire
- 2020 = Year of Rat (base year)

### Compatibility Engine (`matching/compatibility.py`)

**5 Axes:**
1. **Structure** (~45%): Life path + day + month compatibility
2. **Dynamics**: Asymmetric power balance (A→B ≠ B→A)
3. **Culture** (~20%): Zodiac compatibility
4. **Affinity**: Placeholder for auxiliary factors
5. **Time**: Cycle number alignment

**Match Types:**
- Twin Flame (85-100)
- Magnetic Stability (75-84)
- Passionate Tension (70-84)
- Gentle Growth (50-69)
- Karmic Lesson (30-49)
- Incompatible (<30)

---

## Prototype (React/Vite) - SOURCE

**Location:** `/apps/prototype`
**Stack:** React 18, Vite, TypeScript, Tailwind CSS 4
**Styling:** Tailwind + custom CSS with mystical/esoteric theme

### Component Structure

```
src/
├── components/
│   ├── App.tsx              # Main orchestrator (3 screens)
│   ├── LoveEngine.tsx       # Circular visualization with sigils
│   ├── ShaderCanvas.tsx     # WebGL shader rendering
│   ├── Blueprint.tsx        # Results 2x2 grid
│   ├── InputForm.tsx        # Name + DOB form
│   ├── Background.tsx       # Gradient layers
│   └── Particles.tsx        # Floating particles
├── lib/
│   ├── numerology.ts        # Client-side calculations
│   └── shaders.ts           # GLSL shaders (5 variants)
└── imports/
    ├── NumerosIcon.tsx
    └── NumerosText.tsx
```

### Screen Flow

```
idle → input → idle (calculation animation) → blueprint
```

### State Management

Local React state with hooks (no Redux):
```typescript
interface EngineState {
  isCalculating: boolean;
  isIntense: boolean;
  resultNumber: number | null;
  showResult: boolean;
  activeNumber: number | null;
  currentPhase: number | null;
  showSigils: { core, desire, bond, friction };
}
```

### UI/UX Patterns

- Dark mystical theme (#0c0a1d background)
- Fonts: Cormorant Garamond (serif), JetBrains Mono
- Phase-based reveal animations
- Rotating number track with glow effects
- WebGL shaders for visual effects
- Sigils: Circle (core), Triangle (desire), Square (bond), Diamond (friction)

### Key Animations
- `floatParticle`: 10-20s floating
- `rotateTrack`: 30s idle, 6s calculating, 2s intense
- `corePulse` / `corePulseActive`: Pulsing
- `fadeIn`, `tileAppear`: Entrance animations

---

## Native (React Native/Expo) - TARGET

**Location:** `/apps/native`
**Stack:** Expo 52, React Native 0.76, TypeScript
**Animations:** react-native-reanimated 3.16
**Graphics:** expo-gl, @shopify/react-native-skia

### Current State

Basic shell with:
- Animated WebGL background (gradient shader)
- StatusOrb component with breathing animation
- Logo: "num**Eros**"
- No navigation, no API integration

### Files
- `App.tsx` - Active main app
- `App.first.tsx` - Astrology chart variant
- `App.fullchart.tsx` - Full chart variant

### Missing (to implement)
- Navigation (React Navigation)
- API client integration
- State management (Zustand/Redux)
- All screens from prototype
- Authentication flow
- Profile management
- Matching/scanning
- Resonance/likes system

---

## Web (Next.js)

**Location:** `/apps/web`
**Stack:** Next.js 16.1, React 19, TypeScript, Tailwind 4
**Status:** Fresh starter template, no features yet

---

## Development Guidelines

### Backend Commands
```bash
cd backend
python manage.py runserver          # Start server (localhost:8000)
python manage.py makemigrations     # Create migrations
python manage.py migrate            # Apply migrations
python manage.py createsuperuser    # Create admin user
```

### Native Commands
```bash
cd native
npm start                          # Expo dev server
npm run ios                        # iOS simulator
npm run android                    # Android emulator
npm run prebuild                   # Generate native dirs
```

### Prototype Commands
```bash
cd prototype
npm run dev                        # Vite dev server (localhost:5173)
npm run build                      # Production build
```

### API Base URLs
- Backend: `http://localhost:8000/api/`
- CORS enabled for: `localhost:3000`, `localhost:8081`

### Auth Header
```
Authorization: Token <token_value>
```

---

## Conversion Strategy: Prototype → Native

### Phase 1: Foundation
1. Set up navigation (React Navigation)
2. Create API client service
3. Implement auth context/store
4. Build base UI components

### Phase 2: Screens
1. **Idle/Home**: Logo + LoveEngine visualization
2. **Input**: Name + DOB form
3. **Blueprint**: Results display
4. **Scan**: Match discovery
5. **Profile**: User profile management
6. **Resonance**: Likes/matches list

### Phase 3: Features
1. Authentication flow (register/login)
2. Profile calculation & storage
3. Match scanning integration
4. Resonance system
5. Push notifications (future)

### Component Mapping

| Prototype | Native Equivalent |
|-----------|-------------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| Tailwind classes | StyleSheet or NativeWind |
| WebGL shaders | expo-gl with GLSL |
| CSS animations | react-native-reanimated |

### Color Palette
```typescript
const colors = {
  bgDeep: '#0c0a1d',
  bgMid: '#1a1533',
  textPrimary: 'rgba(255,255,255,0.95)',
  textSecondary: 'rgba(255,255,255,0.7)',
  textDim: 'rgba(255,255,255,0.5)',
  accentPink: '#ff6b9d',
  accentPurple: '#9d4edd',
};
```

---

## Skills Reference

### Skill: Create API Client
```typescript
// services/api.ts
const API_BASE = 'http://localhost:8000/api';

export const api = {
  auth: {
    register: (data) => fetch(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
    login: (email, password) => fetch(`${API_BASE}/auth/login`, { method: 'POST', body: JSON.stringify({email, password}) }),
    logout: (token) => fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: { Authorization: `Token ${token}` } }),
  },
  profile: {
    me: (token) => fetch(`${API_BASE}/profile/me`, { headers: { Authorization: `Token ${token}` } }),
    calculate: (data) => fetch(`${API_BASE}/profile/calculate`, { method: 'POST', body: JSON.stringify(data) }),
  },
  match: {
    scan: (token, params) => fetch(`${API_BASE}/match/scan`, { method: 'POST', headers: { Authorization: `Token ${token}` }, body: JSON.stringify(params) }),
  },
  resonance: {
    resonate: (token, targetUserId) => fetch(`${API_BASE}/resonance/resonate`, { method: 'POST', headers: { Authorization: `Token ${token}` }, body: JSON.stringify({ target_user_id: targetUserId }) }),
    mutual: (token) => fetch(`${API_BASE}/resonance/mutual`, { headers: { Authorization: `Token ${token}` } }),
  },
};
```

### Skill: Auth Context Pattern
```typescript
// contexts/AuthContext.tsx
interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState<AuthState>({ token: null, user: null, isLoading: true });

  // Load token from SecureStore on mount
  // Provide login/logout/register functions

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
```

### Skill: Numerology Types
```typescript
interface NumerologyProfile {
  lifePath: number;       // 1-9, 11, 22, 33
  dayNumber: number;      // 1-9
  monthNumber: number;    // 1-12
  cycleNumber: number;    // Current year cycle
  soulUrge: number | null;
  expression: number | null;
  challenge: number | null;
}

interface ZodiacProfile {
  animal: string;
  element: string;
  position: number;       // 1-12
}

interface CompatibilityResult {
  totalScore: number;     // 0-100
  matchType: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  axes: {
    structure: number;
    dynamics: number;
    culture: number;
    affinity: number;
    time: number;
  };
  headline: string;
  description: string;
}
```

---

## File Quick Reference

### Backend Key Files
- `backend/numeros/settings.py` - Django config
- `backend/numeros/urls.py` - Main URL routing
- `backend/users/models.py` - User model
- `backend/users/views.py` - Auth/profile endpoints
- `backend/matching/compatibility.py` - 5-axis engine
- `backend/matching/numerology.py` - Number calculations
- `backend/matching/zodiac.py` - Zodiac calculations

### Prototype Key Files
- `prototype/src/App.tsx` - Main app (3 screens)
- `prototype/src/components/LoveEngine.tsx` - Circular viz
- `prototype/src/components/Blueprint.tsx` - Results grid
- `prototype/src/lib/numerology.ts` - Client calculations
- `prototype/src/lib/shaders.ts` - GLSL shaders

### Native Key Files
- `native/App.tsx` - Current main app
- `native/index.js` - Entry point
- `native/package.json` - Dependencies

---

*Last updated: 2026-01-22*
