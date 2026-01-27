# PROTOTYPE → NATIVE: Systematic Implementation Protocol

## CRITICAL INSTRUCTION

You are converting `/apps/prototype` (React/Vite) to `/apps/native` (React Native/Expo). **Do NOT skip details.** This is a pixel-perfect, element-by-element adaptation.

---

## PHASE 1: AUDIT (Do this FIRST, every session)

Before ANY implementation work:

```
1. LIST all files in /apps/prototype/src/components/
2. LIST all files in /apps/prototype/src/screens/
3. LIST all files in /apps/native/src/components/
4. LIST all files in /apps/native/src/screens/
5. Create a COMPARISON TABLE showing:
   - File exists in prototype? (Y/N)
   - File exists in native? (Y/N)
   - Implementation status: NOT_STARTED | PARTIAL | COMPLETE
```

Output this table before proceeding.

---

## PHASE 2: ELEMENT-BY-ELEMENT DECOMPOSITION

### CRITICAL: You must process COMPONENTS before SCREENS

```
ORDER OF OPERATIONS:
1. First: ALL files in /apps/prototype/src/components/
2. Then: ALL files in /apps/prototype/src/screens/
3. Never skip a component because "it's used by a screen"
```

---

### Step 2.1: EXTRACT EVERY JSX ELEMENT

For each file, create a **LINE-BY-LINE JSX INVENTORY**.

**You MUST list every single JSX tag.** Do not summarize. Do not group.

```markdown
## [FileName].tsx - JSX Element Inventory

### Line-by-line extraction from prototype:

| Line | JSX Tag | className/style | Content/Children | Props |
|------|---------|-----------------|------------------|-------|
| 24 | `<div>` | `flex flex-col gap-6 p-8` | contains lines 25-89 | - |
| 25 | `<span>` | `text-xs font-mono uppercase tracking-wider text-white/40` | "YOUR NUMBERS" | - |
| 26 | `<div>` | `grid grid-cols-2 gap-4` | contains lines 27-58 | - |
| 27 | `<div>` | `bg-white/5 rounded-xl p-4 border border-white/10` | contains lines 28-35 | onClick={...} |
| 28 | `<span>` | `text-[10px] font-mono text-white/40` | "LIFE PATH" | - |
| 29 | `<span>` | `text-4xl font-serif text-indigo-400` | "{lifePathNumber}" | - |
| ... | ... | ... | ... | ... |
```

**EVERY TAG MUST BE LISTED.** If there are 47 JSX elements, list 47 rows.

---

### Step 2.2: MAP EACH ELEMENT TO NATIVE

For EACH row in the inventory, document the native equivalent:

```markdown
## [FileName].tsx - Element Mapping

| Line | Prototype | Native Equivalent | Status |
|------|-----------|-------------------|--------|
| 24 | `<div className="flex flex-col gap-6 p-8">` | `<View style={{flexDirection:'column', gap:24, padding:32}}>` | ✅ |
| 25 | `<span className="text-xs font-mono uppercase tracking-wider text-white/40">` | `<Text style={{fontSize:12, fontFamily:fonts.mono, textTransform:'uppercase', letterSpacing:1.5, color:'rgba(255,255,255,0.4)'}}>` | ❌ letterSpacing missing |
| 26 | `<div className="grid grid-cols-2 gap-4">` | `<View style={{flexDirection:'row', flexWrap:'wrap', gap:16}}>` | ✅ |
| ... | ... | ... | ... |
```

---

### Step 2.3: EXTRACT ALL STYLES

List EVERY Tailwind class used and its exact value:

```markdown
## [FileName].tsx - Style Extraction

### Tailwind → React Native Values

| Tailwind Class | CSS Value | React Native |
|----------------|-----------|--------------|
| `text-xs` | font-size: 12px | fontSize: 12 |
| `text-sm` | font-size: 14px | fontSize: 14 |
| `text-lg` | font-size: 18px | fontSize: 18 |
| `text-xl` | font-size: 20px | fontSize: 20 |
| `text-2xl` | font-size: 24px | fontSize: 24 |
| `text-4xl` | font-size: 36px | fontSize: 36 |
| `text-white/40` | color: rgba(255,255,255,0.4) | color: 'rgba(255,255,255,0.4)' |
| `text-white/60` | color: rgba(255,255,255,0.6) | color: 'rgba(255,255,255,0.6)' |
| `text-indigo-400` | color: #818CF8 | color: '#818CF8' |
| `bg-white/5` | background: rgba(255,255,255,0.05) | backgroundColor: 'rgba(255,255,255,0.05)' |
| `rounded-xl` | border-radius: 12px | borderRadius: 12 |
| `rounded-2xl` | border-radius: 16px | borderRadius: 16 |
| `gap-4` | gap: 16px | gap: 16 |
| `gap-6` | gap: 24px | gap: 24 |
| `p-4` | padding: 16px | padding: 16 |
| `p-6` | padding: 24px | padding: 24 |
| `p-8` | padding: 32px | padding: 32 |
| `border-white/10` | border-color: rgba(255,255,255,0.1) | borderColor: 'rgba(255,255,255,0.1)' |
| `tracking-wider` | letter-spacing: 0.05em | letterSpacing: 1.5 |
| `uppercase` | text-transform: uppercase | textTransform: 'uppercase' |
```

