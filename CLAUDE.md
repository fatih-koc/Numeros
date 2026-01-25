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

#### SplashScreen.tsx
- Initial app screen with logo and breathing text
- **Logo animation**: Scale 0.95→1 with 400ms easeOut
- **Text animation**: "Aligning energies..." with breathing opacity cycle (0.8→0.4→0.8)
- Auto-navigates to Idle screen after 2 seconds
- Uses ScreenWrapper for consistent background

#### YourDayPreviewScreen.tsx
- Daily numerology forecast with shareable card
- **Three card styles**: Numbers, Stars, Combined (swipeable)
- Universal day number calculation (reduces date to single digit)
- Energy data with color and glow for each day number (1-9)
- **Swipe gestures**: PanResponder for card style navigation
- Save and Share buttons (native Share API)
- Close button to return to Blueprint

#### SoftGateScreen.tsx
- Account creation prompt after Blueprint
- Glossy elevated container with blur backdrop
- User's name and zodiac sign display
- **4-column number grid**: Life, Soul, Expression, Personality with colors
- "Souls Awaiting Resonance" section with 2x2 mock profile grid
- Profile cards show numerology numbers overlay
- Social proof text: "12,847 resonances today"
- "Create Account" primary button + "Skip and explore" link

#### LoveEngine.tsx
- Rotating number track (1-9) with counter-rotation to keep numbers upright
- **Reanimated-driven animation** via SharedValues from EngineContext
- Sigils with Skia (Circle, Triangle, Diamond shapes) with opacity derived from `currentPhase`
- Shader switching via `useDerivedValue` for smooth phase transitions
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

#### ChartTabs.tsx
- Tab navigation between "Your Numbers" and "Your Stars"
- FadeIn animation (800ms) on tab content switch
- Animated tab indicator
- Wraps Blueprint and Stars components

#### Stars.tsx
- **Chart level-based layouts:**
  - Level 1-2: Single column with section headers (Luminaries, Personal, Social)
  - Level 3: Bento grid layout with larger Sun/Moon cards
  - Level 4: Advanced bento with FlippableAngleCard for Ascendant/Midheaven
- Chart level indicator with colored icons (◔ ◑ ◕ ●)
- Upgrade prompts for incomplete charts
- FadeIn entrance animation (800ms)

#### FlippablePlanetCard.tsx
- 3D flip animation using Reanimated
- `perspective: 1000`, `rotateY`, `backfaceVisibility: 'hidden'`
- 600ms animation with `Easing.bezier(0.215, 0.61, 0.355, 1)`
- Front face: planet symbol (Astronomicon), name, sign, degree, house
- Back face: planet meaning, sign meaning with gradient background
- **Fixed heights** for consistent row alignment:
  - small: 160px
  - medium: 180px
  - large: 220px
- Uses Astronomicon font for astrological symbols

