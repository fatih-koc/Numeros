"""
Multidimensional Compatibility Engine (MCE)

Implements the 5-axis compatibility system for numEros matching.
Based on the formal specification in Technical Specification.md

Axes:
1. Structure - Numerology heavy, long-term stability
2. Dynamics - Asymmetric, power balance
3. Culture - Zodiac compatibility
4. Affinity - Auxiliary factors (Phase 2)
5. Time - Cycle alignment

All calculations are deterministic and rule-based.
"""

from typing import Tuple, Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

from .numerology import NumerologyProfile
from .zodiac import ZodiacProfile, get_compatibility_score


# Compatibility matrices (from founder's table)
# Maps life path numbers to compatibility levels

VERY_COMPATIBLE = {
    1: [3, 5],
    2: [4, 6, 8],
    3: [1, 5, 9],
    4: [2, 6, 8, 22],
    5: [1, 3, 7],
    6: [2, 4, 9, 33],
    7: [5, 7, 9],
    8: [2, 4, 6, 22],
    9: [3, 6, 9, 33],
    11: [2, 6, 9, 11],
    22: [4, 6, 8, 22],
    33: [6, 9, 33]
}

MEDIUM_COMPATIBLE = {
    1: [9, 11],
    2: [9, 11],
    3: [6, 11],
    4: [9],
    5: [9],
    6: [11, 22],
    7: [11],
    8: [11],
    9: [1, 11],
    11: [3, 8],
    22: [11],
    33: [11]
}

CHALLENGING = {
    1: [2, 6],
    2: [1, 5],
    3: [4, 8],
    4: [3, 5],
    5: [4, 6, 8],
    6: [1, 5],
    7: [2, 6, 8],
    8: [3, 5, 7],
    9: [4, 8],
    11: [4],
    22: [3, 5],
    33: [1, 8]
}

# Axis weights
W_LIFE = 45
W_DAY = 20
W_MONTH = 10
W_ZODIAC_CHINESE = 20
W_ZODIAC_TURKISH = 15  # Same as Chinese for MVP


class MatchType(str, Enum):
    """Match type classifications"""
    TWIN_FLAME = 'twin_flame'
    MAGNETIC_STABILITY = 'magnetic_stability'
    PASSIONATE_TENSION = 'passionate_tension'
    GENTLE_GROWTH = 'gentle_growth'
    KARMIC_LESSON = 'karmic_lesson'
    INCOMPATIBLE = 'incompatible'


class RiskLevel(str, Enum):
    """Risk level for relationship"""
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'


class DominantAxis(str, Enum):
    """Dominant compatibility axis"""
    STRUCTURE = 'structure'
    DYNAMICS = 'dynamics'
    CULTURE = 'culture'
    AFFINITY = 'affinity'
    TIME = 'time'


@dataclass
class CompatibilityAxes:
    """Five compatibility axes scores"""
    structure: float
    dynamics: float
    culture: float
    affinity: float
    time: float

    def to_dict(self) -> dict:
        return {
            'structure': round(self.structure, 2),
            'dynamics': round(self.dynamics, 2),
            'culture': round(self.culture, 2),
            'affinity': round(self.affinity, 2),
            'time': round(self.time, 2)
        }


@dataclass
class CompatibilityLabels:
    """Human-readable labels for compatibility"""
    match_type: MatchType
    risk_level: RiskLevel
    headline: str
    description: str
    longevity_forecast: str

    def to_dict(self) -> dict:
        return {
            'match_type': self.match_type.value,
            'risk_level': self.risk_level.value,
            'headline': self.headline,
            'description': self.description,
            'longevity_forecast': self.longevity_forecast
        }


@dataclass
class RuleTrace:
    """Trace of a rule that was applied"""
    rule: str
    triggered: bool
    impact: float
    explanation: str

    def to_dict(self) -> dict:
        return {
            'rule': self.rule,
            'triggered': self.triggered,
            'impact': round(self.impact, 2),
            'explanation': self.explanation
        }


