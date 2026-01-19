"""
Numerology Calculation Service

Implements the core numerology calculations for numEros matching system.
Based on the formal specification in Technical Specification.md

All functions are deterministic - same inputs always produce same outputs.
"""

from typing import Tuple
from datetime import date


# Master numbers that should never be reduced
MASTER_NUMBERS = {11, 22, 33}


def sum_digits(n: int) -> int:
    """
    Calculate sum of all digits in a number.

    Example:
        sum_digits(1987) -> 1 + 9 + 8 + 7 = 25
    """
    total = 0
    while n > 0:
        total += n % 10
        n = n // 10
    return total


def reduce_number(n: int, preserve_master: bool = True) -> int:
    """
    Reduce a number to a single digit, preserving master numbers.

    Args:
        n: Number to reduce
        preserve_master: If True, preserve 11, 22, 33

    Returns:
        Reduced number (1-9) or master number (11, 22, 33)

    Examples:
        reduce_number(40) -> 4
        reduce_number(29) -> 11 (master number)
        reduce_number(47) -> 11 (4+7=11)
        reduce_number(38) -> 11 (3+8=11)
    """
    while n > 9:
        if preserve_master and n in MASTER_NUMBERS:
            return n
        n = sum_digits(n)

    return n


def calculate_life_path(birth_date: date) -> int:
    """
    Calculate Life Path Number (L) - Core identity.

    Formula: L(P) := R(d + m + y)

    Args:
        birth_date: Date of birth

    Returns:
        Life path number (1-9, 11, 22, 33)

    Example:
        birth_date = 1987-07-08
        Step 1: 0+8 + 0+7 + 1+9+8+7 = 8 + 7 + 25 = 40
        Step 2: 4+0 = 4
        Life Path = 4
    """
    day = birth_date.day
    month = birth_date.month
    year = birth_date.year

    # Sum all digits
    day_sum = sum_digits(day)
    month_sum = sum_digits(month)
    year_sum = sum_digits(year)

    total = day_sum + month_sum + year_sum

    return reduce_number(total, preserve_master=True)


def calculate_day_number(birth_date: date) -> int:
    """
    Calculate Day Number (D) - Personal rhythm.

    Formula: D(P) := R(d)

    Args:
        birth_date: Date of birth

    Returns:
        Day number (1-9)
    """
    day = birth_date.day
    return reduce_number(day, preserve_master=False)


def calculate_month_number(birth_date: date) -> int:
    """
    Calculate Month Number (M) - Emotional baseline.

    Formula: M(P) := R(m)

    Args:
        birth_date: Date of birth

    Returns:
        Month number (1-12, can be reduced further if needed)
    """
    month = birth_date.month
    return reduce_number(month, preserve_master=False)


def calculate_cycle_number(birth_date: date, current_year: int) -> int:
    """
    Calculate Cycle Number (C) - Temporal state.

    Formula: C(P, t) := R(d + m + y + t)
    where t = current year

    Args:
        birth_date: Date of birth
        current_year: Current year for cycle calculation

    Returns:
        Cycle number (1-9, 11, 22, 33)

    Note:
        This changes each year, making compatibility temporal.
    """
    day = birth_date.day
    month = birth_date.month
    year = birth_date.year

    day_sum = sum_digits(day)
    month_sum = sum_digits(month)
    year_sum = sum_digits(year)
    current_year_sum = sum_digits(current_year)

    total = day_sum + month_sum + year_sum + current_year_sum

    return reduce_number(total, preserve_master=True)


# Letter to number mappings for name calculations
LETTER_VALUES = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
}

# Turkish-specific letters
TURKISH_LETTERS = {
    'ç': 3,
    'ğ': 7,
    'ı': 9,
    'ö': 6,
    'ş': 1,
    'ü': 3
}

VOWELS = {'a', 'e', 'i', 'o', 'u'}
TURKISH_VOWELS = VOWELS | {'ı', 'ö', 'ü'}


def calculate_soul_urge(name: str, use_turkish: bool = False) -> int:
    """
    Calculate Soul Urge Number - What you crave (DESIRE axis).

    Sum of vowels in name.

    Args:
        name: Full name
        use_turkish: Use Turkish letter mappings

    Returns:
        Soul urge number (1-9, 11, 22, 33)
    """
    letter_map = {**LETTER_VALUES, **TURKISH_LETTERS} if use_turkish else LETTER_VALUES
    vowel_set = TURKISH_VOWELS if use_turkish else VOWELS

    name_lower = name.lower()
    vowels = [c for c in name_lower if c in vowel_set]
    total = sum(letter_map.get(c, 0) for c in vowels)

    return reduce_number(total, preserve_master=True)


def calculate_expression(name: str, use_turkish: bool = False) -> int:
    """
    Calculate Expression Number - How you attach (BOND axis).

    Sum of all letters in name.

    Args:
        name: Full name
        use_turkish: Use Turkish letter mappings

    Returns:
        Expression number (1-9, 11, 22, 33)
    """
    letter_map = {**LETTER_VALUES, **TURKISH_LETTERS} if use_turkish else LETTER_VALUES

    name_lower = name.lower()
    letters = [c for c in name_lower if c in letter_map]
    total = sum(letter_map[c] for c in letters)

    return reduce_number(total, preserve_master=True)


