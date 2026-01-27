# Numeros Marketing Site — Figma Design Prompt

> **Purpose:** This document provides page-by-page design specifications for the Numeros marketing website, intended for use with Figma Make. Each section details layout structure, visual components, typography, motion hints, and asset guidance.

**Primary Goal:** Drive email capture through free Numerology & Astrology calculations. Users get their cosmic blueprint without creating an account — just provide email + birth data.

**Monetization:** Free app on App Store & Play Store. No pricing page needed.

---

## Global Design System

### Color Palette

```
Background
  bgDeep:       #0c0a1d    — Primary dark background
  bgMid:        #1a1533    — Secondary/section backgrounds
  bgLight:      #2a2347    — Card backgrounds, elevated surfaces

Text
  textPrimary:  rgba(255, 255, 255, 0.95)  — Headlines, primary copy
  textSecondary: rgba(255, 255, 255, 0.6)  — Body text, descriptions
  textDim:      rgba(255, 255, 255, 0.3)   — Captions, tertiary info

Accent Colors
  accentViolet: #8B5CF6    — Primary CTA, interactive elements
  accentPink:   #EC4899    — Secondary accent, highlights
  accentIndigo: #6366F1    — Links, tertiary actions
  accentGold:   #F59E0B    — Premium indicators

Numerology Number Colors (Core 4)
  lifePath:     #F59E0B    — Orange (Circle sigil)
  soulUrge:     #06B6D4    — Cyan (Triangle sigil)
  expression:   #10B981    — Green (Square sigil)
  personality:  #F472B6    — Pink (Diamond sigil)

Energy Colors (Numbers 1-9)
  1: #DC2626  2: #F472B6  3: #F59E0B  4: #10B981
  5: #06B6D4  6: #FBBF24  7: #6366F1  8: #8B5CF6  9: #F5F5F5

Borders & Effects
  borderLight:  rgba(255, 255, 255, 0.1)
  borderActive: rgba(139, 92, 246, 0.5)
  glowViolet:   0 0 40px rgba(139, 92, 246, 0.4)
  glowPink:     0 0 40px rgba(236, 72, 153, 0.3)
```

### Typography

| Role | Font | Weight | Size Range | Usage |
|------|------|--------|------------|-------|
| Display | Cormorant Garamond | Light (300) | 48–72px | Hero headlines |
| Heading | Cormorant Garamond | Regular (400) | 32–40px | Section titles |
| Subheading | Cormorant Garamond | Regular (400) | 24–28px | Card titles, feature names |
| Body | Cormorant Garamond | Light (300) | 17–18px | Paragraphs, descriptions |
| Label | JetBrains Mono | Medium (500) | 12–14px | Section labels, tags, metadata |
| Button | JetBrains Mono | SemiBold (600) | 14–16px | CTA buttons |
| Caption | JetBrains Mono | Regular (400) | 11–12px | Footnotes, timestamps |
| Symbols | Astronomicon | Regular | Variable | Astrological glyphs only |

**Line Heights:**
- Display/Heading: 1.1–1.2
- Body: 1.5–1.6
- Labels: 1.3

**Letter Spacing:**
- Mono labels: +0.05em (tracking-wide)
- Serif body: 0 (normal)

### Spacing System

```
Base unit: 4px

Micro:   4px   (element padding, icon gaps)
Small:   8px   (tight spacing)
Medium:  16px  (card padding, list gaps)
Large:   24px  (section content padding)
XL:      40px  (between sections)
XXL:     80px  (major section breaks)
Hero:    120px (above-fold breathing room)
```

### Component Patterns

**Cards**
- Background: bgMid or bgLight with 1px borderLight
- Border radius: 12px (standard), 16px (featured)
- Padding: 24px internal
- Hover: borderActive glow, subtle scale(1.02)

**Buttons**
- Primary: accentViolet bg, white text, 12px radius
- Secondary: transparent bg, borderLight, white text
- Hover: brightness(1.1), subtle glow
- Active: scale(0.98)

**Glassmorphism**
- Background: rgba(26, 21, 51, 0.6)
- Backdrop blur: 20px
- Border: 1px rgba(255, 255, 255, 0.1)

**Gradients**
- Hero gradient: radial from center, accentViolet 0% → bgDeep 100%
- Section divider: linear bgDeep → bgMid → bgDeep

---

