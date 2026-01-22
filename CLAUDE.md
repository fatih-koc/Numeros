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

## Native App Implementation Status (React Native/Expo)

**Location:** `/apps/native`
**Stack:** Expo 52, React Native 0.76, TypeScript
**Animations:** react-native-reanimated 3.16
**Graphics:** @shopify/react-native-skia, expo-gl

### ✅ Completed Components

#### Background.tsx
- **Skia Canvas** for all rendering (no SVG)
- LinearGradient: bgDeep → bgMid → bgDeep
- RadialGradient glows: violet (center), pink (top-left), indigo (bottom-right)
- Noise texture overlay: 0.02 alpha, multiply blend mode

#### LoveEngine.tsx
- Rotating number track (1-9) with counter-rotation to keep numbers upright
- Shader canvas with 5 phase-based shaders
- Sigils with Skia (Circle, Triangle, Diamond shapes)
- Inner core with 4-stop radial gradient
- Bond sigil scale 0.8
- Glow radii: 15-20px blur on sigils, 20px on active numbers, 40px on result

#### Blueprint.tsx
- 2x2 tile grid with expand/collapse animation
- **Animation**: 700ms easeInOutQuart `Easing.bezier(0.77, 0, 0.175, 1)`
- Height-animated subtitle and details (collapse to 0 when not expanded)
- Blueprint grid background (SVG pattern, 24×24px)
- Close button with fade-in animation
- "Tap to expand" hint text
- Title: "Your num*Eros* Signature"

#### InputForm.tsx
- Animated focus states on inputs (border color + shadow glow)
- 300ms easeInOutQuart transitions
- Button press animation (scale 0.98)
- iOS date picker with "Done" button

#### Particles.tsx
- 25 floating particles with staggered animations
- Bottom-to-top translation with opacity fade

#### ShaderCanvas.tsx
- 5 GLSL shaders via Skia RuntimeEffect
- Phase-based shader selection during calculation

### Animation Standards

**Easing:** `Easing.bezier(0.77, 0, 0.175, 1)` (easeInOutQuart)
**Durations:**
- Tile expand/collapse: 700ms
- Entrance animations: 600ms
- Focus states: 300ms
- Button press: 100ms in, 200ms out

### File Structure

```
native/
├── App.tsx                    # Main orchestrator
├── src/
│   ├── components/
│   │   ├── Background.tsx     # Skia gradient + noise
│   │   ├── Blueprint.tsx      # Results grid with expand
│   │   ├── InputForm.tsx      # Name + DOB with focus states
│   │   ├── LoveEngine.tsx     # Circular visualization
│   │   ├── Particles.tsx      # Floating particles
│   │   ├── ShaderCanvas.tsx   # WebGL shaders
│   │   └── index.ts
│   ├── lib/
│   │   ├── colors.ts          # Color palette
│   │   ├── fonts.ts           # Font definitions
│   │   ├── numerology.ts      # Calculations
│   │   └── index.ts
│   └── types/
│       └── webgl.d.ts
├── assets/
│   ├── fonts/                 # Garamond, Letter Gothic, Astronomicon
│   └── images/
└── ios/, android/             # Native projects
```

### Color Palette (lib/colors.ts)

```typescript
export const colors = {
  bgDeep: '#0c0a1d',
  bgMid: '#1a1533',
  textPrimary: 'rgba(255, 255, 255, 0.95)',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textDim: 'rgba(255, 255, 255, 0.5)',
  accentViolet: '#8B5CF6',
  accentPink: '#EC4899',
  borderLight: 'rgba(255, 255, 255, 0.1)',
}

export const sigilColors = {
  core: '#6366f1',
  desire: '#f59e0b',
  bond: '#10b981',
  friction: '#f472b6',
}
```

### Still Missing

- Navigation (React Navigation)
- API client integration
- Auth context with SecureStore
- Scan screen (match discovery)
- Profile screen
- Resonance screen (likes/matches)

---

## Backend (Django)

**Location:** `/apps/backend`
**Framework:** Django 4.2+ with Django REST Framework
**Database:** SQLite (dev) / PostgreSQL (prod)
**Auth:** Token-based (DRF TokenAuthentication)

### API Endpoints

**Auth:**
- `POST /api/auth/register` - Register with auto-calculated numerology
- `POST /api/auth/login` - Returns token
- `POST /api/auth/logout` - Deletes token

**Profile:**
- `GET /api/profile/me` - Full user profile
- `PUT /api/profile/me` - Update profile
- `POST /api/profile/calculate` - Calculate numerology without account

**Matching:**
- `POST /api/match/scan` - Scan for matches
- `POST /api/match/evaluate` - Evaluate specific user compatibility

**Resonance:**
- `POST /api/resonance/resonate` - Like a user
- `POST /api/resonance/decline` - Decline a user
- `GET /api/resonance/mutual` - Mutual matches only

---

## Prototype (React/Vite) - SOURCE

**Location:** `/apps/prototype`
**Stack:** React 18, Vite, TypeScript, Tailwind CSS 4

### Key Files
- `src/components/App.tsx` - Main orchestrator
- `src/components/LoveEngine.tsx` - Circular visualization
- `src/components/Blueprint.tsx` - Results grid
- `src/components/InputForm.tsx` - Name + DOB form
- `src/lib/numerology.ts` - Client calculations
- `src/lib/shaders.ts` - GLSL shaders

---

## Development Commands

### Native
```bash
cd native
npm start          # Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npx tsc --noEmit   # TypeScript check
```

### Prototype
```bash
cd prototype
npm run dev        # Vite dev server (localhost:5173)
```

### Backend
```bash
cd backend
python manage.py runserver  # localhost:8000
```

---

## Conversion Notes

### CSS → React Native Mapping

| CSS Property | React Native |
|--------------|--------------|
| `transition: all 0.7s cubic-bezier(...)` | `withTiming(value, { duration: 700, easing: Easing.bezier(...) })` |
| `opacity: 0` with conditional render | Always render, animate opacity to 0 |
| `height: auto` expanding | Animate height/maxHeight with interpolate |
| `box-shadow` | `shadowColor`, `shadowRadius`, `shadowOpacity` (iOS) or Skia BlurMask |
| `background: radial-gradient(...)` | Skia RadialGradient |
| `filter: blur(...)` | Skia BlurMask |

### Skia vs SVG

Prefer **Skia Canvas** for:
- Complex gradients (multi-stop radial)
- Blur/glow effects
- Noise textures
- Runtime shaders

Use **react-native-svg** only for:
- Simple static patterns (like blueprint grid)

---

*Last updated: 2026-01-22*