---

### Step 2.4: EXTRACT ALL ANIMATIONS

List EVERY animation/transition with exact timing:

```markdown
## [FileName].tsx - Animation Extraction

| Element | Trigger | CSS/Framer | Duration | Easing | Properties |
|---------|---------|------------|----------|--------|------------|
| Card container | hover | `hover:scale-[1.02]` | 200ms | ease-out | transform: scale |
| Card container | click | `active:scale-[0.98]` | 100ms | ease-in | transform: scale |
| Expanded content | state change | `transition-all duration-700` | 700ms | cubic-bezier(0.77,0,0.175,1) | height, opacity |
| Tab indicator | tab change | `transition-transform` | 300ms | ease-out | translateX |
| Fade in | mount | `animate-fadeIn` | 800ms | ease-out | opacity 0→1 |

### Native Implementation Required:
| Animation | Reanimated Code |
|-----------|-----------------|
| hover:scale-[1.02] | `useAnimatedStyle` + `withTiming(1.02, {duration: 200})` |
| duration-700 ease | `withTiming(value, {duration: 700, easing: Easing.bezier(0.77,0,0.175,1)})` |
| animate-fadeIn | `entering={FadeIn.duration(800)}` |
```

---

### Step 2.5: EXTRACT ALL EVENT HANDLERS

List EVERY interactive behavior:

```markdown
## [FileName].tsx - Event Handlers

| Element | Event | Handler | Action |
|---------|-------|---------|--------|
| Card (line 27) | onClick | `() => setExpanded(prev => prev === 'life' ? null : 'life')` | Toggle expand state |
| Close button (line 45) | onClick | `() => setExpanded(null)` | Collapse all |
| Tab button (line 12) | onClick | `() => setActiveTab('stars')` | Switch tab |
| Input (line 67) | onChange | `handleDateChange` | Format and validate date |
| Input (line 67) | onFocus | `setFocusedField('date')` | Track focus state |
| Input (line 67) | onBlur | `setFocusedField(null)` | Clear focus state |
```

---

### Step 2.6: IMPLEMENT ONE ELEMENT AT A TIME

**STOP. Do not batch. For EACH ❌ item:**

```markdown
### Implementing: Line 25 - Section label

**Prototype (line 25):**
```tsx
<span className="text-xs font-mono uppercase tracking-wider text-white/40">
  YOUR NUMBERS
</span>
```

**Current Native:**
```tsx
<Text style={styles.sectionLabel}>YOUR NUMBERS</Text>

// styles.sectionLabel = {
//   fontSize: 12,
//   fontFamily: fonts.mono,
//   textTransform: 'uppercase',
//   color: 'rgba(255,255,255,0.4)',
//   // MISSING: letterSpacing
// }
```

**Fix:**
```tsx
sectionLabel: {
  fontSize: 12,
  fontFamily: fonts.mono,
  textTransform: 'uppercase',
  letterSpacing: 1.5,  // ← ADDED
  color: 'rgba(255,255,255,0.4)',
},
```

**Verification:** ✅ Now matches prototype
```

**THEN move to the next element. Do not skip ahead.**

---

### Step 2.7: VERIFY CHILD COMPONENT IMPORTS

If the prototype imports a component, verify native imports the equivalent:

```markdown
## [FileName].tsx - Component Dependencies

| Prototype Import | Native Equivalent | Status |
|------------------|-------------------|--------|
| `import { Blueprint } from './Blueprint'` | `import { Blueprint } from '../components/Blueprint'` | ✅ |
| `import { FlippablePlanetCard } from './FlippablePlanetCard'` | `import { FlippablePlanetCard } from '../components/FlippablePlanetCard'` | ❌ NOT IMPORTED |
| `import { motion } from 'framer-motion'` | `import Animated from 'react-native-reanimated'` | ✅ |
```

