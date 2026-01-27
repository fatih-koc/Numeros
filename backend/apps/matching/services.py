"""
Matching services - Combined compatibility calculations.
"""

from typing import Dict, List, Optional, Tuple
from datetime import timedelta
from django.utils import timezone
from django.db.models import Q

from apps.numerology.compatibility import (
    calculate_compatibility as calculate_numerology_compatibility,
    get_match_type,
    MATCH_TYPE_DESCRIPTIONS,
)
from apps.astrology.compatibility import (
    calculate_synastry,
    get_aspect_meaning,
)


def calculate_full_compatibility(user1, user2) -> Dict:
    """
    Calculate full compatibility between two users combining numerology and astrology.

    Args:
        user1: First user instance
        user2: Second user instance

    Returns:
        {
            'overall_score': int (0-100),
            'match_type': str,
            'match_description': str,
            'numerology': {...},
            'astrology': {...},
            'highlights': list[str],
        }
    """
    # Numerology compatibility
    user1_nums = {
        'life_path': user1.life_path,
        'soul_urge': user1.soul_urge,
        'expression': user1.expression,
        'personality': user1.personality,
    }
    user2_nums = {
        'life_path': user2.life_path,
        'soul_urge': user2.soul_urge,
        'expression': user2.expression,
        'personality': user2.personality,
    }

    numerology = calculate_numerology_compatibility(user1_nums, user2_nums)

    # Astrology compatibility (if both have chart data)
    astrology = None
    astrology_score = 50  # Default neutral score

    if user1.chart_data and user2.chart_data:
        user1_planets = user1.chart_data.get('planets', {})
        user2_planets = user2.chart_data.get('planets', {})

        if user1_planets and user2_planets:
            astrology = calculate_synastry(user1_planets, user2_planets)
            astrology_score = astrology['overall_compatibility']

            # Add aspect meanings
            for aspect in astrology.get('aspects', []):
                aspect['meaning'] = get_aspect_meaning(
                    aspect['planet1'],
                    aspect['planet2'],
                    aspect['aspect']
                )

    # Combined overall score (60% numerology, 40% astrology)
    overall_score = int(numerology['overall_score'] * 0.6 + astrology_score * 0.4)

    # Determine match type
    match_type = get_match_type(overall_score)
    match_description = MATCH_TYPE_DESCRIPTIONS.get(match_type, '')

    # Generate highlights
    highlights = _generate_highlights(numerology, astrology, user1, user2)

    return {
        'overall_score': overall_score,
        'match_type': match_type,
        'match_description': match_description,
        'numerology': numerology,
        'astrology': astrology,
        'highlights': highlights,
    }


def _generate_highlights(
    numerology: Dict,
    astrology: Optional[Dict],
    user1,
    user2
) -> List[str]:
    """Generate human-readable compatibility highlights."""
    highlights = []

    # Numerology highlights
    if numerology['life_path_harmony'] >= 85:
        highlights.append(f"Your Life Paths ({user1.life_path} & {user2.life_path}) are in perfect harmony")
    elif numerology['life_path_harmony'] >= 70:
        highlights.append(f"Strong Life Path connection ({user1.life_path} & {user2.life_path})")

    if numerology['soul_connection'] >= 85:
        highlights.append("Deep soul-level understanding")

    if numerology['expression_sync'] >= 80:
        highlights.append("Natural communication flow")

    # Astrology highlights
    if astrology:
        harmony_aspects = [a for a in astrology.get('aspects', [])
                         if a['aspect'] in ('trine', 'sextile', 'conjunction')]

        # Find key aspects
        for aspect in harmony_aspects[:3]:  # Top 3 harmonious aspects
            p1 = aspect['planet1'].title()
            p2 = aspect['planet2'].title()
            aspect_name = aspect['aspect'].title()

            if aspect['planet1'] == 'venus' or aspect['planet2'] == 'venus':
                highlights.append(f"Venus {aspect_name}: Romantic harmony")
            elif aspect['planet1'] == 'moon' or aspect['planet2'] == 'moon':
                highlights.append(f"Moon {aspect_name}: Emotional connection")
            elif aspect['planet1'] == 'sun' and aspect['planet2'] == 'sun':
                highlights.append(f"Sun {aspect_name}: Core identity alignment")

    # Sun sign compatibility
    if user1.sun_sign and user2.sun_sign:
        element_matches = _check_element_compatibility(user1.sun_sign, user2.sun_sign)
        if element_matches:
            highlights.append(f"{user1.sun_sign} & {user2.sun_sign}: {element_matches}")

    return highlights[:5]  # Limit to 5 highlights


