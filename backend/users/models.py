"""
User models for numEros.

Custom user model with numerology and zodiac profiles.
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from datetime import date


class UserManager(BaseUserManager):
    """Custom manager for User model."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user."""
        if not email:
            raise ValueError('Email is required')

        # Birth date is required for numerology calculations
        birth_date = extra_fields.get('birth_date')
        if not birth_date:
            raise ValueError('Birth date is required')

        # Get name for name-based calculations
        name = extra_fields.get('name', '')
        use_turkish = extra_fields.get('use_turkish_letters', False)

        # Calculate numerology if not provided
        if 'life_path' not in extra_fields:
            from matching.numerology import (
                calculate_life_path,
                calculate_day_number,
                calculate_month_number,
                calculate_soul_urge,
                calculate_expression,
                calculate_challenge
            )

            extra_fields['life_path'] = calculate_life_path(birth_date)
            extra_fields['day_number'] = calculate_day_number(birth_date)
            extra_fields['month_number'] = calculate_month_number(birth_date)

            if name:
                extra_fields['soul_urge'] = calculate_soul_urge(name, use_turkish)
                extra_fields['expression'] = calculate_expression(name, use_turkish)

            extra_fields['challenge'] = calculate_challenge(birth_date)

        # Calculate zodiac if not provided
        if 'zodiac_animal' not in extra_fields:
            from matching.zodiac import ZodiacProfile

            zodiac = ZodiacProfile.from_birth_date(birth_date)
            extra_fields['zodiac_animal'] = zodiac.animal.value
            extra_fields['zodiac_element'] = zodiac.element.value
            extra_fields['zodiac_position'] = zodiac.position

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model for numEros.

    Stores basic profile information along with precomputed numerology
    and zodiac data for fast matching.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Authentication
    email = models.EmailField(unique=True, max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Profile
    name = models.CharField(max_length=100)
    birth_date = models.DateField()

    # Numerology (precomputed)
    life_path = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(33)],
        help_text='Life path number (1-9, 11, 22, 33)'
    )
    day_number = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(9)],
        help_text='Day number (1-9)'
    )
    month_number = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)],
        help_text='Month number (1-12)'
    )

    # Name numbers (optional)
    soul_urge = models.SmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(33)],
        help_text='Soul urge number (desire axis)'
    )
    expression = models.SmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(33)],
        help_text='Expression number (bond axis)'
    )
    challenge = models.SmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(9)],
        help_text='Challenge number (friction axis)'
    )

    # Zodiac (precomputed)
    zodiac_animal = models.CharField(
        max_length=20,
        help_text='Chinese/Turkish zodiac animal'
    )
    zodiac_element = models.CharField(
        max_length=10,
        help_text='Zodiac element (water, metal, wood, fire)'
    )
    zodiac_position = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)],
        help_text='Position on zodiac wheel (1-12)'
    )

    # Preferences (MVP - minimal)
    gender = models.CharField(max_length=20, blank=True, null=True)
    seeking = models.CharField(max_length=20, blank=True, null=True)

    # Location (optional for MVP)
    location_lat = models.FloatField(null=True, blank=True)
    location_lng = models.FloatField(null=True, blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(auto_now=True)

    # Settings
    use_turkish_letters = models.BooleanField(
        default=False,
        help_text='Use Turkish letter mappings for name calculations'
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'birth_date']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['life_path']),
            models.Index(fields=['zodiac_animal', 'zodiac_element']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.email})"

    def get_cycle_number(self, year: int = None) -> int:
        """
        Calculate cycle number for given year.

        Args:
            year: Year to calculate for (defaults to current year)

        Returns:
            Cycle number (1-9, 11, 22, 33)
        """
        from matching.numerology import calculate_cycle_number

        if year is None:
            year = date.today().year

        return calculate_cycle_number(self.birth_date, year)

    def get_numerology_profile(self, year: int = None):
        """
        Get numerology profile for this user.

        Args:
            year: Year for cycle calculation (defaults to current year)

        Returns:
            NumerologyProfile instance
        """
        from matching.numerology import NumerologyProfile

        if year is None:
            year = date.today().year

        return NumerologyProfile(
            life_path=self.life_path,
            day_number=self.day_number,
            month_number=self.month_number,
            cycle_number=self.get_cycle_number(year),
            soul_urge=self.soul_urge,
            expression=self.expression,
            challenge=self.challenge
        )

    def get_zodiac_profile(self):
        """
        Get zodiac profile for this user.

        Returns:
            ZodiacProfile instance
        """
        from matching.zodiac import ZodiacProfile, ZodiacAnimal, ZodiacElement

        return ZodiacProfile(
            animal=ZodiacAnimal(self.zodiac_animal),
            element=ZodiacElement(self.zodiac_element),
            position=self.zodiac_position
        )

    def calculate_compatibility_with(self, other_user, year: int = None):
        """
        Calculate compatibility with another user.

        Args:
            other_user: Another User instance
            year: Year for cycle calculation (defaults to current year)

        Returns:
            CompatibilityResult instance
        """
        from matching.compatibility import evaluate_compatibility

        if year is None:
            year = date.today().year

        return evaluate_compatibility(
            numerology_a=self.get_numerology_profile(year),
            numerology_b=other_user.get_numerology_profile(year),
            zodiac_a=self.get_zodiac_profile(),
            zodiac_b=other_user.get_zodiac_profile()
        )
