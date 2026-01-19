"""
Zodiac Calculation Service

Implements Chinese/Turkish zodiac calculations for numEros matching system.
Based on the formal specification in Technical Specification.md

All functions are deterministic - same inputs always produce same outputs.
"""

from datetime import date
from typing import Tuple
from enum import Enum


class ZodiacAnimal(str, Enum):
    """Chinese/Turkish Zodiac Animals (12-year cycle)"""
    FARE = 'fare'          # Rat
    OKUZ = 'okuz'          # Ox
    KAPLAN = 'kaplan'      # Tiger
    TAVSAN = 'tavsan'      # Rabbit
    EJDERHA = 'ejderha'    # Dragon
    YILAN = 'yilan'        # Snake
    AT = 'at'              # Horse
    KOYUN = 'koyun'        # Goat
    MAYMUN = 'maymun'      # Monkey
    HOROZ = 'horoz'        # Rooster
    KOPEK = 'kopek'        # Dog
    DOMUZ = 'domuz'        # Pig


class ZodiacElement(str, Enum):
    """Zodiac Elements (Trine groups)"""
    WATER = 'water'
    METAL = 'metal'
    WOOD = 'wood'
    FIRE = 'fire'


# Zodiac wheel - ordered by position (1-12)
ZODIAC_WHEEL = [
    ZodiacAnimal.FARE,     # 1
    ZodiacAnimal.OKUZ,     # 2
    ZodiacAnimal.KAPLAN,   # 3
    ZodiacAnimal.TAVSAN,   # 4
    ZodiacAnimal.EJDERHA,  # 5
    ZodiacAnimal.YILAN,    # 6
    ZodiacAnimal.AT,       # 7
    ZodiacAnimal.KOYUN,    # 8
    ZodiacAnimal.MAYMUN,   # 9
    ZodiacAnimal.HOROZ,    # 10
    ZodiacAnimal.KOPEK,    # 11
    ZodiacAnimal.DOMUZ,    # 12
]

# Element mappings (Trine harmony groups)
ZODIAC_ELEMENTS = {
    # Water trine
    ZodiacAnimal.FARE: ZodiacElement.WATER,
    ZodiacAnimal.EJDERHA: ZodiacElement.WATER,
    ZodiacAnimal.MAYMUN: ZodiacElement.WATER,

    # Metal trine
    ZodiacAnimal.OKUZ: ZodiacElement.METAL,
    ZodiacAnimal.YILAN: ZodiacElement.METAL,
    ZodiacAnimal.HOROZ: ZodiacElement.METAL,

    # Wood trine
    ZodiacAnimal.KAPLAN: ZodiacElement.WOOD,
    ZodiacAnimal.AT: ZodiacElement.WOOD,
    ZodiacAnimal.KOPEK: ZodiacElement.WOOD,

    # Fire trine
    ZodiacAnimal.TAVSAN: ZodiacElement.FIRE,
    ZodiacAnimal.KOYUN: ZodiacElement.FIRE,
    ZodiacAnimal.DOMUZ: ZodiacElement.FIRE,
}

# Opposition pairs (6 positions apart = clash)
ZODIAC_OPPOSITIONS = {
    ZodiacAnimal.FARE: ZodiacAnimal.AT,
    ZodiacAnimal.AT: ZodiacAnimal.FARE,

    ZodiacAnimal.OKUZ: ZodiacAnimal.KOYUN,
    ZodiacAnimal.KOYUN: ZodiacAnimal.OKUZ,

    ZodiacAnimal.KAPLAN: ZodiacAnimal.MAYMUN,
    ZodiacAnimal.MAYMUN: ZodiacAnimal.KAPLAN,

    ZodiacAnimal.TAVSAN: ZodiacAnimal.HOROZ,
    ZodiacAnimal.HOROZ: ZodiacAnimal.TAVSAN,

    ZodiacAnimal.EJDERHA: ZodiacAnimal.KOPEK,
    ZodiacAnimal.KOPEK: ZodiacAnimal.EJDERHA,

    ZodiacAnimal.YILAN: ZodiacAnimal.DOMUZ,
    ZodiacAnimal.DOMUZ: ZodiacAnimal.YILAN,
}