def calculate_challenge(birth_date: date) -> int:
    """
    Calculate Challenge Number - What breaks you (FRICTION axis).

    Absolute difference between month and day numbers.

    Args:
        birth_date: Date of birth

    Returns:
        Challenge number (0-9)
    """
    day_num = calculate_day_number(birth_date)
    month_num = calculate_month_number(birth_date)

    return abs(month_num - day_num)


class NumerologyProfile:
    """
    Complete numerology profile for a person.
    """

    def __init__(
        self,
        life_path: int,
        day_number: int,
        month_number: int,
        cycle_number: int,
        soul_urge: int = None,
        expression: int = None,
        challenge: int = None
    ):
        self.life_path = life_path
        self.day_number = day_number
        self.month_number = month_number
        self.cycle_number = cycle_number
        self.soul_urge = soul_urge
        self.expression = expression
        self.challenge = challenge

    @classmethod
    def from_birth_date(
        cls,
        birth_date: date,
        current_year: int,
        name: str = None,
        use_turkish: bool = False
    ):
        """
        Create numerology profile from birth date and optional name.

        Args:
            birth_date: Date of birth
            current_year: Current year for cycle calculation
            name: Full name (optional, for name-based numbers)
            use_turkish: Use Turkish letter mappings

        Returns:
            NumerologyProfile instance
        """
        life_path = calculate_life_path(birth_date)
        day_number = calculate_day_number(birth_date)
        month_number = calculate_month_number(birth_date)
        cycle_number = calculate_cycle_number(birth_date, current_year)

        soul_urge = None
        expression = None
        challenge = None

        if name:
            soul_urge = calculate_soul_urge(name, use_turkish)
            expression = calculate_expression(name, use_turkish)

        challenge = calculate_challenge(birth_date)

        return cls(
            life_path=life_path,
            day_number=day_number,
            month_number=month_number,
            cycle_number=cycle_number,
            soul_urge=soul_urge,
            expression=expression,
            challenge=challenge
        )

    def to_dict(self) -> dict:
        """Convert to dictionary representation."""
        return {
            'life_path': self.life_path,
            'day_number': self.day_number,
            'month_number': self.month_number,
            'cycle_number': self.cycle_number,
            'soul_urge': self.soul_urge,
            'expression': self.expression,
            'challenge': self.challenge
        }

    def __repr__(self):
        return (
            f"NumerologyProfile(life_path={self.life_path}, "
            f"day={self.day_number}, month={self.month_number}, "
            f"cycle={self.cycle_number})"
        )


# Number meanings for UI display
NUMBER_MEANINGS = {
    1: {
        'title': 'The Independent Leader',
        'description': 'You lead with vision and courage',
        'keywords': ['leadership', 'independence', 'initiative']
    },
    2: {
        'title': 'The Sensitive Mediator',
        'description': 'You heal through understanding',
        'keywords': ['partnership', 'sensitivity', 'diplomacy']
    },
    3: {
        'title': 'The Creative Expresser',
        'description': 'You bring joy through creation',
        'keywords': ['creativity', 'expression', 'joy']
    },
    4: {
        'title': 'The Stable Builder',
        'description': 'You create lasting foundations',
        'keywords': ['stability', 'foundation', 'discipline']
    },
    5: {
        'title': 'The Free Spirit',
        'description': 'You transform through adventure',
        'keywords': ['freedom', 'adventure', 'change']
    },
    6: {
        'title': 'The Nurturing Lover',
        'description': 'You love with your whole being',
        'keywords': ['love', 'nurturing', 'harmony']
    },
    7: {
        'title': 'The Deep Seeker',
        'description': 'You find truth in silence',
        'keywords': ['depth', 'mysticism', 'introspection']
    },
    8: {
        'title': 'The Powerful Achiever',
        'description': 'You manifest abundance',
        'keywords': ['power', 'abundance', 'achievement']
    },
    9: {
        'title': 'The Universal Healer',
        'description': 'You serve the greater whole',
        'keywords': ['completion', 'wisdom', 'universality']
    },
    11: {
        'title': 'The Illuminated Visionary',
        'description': 'You channel higher truths',
        'keywords': ['illumination', 'intuition', 'inspiration']
    },
    22: {
        'title': 'The Master Builder',
        'description': 'You build dreams into reality',
        'keywords': ['mastery', 'building', 'manifestation']
    },
    33: {
        'title': 'The Master Teacher',
        'description': 'You uplift all humanity',
        'keywords': ['teaching', 'healing', 'compassion']
    }
}


def get_number_meaning(number: int) -> dict:
    """
    Get the meaning of a numerology number.

    Args:
        number: Numerology number (1-9, 11, 22, 33)

    Returns:
        Dictionary with title, description, and keywords
    """
    return NUMBER_MEANINGS.get(number, {
        'title': 'Unknown',
        'description': '',
        'keywords': []
    })
