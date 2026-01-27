"""
Astrological synastry (compatibility) calculations.
"""

from typing import Dict, List, Optional, Tuple

ASPECTS = {
    'conjunction': (0, 8),    # 0 degrees, 8 degree orb
    'sextile': (60, 6),
    'square': (90, 8),
    'trine': (120, 8),
    'opposition': (180, 8),
}

HARMONY_ASPECTS = {'trine', 'sextile', 'conjunction'}
TENSION_ASPECTS = {'square', 'opposition'}


def calculate_aspect(long1: float, long2: float) -> Tuple[Optional[str], Optional[float]]:
    """
    Calculate aspect between two planetary positions.

    Args:
        long1: First planet longitude (0-360)
        long2: Second planet longitude (0-360)

    Returns:
        (aspect_name, orb) or (None, None) if no aspect
    """
    diff = abs(long1 - long2)
    if diff > 180:
        diff = 360 - diff

    for aspect_name, (angle, max_orb) in ASPECTS.items():
        orb = abs(diff - angle)
        if orb <= max_orb:
            return aspect_name, round(orb, 2)

    return None, None


def calculate_synastry(chart1_planets: Dict, chart2_planets: Dict) -> Dict:
    """
    Calculate compatibility aspects between two charts.

    Args:
        chart1_planets: dict of planet positions {name: {longitude: float, ...}}
        chart2_planets: same structure

    Returns:
        {
            'aspects': list[dict],
            'harmony_score': int,
            'tension_score': int,
            'overall_compatibility': int (0-100),
            'interpretation': str,
        }
    """
    aspects: List[Dict] = []
    key_planets = ['sun', 'moon', 'venus', 'mars', 'mercury']

    for p1 in key_planets:
        if p1 not in chart1_planets or chart1_planets[p1] is None:
            continue

        for p2 in key_planets:
            if p2 not in chart2_planets or chart2_planets[p2] is None:
                continue

            aspect, orb = calculate_aspect(
                chart1_planets[p1]['longitude'],
                chart2_planets[p2]['longitude']
            )

            if aspect:
                aspects.append({
                    'planet1': p1,
                    'planet2': p2,
                    'aspect': aspect,
                    'orb': orb,
                })

    harmony_count = sum(1 for a in aspects if a['aspect'] in HARMONY_ASPECTS)
    tension_count = sum(1 for a in aspects if a['aspect'] in TENSION_ASPECTS)

    # Calculate overall score (50 baseline, +10 per harmony, -5 per tension)
    overall = max(0, min(100, 50 + (harmony_count * 10) - (tension_count * 5)))

    # Generate interpretation
    interpretation = _generate_interpretation(aspects, harmony_count, tension_count)

    return {
        'aspects': aspects,
        'harmony_score': harmony_count,
        'tension_score': tension_count,
        'overall_compatibility': overall,
        'interpretation': interpretation,
    }


def _generate_interpretation(
    aspects: List[Dict],
    harmony_count: int,
    tension_count: int
) -> str:
    """Generate a text interpretation of the synastry."""
    if harmony_count >= 5:
        return "Exceptional cosmic alignment - your charts resonate on multiple levels"
    elif harmony_count >= 3:
        return "Strong astrological compatibility with harmonious planetary connections"
    elif harmony_count >= tension_count:
        return "Balanced celestial energies with potential for growth"
    elif tension_count > harmony_count:
        return "Dynamic tension that can spark transformation and passion"
    else:
        return "Unique cosmic connection worth exploring"


# Aspect meanings for detailed breakdowns
ASPECT_MEANINGS = {
    'sun': {
        'sun': {
            'conjunction': 'Core identities merge - powerful ego connection',
            'trine': 'Natural understanding and mutual support',
            'sextile': 'Easy communication of core values',
            'square': 'Challenging but growth-inducing tension',
            'opposition': 'Complementary opposites that balance',
        },
        'moon': {
            'conjunction': 'Emotional and ego needs align',
            'trine': 'Emotional harmony and understanding',
            'sextile': 'Supportive emotional connection',
            'square': 'Emotional friction requiring work',
            'opposition': 'Push-pull of needs and desires',
        },
        'venus': {
            'conjunction': 'Love and identity merge beautifully',
            'trine': 'Natural romantic attraction',
            'sextile': 'Appreciation and affection flow easily',
            'square': 'Attraction with complications',
            'opposition': 'Magnetic pull despite differences',
        },
    },
    'moon': {
        'moon': {
            'conjunction': 'Deep emotional resonance',
            'trine': 'Instinctive understanding of needs',
            'sextile': 'Comfortable emotional exchange',
            'square': 'Emotional patterns clash',
            'opposition': 'Different emotional needs',
        },
        'venus': {
            'conjunction': 'Emotional and romantic harmony',
            'trine': 'Natural nurturing affection',
            'sextile': 'Gentle, caring connection',
            'square': 'Love language differences',
            'opposition': 'Attraction across differences',
        },
    },
    'venus': {
        'venus': {
            'conjunction': 'Shared values and aesthetics',
            'trine': 'Easy romantic flow',
            'sextile': 'Pleasurable connection',
            'square': 'Different love styles',
            'opposition': 'Magnetic romantic attraction',
        },
        'mars': {
            'conjunction': 'Intense physical attraction',
            'trine': 'Passionate and harmonious',
            'sextile': 'Playful romantic chemistry',
            'square': 'Explosive passion and friction',
            'opposition': 'Powerful magnetic pull',
        },
    },
}


def get_aspect_meaning(planet1: str, planet2: str, aspect: str) -> str:
    """Get the meaning for a specific aspect between two planets."""
    # Check both orderings
    if planet1 in ASPECT_MEANINGS and planet2 in ASPECT_MEANINGS[planet1]:
        meanings = ASPECT_MEANINGS[planet1][planet2]
    elif planet2 in ASPECT_MEANINGS and planet1 in ASPECT_MEANINGS[planet2]:
        meanings = ASPECT_MEANINGS[planet2][planet1]
    else:
        return f"{planet1.title()} {aspect} {planet2.title()}"

    return meanings.get(aspect, f"{planet1.title()} {aspect} {planet2.title()}")