def _check_element_compatibility(sign1: str, sign2: str) -> Optional[str]:
    """Check if two signs share compatible elements."""
    FIRE_SIGNS = {'Aries', 'Leo', 'Sagittarius'}
    EARTH_SIGNS = {'Taurus', 'Virgo', 'Capricorn'}
    AIR_SIGNS = {'Gemini', 'Libra', 'Aquarius'}
    WATER_SIGNS = {'Cancer', 'Scorpio', 'Pisces'}

    def get_element(sign):
        if sign in FIRE_SIGNS:
            return 'Fire'
        elif sign in EARTH_SIGNS:
            return 'Earth'
        elif sign in AIR_SIGNS:
            return 'Air'
        elif sign in WATER_SIGNS:
            return 'Water'
        return None

    e1 = get_element(sign1)
    e2 = get_element(sign2)

    if e1 == e2:
        return f"Same element ({e1}) - natural understanding"
    elif (e1, e2) in [('Fire', 'Air'), ('Air', 'Fire')]:
        return "Fire & Air - inspiring connection"
    elif (e1, e2) in [('Earth', 'Water'), ('Water', 'Earth')]:
        return "Earth & Water - nurturing bond"

    return None


def get_scan_candidates(user, limit: int = 20, filters: Optional[Dict] = None) -> List:
    """
    Get potential matches for a user.

    Args:
        user: The requesting user
        limit: Maximum number of results
        filters: Optional filters (age_min, age_max, gender)

    Returns:
        List of user instances with compatibility scores
    """
    from apps.users.models import User
    from apps.matching.models import Resonance

    # Get IDs of users already resonated with
    resonated_ids = Resonance.objects.filter(
        from_user=user
    ).values_list('to_user_id', flat=True)

    # Base query - exclude self and already resonated
    queryset = User.objects.filter(
        is_active=True,
        is_profile_complete=True,
    ).exclude(
        id=user.id
    ).exclude(
        id__in=resonated_ids
    )

    # Apply gender filter
    if user.interested_in:
        queryset = queryset.filter(gender__in=user.interested_in)

    # Apply age filter
    if filters:
        age_min = filters.get('age_min', user.age_min_preference)
        age_max = filters.get('age_max', user.age_max_preference)

        # Calculate birth date range for age filter
        today = timezone.now().date()
        max_birth_date = today.replace(year=today.year - age_min)
        min_birth_date = today.replace(year=today.year - age_max - 1)

        queryset = queryset.filter(
            birth_date__gte=min_birth_date,
            birth_date__lte=max_birth_date
        )

    # Get candidates
    candidates = list(queryset[:limit * 2])  # Get extra to account for filtering

    # Calculate compatibility for each
    results = []
    for candidate in candidates:
        compatibility = calculate_full_compatibility(user, candidate)
        results.append({
            'user': candidate,
            'compatibility': compatibility,
        })

    # Sort by compatibility score
    results.sort(key=lambda x: x['compatibility']['overall_score'], reverse=True)

    return results[:limit]


def process_resonance(from_user, to_user, action: str) -> Tuple[bool, Optional['Match']]:
    """
    Process a resonance action and check for mutual match.

    Args:
        from_user: User sending the resonance
        to_user: User receiving the resonance
        action: 'resonate', 'decline', or 'maybe_later'

    Returns:
        (is_match, match_instance or None)
    """
    from apps.matching.models import Resonance, Match

    # Calculate compatibility for storage
    compatibility = calculate_full_compatibility(from_user, to_user)

    # Create or update resonance
    resonance, created = Resonance.objects.update_or_create(
        from_user=from_user,
        to_user=to_user,
        defaults={
            'action': action,
            'compatibility_score': compatibility['overall_score'],
            'compatibility_data': compatibility,
            'expires_at': (
                timezone.now() + timedelta(days=7)
                if action == 'maybe_later' else None
            ),
        }
    )

    # Check for mutual resonance
    is_match = False
    match = None

    if action == 'resonate':
        # Check if other user has already resonated
        mutual = Resonance.objects.filter(
            from_user=to_user,
            to_user=from_user,
            action='resonate'
        ).exists()

        if mutual:
            is_match = True
            # Create match (ensure consistent ordering)
            user1, user2 = (from_user, to_user) if from_user.id < to_user.id else (to_user, from_user)

            match, _ = Match.objects.get_or_create(
                user1=user1,
                user2=user2,
                defaults={
                    'compatibility_data': compatibility,
                    'overall_score': compatibility['overall_score'],
                }
            )

    return is_match, match
