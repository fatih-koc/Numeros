"""
Numerology calculation engine - Pure Python, no Django dependencies.

IMPORTANT: This must produce identical results to native/src/lib/numerology.ts
The calculations are deterministic - same inputs always produce same outputs.
"""

from typing import Dict, List

# Pythagorean letter-to-number mapping
LETTER_VALUES: Dict[str, int] = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
}

VOWELS = {'a', 'e', 'i', 'o', 'u'}
MASTER_NUMBERS = {11, 22, 33}


def reduce_to_single(num: int, preserve_master: bool = True) -> int:
    """
    Reduce any number to single digit (1-9) or master number (11, 22, 33).

    This MUST match the TypeScript implementation exactly:
    ```typescript
    function reduceToSingle(num: number, preserveMaster = true): number {
      if (preserveMaster && [11, 22, 33].includes(num)) return num
      while (num > 9 && !(preserveMaster && [11, 22, 33].includes(num))) {
        num = String(num)
          .split('')
          .reduce((a, b) => a + parseInt(b, 10), 0)
      }
      return num
    }
    ```
    """
    if preserve_master and num in MASTER_NUMBERS:
        return num

    while num > 9 and not (preserve_master and num in MASTER_NUMBERS):
        num = sum(int(d) for d in str(num))

    return num


def calculate_life_path(date_str: str) -> int:
    """
    Calculate Life Path number from birth date.

    Args:
        date_str: Date in YYYY-MM-DD format

    Returns:
        Life Path number (1-9 or 11, 22, 33)

    This MUST match the TypeScript implementation:
    ```typescript
    export function calculateLifePath(dateStr: string): number {
      const [year, month, day] = dateStr.split('-').map(Number)
      const sum =
        String(day).split('').reduce((a, b) => a + parseInt(b, 10), 0) +
        String(month).split('').reduce((a, b) => a + parseInt(b, 10), 0) +
        String(year).split('').reduce((a, b) => a + parseInt(b, 10), 0)
      return reduceToSingle(sum, true)
    }
    ```
    """
    year, month, day = date_str.split('-')

    # Sum each component's digits separately first
    day_sum = sum(int(d) for d in day)
    month_sum = sum(int(d) for d in month)
    year_sum = sum(int(d) for d in year)

    total = day_sum + month_sum + year_sum
    return reduce_to_single(total, preserve_master=True)


def calculate_soul_urge(name: str) -> int:
    """
    Calculate Soul Urge number from vowels in name.

    Args:
        name: Full name

    Returns:
        Soul Urge number (1-9)

    This MUST match the TypeScript implementation:
    ```typescript
    export function calculateSoulUrge(name: string): number {
      const vowels = name.toLowerCase().split('').filter((c) => VOWELS.includes(c))
      const sum = vowels.reduce((a, c) => a + (LETTER_VALUES[c] || 0), 0)
      return reduceToSingle(sum)
    }
    ```
    """
    vowels = [c for c in name.lower() if c in VOWELS]
    total = sum(LETTER_VALUES.get(c, 0) for c in vowels)
    return reduce_to_single(total, preserve_master=True)


def calculate_expression(name: str) -> int:
    """
    Calculate Expression number from full name (all letters).

    Args:
        name: Full name

    Returns:
        Expression number (1-9)

    This MUST match the TypeScript implementation:
    ```typescript
    export function calculateExpression(name: string): number {
      const letters = name.toLowerCase().split('').filter((c) => LETTER_VALUES[c])
      const sum = letters.reduce((a, c) => a + LETTER_VALUES[c], 0)
      return reduceToSingle(sum)
    }
    ```
    """
    letters = [c for c in name.lower() if c in LETTER_VALUES]
    total = sum(LETTER_VALUES[c] for c in letters)
    return reduce_to_single(total, preserve_master=True)


def calculate_personality(name: str) -> int:
    """
    Calculate Personality number from consonants in name.

    Args:
        name: Full name

    Returns:
        Personality number (1-9 or 11, 22, 33)

    This MUST match the TypeScript implementation:
    ```typescript
    export function calculatePersonality(name: string): number {
      const consonants = name.toLowerCase().split('').filter((c) =>
        LETTER_VALUES[c] && !VOWELS.includes(c))
      const sum = consonants.reduce((a, c) => a + LETTER_VALUES[c], 0)
      return reduceToSingle(sum, true)
    }
    ```
    """
    consonants = [c for c in name.lower() if c in LETTER_VALUES and c not in VOWELS]
    total = sum(LETTER_VALUES[c] for c in consonants)
    return reduce_to_single(total, preserve_master=True)