@dataclass
class CompatibilityResult:
    """Complete compatibility evaluation result"""
    axes: CompatibilityAxes
    total_score: float
    dominant_axis: DominantAxis
    labels: CompatibilityLabels
    rule_trace: List[RuleTrace]

    def to_dict(self) -> dict:
        return {
            'axes': self.axes.to_dict(),
            'total_score': round(self.total_score, 2),
            'dominant_axis': self.dominant_axis.value,
            'labels': self.labels.to_dict(),
            'rule_trace': [trace.to_dict() for trace in self.rule_trace]
        }


def get_numerology_compatibility(num1: int, num2: int) -> int:
    """
    Get compatibility level between two numerology numbers.

    Args:
        num1: First life path number
        num2: Second life path number

    Returns:
        -1 (challenging), 0 (neutral), +1 (compatible)
    """
    if num2 in VERY_COMPATIBLE.get(num1, []):
        return 1
    elif num2 in MEDIUM_COMPATIBLE.get(num1, []):
        return 0
    elif num2 in CHALLENGING.get(num1, []):
        return -1
    else:
        return 0  # Neutral if not in any list


def calculate_structure_axis(
    profile_a: NumerologyProfile,
    profile_b: NumerologyProfile
) -> Tuple[float, List[RuleTrace]]:
    """
    Calculate Structure Axis (Numerology Heavy).

    Formula: V_Structure = w_L × ℒ(L_A, L_B) + w_D × 𝒟(D_A, D_B) + w_M × δ(M_A = M_B)

    Args:
        profile_a: Numerology profile for person A
        profile_b: Numerology profile for person B

    Returns:
        Tuple of (structure_score, rule_traces)
    """
    trace = []
    score = 0

    # Life path compatibility (highest weight)
    life_compat = get_numerology_compatibility(profile_a.life_path, profile_b.life_path)
    life_score = W_LIFE * life_compat
    score += life_score

    trace.append(RuleTrace(
        rule='Life Path Compatibility',
        triggered=True,
        impact=life_score,
        explanation=f'Life paths {profile_a.life_path} and {profile_b.life_path} are '
                   f'{"compatible" if life_compat > 0 else "challenging" if life_compat < 0 else "neutral"}'
    ))

    # Day number compatibility
    day_compat = get_numerology_compatibility(profile_a.day_number, profile_b.day_number)
    day_score = W_DAY * day_compat
    score += day_score

    trace.append(RuleTrace(
        rule='Day Number Compatibility',
        triggered=True,
        impact=day_score,
        explanation=f'Day numbers {profile_a.day_number} and {profile_b.day_number} are '
                   f'{"compatible" if day_compat > 0 else "challenging" if day_compat < 0 else "neutral"}'
    ))

    # Month number match bonus
    if profile_a.month_number == profile_b.month_number:
        score += W_MONTH
        trace.append(RuleTrace(
            rule='Month Number Match',
            triggered=True,
            impact=W_MONTH,
            explanation=f'Both born in month {profile_a.month_number} - emotional baseline alignment'
        ))
    else:
        trace.append(RuleTrace(
            rule='Month Number Match',
            triggered=False,
            impact=0,
            explanation='Different birth months'
        ))

    return score, trace


def calculate_dynamics_axis(
    profile_a: NumerologyProfile,
    profile_b: NumerologyProfile
) -> Tuple[float, List[RuleTrace]]:
    """
    Calculate Dynamics Axis (Asymmetric/Directional).

    Formula: V_Dynamics = ℒ(L_A, L_B) - ℒ(L_B, L_A)

    This axis captures power imbalances and role dynamics.
    Positive = A has advantage, Negative = B has advantage, Zero = Symmetric

    Args:
        profile_a: Numerology profile for person A
        profile_b: Numerology profile for person B

    Returns:
        Tuple of (dynamics_score, rule_traces)
    """
    trace = []

    a_to_b = get_numerology_compatibility(profile_a.life_path, profile_b.life_path)
    b_to_a = get_numerology_compatibility(profile_b.life_path, profile_a.life_path)

    score = a_to_b - b_to_a

    if score > 0:
        explanation = f'Person A (life path {profile_a.life_path}) has relational advantage'
    elif score < 0:
        explanation = f'Person B (life path {profile_b.life_path}) has relational advantage'
    else:
        explanation = 'Symmetric power dynamic - balanced relationship'

    trace.append(RuleTrace(
        rule='Directional Life Path Compatibility',
        triggered=True,
        impact=score,
        explanation=explanation
    ))

    return score, trace


