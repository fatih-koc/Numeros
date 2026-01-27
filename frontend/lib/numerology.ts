// Client-side numerology calculation helpers

/**
 * Calculate Life Path number from date string (YYYY-MM-DD)
 */
export function calculateLifePath(dateStr: string): number {
  if (!dateStr) return 7;
  const digits = dateStr.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);

  // Reduce to single digit unless 11, 22, 33 (Master Numbers)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

/**
 * Letter to number mapping for Pythagorean numerology
 */
const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/**
 * Reduce a number to single digit or master number
 */
function reduceNumber(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return num;
}

/**
 * Calculate Expression number from full name
 */
export function calculateExpression(name: string): number {
  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  const sum = letters.reduce((acc, letter) => acc + (LETTER_VALUES[letter] || 0), 0);
  return reduceNumber(sum);
}

/**
 * Calculate Soul Urge number from vowels in name
 */
export function calculateSoulUrge(name: string): number {
  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  const vowelSum = letters
    .filter(letter => VOWELS.includes(letter))
    .reduce((acc, letter) => acc + (LETTER_VALUES[letter] || 0), 0);
  return reduceNumber(vowelSum);
}

/**
 * Calculate Personality number from consonants in name
 */
export function calculatePersonality(name: string): number {
  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  const consonantSum = letters
    .filter(letter => !VOWELS.includes(letter))
    .reduce((acc, letter) => acc + (LETTER_VALUES[letter] || 0), 0);
  return reduceNumber(consonantSum);
}

/**
 * Get sun sign from date
 */
export function getSunSign(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Capricorn";
}

/**
 * Calculate all numerology numbers from name and date
 */
export function calculateAllNumbers(name: string, birthDate: string) {
  return {
    life_path: calculateLifePath(birthDate),
    soul_urge: calculateSoulUrge(name),
    expression: calculateExpression(name),
    personality: calculatePersonality(name),
  };
}