## Page 1: Home (Primary Lead Capture)

### Purpose
Convert visitors into email leads through free Numerology/Astrology calculations. The calculation is the product — give value first, capture email for delivery.

### Target User Mindset
- Curious about numerology/astrology
- Wants instant gratification (see their numbers)
- Willing to provide email for personalized results
- May download app later for matching features

### Section Breakdown

#### 1.1 Hero Section — Interactive Calculator

**Layout:** Full viewport height, split layout (content left, calculator right on desktop; stacked on mobile)

**Content (Left):**
- Mono label (12px): `COSMIC BLUEPRINT`
- Display headline (64px): "Discover your numbers."
- Body subhead (18px): "Enter your birth data to reveal your numerology blueprint and astrological chart — free, instant, no account needed."
- Trust indicators below: "Calculated using Swiss Ephemeris" • "Same inputs = same results"

**Calculator Form (Right):**
- Glassmorphism card with form:
  - Email input (required): "your@email.com"
  - Name input: "Your full name"
  - Birth date picker: "DD.MM.YYYY"
  - Birth time (optional): "HH:MM" with note "For precise Moon & rising sign"
  - Birth city (optional): Autocomplete city lookup
- Primary CTA: "Calculate My Blueprint"
- Privacy note: "Your data stays private. We email your results once."

**Visual:**
- Animated LoveEngine orb behind/beside the form
- Subtle particle drift
- Form fields have focus glow animation

**Motion Notes:**
- Form fields glow accentViolet on focus
- Submit button pulses subtly
- On submit: transition to extraction animation

**API Integration:**
```
POST /api/v1/profile/calculate/
{
  "name": "Jane Doe",
  "birth_date": "1990-05-15",
  "birth_time": "14:30",        // optional
  "latitude": 40.7128,          // optional (from city)
  "longitude": -74.0060         // optional
}

Response:
{
  "chart_level": 4,
  "numerology": {
    "life_path": 3,
    "soul_urge": 7,
    "expression": 5,
    "personality": 9,
    "master_numbers": []
  },
  "astrology": {
    "sun": { "sign": "Taurus", "degree": 24.5 },
    "moon": { "sign": "Cancer", "degree": 12.3 },
    "ascendant": { "sign": "Libra", "degree": 5.8 },
    ...
  }
}
```

#### 1.2 Live Extraction Experience (Post-Submit)

**Layout:** Full-screen takeover with centered content

**Visual:**
- Large (320px) animated extraction orb with layered shaders
- Status text rotating through phases
- Live feed showing pattern matches

**Status Messages (rotate every 2s):**
```
"Scanning for compatible energies..."
"Analyzing Life Path harmonics..."
"Checking Venus-Moon connections..."
"Filtering friction patterns..."
"Mapping Mars-Venus dynamics..."
"Finalizing resonance field..."
```

**Feed Items (stream at ~3/second):**
```
✓ "Life Path 3 × 5: Creative synergy..."
✓ "Venus △ Moon: Emotional harmony..."
✗ "Life Path 4 × 8: High friction..."
✗ "Moon □ Mars: Emotional clash..."
```

**Duration:** 12.5 seconds total, then reveal results

**Component: Extraction Orb**
- Two layered shaders with screen blend mode
- Base layer: Ether shader (mystical purple-pink volumetric)
- Overlay: Radar sweep effect
- Circular mask with edge softening

#### 1.3 Results Display (After Extraction)

**Layout:** Full results page with shareable cards

**Content:**
- Heading: "Your Cosmic Blueprint"
- Subhead: "[Name], here's what the universe encoded in your birth."

**Blueprint Grid (2×2):**
- Life Path tile (orange): Number + "The [Archetype]" + meaning
- Soul Urge tile (cyan): Number + desire description
- Expression tile (green): Number + talent description
- Personality tile (pink): Number + perception description

**Astrology Section (if chart_level > 1):**
- Sun sign card with degree
- Moon sign card with degree
- Rising sign card (if chart_level = 4)
- FlippablePlanetCard components for tap-to-reveal meanings

**CTAs:**
- "Download the App" (primary) → App store links
- "Share Your Blueprint" → Native share with generated card image
- "Calculate Another" → Reset form

**Email Confirmation:**
- "We've sent your full results to [email]"

#### 1.4 Value Proposition (Below Results or Scroll Section)