def calculate_culture_axis(
    zodiac_a: ZodiacProfile,
    zodiac_b: ZodiacProfile
) -> Tuple[float, List[RuleTrace]]:
    """
    Calculate Culture Axis (Zodiac).

    Formula: V_Culture = w_Zc × ℤ_c(Z_cA, Z_cB) + w_Zt × ℤ_t(Z_tA, Z_tB)

    For MVP, Chinese and Turkish zodiac are the same.

    Args:
        zodiac_a: Zodiac profile for person A
        zodiac_b: Zodiac profile for person B

    Returns:
        Tuple of (culture_score, rule_traces)
    """
    trace = []

    # Chinese zodiac compatibility
    zodiac_compat = get_compatibility_score(zodiac_a.animal, zodiac_b.animal)
    chinese_score = W_ZODIAC_CHINESE * zodiac_compat

    if zodiac_compat > 0:
        explanation = f'{zodiac_a.animal.value} and {zodiac_b.animal.value} are harmonious'
    elif zodiac_compat < 0:
        explanation = f'{zodiac_a.animal.value} and {zodiac_b.animal.value} clash (opposition)'
    else:
        explanation = f'{zodiac_a.animal.value} and {zodiac_b.animal.value} are neutral'

    trace.append(RuleTrace(
        rule='Zodiac Compatibility',
        triggered=True,
        impact=chinese_score,
        explanation=explanation
    ))

    # For MVP, Turkish is same as Chinese
    score = chinese_score

    return score, trace


def calculate_affinity_axis() -> Tuple[float, List[RuleTrace]]:
    """
    Calculate Affinity Axis (Auxiliary Factors).

    This is Phase 2 - not implemented in MVP.
    Returns 0 for now.

    Returns:
        Tuple of (affinity_score, rule_traces)
    """
    trace = [RuleTrace(
        rule='Affinity Axis',
        triggered=False,
        impact=0,
        explanation='Auxiliary factors not implemented in MVP'
    )]

    return 0, trace


def calculate_time_axis(
    profile_a: NumerologyProfile,
    profile_b: NumerologyProfile
) -> Tuple[float, List[RuleTrace]]:
    """
    Calculate Time Axis (Cycle Distance).

    Formula: V_Time = -|C(A, t) - C(B, t)|

    Smaller cycle distance = better temporal alignment.

    Args:
        profile_a: Numerology profile for person A
        profile_b: Numerology profile for person B

    Returns:
        Tuple of (time_score, rule_traces)
    """
    trace = []

    cycle_distance = abs(profile_a.cycle_number - profile_b.cycle_number)
    score = -cycle_distance

    if cycle_distance == 0:
        explanation = f'Perfect cycle alignment - both in cycle {profile_a.cycle_number}'
    elif cycle_distance < 4:
        explanation = f'Close cycle alignment (distance: {cycle_distance})'
    elif cycle_distance >= 8:
        explanation = f'Large cycle distance ({cycle_distance}) - timing may be challenging'
    else:
        explanation = f'Moderate cycle distance ({cycle_distance})'

    trace.append(RuleTrace(
        rule='Cycle Alignment',
        triggered=True,
        impact=score,
        explanation=explanation
    ))

    return score, trace


