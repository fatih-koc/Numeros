"""
Daily numerology forecast calculations.
"""

from datetime import date, datetime
from typing import Dict, Optional

from .engine import reduce_to_single


def calculate_universal_day(target_date: date) -> int:
    """
    Calculate the Universal Day Number.
    Reduces the date (day + month + year) to a single digit.
    """
    day = target_date.day
    month = target_date.month
    year = target_date.year

    total = day + month + sum(int(d) for d in str(year))
    return reduce_to_single(total, preserve_master=False)


def calculate_personal_day(birth_date: date, target_date: date) -> int:
    """
    Calculate the Personal Day Number.
    Combines birth day/month with universal year/day.
    """
    birth_day = birth_date.day
    birth_month = birth_date.month

    # Personal Year = birth day + birth month + current year
    current_year = target_date.year
    personal_year = reduce_to_single(
        birth_day + birth_month + sum(int(d) for d in str(current_year)),
        preserve_master=False
    )

    # Personal Month = personal year + current month
    personal_month = reduce_to_single(
        personal_year + target_date.month,
        preserve_master=False
    )

    # Personal Day = personal month + current day
    personal_day = reduce_to_single(
        personal_month + target_date.day,
        preserve_master=False
    )

    return personal_day


# Energy descriptions for each number
DAY_ENERGIES: Dict[int, Dict] = {
    1: {
        'theme': 'New Beginnings',
        'energy': 'Initiative & Independence',
        'color': '#DC2626',  # Red
        'glow': '#DC262640',
        'advice': 'Take the lead on projects. Your confidence is high.',
        'love': 'Express your feelings directly. Bold moves are favored.',
        'challenge': 'Avoid being too forceful or impatient with others.',
    },
    2: {
        'theme': 'Partnership',
        'energy': 'Cooperation & Sensitivity',
        'color': '#F472B6',  # Pink
        'glow': '#F472B640',
        'advice': 'Focus on relationships and diplomacy. Listen more.',
        'love': 'Emotional connections deepen. Be receptive to your partner.',
        'challenge': 'Don\'t let indecision hold you back.',
    },
    3: {
        'theme': 'Expression',
        'energy': 'Creativity & Communication',
        'color': '#F59E0B',  # Amber
        'glow': '#F59E0B40',
        'advice': 'Share your ideas. Creative energy is abundant.',
        'love': 'Playfulness and humor strengthen bonds.',
        'challenge': 'Avoid scattering your energy in too many directions.',
    },
    4: {
        'theme': 'Foundation',
        'energy': 'Stability & Hard Work',
        'color': '#10B981',  # Emerald
        'glow': '#10B98140',
        'advice': 'Build something lasting. Focus on practical matters.',
        'love': 'Security and commitment are themes. Show reliability.',
        'challenge': 'Don\'t become too rigid or resistant to change.',
    },
    5: {
        'theme': 'Change',
        'energy': 'Freedom & Adventure',
        'color': '#06B6D4',  # Cyan
        'glow': '#06B6D440',
        'advice': 'Embrace the unexpected. Flexibility is your strength.',
        'love': 'Spontaneity sparks romance. Try something new together.',
        'challenge': 'Avoid restlessness or making impulsive decisions.',
    },
    6: {
        'theme': 'Harmony',
        'energy': 'Love & Responsibility',
        'color': '#FBBF24',  # Yellow
        'glow': '#FBBF2440',
        'advice': 'Nurture your relationships. Home and family matters.',
        'love': 'Deep emotional bonds form. Care for your loved ones.',
        'challenge': 'Don\'t neglect your own needs while caring for others.',
    },
    7: {
        'theme': 'Reflection',
        'energy': 'Wisdom & Introspection',
        'color': '#6366F1',  # Indigo
        'glow': '#6366F140',
        'advice': 'Seek deeper understanding. Trust your intuition.',
        'love': 'Spiritual connections matter more than surface attraction.',
        'challenge': 'Avoid isolation or overthinking.',
    },
    8: {
        'theme': 'Abundance',
        'energy': 'Power & Achievement',
        'color': '#8B5CF6',  # Violet
        'glow': '#8B5CF640',
        'advice': 'Focus on material goals. Your efforts can bring rewards.',
        'love': 'Balance power dynamics. Generosity attracts love.',
        'challenge': 'Don\'t let ambition overshadow personal connections.',
    },
    9: {
        'theme': 'Completion',
        'energy': 'Compassion & Release',
        'color': '#F5F5F5',  # White/Silver
        'glow': '#F5F5F540',
        'advice': 'Let go of what no longer serves you. Give generously.',
        'love': 'Universal love and forgiveness heal relationships.',
        'challenge': 'Release attachments to outcomes.',
    },
}


def get_daily_forecast(
    life_path: int,
    birth_date: date,
    target_date: Optional[date] = None
) -> Dict:
    """
    Generate a personalized daily forecast.

    Args:
        life_path: User's life path number
        birth_date: User's birth date
        target_date: Date to forecast (defaults to today)

    Returns:
        Dictionary with forecast data
    """
    if target_date is None:
        target_date = date.today()

    universal_day = calculate_universal_day(target_date)
    personal_day = calculate_personal_day(birth_date, target_date)

    # Get energy data
    universal_energy = DAY_ENERGIES.get(universal_day, DAY_ENERGIES[1])
    personal_energy = DAY_ENERGIES.get(personal_day, DAY_ENERGIES[1])

    # Calculate harmony between life path and day numbers
    life_path_reduced = life_path if life_path <= 9 else reduce_to_single(life_path, False)
    harmony_score = _calculate_day_harmony(life_path_reduced, personal_day, universal_day)

    return {
        'date': target_date.isoformat(),
        'universal_day': {
            'number': universal_day,
            'theme': universal_energy['theme'],
            'energy': universal_energy['energy'],
            'color': universal_energy['color'],
            'glow': universal_energy['glow'],
        },
        'personal_day': {
            'number': personal_day,
            'theme': personal_energy['theme'],
            'energy': personal_energy['energy'],
            'color': personal_energy['color'],
            'glow': personal_energy['glow'],
            'advice': personal_energy['advice'],
            'love': personal_energy['love'],
            'challenge': personal_energy['challenge'],
        },
        'life_path': life_path,
        'harmony_score': harmony_score,
        'harmony_description': _get_harmony_description(harmony_score),
    }


def _calculate_day_harmony(life_path: int, personal_day: int, universal_day: int) -> int:
    """Calculate how harmonious the day is for this life path (0-100)."""
    # Same numbers = high harmony
    base_score = 50

    if life_path == personal_day:
        base_score += 25
    elif abs(life_path - personal_day) <= 2:
        base_score += 15

    if life_path == universal_day:
        base_score += 15
    elif abs(life_path - universal_day) <= 2:
        base_score += 10

    # Complementary numbers
    complements = {
        1: [5, 9], 2: [4, 6], 3: [6, 9], 4: [2, 8],
        5: [1, 7], 6: [2, 3], 7: [5, 9], 8: [4, 2], 9: [1, 3, 7]
    }

    if personal_day in complements.get(life_path, []):
        base_score += 10

    return min(100, max(0, base_score))


def _get_harmony_description(score: int) -> str:
    """Get description for harmony score."""
    if score >= 85:
        return "Exceptional alignment - your energy flows naturally today"
    elif score >= 70:
        return "Strong harmony - favorable conditions for your goals"
    elif score >= 55:
        return "Balanced energy - steady progress is possible"
    elif score >= 40:
        return "Mixed influences - stay flexible and adaptable"
    else:
        return "Challenging aspects - patience and mindfulness help"