**Layout:** 3-column grid

**Column 1 — Your Numbers**
- Icon: 4-number sigil grid
- Heading: "Numerology Blueprint"
- Body: "Four core numbers derived from your name and birth date reveal your life path, inner desires, natural talents, and how others perceive you."

**Column 2 — Your Stars**
- Icon: Birth chart wheel
- Heading: "Astrological Chart"
- Body: "Precise planetary positions at your birth moment, calculated with Swiss Ephemeris — the same engine used by professional astrologers."

**Column 3 — Your Matches**
- Icon: Two overlapping circles with heart
- Heading: "Cosmic Compatibility"
- Body: "When you're ready, scan for others whose numbers and stars align with yours. Available in the Numeros app."

#### 1.5 Social Proof

**Layout:** Centered testimonials + stat bar

**Content:**
- Stat: "127,439 blueprints calculated"
- Testimonial cards (2-3)
- App store ratings (placeholder)

#### 1.6 App Download CTA

**Layout:** Full-width gradient section

**Content:**
- Heading: "Ready to find your resonance?"
- Body: "Your blueprint is just the beginning. Download Numeros to discover who aligns with your cosmic signature."
- App Store / Play Store badges
- QR code for quick download

---

## Page 2: Numerology Deep Dive

### Purpose
Educational content about numerology system. SEO-focused. Secondary lead capture.

### Target User Mindset
- Researching numerology
- Wants to understand the system
- May have searched "life path number calculator"

### Section Breakdown

#### 2.1 Hero

**Content:**
- Mono label: `NUMEROLOGY`
- Heading: "The science of your numbers"
- Body: "Your name and birth date encode four fundamental numbers that define your cosmic blueprint. Learn what each one means."
- Inline calculator CTA: "Calculate yours free →"

#### 2.2 The Four Core Numbers

**Layout:** Vertical sections, one per number type