def apply_override_rules(
    axes: CompatibilityAxes,
    profile_a: NumerologyProfile,
    profile_b: NumerologyProfile,
    zodiac_a: ZodiacProfile,
    zodiac_b: ZodiacProfile
) -> Tuple[CompatibilityAxes, List[RuleTrace]]:
    """
    Apply override rules (hard constraints).

    Override 1 - Structural Collapse:
        If ℒ(L_A, L_B) = -1 AND ℤ_c(Z_cA, Z_cB) = -1
        Then V_Culture := -|V_Culture|

    Override 2 - Temporal Suppression:
        If |C(A, t) - C(B, t)| ≥ 8
        Then V_Structure := 0.6 × V_Structure

    Args:
        axes: Current axis scores
        profile_a: Numerology profile for person A
        profile_b: Numerology profile for person B
        zodiac_a: Zodiac profile for person A
        zodiac_b: Zodiac profile for person B

    Returns:
        Tuple of (modified_axes, rule_traces)
    """
    trace = []

    # Override 1: Structural Collapse
    life_compat = get_numerology_compatibility(profile_a.life_path, profile_b.life_path)
    zodiac_compat = get_compatibility_score(zodiac_a.animal, zodiac_b.animal)

    if life_compat == -1 and zodiac_compat == -1:
        old_culture = axes.culture
        axes.culture = -abs(axes.culture)

        trace.append(RuleTrace(
            rule='Structural Collapse Override',
            triggered=True,
            impact=axes.culture - old_culture,
            explanation='Both numerology and zodiac clash - forcing culture score negative'
        ))
    else:
        trace.append(RuleTrace(
            rule='Structural Collapse Override',
            triggered=False,
            impact=0,
            explanation='No double clash detected'
        ))

    # Override 2: Temporal Suppression
    cycle_distance = abs(profile_a.cycle_number - profile_b.cycle_number)

    if cycle_distance >= 8:
        old_structure = axes.structure
        axes.structure = axes.structure * 0.6

        trace.append(RuleTrace(
            rule='Temporal Suppression Override',
            triggered=True,
            impact=axes.structure - old_structure,
            explanation=f'Large cycle distance ({cycle_distance}) reduces structural compatibility'
        ))
    else:
        trace.append(RuleTrace(
            rule='Temporal Suppression Override',
            triggered=False,
            impact=0,
            explanation='Cycle distance within acceptable range'
        ))

    return axes, trace


def determine_dominant_axis(axes: CompatibilityAxes) -> DominantAxis:
    """
    Determine which axis has the strongest influence.

    Returns the axis with the largest absolute value.

    Args:
        axes: Compatibility axes

    Returns:
        DominantAxis enum value
    """
    axis_values = {
        DominantAxis.STRUCTURE: abs(axes.structure),
        DominantAxis.DYNAMICS: abs(axes.dynamics),
        DominantAxis.CULTURE: abs(axes.culture),
        DominantAxis.AFFINITY: abs(axes.affinity),
        DominantAxis.TIME: abs(axes.time)
    }

    return max(axis_values, key=axis_values.get)