def calculate_all(name: str, birth_date: str) -> Dict:
    """
    Calculate all numerology numbers for a person.

    Args:
        name: Full name
        birth_date: Date in YYYY-MM-DD format

    Returns:
        {
            'life_path': int,
            'soul_urge': int,
            'expression': int,
            'personality': int,
            'master_numbers': list[int]
        }
    """
    life_path = calculate_life_path(birth_date)
    soul_urge = calculate_soul_urge(name)
    expression = calculate_expression(name)
    personality = calculate_personality(name)

    # Identify master numbers
    master_numbers: List[int] = []
    for num in [life_path, soul_urge, expression, personality]:
        if num in MASTER_NUMBERS and num not in master_numbers:
            master_numbers.append(num)

    return {
        'life_path': life_path,
        'soul_urge': soul_urge,
        'expression': expression,
        'personality': personality,
        'master_numbers': master_numbers,
    }


def calculate_universal_day(date_str: str) -> int:
    """
    Calculate universal day number (1-9) for any date.
    Used for daily forecasts.

    Args:
        date_str: Date in YYYY-MM-DD format

    Returns:
        Universal day number (1-9)
    """
    year, month, day = date_str.split('-')

    # Sum all digits of the date
    total = sum(int(d) for d in year + month + day)
    return reduce_to_single(total, preserve_master=False)


# Number meanings for API responses
NUMBER_MEANINGS = {
    'life_path': {
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
    },
    'soul_urge': {
        1: 'You crave independence and recognition',
        2: 'You crave harmony and partnership',
        3: 'You crave self-expression and joy',
        4: 'You crave security and order',
        5: 'You crave freedom and adventure',
        6: 'You crave love and family',
        7: 'You crave knowledge and solitude',
        8: 'You crave power and abundance',
        9: 'You crave service and completion',
    },
    'expression': {
        1: 'You attach through admiration',
        2: 'You attach through emotional safety',
        3: 'You attach through fun and creativity',
        4: 'You attach through reliability',
        5: 'You attach through excitement',
        6: 'You attach through devotion',
        7: 'You attach through mental connection',
        8: 'You attach through shared ambition',
        9: 'You attach through spiritual depth',
    },
    'personality': {
        1: 'Others see you as a leader',
        2: 'Others see you as diplomatic',
        3: 'Others see you as creative',
        4: 'Others see you as reliable',
        5: 'Others see you as dynamic',
        6: 'Others see you as nurturing',
        7: 'Others see you as mysterious',
        8: 'Others see you as powerful',
        9: 'Others see you as compassionate',
    },
}


def get_meaning(number_type: str, value: int) -> str:
    """
    Get the meaning for a numerology number.

    Args:
        number_type: One of 'life_path', 'soul_urge', 'expression', 'personality'
        value: The number value

    Returns:
        Meaning string
    """
    meanings = NUMBER_MEANINGS.get(number_type, {})

    # First try the exact value
    if value in meanings:
        return meanings[value]

    # For master numbers, fall back to reduced value
    if value in MASTER_NUMBERS:
        reduced = reduce_to_single(value, preserve_master=False)
        return meanings.get(reduced, 'The Seeker')

    return 'The Seeker'


# Short labels for email templates
NUMBER_SHORT_LABELS = {
    1: 'The Leader',
    2: 'The Mediator',
    3: 'The Communicator',
    4: 'The Builder',
    5: 'The Freedom Seeker',
    6: 'The Nurturer',
    7: 'The Seeker',
    8: 'The Achiever',
    9: 'The Humanitarian',
    11: 'The Intuitive',
    22: 'The Master Builder',
    33: 'The Master Teacher',
}


def get_number_meaning(number: int, number_type: str = None) -> str:
    """
    Get short meaning label for a numerology number.
    Used in email templates.

    Args:
        number: The numerology number
        number_type: Optional type (unused, for API compatibility)

    Returns:
        Short meaning string
    """
    if number is None:
        return ''
    return NUMBER_SHORT_LABELS.get(number, NUMBER_SHORT_LABELS.get(number % 9 or 9, ''))


def calculate_with_meanings(name: str, birth_date: str) -> Dict:
    """
    Calculate all numerology numbers with their meanings.

    Args:
        name: Full name
        birth_date: Date in YYYY-MM-DD format

    Returns:
        {
            'life_path': int,
            'soul_urge': int,
            'expression': int,
            'personality': int,
            'master_numbers': list[int],
            'meanings': {
                'life_path': str,
                'soul_urge': str,
                'expression': str,
                'personality': str,
            }
        }
    """
    numbers = calculate_all(name, birth_date)

    numbers['meanings'] = {
        'life_path': get_meaning('life_path', numbers['life_path']),
        'soul_urge': get_meaning('soul_urge', numbers['soul_urge']),
        'expression': get_meaning('expression', numbers['expression']),
        'personality': get_meaning('personality', numbers['personality']),
    }

    return numbers