**If a component is missing, STOP and implement that component first.**

---

## PHASE 3: ELEMENT CONVERSION RULES

### Typography Conversion
```
Prototype                          → Native
-----------------------------------------
className="text-sm"                → fontSize: 14
className="text-lg"                → fontSize: 18
className="font-serif"             → fontFamily: fonts.serif
className="text-white/60"          → color: 'rgba(255,255,255,0.6)'
className="tracking-wider"         → letterSpacing: 1.5
className="uppercase"              → textTransform: 'uppercase'
```

### Layout Conversion
```
Prototype                          → Native
-----------------------------------------
className="flex flex-col"          → flexDirection: 'column'
className="items-center"           → alignItems: 'center'
className="justify-between"        → justifyContent: 'space-between'
className="gap-4"                  → gap: 16
className="p-6"                    → padding: 24
className="mt-4"                   → marginTop: 16
className="w-full"                 → width: '100%'
className="rounded-2xl"            → borderRadius: 16
```

### Animation Conversion
```
Prototype                          → Native
-----------------------------------------
transition: all 0.3s ease          → withTiming(val, {duration: 300, easing: Easing.ease})
@keyframes fadeIn                  → entering={FadeIn.duration(X)}
transform: scale(1.02)             → useAnimatedStyle + transform: [{scale: 1.02}]
opacity with transition            → useAnimatedStyle + opacity: withTiming(...)
```

### Gradient Conversion
```
Prototype (CSS)                    → Native (Skia)
-----------------------------------------
background: linear-gradient(...)   → <LinearGradient colors={[...]} start={...} end={...} />
background: radial-gradient(...)   → <RadialGradient c={...} r={...} colors={[...]} />
backdrop-filter: blur(...)         → <Blur blur={...} /> or BlurMask
```

---

## PHASE 4: VALIDATION CHECKLIST

After implementing a screen, verify:

```markdown
## Post-Implementation Validation: [ScreenName]

### Visual Parity
- [ ] Screenshot prototype vs native - identical?
- [ ] All text content matches exactly
- [ ] All colors match (use color picker if needed)
- [ ] All spacing/gaps match
- [ ] All border radius values match
- [ ] All shadows/glows present

### Interaction Parity
- [ ] All buttons respond correctly
- [ ] All inputs work as expected
- [ ] All gestures recognized
- [ ] All navigation works

### Animation Parity
- [ ] Entrance animations present
- [ ] Exit animations present
- [ ] Micro-interactions present
- [ ] Timing feels the same
- [ ] Easing curves match

### State Parity
- [ ] All conditional renders work
- [ ] Loading states match
- [ ] Error states match
- [ ] Empty states match
```

---

## PHASE 5: SESSION PERSISTENCE

At END of each session, update `/apps/native/IMPLEMENTATION_STATUS.md`:

```markdown
# Implementation Status

## Last Updated: [DATE]

## Completed Screens
- [x] SplashScreen - 100%
- [x] IdleScreen - 100%

## In Progress
- [ ] ProfileScreen - 60%
  - ✅ Header layout
  - ✅ Avatar display
  - ❌ Edit button animation
  - ❌ Stats section

## Not Started
- [ ] SettingsScreen
- [ ] MatchDetailScreen

## Known Issues
1. [Issue description + file + line]

## Next Session Priority
1. Complete ProfileScreen edit button
2. Start SettingsScreen
```

---

## MANDATORY BEHAVIORS

### ABSOLUTELY FORBIDDEN - INSTANT FAILURE

1. **"Similarly for other elements..."** - NO. List every element.
2. **"The rest follows the same pattern..."** - NO. Show each one.
3. **"I'll skip the details..."** - NO. Details are the job.
4. **"This component is straightforward..."** - NO. Prove it with line-by-line mapping.
5. **"The styles are similar..."** - NO. Extract each style explicitly.
6. **Jumping from file to file** - NO. Complete one file 100% before moving.
7. **Implementing screens before their child components** - NO. Components first.
8. **Saying "matches prototype" without showing the comparison** - NO. Show both sides.

### REQUIRED BEHAVIORS

1. **ALWAYS show the JSX inventory table** before any implementation

2. **ALWAYS show prototype code → native code side by side** for each element