def generate_labels(
    total_score: float,
    axes: CompatibilityAxes,
    dominant_axis: DominantAxis
) -> CompatibilityLabels:
    """
    Generate human-readable labels for compatibility result.

    Args:
        total_score: Total compatibility score
        axes: Compatibility axes
        dominant_axis: Dominant axis

    Returns:
        CompatibilityLabels instance
    """
    # Calculate attraction and stability scores
    attraction_score = axes.structure + abs(axes.dynamics)
    stability_score = axes.culture + abs(axes.time)

    # Determine match type
    if total_score >= 85:
        if attraction_score > 50 and stability_score > 30:
            match_type = MatchType.TWIN_FLAME
            headline = 'Cosmic Alignment'
            description = 'Your numbers mirror each other in rare ways'
        else:
            match_type = MatchType.MAGNETIC_STABILITY
            headline = 'Magnetic Stability'
            description = 'Strong attraction meets deep emotional safety'
    elif total_score >= 70:
        if attraction_score > 45 and stability_score < 25:
            match_type = MatchType.PASSIONATE_TENSION
            headline = 'Passionate Tension'
            description = 'Intense chemistry with growth edges'
        else:
            match_type = MatchType.GENTLE_GROWTH
            headline = 'Gentle Growth'
            description = 'A nurturing connection that deepens over time'
    elif total_score >= 50:
        match_type = MatchType.GENTLE_GROWTH
        headline = 'Steady Potential'
        description = 'Different energies that can complement'
    elif total_score >= 30:
        match_type = MatchType.KARMIC_LESSON
        headline = 'Karmic Lesson'
        description = 'This connection teaches through contrast'
    else:
        match_type = MatchType.INCOMPATIBLE
        headline = 'Challenging Match'
        description = 'Fundamental incompatibilities present'

    # Determine risk level
    if total_score >= 75 and stability_score >= 30:
        risk_level = RiskLevel.LOW
    elif total_score >= 50 or stability_score >= 25:
        risk_level = RiskLevel.MEDIUM
    else:
        risk_level = RiskLevel.HIGH

    # Longevity forecast
    if total_score >= 80 and risk_level == RiskLevel.LOW:
        longevity = 'Built for the long term'
    elif total_score >= 65:
        longevity = 'Can last with mutual effort'
    elif match_type == MatchType.PASSIONATE_TENSION:
        longevity = 'Intense but may burn fast'
    else:
        longevity = 'Better as a learning experience'

    return CompatibilityLabels(
        match_type=match_type,
        risk_level=risk_level,
        headline=headline,
        description=description,
        longevity_forecast=longevity
    )


def evaluate_compatibility(
    numerology_a: NumerologyProfile,
    numerology_b: NumerologyProfile,
    zodiac_a: ZodiacProfile,
    zodiac_b: ZodiacProfile
) -> CompatibilityResult:
    """
    Main compatibility evaluation function.

    Calculates all 5 axes, applies override rules, determines dominant axis,
    and generates human-readable labels.

    Args:
        numerology_a: Numerology profile for person A
        numerology_b: Numerology profile for person B
        zodiac_a: Zodiac profile for person A
        zodiac_b: Zodiac profile for person B

    Returns:
        CompatibilityResult with all scores, labels, and rule traces
    """
    all_traces = []

    # Calculate all axes
    structure_score, structure_trace = calculate_structure_axis(numerology_a, numerology_b)
    all_traces.extend(structure_trace)

    dynamics_score, dynamics_trace = calculate_dynamics_axis(numerology_a, numerology_b)
    all_traces.extend(dynamics_trace)

    culture_score, culture_trace = calculate_culture_axis(zodiac_a, zodiac_b)
    all_traces.extend(culture_trace)

    affinity_score, affinity_trace = calculate_affinity_axis()
    all_traces.extend(affinity_trace)

    time_score, time_trace = calculate_time_axis(numerology_a, numerology_b)
    all_traces.extend(time_trace)

    # Create axes object
    axes = CompatibilityAxes(
        structure=structure_score,
        dynamics=dynamics_score,
        culture=culture_score,
        affinity=affinity_score,
        time=time_score
    )

    # Apply override rules
    axes, override_trace = apply_override_rules(
        axes, numerology_a, numerology_b, zodiac_a, zodiac_b
    )
    all_traces.extend(override_trace)

    # Calculate total score
    total_score = sum([
        axes.structure,
        axes.culture,
        axes.affinity,
        # Note: dynamics and time can be negative, but we want them to contribute to variety
        # We include them in total but they're primarily for analysis
    ])

    # Determine dominant axis
    dominant_axis = determine_dominant_axis(axes)

    # Generate labels
    labels = generate_labels(total_score, axes, dominant_axis)

    return CompatibilityResult(
        axes=axes,
        total_score=total_score,
        dominant_axis=dominant_axis,
        labels=labels,
        rule_trace=all_traces
    )