**Life Path (#F59E0B)**
- Sigil: Circle
- Heading: "Life Path Number"
- Calculation method: "Reduce your full birth date (day + month + year) to a single digit."
- Example: "May 15, 1990 → 5+1+5+1+9+9+0 = 30 → 3+0 = 3"
- Meaning: "Your soul's journey and life purpose"

**Number Meanings Grid (1-9 + master numbers):**
| Number | Archetype | Description |
|--------|-----------|-------------|
| 1 | The Independent Leader | Pioneer, innovator, self-starter |
| 2 | The Sensitive Mediator | Peacemaker, partner, intuitive |
| 3 | The Creative Expresser | Artist, communicator, optimist |
| 4 | The Stable Builder | Organizer, hard worker, loyal |
| 5 | The Free Spirit | Adventurer, versatile, dynamic |
| 6 | The Nurturing Lover | Caregiver, responsible, harmonious |
| 7 | The Deep Seeker | Analyst, spiritual, introspective |
| 8 | The Powerful Achiever | Ambitious, authoritative, wealthy |
| 9 | The Universal Healer | Humanitarian, wise, compassionate |
| 11 | The Illuminated Visionary | Master intuitive (not reduced) |
| 22 | The Master Builder | Master manifester (not reduced) |
| 33 | The Master Teacher | Master healer (not reduced) |

**Soul Urge (#06B6D4)**
- Sigil: Triangle
- Heading: "Soul Urge Number"
- Calculation: "Sum the vowels (A, E, I, O, U) in your full name."
- Letter values table:
  ```
  A=1  E=5  I=9  O=6  U=3
  ```
- Meaning: "Your inner desires and spiritual motivations"

**Expression (#10B981)**
- Sigil: Square
- Heading: "Expression Number"
- Calculation: "Sum ALL letters in your full name using Pythagorean values."
- Letter values table (full):
  ```
  A=1 B=2 C=3 D=4 E=5 F=6 G=7 H=8 I=9
  J=1 K=2 L=3 M=4 N=5 O=6 P=7 Q=8 R=9
  S=1 T=2 U=3 V=4 W=5 X=6 Y=7 Z=8
  ```
- Meaning: "Your natural talents and abilities"

**Personality (#F472B6)**
- Sigil: Diamond
- Heading: "Personality Number"
- Calculation: "Sum only the CONSONANTS in your full name."
- Meaning: "How others perceive you — your outer self"

#### 2.3 Calculation Engine

**Layout:** Code block style section (technical credibility)

**Content:**
- Heading: "Transparent. Reproducible. Deterministic."
- Body: "Our calculations use the Pythagorean system. Same inputs always produce same outputs. Here's the exact algorithm:"

**Code Example (Python/TypeScript side-by-side):**

```python
# Python (Backend)
LETTER_VALUES = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
}
VOWELS = {'a', 'e', 'i', 'o', 'u'}
MASTER_NUMBERS = {11, 22, 33}

def reduce_to_single(num: int, preserve_master=True) -> int:
    if preserve_master and num in MASTER_NUMBERS:
        return num
    while num > 9 and not (preserve_master and num in MASTER_NUMBERS):
        num = sum(int(d) for d in str(num))
    return num

def calculate_life_path(date_str: str) -> int:
    year, month, day = date_str.split('-')
    total = sum(int(d) for d in day) + sum(int(d) for d in month) + sum(int(d) for d in year)
    return reduce_to_single(total)
```

```typescript
// TypeScript (Mobile App)
const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
}
const VOWELS = ['a', 'e', 'i', 'o', 'u']
const MASTER_NUMBERS = [11, 22, 33]

function reduceToSingle(num: number, preserveMaster = true): number {
  if (preserveMaster && MASTER_NUMBERS.includes(num)) return num
  while (num > 9 && !(preserveMaster && MASTER_NUMBERS.includes(num))) {
    num = String(num).split('').reduce((a, b) => a + parseInt(b, 10), 0)
  }
  return num
}
```

#### 2.4 Interactive Calculator (Embedded)

**Layout:** Same as home hero calculator, but embedded mid-page

**Content:**
- "Try it yourself"
- Full calculator form
- Results display inline

---

## Page 3: Astrology Deep Dive

### Purpose
Educational content about astrology system. SEO-focused. Secondary lead capture.

### Target User Mindset
- Researching birth chart calculations
- Wants precise, professional-grade astrology
- Skeptical of generic horoscopes

### Section Breakdown

#### 3.1 Hero

**Content:**
- Mono label: `ASTROLOGY`
- Heading: "Your stars, precisely mapped"
- Body: "We use Swiss Ephemeris — the same engine powering professional astrological software — to calculate exact planetary positions at your birth moment."
- CTA: "Get your free chart →"

#### 3.2 Chart Levels

**Layout:** 4-step visual progression

**Content:**
- Heading: "Your chart grows with your data"

**Level 1 — Date Only (◔)**
- What you provide: Birth date
- What we calculate: Sun sign, approximate Moon
- Accuracy: "General energy profile"

**Level 2 — Date + Time (◑)**
- What you provide: Birth date + time
- What we calculate: All planets with precise degrees
- Accuracy: "Full planetary picture"

**Level 3 — Date + Location (◕)**
- What you provide: Birth date + city
- What we calculate: Localized positions
- Accuracy: "Geographic precision"

**Level 4 — Full Chart (●)**
- What you provide: Birth date + time + city
- What we calculate: Houses, Ascendant, Midheaven
- Accuracy: "Complete birth chart"

#### 3.3 The Planets

**Layout:** Grid of planet cards

**Planets covered:**
- Sun (☉) — Core identity, ego, life force
- Moon (☽) — Emotions, instincts, inner self
- Mercury (☿) — Communication, thinking, learning
- Venus (♀) — Love, beauty, values, attraction
- Mars (♂) — Action, desire, passion, drive
- Jupiter (♃) — Expansion, luck, philosophy
- Saturn (♄) — Structure, discipline, lessons

**Each card shows:**
- Planet glyph (Astronomicon font)
- Planet name
- What it represents
- Example: "Your Venus in Libra suggests..."

#### 3.4 The Zodiac Signs

**Layout:** 12-card grid or horizontal scroll

**Signs with colors:**
```
Aries (#FF4136) — Fire, Cardinal
Taurus (#2ECC40) — Earth, Fixed
Gemini (#FFDC00) — Air, Mutable
Cancer (#C0C0C0) — Water, Cardinal
Leo (#FF851B) — Fire, Fixed
Virgo (#3D9970) — Earth, Mutable
Libra (#F012BE) — Air, Cardinal
Scorpio (#85144b) — Water, Fixed
Sagittarius (#B10DC9) — Fire, Mutable
Capricorn (#654321) — Earth, Cardinal
Aquarius (#0074D9) — Air, Fixed
Pisces (#7FDBFF) — Water, Mutable
```

#### 3.5 Technical Credibility

**Layout:** Technical details block

**Content:**
- Heading: "Swiss Ephemeris precision"
- Body: "Our calculations use pyswisseph, the Python interface to Swiss Ephemeris — the gold standard for astronomical calculations, trusted by NASA for celestial mechanics."

**Code Example:**
```python
import swisseph as swe

def calculate_planet_position(planet_id: int, julian_day: float):
    """Calculate precise planetary position using Swiss Ephemeris."""
    flags = swe.FLG_SWIEPH | swe.FLG_SPEED
    result = swe.calc_ut(julian_day, planet_id, flags)
    longitude = result[0][0]

    # Convert longitude to zodiac sign
    sign_index = int(longitude / 30)
    degree_in_sign = longitude % 30

    signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
             'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

    return {
        'sign': signs[sign_index],
        'degree': round(degree_in_sign, 2),
        'longitude': longitude
    }
```

#### 3.6 Calculator CTA

**Content:**
- Heading: "See your chart"
- Embedded calculator or link to home page

---

## Page 4: Universe Scan (Core Experience)

### Purpose
Showcase the extraction ritual and matching system. Build desire for app download.

### Target User Mindset
- Already calculated their numbers
- Curious about the matching/dating aspect
- Wants to see the experience before downloading

### Section Breakdown

#### 4.1 Hero

**Content:**
- Mono label: `THE UNIVERSE SCAN`
- Heading: "12.5 seconds of cosmic revelation"
- Body: "The Universe Scan is your initiation into Numeros — an extraction ritual that analyzes your birth data across five phases to find your compatible matches."

**Visual:**
- Large (400px) extraction orb — static hero frame showing peak animation state
- Status text: "Analyzing Life Path harmonics..."

#### 4.2 The Extraction Ritual

**Layout:** Full-width immersive section with animated concept

**Shader Visualization:**

The extraction uses two layered Skia shaders rendered on a circular canvas:

**Layer 1: Ether Shader (Base Orb)**
```glsl
// Mystical volumetric purple-pink energy
uniform float2 iResolution;
uniform float iTime;

float2x2 m(float a) {
  float c = cos(a);
  float s = sin(a);
  return float2x2(c, -s, s, c);
}

float map(float3 p, float t) {
  p.xz = m(t * 0.4) * p.xz;
  p.xy = m(t * 0.3) * p.xy;
  float3 q = p * 2.0 + t;
  return length(p + float3(sin(t * 0.7))) * log(length(p) + 1.0)
         + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
}

half4 main(float2 fragCoord) {
  float t = iTime;
  float2 p = fragCoord.xy / min(iResolution.x, iResolution.y) - float2(0.9, 0.5);
  p.x += 0.4;

  float3 cl = float3(0.0);
  float d = 2.5;

  for(int i = 0; i <= 5; i++) {
    float3 p3d = float3(0.0, 0.0, 5.0) + normalize(float3(p, -1.0)) * d;
    float rz = map(p3d, t);
    float f = clamp((rz - map(p3d + 0.1, t)) * 0.5, -0.1, 1.0);

    // Purple-pink mystical palette
    float3 baseColor = float3(0.2, 0.1, 0.3) + float3(4.0, 1.5, 5.0) * f;
    cl = cl * baseColor + smoothstep(2.5, 0.0, rz) * 0.7 * baseColor;
    d += min(rz, 1.0);
  }

  // Circular mask with center dimming
  float2 center = iResolution * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float edge = smoothstep(radius, radius - 8.0, dist);
  float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);

  cl = clamp(cl, float3(0.0), float3(1.0));
  cl = mix(cl * 0.2, cl, centerDim);

  return half4(cl * edge, edge);
}
```

**Layer 2: Plasma Energy Overlay**
```glsl
// Dynamic plasma overlay with screen blend
uniform float2 iResolution;
uniform float iTime;

half4 main(float2 fragCoord) {
  float2 uv = (fragCoord * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

  float v = 0.0;
  float2 c = uv * float2(3.0, 3.0) - float2(20.0);

  v += sin((c.x + iTime));
  v += sin((c.y + iTime) / 2.0);
  v += sin((c.x + c.y + iTime) / 2.0);
  c += float2(sin(iTime / 3.0), cos(iTime / 2.0)) * 2.0;
  v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + iTime);
  v = v / 2.0;

  float3 col = float3(
    sin(v * 3.14159),
    sin(v * 3.14159 + 2.0 * 3.14159 / 3.0),
    sin(v * 3.14159 + 4.0 * 3.14159 / 3.0)
  ) * 0.5 + 0.5;

  // Purple-pink energy tint
  col = mix(col, float3(0.6, 0.2, 0.8), 0.4);

  // Circular mask
  float2 center = iResolution * 0.5;
  float dist = distance(fragCoord, center);
  float radius = min(iResolution.x, iResolution.y) * 0.5;
  float edge = smoothstep(radius, radius - 8.0, dist);
  float centerDim = smoothstep(radius * 0.0, radius * 0.4, dist);

  col = mix(col * 0.2, col, centerDim);

  return half4(col * edge, edge);
}
```

**Shader Rendering Setup (React Native):**
```typescript
// Shaders rendered via @shopify/react-native-skia
<Canvas style={{ width: 320, height: 320 }}>
  <Group clip={{ x: 0, y: 0, width: 320, height: 320 }}>
    {/* Base layer: Ether */}
    <Group opacity={1}>
      <Fill>
        <Shader source={etherSource} uniforms={{ iResolution: [320, 320], iTime: time }} />
      </Fill>
    </Group>

    {/* Overlay layer: Plasma with screen blend */}
    <Group opacity={0.5} blendMode="screen">
      <Fill>
        <Shader source={plasmaSource} uniforms={{ iResolution: [320, 320], iTime: time }} />
      </Fill>
    </Group>
  </Group>
</Canvas>
```

#### 4.3 Phase Breakdown

**Layout:** Vertical timeline

**Phases (2.5s each = 12.5s total):**

1. **Life Path Extraction (0:00–2:50)**
   - Status: "Extracting Life Path..."
   - Sub: "Reading your birth signature"
   - Visual: Number reduction animation concept

2. **Soul Urge Analysis (2:50–5:00)**
   - Status: "Analyzing Soul Urge..."
   - Sub: "Decoding your vowels"

3. **Expression Mapping (5:00–7:50)**
   - Status: "Mapping Expression..."
   - Sub: "Summing your letters"

4. **Personality Reading (7:50–10:00)**
   - Status: "Reading Personality..."
   - Sub: "Extracting consonants"

5. **Resonance Scan (10:00–12:50)**
   - Status: "Scanning for Resonance..."
   - Sub: "Finding compatible patterns"

#### 4.4 Live Feed Visualization

**Layout:** Feed mockup showing real-time pattern matching

**Feed Items:**
```
✓ "Life Path 3 × 5: Creative synergy..." (green)
✓ "Venus △ Moon: Emotional harmony..." (green)
✗ "Life Path 4 × 8: High friction..." (gray)
✗ "Moon □ Mars: Emotional clash..." (gray)
✓ "Soul Urge 7 × 7: Spiritual depth..." (green)
```

**Visual:**
- Mono font (11px)
- Green (#4DE680) for matches
- Gray (textSecondary) for rejections
- Items fade in from bottom, stack up
- Keep last 4-8 visible

#### 4.5 Post-Scan: Match Cards

**Layout:** 2×3 grid of match preview cards

**Each card shows:**
- Match percentage (large): "92%"
- Two compatibility reasons:
  - "Life Path 5 × 3"
  - "Venus △ Moon"
- Blurred photo placeholder
- Unlock timer: "3h 59m"

**CTA:** "Download to see your matches"

#### 4.6 Time-Gating Explainer

**Content:**
- Heading: "Quality over quantity"
- Body: "One scan per day. Matches unlock gradually. This isn't swiping — it's intentional discovery."
- Icon: Clock/timer

---

## Page 5: Verification & Trust

### Purpose
Address safety concerns. Explain verification system.

### Target User Mindset
- Cautious about online dating
- Wants real profiles
- Values privacy

### Section Breakdown

#### 5.1 Hero

**Content:**
- Mono label: `TRUST & SAFETY`
- Heading: "Real people. Real charts. Real connections."
- Body: "Every Numeros profile is verified. We authenticate identity while protecting your privacy."

**Visual:**
- Verification badge visual
- 8-pointed star geometric pattern

#### 5.2 Verification Flow

**Layout:** 3-step horizontal

**Step 1 — Calculate Your Matrix**
- "Complete your numerology with birth data"
- Visual: 4-number grid

**Step 2 — Seal Your Identity**
- "Verify via phone, email, or SSO"
- Visual: Phone/Email/Google icons
- Note: "Your contact is never shared"

**Step 3 — Earn Your Badge**
- "Verified badge visible to matches"
- Visual: Checkmark badge

#### 5.3 Privacy Commitments

**Layout:** 4-card grid

**Cards:**
1. "Your phone stays private" — Verified but never shared
2. "Birth location only" — Not your current location
3. "Your data, your control" — Download or delete anytime
4. "Enterprise security" — Bank-grade encryption

---

## Page 6: Features

### Purpose
Comprehensive feature overview for comparison shoppers.

### Section Breakdown

#### 6.1 Hero

**Content:**
- Mono label: `FEATURES`
- Heading: "Everything you need to find your resonance"

#### 6.2 Feature Grid (3×3)

**Row 1:**
- Universe Scan — Daily extraction ritual
- Blueprint — Interactive numerology display
- Birth Chart — Full astrological chart

**Row 2:**
- Resonance System — Like/pass with scoring
- Unlock Timers — Gradual match reveal
- Daily Forecast — Personalized numerology forecast

**Row 3:**
- Secure Chat — In-app messaging
- Match Details — Full compatibility breakdown
- Shareable Cards — Social-ready forecast images

#### 6.3 Deep Dives

**Blueprint Section:**
- 2×2 expandable tile grid
- Tap to reveal meanings
- 700ms easeInOutQuart animations

**Birth Chart Section:**
- FlippablePlanetCard components
- 3D flip animation (600ms)
- Front: planet + sign + degree
- Back: meaning text

**Compatibility Section:**
- Combined scoring: 60% numerology + 40% astrology
- Match type labels:
  - Twin Flame (90-100)
  - Magnetic Stability (75-89)
  - Passionate Tension (60-74)
  - Gentle Growth (45-59)
  - Karmic Lesson (0-44)

#### 6.4 Comparison Table

| Feature | Numeros | Swipe Apps |
|---------|---------|------------|
| Matching | Deterministic cosmic calculation | Black-box ML |
| Daily limits | 1 scan per day | Unlimited |
| Match explanations | Full breakdown | None |
| Verification | Multi-method | Basic |
| Focus | Long-term compatibility | Engagement |

---

## Page 7: Roadmap / Vision

### Purpose
Share product direction. Build excitement.

### Section Breakdown

#### 7.1 Hero

**Content:**
- Mono label: `ROADMAP`
- Heading: "The future of cosmic connection"

#### 7.2 Philosophy Quote

**Layout:** Large centered quote

**Content:**
- "We believe compatibility is not random — it's cosmic. Our mission is to reveal the invisible threads that connect resonant souls."

#### 7.3 Timeline

**Q1 2026 — Foundation (Complete)**
- Core numerology engine
- Birth chart integration (Swiss Ephemeris)
- Universe Scan ritual
- iOS/Android apps

**Q2 2026 — Enhancement**
- Synastry charts (two-chart comparison)
- Transit forecasts
- Enhanced matching weights

**Q3 2026 — Social**
- Friend numerology comparison
- Group compatibility
- Community features

**Q4 2026 — Premium**
- Astrologer consultations
- Annual forecast reports
- Relationship coaching

#### 7.4 Values

**3-column:**
- Transparency — Show our work
- Intentionality — Quality over quantity
- Respect — No manipulation

---

## Page 8: About / Philosophy

### Purpose
Brand story. Emotional connection.

### Section Breakdown

#### 8.1 Hero

**Content:**
- Mono label: `ABOUT NUMEROS`
- Heading: "Love, calculated."
- Body: "We built Numeros because we believe the universe already knows who you're looking for. We're just translating."

#### 8.2 Origin Story

**Content:**
- Problem: "Modern dating is broken. Swipe culture optimizes for engagement, not connection."
- Question: "What if matching wasn't based on what you like, but who you are?"
- Solution: "Systems that have mapped human compatibility for millennia — numerology and astrology."

**Pull Quote:**
- "The same inputs always produce the same compatibility. No manipulation. Just math."

#### 8.3 The Systems

**2-column:**

**Numerology**
- Brief history (Pythagoras)
- How it works
- Why it's reliable

**Astrology**
- Brief history (Hellenistic)
- Swiss Ephemeris precision
- Why it's accurate

#### 8.4 Contact

**Content:**
- "Have questions? Reach out."
- Email placeholder
- Social links

---

## Page 9: CTA / Entry Points

### Purpose
Dedicated landing pages for campaigns

### 9.1 Universal Calculator Page

**URL:** `/calculate`

**Content:**
- Heading: "Calculate your cosmic blueprint"
- Full calculator form (same as home)
- Trust elements
- No distractions

### 9.2 App Download Page

**URL:** `/download`

**Content:**
- Heading: "Get Numeros"
- App preview mockups
- App Store / Play Store badges
- QR code
- Feature highlights

---

## Global Components

### Navigation

**Desktop:**
- Logo (left)
- Links: Numerology, Astrology, Universe Scan, Features, About
- CTA: "Calculate Free" (right)

**Mobile:**
- Logo (left)
- Hamburger (right)
- Slide-out with links + CTA

### Footer

**Layout:** 4-column + bottom bar

**Columns:**
1. Logo + tagline + social
2. Product: Numerology, Astrology, Universe Scan, Features
3. Company: About, Blog, Careers, Contact
4. Legal: Privacy, Terms, Cookies

**Bottom:**
- © 2026 Numeros
- App store badges

---

## Shader Gallery (For Figma Static Frames)

### Available Shaders

1. **Flowing Waves** — Wavy distortion pattern, purple/violet
2. **Ether** — Volumetric mystical clouds (DEFAULT for extraction)
3. **Shooting Stars** — Star field animation
4. **Wavy Lines** — Organic line pattern
5. **Plasma Energy** — Colorful plasma overlay

### Static Representation

For Figma, capture shader at t=3.0s as static frame:
- Export at 2x resolution
- Apply circular mask
- Add subtle glow effect around edges

---

## API Integration Points

### Calculate Endpoint (Lead Capture)

```typescript
// POST /api/v1/profile/calculate/
interface CalculateRequest {
  name: string;           // Required
  birth_date: string;     // Required: YYYY-MM-DD
  birth_time?: string;    // Optional: HH:MM
  latitude?: number;      // Optional: from city lookup
  longitude?: number;     // Optional: from city lookup
  email: string;          // For lead capture (frontend only)
}

interface CalculateResponse {
  chart_level: 1 | 2 | 3 | 4;
  numerology: {
    life_path: number;
    soul_urge: number;
    expression: number;
    personality: number;
    master_numbers: number[];
  };
  astrology: {
    sun: { sign: string; degree: number };
    moon: { sign: string; degree: number };
    ascendant?: { sign: string; degree: number };
    // ... more planets
  };
}
```

### Email Capture Flow

1. User enters email + birth data
2. Frontend validates email format
3. Call `/api/v1/profile/calculate/`
4. Store email + results in marketing database (separate endpoint TBD)
5. Send email with PDF/link to results
6. Show results immediately on page

---

## Responsive Breakpoints

```
Mobile:    320px – 767px    (single column)
Tablet:    768px – 1023px   (2-column grids)
Desktop:   1024px – 1439px  (full layouts)
Wide:      1440px+          (max-width 1200px, centered)
```

---

## Motion Design Notes

### Page Transitions
- Fade: 400ms ease-out
- Scroll-triggered: 100ms stagger

### Calculator Interactions
- Input focus: border → accentViolet, subtle glow
- Submit: button scale 0.98 → loading state
- Extraction: 12.5s animated sequence
- Results: stagger reveal (200ms per element)

### Shader Animations
- Continuous time uniform
- 60fps target
- Fallback: static gradient for low-power devices

---

## Notes for Implementation

1. **No pricing page** — App is free on stores
2. **Email capture is primary goal** — Calculator first, app download second
3. **Backend is ready** — Use `/api/v1/profile/calculate/` endpoint
4. **Shaders are real** — Code examples are production code
5. **Stats are placeholder** — Replace with real data or remove
6. **Calculator works without account** — AllowAny permission

---

*Document Version: 2.0*
*Created: 2026-01-27*
*Updated: 2026-01-27 — Removed pricing, added lead capture focus, included shader code*
*For: Figma Make Design Phase*
