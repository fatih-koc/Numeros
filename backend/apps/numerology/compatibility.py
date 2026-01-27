"""
Numerology compatibility calculations.
"""

from typing import Dict, List

# Harmony matrix: compatibility[a][b] = score (0-100)
# Based on numerological principles
HARMONY_MATRIX = {
    1: {1: 70, 2: 60, 3: 90, 4: 50, 5: 85, 6: 70, 7: 75, 8: 80, 9: 85},
    2: {1: 60, 2: 85, 3: 70, 4: 90, 5: 50, 6: 95, 7: 60, 8: 85, 9: 75},
    3: {1: 90, 2: 70, 3: 80, 4: 50, 5: 95, 6: 85, 7: 60, 8: 55, 9: 90},
    4: {1: 50, 2: 90, 3: 50, 4: 75, 5: 40, 6: 80, 7: 85, 8: 95, 9: 55},
    5: {1: 85, 2: 50, 3: 95, 4: 40, 5: 75, 6: 60, 7: 85, 8: 55, 9: 90},
    6: {1: 70, 2: 95, 3: 85, 4: 80, 5: 60, 6: 85, 7: 55, 8: 75, 9: 95},
    7: {1: 75, 2: 60, 3: 60, 4: 85, 5: 85, 6: 55, 7: 80, 8: 50, 9: 70},
    8: {1: 80, 2: 85, 3: 55, 4: 95, 5: 55, 6: 75, 7: 50, 8: 75, 9: 65},
    9: {1: 85, 2: 75, 3: 90, 4: 55, 5: 90, 6: 95, 7: 70, 8: 65, 9: 80},
}


def get_pair_harmony(num1: int, num2: int) -> int:
    """
    Get harmony score between two numbers (1-9).

    Args:
        num1: First number (1-9 or master number)
        num2: Second number (1-9 or master number)

    Returns:
        Harmony score 0-100
    """
    # Reduce master numbers for comparison
    n1 = num1 if num1 <= 9 else (num1 % 10) or 9
    n2 = num2 if num2 <= 9 else (num2 % 10) or 9

    return HARMONY_MATRIX.get(n1, {}).get(n2, 50)


def calculate_compatibility(user1_nums: Dict, user2_nums: Dict) -> Dict:
    """
    Calculate full numerology compatibility between two users.

    Args:
        user1_nums: {'life_path': int, 'soul_urge': int, 'expression': int, 'personality': int}
        user2_nums: same structure

    Returns:
        {
            'overall_score': int (0-100),
            'life_path_harmony': int,
            'soul_connection': int,
            'expression_sync': int,
            'personality_match': int,
            'challenges': list[str],
            'strengths': list[str],
        }
    """
    life_path_harmony = get_pair_harmony(user1_nums['life_path'], user2_nums['life_path'])
    soul_connection = get_pair_harmony(user1_nums['soul_urge'], user2_nums['soul_urge'])
    expression_sync = get_pair_harmony(user1_nums['expression'], user2_nums['expression'])
    personality_match = get_pair_harmony(user1_nums['personality'], user2_nums['personality'])

    # Weighted average (Life Path is most important)
    overall_score = int(
        life_path_harmony * 0.35 +
        soul_connection * 0.30 +
        expression_sync * 0.20 +
        personality_match * 0.15
    )

    # Generate interpretation
    challenges: List[str] = []
    strengths: List[str] = []

    if life_path_harmony >= 80:
        strengths.append("Your life paths align beautifully")
    elif life_path_harmony <= 50:
        challenges.append("Different life directions may require compromise")

    if soul_connection >= 85:
        strengths.append("Deep soul-level understanding")
    elif soul_connection <= 45:
        challenges.append("Core desires may differ significantly")

    if expression_sync >= 80:
        strengths.append("Natural communication flow")

    if personality_match >= 80:
        strengths.append("Strong first-impression chemistry")

    return {
        'overall_score': overall_score,
        'life_path_harmony': life_path_harmony,
        'soul_connection': soul_connection,
        'expression_sync': expression_sync,
        'personality_match': personality_match,
        'challenges': challenges,
        'strengths': strengths,
    }


def get_match_type(overall_score: int) -> str:
    """
    Classify match type based on overall compatibility score.

    Args:
        overall_score: 0-100 compatibility score

    Returns:
        Match type string
    """
    if overall_score >= 90:
        return 'twin_flame'
    elif overall_score >= 80:
        return 'magnetic_stability'
    elif overall_score >= 70:
        return 'passionate_tension'
    elif overall_score >= 60:
        return 'gentle_growth'
    elif overall_score >= 50:
        return 'karmic_lesson'
    else:
        return 'incompatible'


MATCH_TYPE_DESCRIPTIONS = {
    'twin_flame': 'Souls aligned across all numbers - rare cosmic mirror',
    'magnetic_stability': 'Strong attraction with solid foundation',
    'passionate_tension': 'Dynamic chemistry with growth potential',
    'gentle_growth': 'Steady connection that deepens with time',
    'karmic_lesson': 'Challenging but transformative union',
    'incompatible': 'Fundamental differences in life direction',
}
