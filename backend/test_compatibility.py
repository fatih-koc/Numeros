"""
Quick test script to verify the compatibility engine works.

Run with: python test_compatibility.py
"""

from datetime import date
from matching.numerology import NumerologyProfile
from matching.zodiac import ZodiacProfile
from matching.compatibility import evaluate_compatibility
import json


def test_compatibility():
    """Test the compatibility engine with sample profiles."""

    print("=" * 80)
    print("numEros Compatibility Engine Test")
    print("=" * 80)
    print()

    # Create test profiles
    print("Creating Test Profiles...")
    print()

    # Person A: Birth date 08.07.1987
    birth_date_a = date(1987, 7, 8)
    profile_a = NumerologyProfile.from_birth_date(
        birth_date=birth_date_a,
        current_year=2026,
        name="Fatih Koç",
        use_turkish=True
    )
    zodiac_a = ZodiacProfile.from_birth_date(birth_date_a)

    print("Person A:")
    print(f"  Name: Fatih Koç")
    print(f"  Birth Date: {birth_date_a}")
    print(f"  Life Path: {profile_a.life_path}")
    print(f"  Day Number: {profile_a.day_number}")
    print(f"  Month Number: {profile_a.month_number}")
    print(f"  Cycle Number (2026): {profile_a.cycle_number}")
    print(f"  Zodiac: {zodiac_a.get_name('en')} ({zodiac_a.animal.value})")
    print(f"  Element: {zodiac_a.element.value}")
    print()

    # Person B: Birth date 07.05.1984
    birth_date_b = date(1984, 5, 7)
    profile_b = NumerologyProfile.from_birth_date(
        birth_date=birth_date_b,
        current_year=2026,
        name="Ayşe Yılmaz",
        use_turkish=True
    )
    zodiac_b = ZodiacProfile.from_birth_date(birth_date_b)

    print("Person B:")
    print(f"  Name: Ayşe Yılmaz")
    print(f"  Birth Date: {birth_date_b}")
    print(f"  Life Path: {profile_b.life_path}")
    print(f"  Day Number: {profile_b.day_number}")
    print(f"  Month Number: {profile_b.month_number}")
    print(f"  Cycle Number (2026): {profile_b.cycle_number}")
    print(f"  Zodiac: {zodiac_b.get_name('en')} ({zodiac_b.animal.value})")
    print(f"  Element: {zodiac_b.element.value}")
    print()

    print("-" * 80)
    print("Evaluating Compatibility...")
    print("-" * 80)
    print()

    # Evaluate compatibility
    result = evaluate_compatibility(
        numerology_a=profile_a,
        numerology_b=profile_b,
        zodiac_a=zodiac_a,
        zodiac_b=zodiac_b
    )

    # Display results
    print("COMPATIBILITY RESULTS")
    print("=" * 80)
    print()

    print(f"Overall Score: {result.total_score:.2f}/100")
    print(f"Dominant Axis: {result.dominant_axis.value}")
    print()

    print("Axis Breakdown:")
    print(f"  Structure:  {result.axes.structure:>6.2f} (Numerology heavy)")
    print(f"  Dynamics:   {result.axes.dynamics:>6.2f} (Directional)")
    print(f"  Culture:    {result.axes.culture:>6.2f} (Zodiac)")
    print(f"  Affinity:   {result.axes.affinity:>6.2f} (Auxiliary factors)")
    print(f"  Time:       {result.axes.time:>6.2f} (Cycle alignment)")
    print()

    print("Match Classification:")
    print(f"  Type: {result.labels.match_type.value}")
    print(f"  Risk Level: {result.labels.risk_level.value}")
    print(f"  Headline: {result.labels.headline}")
    print(f"  Description: {result.labels.description}")
    print(f"  Longevity: {result.labels.longevity_forecast}")
    print()

    print("Rule Trace:")
    print("-" * 80)
    for trace in result.rule_trace:
        status = "✓" if trace.triggered else "○"
        print(f"{status} {trace.rule}")
        if trace.triggered:
            print(f"  Impact: {trace.impact:+.2f}")
            print(f"  {trace.explanation}")
        print()

    print("=" * 80)
    print("JSON Output:")
    print("=" * 80)
    print(json.dumps(result.to_dict(), indent=2))
    print()

    return result


if __name__ == "__main__":
    test_compatibility()
