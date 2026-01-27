"""
User serializers for API responses and request validation.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from apps.numerology.engine import calculate_all as calculate_numerology
from apps.astrology.engine import calculate_full_chart, get_sun_sign, get_moon_sign, serialize_chart

User = get_user_model()


class NumerologySerializer(serializers.Serializer):
    """Serializer for numerology data."""
    life_path = serializers.IntegerField()
    soul_urge = serializers.IntegerField()
    expression = serializers.IntegerField()
    personality = serializers.IntegerField()
    master_numbers = serializers.ListField(child=serializers.IntegerField())


class AstrologySerializer(serializers.Serializer):
    """Serializer for astrology data matching scanOutput.ts."""
    zodiac_system = serializers.CharField(default='tropical')
    ephemeris = serializers.CharField(default='pyswisseph')
    angles = serializers.DictField()
    houses = serializers.DictField(allow_null=True)
    planets = serializers.DictField()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile data."""
    numerology = serializers.SerializerMethodField()
    astrology = serializers.SerializerMethodField()
    age = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'display_name',
            'birth_date', 'birth_time', 'birth_place',
            'birth_latitude', 'birth_longitude',
            'bio', 'photos', 'gender', 'interested_in',
            'is_verified', 'is_profile_complete',
            'age_min_preference', 'age_max_preference',
            'distance_km_preference', 'women_first_messaging',
            'chart_level', 'age',
            'numerology', 'astrology',
            'created_at', 'last_active',
        ]
        read_only_fields = [
            'id', 'email', 'is_verified', 'chart_level',
            'created_at', 'last_active', 'age',
        ]

    def get_numerology(self, obj):
        return obj.get_numerology()

    def get_astrology(self, obj):
        return obj.get_astrology()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm',
            'display_name', 'birth_date', 'birth_time',
            'birth_place', 'birth_latitude', 'birth_longitude',
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')

        # Calculate numerology
        name = validated_data['display_name']
        birth_date = str(validated_data['birth_date'])
        numerology = calculate_numerology(name, birth_date)

        # Calculate astrology
        birth_time = validated_data.get('birth_time')
        birth_time_str = birth_time.strftime('%H:%M') if birth_time else None
        latitude = validated_data.get('birth_latitude')
        longitude = validated_data.get('birth_longitude')

        chart = calculate_full_chart(
            birth_date,
            birth_time_str,
            latitude,
            longitude
        )

        # Create user with calculated values
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            display_name=validated_data['display_name'],
            birth_date=validated_data['birth_date'],
            birth_time=birth_time,
            birth_place=validated_data.get('birth_place'),
            birth_latitude=latitude,
            birth_longitude=longitude,
            # Numerology
            life_path=numerology['life_path'],
            soul_urge=numerology['soul_urge'],
            expression=numerology['expression'],
            personality=numerology['personality'],
            # Astrology
            sun_sign=get_sun_sign(birth_date),
            moon_sign=get_moon_sign(birth_date, birth_time_str),
            rising_sign=chart.angles.get('ascendant', {}).get('sign') if chart.angles.get('ascendant') else None,
            chart_level=chart.chart_level,
            chart_data=serialize_chart(chart),
        )

        return user


class CalculateRequestSerializer(serializers.Serializer):
    """Serializer for anonymous profile calculation request."""
    name = serializers.CharField(max_length=100)
    birth_date = serializers.DateField()
    birth_time = serializers.TimeField(required=False, allow_null=True)
    birth_place = serializers.CharField(max_length=200, required=False, allow_null=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)


class CalculateResponseSerializer(serializers.Serializer):
    """Serializer for anonymous profile calculation response."""
    chart_level = serializers.IntegerField()
    numerology = NumerologySerializer()
    astrology = AstrologySerializer()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for profile updates."""

    class Meta:
        model = User
        fields = [
            'display_name', 'bio', 'photos',
            'gender', 'interested_in',
            'age_min_preference', 'age_max_preference',
            'distance_km_preference', 'women_first_messaging',
        ]

    def update(self, instance, validated_data):
        # Check if profile becomes complete
        instance = super().update(instance, validated_data)

        # Mark profile as complete if required fields are filled
        if (instance.bio and instance.photos and instance.gender):
            instance.is_profile_complete = True
            instance.save(update_fields=['is_profile_complete'])

        return instance
