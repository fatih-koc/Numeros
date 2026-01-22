const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
}

const VOWELS = ['a', 'e', 'i', 'o', 'u']

const NUMBER_MEANINGS = {
  life_path: {
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
  soul_urge: {
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
  expression: {
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
  personality: {
    1: 'Others see you as a leader',
    2: 'Others see you as diplomatic',
    3: 'Others see you as creative',
    4: 'Others see you as reliable',
    5: 'Others see you as dynamic',
    6: 'Others see you as nurturing',
    7: 'Others see you as mysterious',
    8: 'Others see you as powerful',
    9: 'Others see you as compassionate',
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

export function calculatePersonality(name: string): number {
  const consonants = name.toLowerCase().split('').filter((c) => LETTER_VALUES[c] && !VOWELS.includes(c))
  const sum = consonants.reduce((a, c) => a + LETTER_VALUES[c], 0)
  return reduceToSingle(sum, true)
}

export interface NumerologyResult {
  life_path: number
  soul_urge: number
  expression: number
  personality: number
  master_numbers: number[]
}

export interface NumerologyData {
  life_path: number
  soul_urge: number
  expression: number
  personality: number
  meanings: {
    life_path: string
    soul_urge: string
    expression: string
    personality: string
  }
}

export function calculateNumerology(name: string, dob: string): NumerologyData {
  const life_path = calculateLifePath(dob)
  const soul_urge = calculateSoulUrge(name)
  const expression = calculateExpression(name)
  const personality = calculatePersonality(name)

  return {
    life_path,
    soul_urge,
    expression,
    personality,
    meanings: {
      life_path:
        NUMBER_MEANINGS.life_path[life_path] ||
        NUMBER_MEANINGS.life_path[reduceToSingle(life_path, false)] ||
        'The Seeker',
      soul_urge: NUMBER_MEANINGS.soul_urge[soul_urge] || 'You crave depth',
      expression: NUMBER_MEANINGS.expression[expression] || 'You attach deeply',
      personality: NUMBER_MEANINGS.personality[personality] || 'Others see you as unique',
    },
  }
}

export function calculateNumerologyResult(fullName: string, birthDate: string): NumerologyResult {
  const life_path = calculateLifePath(birthDate)
  const soul_urge = calculateSoulUrge(fullName)
  const expression = calculateExpression(fullName)
  const personality = calculatePersonality(fullName)

  // Identify master numbers
  const master_numbers: number[] = []
  ;[life_path, soul_urge, expression, personality].forEach((num) => {
    if ([11, 22, 33].includes(num) && !master_numbers.includes(num)) {
      master_numbers.push(num)
    }
  })

  return {
    life_path,
    soul_urge,
    expression,
    personality,
    master_numbers,
  }
}
