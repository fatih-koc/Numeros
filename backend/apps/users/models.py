"""
User model with numerology and astrology profile.
"""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager with email as the unique identifier."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Extended user model with numerology and astrology profile."""

    # Override email to be required and unique (used as login field)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)

    # Basic Info
    display_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    birth_time = models.TimeField(null=True, blank=True)
    birth_place = models.CharField(max_length=200, null=True, blank=True)
    birth_latitude = models.FloatField(null=True, blank=True)
    birth_longitude = models.FloatField(null=True, blank=True)

    # Numerology Numbers (calculated on create, stored for query performance)
    life_path = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(33)]
    )
    soul_urge = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(33)]
    )
    expression = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(33)]
    )
    personality = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(33)]
    )

    # Astrology (calculated fields)
    sun_sign = models.CharField(max_length=20)
    moon_sign = models.CharField(max_length=20, null=True, blank=True)
    rising_sign = models.CharField(max_length=20, null=True, blank=True)
    chart_level = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(4)]
    )

    # Full chart data (JSON for flexibility)
    chart_data = models.JSONField(null=True, blank=True)

    # Profile
    bio = models.TextField(max_length=500, blank=True)
    photos = models.JSONField(default=list)  # List of photo URLs

    # Gender and preferences (for matching)
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('non_binary', 'Non-binary'),
        ('other', 'Other'),
    ]
    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        null=True,
        blank=True
    )
    interested_in = models.JSONField(default=list)  # List of genders

    # Status
    is_verified = models.BooleanField(default=False)
    is_profile_complete = models.BooleanField(default=False)

    # Matching settings
    age_min_preference = models.IntegerField(default=18)
    age_max_preference = models.IntegerField(default=99)
    distance_km_preference = models.IntegerField(default=100)
    women_first_messaging = models.BooleanField(default=False)

    # Tracking
    last_active = models.DateTimeField(auto_now=True)
    last_scan_at = models.DateTimeField(null=True, blank=True)
    daily_discover_count = models.IntegerField(default=0)
    daily_discover_reset = models.DateField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name', 'birth_date']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['life_path']),
            models.Index(fields=['sun_sign']),
            models.Index(fields=['is_active', 'is_profile_complete']),
            models.Index(fields=['gender']),
        ]

    def __str__(self):
        return f"{self.display_name} ({self.email})"

    def get_numerology(self):
        """Return numerology numbers as a dictionary."""
        master_numbers = []
        for num in [self.life_path, self.soul_urge, self.expression, self.personality]:
            if num in [11, 22, 33] and num not in master_numbers:
                master_numbers.append(num)

        return {
            'life_path': self.life_path,
            'soul_urge': self.soul_urge,
            'expression': self.expression,
            'personality': self.personality,
            'master_numbers': master_numbers,
        }

    def get_astrology(self):
        """Return astrology data as a dictionary."""
        return {
            'sun_sign': self.sun_sign,
            'moon_sign': self.moon_sign,
            'rising_sign': self.rising_sign,
            'chart_level': self.chart_level,
            'chart_data': self.chart_data,
        }

    @property
    def age(self):
        """Calculate user's age from birth_date."""
        from datetime import date
        today = date.today()
        born = self.birth_date
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


class Device(models.Model):
    """
    Registered device for push notifications.
    Supports both iOS (APNs) and Android (FCM).
    """

    class Platform(models.TextChoices):
        IOS = 'ios', 'iOS'
        ANDROID = 'android', 'Android'

    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='devices'
    )
    platform = models.CharField(max_length=10, choices=Platform.choices)
    token = models.TextField()  # Push notification token
    device_id = models.CharField(max_length=255, unique=True)  # Unique device identifier

    # Notification preferences
    notifications_enabled = models.BooleanField(default=True)
    match_notifications = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)
    forecast_notifications = models.BooleanField(default=True)

    # Metadata
    app_version = models.CharField(max_length=20, blank=True)
    os_version = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'devices'
        indexes = [
            models.Index(fields=['user', 'platform']),
            models.Index(fields=['token']),
        ]

    def __str__(self):
        return f"{self.user.display_name}'s {self.platform} device"