3. **ALWAYS extract exact pixel/color values** - never say "similar purple"

4. **ALWAYS verify component imports** before implementing a screen

5. **ALWAYS complete components before screens** that use them

6. **ONE element at a time** - show the fix, verify, then next element

7. **COUNT your elements** - if prototype has 34 JSX tags, native needs 34 equivalents

8. **PRESERVE existing React Native patterns** from CLAUDE.md

### VERIFICATION GATES

Before marking a file as COMPLETE, you must confirm:

```
□ JSX inventory table created with ALL elements
□ Every Tailwind class mapped to React Native value  
□ Every animation documented and implemented
□ Every event handler mapped
□ Every child component import verified
□ Side-by-side comparison shown for each element
□ Element count matches: Prototype has X elements, Native has X elements
```

---

## QUICK START COMMAND

Copy this to begin a session:

```
Read CLAUDE.md first. Then:

1. LIST all files in /apps/prototype/src/components/
2. LIST all files in /apps/native/src/components/
3. For the FIRST component that needs work:
   a. Create the JSX INVENTORY TABLE (every single tag, line by line)
   b. Create the ELEMENT MAPPING TABLE (prototype → native for each)
   c. Create the STYLE EXTRACTION TABLE (every Tailwind class)
   d. Create the ANIMATION TABLE (every transition/animation)
   e. For EACH ❌ element, show prototype code → native code → verification
4. Only after ALL components are done, move to screens
5. Update IMPLEMENTATION_STATUS.md

REMEMBER:
- If prototype line 24 has a <div>, I need to see that specific div mapped
- If there are 47 JSX elements, show me 47 rows in the inventory
- Do not say "similarly" or "the rest follows" - show each element
- Do not move to the next file until current file element count matches
```

---

## SINGLE FILE DEEP-DIVE COMMAND

For focusing on one specific file:

```
Deep-dive on [FileName].tsx:

1. Show me the COMPLETE JSX inventory - every tag, every line number
2. Show me EVERY Tailwind class used and its exact React Native equivalent
3. Show me EVERY animation with exact timing values
4. For each element where native differs from prototype, show:
   - The prototype code
   - The current native code  
   - The fix required
5. Do not summarize. Do not group. Every element individually.
```

---

## EXAMPLE: Full Element-Level Processing

### File: Blueprint.tsx

**Step 1: JSX Inventory**

| Line | Tag | className | Content | Props |
|------|-----|-----------|---------|-------|
| 15 | `<div>` | `flex flex-col gap-6` | wrapper | - |
| 16 | `<span>` | `text-xs font-mono uppercase tracking-wider text-white/40` | "YOUR NUMBERS" | - |
| 17 | `<div>` | `grid grid-cols-2 gap-4` | grid container | - |
| 18 | `<div>` | `bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer transition-all duration-700 hover:scale-[1.02]` | life path card | `onClick={...}` |
| 19 | `<span>` | `text-[10px] font-mono text-white/40 uppercase tracking-wider` | "LIFE PATH" | - |
| 20 | `<span>` | `text-4xl font-serif` | `{numbers.lifePath}` | `style={{color: sigilColors.life_path}}` |
| 21 | `<div>` | `overflow-hidden transition-all duration-700` | expandable content | `style={{maxHeight: expanded === 'life' ? 200 : 0}}` |
| 22 | `<p>` | `text-sm text-white/70 mt-2` | `{meanings.lifePath}` | - |
| ... | ... | ... | ... | ... |

**Element count: 34 tags**

---

**Step 2: Style Extraction**