#### FlippableAngleCard.tsx
- 3D flip animation for Ascendant/Midheaven angles
- Same animation specs as FlippablePlanetCard
- Front: angle symbol, name, zodiac sign, degree
- Back: element/quality info, angle meaning, zodiac meaning
- **Fixed height: 140px** for consistent layout
- Green accent color (#10B981)

#### InputForm.tsx
- Two-step form: Name (step 1) → Birth data (step 2)
- Animated focus states on inputs (border color + shadow glow)
- 300ms easeInOutQuart transitions
- **Text inputs** for date (DD.MM.YYYY format) and time (HH:MM format)
- Auto-formatting functions for date and time inputs
- Button press animation (scale 0.98)
- City lookup for birth place coordinates

#### Particles.tsx
- 25 floating particles with staggered animations
- Bottom-to-top translation with opacity fade

#### ShaderCanvas.tsx
- 5 GLSL shaders via Skia RuntimeEffect
- **Dynamic shader switching** via SharedValue `shaderId`
- All shaders rendered with opacity groups for smooth UI-thread transitions
- No re-renders needed for shader changes

#### ScreenWrapper.tsx
- Common wrapper with Background and Particles
- SafeAreaView handling

### Fonts

**Custom fonts loaded via expo-font:**
- `fonts.serif` - Cormorant Garamond (body text)
- `fonts.mono` - Letter Gothic Std (labels, technical)
- `fonts.symbols` - Astronomicon (astrological symbols)

**Astronomicon Glyph Mapping:**
```
Planets: Q=Sun, R=Moon, S=Mercury, T=Venus, U=Mars, V=Jupiter, W=Saturn
Zodiac:  A=Aries, B=Taurus, C=Gemini, D=Cancer, E=Leo, F=Virgo,
         G=Libra, H=Scorpio, I=Sagittarius, J=Capricorn, K=Aquarius, L=Pisces
Angles:  c=Ascendant, d=Midheaven, e=IC, f=Descendant
```

### Typography Standards

**App-wide font sizing:**
| Category | Size | Used For |
|----------|------|----------|
| Label (mono) | 14 | Section titles, form labels, step indicators |
| Main text (serif) | 17 | Primary content, status text |
| Sub text (serif) | 16 | Descriptions, meanings, hints |
| Button (mono) | 15 | All button text |

### Animation Standards

**Easing Functions:**
- `Easing.bezier(0.77, 0, 0.175, 1)` - easeInOutQuart (main transitions)
- `Easing.bezier(0.215, 0.61, 0.355, 1)` - easeOutCubic (flip animations)

**Durations:**
- Tile expand/collapse: 700ms
- Tab content fade: 800ms
- Card flip: 600ms
- Entrance animations: 600ms
- Focus states: 300ms
- Button press: 100ms in, 200ms out
- Extraction phase: 2000ms per phase
- Intensity ramp: 1500ms
- Result display: 1500ms

---

## EngineContext - Reanimated Orchestration

**Location:** `src/contexts/EngineContext.tsx`

The engine uses **Reanimated SharedValues** for UI-thread animation orchestration instead of JS-thread setTimeout.

### Shared Values (UI Thread)
```typescript
extractionProgress: SharedValue<number>  // 0→1 over full extraction
currentPhase: SharedValue<number>        // 0→1→2→3→4 via withSequence
intensity: SharedValue<number>           // 0→1 during final intensify
resultOpacity: SharedValue<number>       // Result number fade in
resultScale: SharedValue<number>         // Result number scale animation
```

### JS State
```typescript
engineState: { isCalculating, resultNumber, showResult }
statusText: string           // "Extracting Life Path...", etc.
subStatus: string            // "Reading your signature"
extractionParams: UserInput | null
idleButtonEnabled: boolean   // Visibility gate for BEGIN ALIGNMENT button
```

### Extraction Flow
1. `startExtraction()` kicks off `withSequence` + `withDelay` for phases
2. Each phase triggers `runOnJS(handlePhaseChange)` to update status text
3. `intensity` animation triggers `runOnJS(handleExtractionComplete)` on finish
4. Result is displayed, then `onComplete()` callback fades out and navigates

### Visibility Gate Pattern (Flicker Prevention)

**Problem:** Button flickers during navigation transitions due to React lifecycle.

**Solution:** Context-level `idleButtonEnabled` boolean that:
- Defaults to `false` (button hidden)
- Only set `true` via `enableIdleButton()` in effects
- Set `false` on blur cleanup and in `resetEngine()`

**IdleScreen uses refs to avoid stale closures:**
```typescript
const isExtractingRef = useRef(false)

// Set in render phase BEFORE hooks run
if (extractionParams && !isExtractingRef.current) {
  isExtractingRef.current = true
}

useFocusEffect(() => {
  if (!isExtractingRef.current) {
    resetEngine()
    enableIdleButton()
  }
  return () => {
    disableIdleButton()
    isExtractingRef.current = false
  }
})
```

**Why this is flicker-proof:**
1. Initial mount: `idleButtonEnabled=false` → hidden
2. Effect runs: `enableIdleButton()` → shows with FadeIn
3. Navigate away: cleanup runs → hidden
4. Navigate back: first render sees `false` → hidden
5. Effect runs: cycle repeats

---

## File Structure

```
native/
├── App.tsx                         # Navigation setup
├── src/
│   ├── components/
│   │   ├── Background.tsx          # Skia gradient + noise
│   │   ├── Blueprint.tsx           # Numerology results grid
│   │   ├── ChartTabs.tsx           # Tab navigation (Numbers/Stars)
│   │   ├── FlippableAngleCard.tsx  # 3D flip for angles
│   │   ├── FlippablePlanetCard.tsx # 3D flip for planets
│   │   ├── InputForm.tsx           # Name + DOB with native pickers
│   │   ├── LoveEngine.tsx          # Circular visualization
│   │   ├── Particles.tsx           # Floating particles
│   │   ├── ScreenWrapper.tsx       # Common screen wrapper
│   │   ├── ShaderCanvas.tsx        # WebGL shaders with dynamic switching
│   │   ├── Stars.tsx               # Astrology chart display
│   │   └── index.ts
│   ├── contexts/
│   │   ├── EngineContext.tsx       # Reanimated-orchestrated extraction
│   │   └── NumerologyContext.tsx   # Scan output state
│   ├── lib/
│   │   ├── cities.ts               # City lookup for coordinates
│   │   ├── colors.ts               # Color palette
│   │   ├── fonts.ts                # Font definitions
│   │   ├── generateScan.ts         # Generate scan output
│   │   ├── numerology.ts           # Numerology calculations
│   │   ├── planetMeanings.ts       # Planet/zodiac data & symbols
│   │   ├── scanOutput.ts           # Type definitions
│   │   └── index.ts
│   ├── screens/
│   │   ├── SplashScreen.tsx        # Initial splash with logo animation
│   │   ├── IdleScreen.tsx          # Main idle screen with LoveEngine
│   │   ├── InputScreen.tsx         # Input form screen
│   │   ├── BlueprintScreen.tsx     # Results screen with ChartTabs
│   │   ├── YourDayPreviewScreen.tsx # Daily forecast shareable card
│   │   └── SoftGateScreen.tsx      # Account creation prompt
│   └── types/
│       └── webgl.d.ts
├── assets/
│   ├── fonts/
│   │   ├── Astronomicon.ttf        # Astrological symbols
│   │   ├── CormorantGaramond-*.ttf # Serif font (Light, LightItalic, Regular, Italic)
│   │   └── JetBrainsMono-*.ttf     # Mono font (Regular, Italic, Medium, SemiBold)
│   └── images/
└── ios/, android/                   # Native projects
```

### Color Palette (lib/colors.ts)

```typescript
export const colors = {
  bgDeep: '#0c0a1d',
  bgMid: '#1a1533',
  textPrimary: 'rgba(255, 255, 255, 0.95)',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textDim: 'rgba(255, 255, 255, 0.3)',
  accentViolet: '#8B5CF6',
  accentPink: '#EC4899',
  accentIndigo: '#6366F1',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderActive: 'rgba(139, 92, 246, 0.5)',
  buttonBg: 'rgba(139, 92, 246, 0.15)',
}

export const energyColors: Record<number, string> = {
  1: '#DC2626', 2: '#F472B6', 3: '#F59E0B', 4: '#10B981',
  5: '#06B6D4', 6: '#FBBF24', 7: '#6366F1', 8: '#8B5CF6', 9: '#F5F5F5',
}

export const sigilColors = {
  life_path: '#6366F1',   // Indigo - Circle
  soul_urge: '#F59E0B',   // Orange - Triangle
  expression: '#10B981',  // Green - Square
  personality: '#F472B6', // Pink - Diamond
}
```

### Planet Colors (lib/planetMeanings.ts)

```typescript
export const PLANET_COLORS: Record<string, string> = {
  sun: '#FFD700', moon: '#C0C0C0', mercury: '#87CEEB',
  venus: '#FFB6C1', mars: '#FF4500', jupiter: '#FFA500', saturn: '#8B4513',
}

export const ZODIAC_COLORS: Record<string, string> = {
  Aries: '#FF4136', Taurus: '#2ECC40', Gemini: '#FFDC00', Cancer: '#C0C0C0',
  Leo: '#FF851B', Virgo: '#3D9970', Libra: '#F012BE', Scorpio: '#85144b',
  Sagittarius: '#B10DC9', Capricorn: '#654321', Aquarius: '#0074D9', Pisces: '#7FDBFF',
}
```

### Still Missing / TODO

- [ ] API client integration with backend
- [ ] Auth context with SecureStore
- [ ] Scan screen (match discovery)
- [ ] Profile screen
- [ ] Resonance screen (likes/matches)
- [ ] Push notifications
- [ ] Offline mode / caching

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
- `src/App.tsx` - Main orchestrator with screen state
- `src/components/LoveEngine.tsx` - Circular visualization with shaders
- `src/components/Blueprint.tsx` - Numerology results
- `src/components/Stars.tsx` - Astrology chart with level-based layouts
- `src/components/ChartTabs.tsx` - Tab navigation
- `src/components/FlippablePlanetCard.tsx` - 3D flip card for planets
- `src/components/InputForm.tsx` - Name + DOB form
- `src/lib/generateScan.ts` - Unified scan output generator
- `src/lib/scanOutput.ts` - Type definitions
- `src/lib/planetMeanings.ts` - Planet/sign data

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
| `grid-cols-N` | `flexDirection: 'row'` with flex children |
| `animation: fadeIn` | `entering={FadeIn.duration(800)}` |

### Skia vs SVG

Prefer **Skia Canvas** for:
- Complex gradients (multi-stop radial)
- Blur/glow effects
- Noise textures
- Runtime shaders

Use **react-native-svg** only for:
- Simple static patterns (like blueprint grid)

### React Native Specifics

- Use `@react-native-community/datetimepicker` for native date/time pickers
- Use `expo-linear-gradient` for simple linear gradients
- Use `react-native-reanimated` for all animations
- Always use `StyleSheet.create()` for styles
- Use `Pressable` instead of `TouchableOpacity` for better customization

### Reanimated Best Practices

- Use `SharedValue` for UI-thread animations
- Use `useDerivedValue` for computed animation values
- Use `runOnJS` sparingly for JS-thread callbacks
- Avoid mixing refs with worklet callbacks (causes "modified key" error)
- Split `useFocusEffect` hooks: one for JS logic, one for SharedValue updates

---

## Known Issues & Solutions

### Button Flicker on Navigation
**Problem:** BEGIN ALIGNMENT button flickers during screen transitions.
**Cause:** React renders before effects run, and React Navigation keeps screens mounted.
**Solution:** Context-level visibility gate (`idleButtonEnabled`) + ref-based extraction tracking.

### Reanimated "Modified Key" Error
**Problem:** `Tried to modify key 'current' of an object which has been passed to a worklet`
**Cause:** Assigning to `.current` of a ref that's read in a worklet-associated callback.
**Solution:** Don't mix refs with SharedValue access in the same callback. Split into separate effects.

---

*Last updated: 2026-01-24*