# Animal names in Turkish and English
ANIMAL_NAMES = {
    ZodiacAnimal.FARE: {'tr': 'Fare', 'en': 'Rat'},
    ZodiacAnimal.OKUZ: {'tr': 'Öküz', 'en': 'Ox'},
    ZodiacAnimal.KAPLAN: {'tr': 'Kaplan', 'en': 'Tiger'},
    ZodiacAnimal.TAVSAN: {'tr': 'Tavşan', 'en': 'Rabbit'},
    ZodiacAnimal.EJDERHA: {'tr': 'Ejderha', 'en': 'Dragon'},
    ZodiacAnimal.YILAN: {'tr': 'Yılan', 'en': 'Snake'},
    ZodiacAnimal.AT: {'tr': 'At', 'en': 'Horse'},
    ZodiacAnimal.KOYUN: {'tr': 'Koyun', 'en': 'Goat'},
    ZodiacAnimal.MAYMUN: {'tr': 'Maymun', 'en': 'Monkey'},
    ZodiacAnimal.HOROZ: {'tr': 'Horoz', 'en': 'Rooster'},
    ZodiacAnimal.KOPEK: {'tr': 'Köpek', 'en': 'Dog'},
    ZodiacAnimal.DOMUZ: {'tr': 'Domuz', 'en': 'Pig'},
}


def get_zodiac_animal(birth_date: date) -> ZodiacAnimal:
    """
    Get Chinese/Turkish zodiac animal from birth year.

    The zodiac follows a 12-year cycle. We use 2020 as the base year (Year of the Rat).

    Args:
        birth_date: Date of birth

    Returns:
        ZodiacAnimal enum value

    Example:
        2020 -> Rat (Fare)
        1987 -> Rabbit (Tavşan)
        1984 -> Rat (Fare)
    """
    year = birth_date.year

    # 2020 is Year of the Rat (position 0)
    offset = (year - 2020) % 12

    # Handle negative offsets for years before 2020
    if offset < 0:
        offset += 12

    return ZODIAC_WHEEL[offset]


def get_zodiac_position(animal: ZodiacAnimal) -> int:
    """
    Get position on zodiac wheel (1-12).

    Args:
        animal: ZodiacAnimal enum value

    Returns:
        Position (1-12)
    """
    return ZODIAC_WHEEL.index(animal) + 1


def get_zodiac_element(animal: ZodiacAnimal) -> ZodiacElement:
    """
    Get element for zodiac animal.

    Args:
        animal: ZodiacAnimal enum value

    Returns:
        ZodiacElement enum value
    """
    return ZODIAC_ELEMENTS[animal]


def get_position_distance(pos1: int, pos2: int) -> int:
    """
    Calculate minimum distance between two positions on zodiac wheel.

    Args:
        pos1: Position 1 (1-12)
        pos2: Position 2 (1-12)

    Returns:
        Minimum distance (0-6)
    """
    # Calculate absolute difference
    diff = abs(pos1 - pos2)

    # Take minimum of forward and backward distance
    return min(diff, 12 - diff)


def are_opposites(animal1: ZodiacAnimal, animal2: ZodiacAnimal) -> bool:
    """
    Check if two animals are opposites (6 positions apart).

    Args:
        animal1: First zodiac animal
        animal2: Second zodiac animal

    Returns:
        True if animals are opposites (clash)
    """
    return ZODIAC_OPPOSITIONS.get(animal1) == animal2


def are_same_element(animal1: ZodiacAnimal, animal2: ZodiacAnimal) -> bool:
    """
    Check if two animals share the same element (Trine harmony).

    Args:
        animal1: First zodiac animal
        animal2: Second zodiac animal

    Returns:
        True if animals share element (harmony)
    """
    return ZODIAC_ELEMENTS[animal1] == ZODIAC_ELEMENTS[animal2]


def get_compatibility_score(animal1: ZodiacAnimal, animal2: ZodiacAnimal) -> int:
    """
    Calculate compatibility score between two zodiac animals.

    Scoring rules:
    - Same animal: +1 (perfect match)
    - Same element (Trine): +1 (harmony)
    - Opposition (6 apart): -1 (clash)
    - Adjacent (1 or 11 apart): 0 (neutral)
    - Square (3 or 9 apart): 0 (tension, treated as neutral)
    - Other: 0 (neutral)

    Args:
        animal1: First zodiac animal
        animal2: Second zodiac animal

    Returns:
        Score: -1 (clash), 0 (neutral), +1 (harmony)
    """
    # Same animal = perfect match
    if animal1 == animal2:
        return 1

    # Opposition = clash
    if are_opposites(animal1, animal2):
        return -1

    # Same element = harmony
    if are_same_element(animal1, animal2):
        return 1

    # All other cases = neutral
    return 0