| Tailwind | Value | React Native |
|----------|-------|--------------|
| `flex flex-col` | flex-direction: column | `flexDirection: 'column'` |
| `gap-6` | gap: 24px | `gap: 24` |
| `gap-4` | gap: 16px | `gap: 16` |
| `text-xs` | 12px | `fontSize: 12` |
| `text-sm` | 14px | `fontSize: 14` |
| `text-4xl` | 36px | `fontSize: 36` |
| `text-[10px]` | 10px | `fontSize: 10` |
| `font-mono` | monospace | `fontFamily: fonts.mono` |
| `font-serif` | serif | `fontFamily: fonts.serif` |
| `uppercase` | text-transform | `textTransform: 'uppercase'` |
| `tracking-wider` | letter-spacing: 0.05em | `letterSpacing: 1.5` |
| `text-white/40` | rgba(255,255,255,0.4) | `color: 'rgba(255,255,255,0.4)'` |
| `text-white/70` | rgba(255,255,255,0.7) | `color: 'rgba(255,255,255,0.7)'` |
| `bg-white/5` | rgba(255,255,255,0.05) | `backgroundColor: 'rgba(255,255,255,0.05)'` |
| `rounded-xl` | 12px | `borderRadius: 12` |
| `p-4` | 16px | `padding: 16` |
| `border border-white/10` | 1px solid rgba(255,255,255,0.1) | `borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'` |
| `mt-2` | margin-top: 8px | `marginTop: 8` |
| `grid-cols-2` | 2 column grid | `flexDirection: 'row', flexWrap: 'wrap'` with 50% width children |
| `cursor-pointer` | - | N/A (use Pressable) |
| `transition-all duration-700` | 700ms | `withTiming(val, {duration: 700, easing: Easing.bezier(0.77,0,0.175,1)})` |
| `hover:scale-[1.02]` | transform: scale(1.02) | `useAnimatedStyle` with scale on press |
| `overflow-hidden` | overflow: hidden | `overflow: 'hidden'` |

---

**Step 3: Animation Extraction**

| Element | Trigger | Duration | Easing | Property | Native |
|---------|---------|----------|--------|----------|--------|
| Card | hover/press | 200ms | ease | scale 1→1.02 | `withTiming(1.02, {duration:200})` |
| Card | press end | 200ms | ease | scale 1.02→1 | `withTiming(1, {duration:200})` |
| Expand | state | 700ms | cubic-bezier(0.77,0,0.175,1) | maxHeight 0→200 | `withTiming(200, {duration:700, easing})` |
| Expand | state | 700ms | same | opacity 0→1 | `withTiming(1, {duration:700, easing})` |

---

**Step 4: Element-by-Element Implementation**

### Element: Line 16 - Section Label

**Prototype:**
```tsx
<span className="text-xs font-mono uppercase tracking-wider text-white/40">
  YOUR NUMBERS
</span>
```

**Native current:**
```tsx
<Text style={styles.sectionLabel}>YOUR NUMBERS</Text>

sectionLabel: {
  fontSize: 12,
  fontFamily: fonts.mono,
  color: 'rgba(255,255,255,0.4)',
}
```

**Missing:** `textTransform: 'uppercase'`, `letterSpacing: 1.5`

**Fix:**
```tsx
sectionLabel: {
  fontSize: 12,
  fontFamily: fonts.mono,
  textTransform: 'uppercase',
  letterSpacing: 1.5,
  color: 'rgba(255,255,255,0.4)',
},
```

✅ **Verified: matches prototype**

---

### Element: Line 18 - Card Container

**Prototype:**
```tsx
<div 
  className="bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer transition-all duration-700 hover:scale-[1.02]"
  onClick={() => setExpanded(prev => prev === 'life' ? null : 'life')}
>
```

**Native current:**
```tsx
<Pressable style={styles.card} onPress={() => toggleExpand('life')}>

card: {
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
}
```

**Missing:** Press animation (scale 1.02), 700ms transition

**Fix:**
```tsx
const cardScale = useSharedValue(1);

const cardAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: cardScale.value }],
}));

<Animated.View style={[styles.card, cardAnimatedStyle]}>
  <Pressable
    onPressIn={() => { cardScale.value = withTiming(1.02, {duration: 200}); }}
    onPressOut={() => { cardScale.value = withTiming(1, {duration: 200}); }}
    onPress={() => toggleExpand('life')}
  >
```

✅ **Verified: matches prototype**

---

### Element: Line 20 - Number Display

**Prototype:**
```tsx
<span 
  className="text-4xl font-serif" 
  style={{color: sigilColors.life_path}}
>
  {numbers.lifePath}
</span>
```

**Native current:**
```tsx
<Text style={[styles.numberDisplay, {color: sigilColors.life_path}]}>
  {numbers.lifePath}
</Text>

numberDisplay: {
  fontSize: 32, // WRONG - should be 36
  fontFamily: fonts.serif,
}
```

**Fix:**
```tsx
numberDisplay: {
  fontSize: 36,  // text-4xl = 36px
  fontFamily: fonts.serif,
},
```

✅ **Verified: matches prototype**

---

*Continue for all 34 elements...*

---

**Final Verification:**
- Prototype elements: 34
- Native elements: 34 ✅
- All styles mapped: ✅
- All animations implemented: ✅
- All handlers connected: ✅

**Status: COMPLETE**
