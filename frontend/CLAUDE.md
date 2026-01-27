# Numeros Marketing Site - Claude Context

## Overview

Next.js 14 App Router marketing site for Numeros. Drives traffic through free Numerology/Astrology calculators with email capture via backend API.

**Stack:** Next.js 14, React 18, Tailwind CSS 4, motion (framer-motion), react-hook-form
**Backend:** Connects to Django API at `NEXT_PUBLIC_API_URL`

## Quick Reference

```bash
cd /apps/frontend
npm run dev     # Development server (localhost:3000)
npm run build   # Production build
npm run start   # Production server
```

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with fonts, nav, footer
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Theme CSS
│   ├── sitemap.ts                # Auto-generated sitemap
│   ├── robots.ts                 # Robots.txt
│   ├── numerology/
│   │   ├── layout.tsx            # SEO metadata
│   │   ├── page.tsx              # Calculator form + email capture
│   │   └── results/page.tsx      # Results with Blueprint
│   ├── astrology/
│   │   ├── layout.tsx            # SEO metadata
│   │   ├── page.tsx              # Astrology form
│   │   └── results/page.tsx      # Astrology results
│   ├── universe/page.tsx         # Universe Scan showcase
│   ├── product/page.tsx          # How It Works
│   ├── features/page.tsx         # Features page
│   ├── about/page.tsx            # About/Philosophy
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Dynamic blog post
│   ├── contact/page.tsx          # Contact form
│   └── {privacy,terms,cookies}/  # Legal pages
├── components/
│   ├── layout/                   # Navbar, Footer
│   ├── ui/                       # Button, Input, Card
│   ├── visuals/                  # LoveEngine, RadarScan
│   ├── numerology/               # Blueprint
│   ├── icons/                    # Sigils
│   └── sections/home/            # Home page sections
├── lib/
│   ├── utils.ts                  # cn() helper
│   ├── api.ts                    # Backend API client
│   └── numerology.ts             # Client-side calculations (fallback)
├── data/
│   └── blogPosts.ts              # Blog content
└── public/
    └── site.webmanifest          # PWA manifest
```

## Backend API Integration

### Profile API

```typescript
// POST /api/v1/profile/calculate/
const result = await calculateProfile({
  name: string,
  birth_date: string, // YYYY-MM-DD
  birth_time?: string, // HH:MM
  latitude?: number,
  longitude?: number,
});

// Response
{
  chart_level: 1 | 2 | 3 | 4;
  numerology: { life_path, soul_urge, expression, personality, master_numbers };
  astrology: { sun, moon, ascendant, ... };
}
```

### Marketing API

```typescript
// POST /api/v1/marketing/capture/
// Captures lead and sends email via Amazon SES
const result = await captureEmail({
  email: string,
  name: string,
  birth_date: string,
  numerology?: { life_path, soul_urge, expression, personality },
  source: 'calculator' | 'waitlist' | 'download',
});

// Response
{ success: boolean, message: string, lead_id?: number }

// POST /api/v1/marketing/unsubscribe/
await unsubscribeEmail({ email: string, token?: string });
```

## Lead Capture Flow

```
1. User visits /numerology
2. Enters email + birth data
3. Form calls calculateProfile() → Backend calculates numbers
4. Form calls captureEmail() → Backend stores lead + sends email via SES
5. Results stored in sessionStorage
6. User redirected to /numerology/results
7. Blueprint displays with flip cards
```

**Fallback:** If API unavailable, uses client-side calculation (lib/numerology.ts)

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=https://numeros.app

# Optional
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

## Color Palette

```css
--color-bgDeep: #0c0a1d
--color-bgMid: #1a1533
--color-textPrimary: rgba(255, 255, 255, 0.95)
--color-textSecondary: rgba(255, 255, 255, 0.6)
--color-accentViolet: #8B5CF6
--color-lifePath: #F59E0B
--color-soulUrge: #06B6D4
--color-expression: #10B981
--color-personality: #F472B6
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page with hero, value props, CTAs |
| `/numerology` | **Main lead capture** - Calculator form |
| `/numerology/results` | Numerology results display |
| `/astrology` | Astrology calculator form |
| `/astrology/results` | Astrology results display |
| `/universe` | Universe Scan showcase |
| `/product` | How It Works / Product page |
| `/features` | Feature grid |
| `/about` | About / Philosophy |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/contact` | Contact form |
| `/privacy`, `/terms`, `/cookies` | Legal pages |

## SEO

- Auto-generated sitemap at `/sitemap.xml`
- Auto-generated robots.txt at `/robots.txt`
- Per-page metadata via layout.tsx files
- OpenGraph and Twitter cards configured

## Production Deployment

1. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.numeros.app
   NEXT_PUBLIC_SITE_URL=https://numeros.app
   ```
2. Run `npm run build`
3. Deploy to Vercel, Netlify, or any Node.js host

## Related

- **Backend:** `/apps/backend` - Django API with marketing endpoints
- **Native App:** `/apps/native` - React Native mobile app
- **Design:** `/apps/frontend/design` - Figma export source