class ZodiacProfile:
    """
    Complete zodiac profile for a person.
    """

    def __init__(
        self,
        animal: ZodiacAnimal,
        element: ZodiacElement,
        position: int
    ):
        self.animal = animal
        self.element = element
        self.position = position

    @classmethod
    def from_birth_date(cls, birth_date: date):
        """
        Create zodiac profile from birth date.

        Args:
            birth_date: Date of birth

        Returns:
            ZodiacProfile instance
        """
        animal = get_zodiac_animal(birth_date)
        element = get_zodiac_element(animal)
        position = get_zodiac_position(animal)

        return cls(
            animal=animal,
            element=element,
            position=position
        )

    def get_name(self, language: str = 'en') -> str:
        """
        Get animal name in specified language.

        Args:
            language: 'en' or 'tr'

        Returns:
            Animal name
        """
        return ANIMAL_NAMES[self.animal].get(language, ANIMAL_NAMES[self.animal]['en'])

    def to_dict(self) -> dict:
        """Convert to dictionary representation."""
        return {
            'animal': self.animal.value,
            'element': self.element.value,
            'position': self.position,
            'name_tr': self.get_name('tr'),
            'name_en': self.get_name('en')
        }

    def __repr__(self):
        return (
            f"ZodiacProfile(animal={self.animal.value}, "
            f"element={self.element.value}, "
            f"position={self.position})"
        )


# Zodiac characteristics for UI display
ZODIAC_CHARACTERISTICS = {
    ZodiacAnimal.FARE: {
        'traits': ['Clever', 'Quick-witted', 'Resourceful'],
        'description': 'The Rat is charming and ambitious, with strong intuition'
    },
    ZodiacAnimal.OKUZ: {
        'traits': ['Patient', 'Reliable', 'Strong'],
        'description': 'The Ox is steady and determined, valuing tradition'
    },
    ZodiacAnimal.KAPLAN: {
        'traits': ['Brave', 'Confident', 'Competitive'],
        'description': 'The Tiger is courageous and unpredictable, a natural leader'
    },
    ZodiacAnimal.TAVSAN: {
        'traits': ['Gentle', 'Compassionate', 'Elegant'],
        'description': 'The Rabbit is kind and graceful, seeking peace'
    },
    ZodiacAnimal.EJDERHA: {
        'traits': ['Charismatic', 'Powerful', 'Lucky'],
        'description': 'The Dragon is confident and energetic, destined for greatness'
    },
    ZodiacAnimal.YILAN: {
        'traits': ['Wise', 'Enigmatic', 'Intuitive'],
        'description': 'The Snake is deep and mysterious, with great insight'
    },
    ZodiacAnimal.AT: {
        'traits': ['Energetic', 'Independent', 'Free-spirited'],
        'description': 'The Horse is warm-hearted and enthusiastic, loving freedom'
    },
    ZodiacAnimal.KOYUN: {
        'traits': ['Peaceful', 'Creative', 'Sympathetic'],
        'description': 'The Goat is gentle and artistic, valuing harmony'
    },
    ZodiacAnimal.MAYMUN: {
        'traits': ['Clever', 'Playful', 'Curious'],
        'description': 'The Monkey is intelligent and witty, always seeking fun'
    },
    ZodiacAnimal.HOROZ: {
        'traits': ['Confident', 'Honest', 'Hardworking'],
        'description': 'The Rooster is observant and straightforward, seeking perfection'
    },
    ZodiacAnimal.KOPEK: {
        'traits': ['Loyal', 'Honest', 'Responsible'],
        'description': 'The Dog is faithful and reliable, valuing justice'
    },
    ZodiacAnimal.DOMUZ: {
        'traits': ['Generous', 'Compassionate', 'Optimistic'],
        'description': 'The Pig is kind-hearted and sincere, enjoying life'
    }
}


def get_zodiac_characteristics(animal: ZodiacAnimal) -> dict:
    """
    Get characteristics for a zodiac animal.

    Args:
        animal: ZodiacAnimal enum value

    Returns:
        Dictionary with traits and description
    """
    return ZODIAC_CHARACTERISTICS.get(animal, {
        'traits': [],
        'description': ''
    })
