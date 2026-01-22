const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
}

const VOWELS = ['a', 'e', 'i', 'o', 'u']

const NUMBER_MEANINGS = {
  core: {
    1: 'The Independent Leader',
    2: 'The Sensitive Mediator',
    3: 'The Creative Expresser',
    4: 'The Stable Builder',
    5: 'The Free Spirit',
    6: 'The Nurturing Lover',
    7: 'The Deep Seeker',
    8: 'The Powerful Achiever',
    9: 'The Universal Healer',
    11: 'The Illuminated Visionary',
    22: 'The Master Builder',
    33: 'The Master Teacher',
  } as Record<number, string>,
  desire: {
    1: 'You crave independence and recognition',
    2: 'You crave harmony and partnership',
    3: 'You crave self-expression and joy',
    4: 'You crave security and order',
    5: 'You crave freedom and adventure',
    6: 'You crave love and family',
    7: 'You crave knowledge and solitude',
    8: 'You crave power and abundance',
    9: 'You crave service and completion',
  } as Record<number, string>,
  bond: {
    1: 'You attach through admiration',
    2: 'You attach through emotional safety',
    3: 'You attach through fun and creativity',
    4: 'You attach through reliability',
    5: 'You attach through excitement',
    6: 'You attach through devotion',
    7: 'You attach through mental connection',
    8: 'You attach through shared ambition',
    9: 'You attach through spiritual depth',
  } as Record<number, string>,
  friction: {
    0: 'Imbalance breaks you',
    1: 'Ego clashes break you',
    2: 'Emotional neglect breaks you',
    3: 'Criticism breaks you',
    4: 'Chaos breaks you',
    5: 'Restriction breaks you',
    6: 'Betrayal breaks you',
    7: 'Superficiality breaks you',
    8: 'Powerlessness breaks you',
    9: 'Meaninglessness breaks you',
  } as Record<number, string>,
}

function reduceToSingle(num: number, preserveMaster = true): number {
  if (preserveMaster && [11, 22, 33].includes(num)) return num
  while (num > 9 && !(preserveMaster && [11, 22, 33].includes(num))) {
    num = String(num)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0)
  }
  return num
}

export function calculateLifePath(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number)
  const sum =
    String(day)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0) +
    String(month)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0) +
    String(year)
      .split('')
      .reduce((a, b) => a + parseInt(b, 10), 0)
  return reduceToSingle(sum, true)
}

export function calculateSoulUrge(name: string): number {
  const vowels = name.toLowerCase().split('').filter((c) => VOWELS.includes(c))
  const sum = vowels.reduce((a, c) => a + (LETTER_VALUES[c] || 0), 0)
  return reduceToSingle(sum)
}

export function calculateExpression(name: string): number {
  const letters = name.toLowerCase().split('').filter((c) => LETTER_VALUES[c])
  const sum = letters.reduce((a, c) => a + LETTER_VALUES[c], 0)
  return reduceToSingle(sum)
}

export function calculateChallenge(dateStr: string): number {
  const [, month, day] = dateStr.split('-').map(Number)
  const monthNum = reduceToSingle(month, false)
  const dayNum = reduceToSingle(day, false)
  return Math.abs(monthNum - dayNum)
}

export interface NumerologyData {
  core: number
  desire: number
  bond: number
  friction: number
  meanings: {
    core: string
    desire: string
    bond: string
    friction: string
  }
}

export function calculateNumerology(name: string, dob: string): NumerologyData {
  const core = calculateLifePath(dob)
  const desire = calculateSoulUrge(name)
  const bond = calculateExpression(name)
  const friction = calculateChallenge(dob)

  return {
    core,
    desire,
    bond,
    friction,
    meanings: {
      core:
        NUMBER_MEANINGS.core[core] ||
        NUMBER_MEANINGS.core[reduceToSingle(core, false)] ||
        'The Seeker',
      desire: NUMBER_MEANINGS.desire[desire] || 'You crave depth',
      bond: NUMBER_MEANINGS.bond[bond] || 'You attach deeply',
      friction: NUMBER_MEANINGS.friction[friction] || 'Imbalance breaks you',
    },
  }
}
