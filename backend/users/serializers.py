"""
Serializers for user-related models.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from datetime import date
from .models import User
from matching.numerology import (
    NumerologyProfile,
    calculate_life_path,
    calculate_day_number,
    calculate_month_number,
    calculate_soul_urge,
    calculate_expression,
    calculate_challenge,
    get_number_meaning
)
from matching.zodiac import (
    ZodiacProfile,
    get_zodiac_animal,
    get_zodiac_characteristics
)


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
            'name', 'birth_date',
            'gender', 'seeking',
            'use_turkish_letters'
        ]

    def validate(self, attrs):
        """Validate password confirmation."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match'
            })
        return attrs

    def create(self, validated_data):
        """Create user with calculated numerology and zodiac."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # Get basic data
        birth_date = validated_data['birth_date']
        name = validated_data['name']
        use_turkish = validated_data.get('use_turkish_letters', False)

        # Calculate numerology
        life_path = calculate_life_path(birth_date)
        day_number = calculate_day_number(birth_date)
        month_number = calculate_month_number(birth_date)
        soul_urge = calculate_soul_urge(name, use_turkish)
        expression = calculate_expression(name, use_turkish)
        challenge = calculate_challenge(birth_date)

        # Calculate zodiac
        animal = get_zodiac_animal(birth_date)
        zodiac_profile = ZodiacProfile.from_birth_date(birth_date)

        # Create user with precomputed values
        user = User.objects.create(
            email=validated_data['email'],
            name=name,
            birth_date=birth_date,
            life_path=life_path,
            day_number=day_number,
            month_number=month_number,
            soul_urge=soul_urge,
            expression=expression,
            challenge=challenge,
            zodiac_animal=zodiac_profile.animal.value,
            zodiac_element=zodiac_profile.element.value,
            zodiac_position=zodiac_profile.position,
            gender=validated_data.get('gender'),
            seeking=validated_data.get('seeking'),
            use_turkish_letters=use_turkish
        )
        user.set_password(password)
        user.save()

        return user


class NumerologySerializer(serializers.Serializer):
    """Serializer for numerology profile."""

    life_path = serializers.IntegerField()
    day_number = serializers.IntegerField()
    month_number = serializers.IntegerField()
    cycle_number = serializers.IntegerField()
    soul_urge = serializers.IntegerField(allow_null=True)
    expression = serializers.IntegerField(allow_null=True)
    challenge = serializers.IntegerField(allow_null=True)

    # Include meanings
    life_path_meaning = serializers.SerializerMethodField()

    def get_life_path_meaning(self, obj):
        """Get meaning for life path number."""
        life_path = obj.get('life_path') if isinstance(obj, dict) else obj.life_path
        return get_number_meaning(life_path)


class ZodiacSerializer(serializers.Serializer):
    """Serializer for zodiac profile."""

    animal = serializers.CharField()
    element = serializers.CharField()
    position = serializers.IntegerField()
    name_tr = serializers.CharField()
    name_en = serializers.CharField()

    # Include characteristics
    characteristics = serializers.SerializerMethodField()

    def get_characteristics(self, obj):
        """Get characteristics for zodiac animal."""
        from matching.zodiac import ZodiacAnimal, get_zodiac_characteristics
        animal = obj.get('animal') if isinstance(obj, dict) else obj.animal
        if isinstance(animal, str):
            animal = ZodiacAnimal(animal)
        return get_zodiac_characteristics(animal)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""

    numerology = serializers.SerializerMethodField()
    zodiac = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'birth_date',
            'numerology', 'zodiac',
            'gender', 'seeking',
            'created_at', 'last_active'
        ]
        read_only_fields = ['id', 'email', 'created_at', 'last_active']

    def get_numerology(self, obj):
        """Get numerology profile."""
        year = date.today().year
        profile = obj.get_numerology_profile(year)
        return NumerologySerializer(profile.to_dict()).data

    def get_zodiac(self, obj):
        """Get zodiac profile."""
        profile = obj.get_zodiac_profile()
        return ZodiacSerializer(profile.to_dict()).data


class UserPublicProfileSerializer(serializers.ModelSerializer):
    """Serializer for public user profile (shown to matches)."""

    numerology = serializers.SerializerMethodField()
    zodiac = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'name', 'age',
            'numerology', 'zodiac',
            'gender'
        ]

    def get_age(self, obj):
        """Calculate age from birth date."""
        today = date.today()
        return today.year - obj.birth_date.year - (
            (today.month, today.day) < (obj.birth_date.month, obj.birth_date.day)
        )

    def get_numerology(self, obj):
        """Get numerology profile."""
        year = date.today().year
        profile = obj.get_numerology_profile(year)
        return NumerologySerializer(profile.to_dict()).data

    def get_zodiac(self, obj):
        """Get zodiac profile."""
        profile = obj.get_zodiac_profile()
        return ZodiacSerializer(profile.to_dict()).data


class ProfileCalculationSerializer(serializers.Serializer):
    """Serializer for calculating profile from birth data."""

    name = serializers.CharField(max_length=100)
    birth_date = serializers.DateField()
    use_turkish_letters = serializers.BooleanField(default=False)
    current_year = serializers.IntegerField(required=False)

    def validate_birth_date(self, value):
        """Validate birth date is not in future."""
        if value > date.today():
            raise serializers.ValidationError('Birth date cannot be in the future')
        return value

    def calculate(self):
        """Calculate and return numerology and zodiac profiles."""
        data = self.validated_data
        year = data.get('current_year', date.today().year)

        numerology = NumerologyProfile.from_birth_date(
            birth_date=data['birth_date'],
            current_year=year,
            name=data['name'],
            use_turkish=data['use_turkish_letters']
        )

        zodiac = ZodiacProfile.from_birth_date(data['birth_date'])

        return {
            'numerology': NumerologySerializer(numerology.to_dict()).data,
            'zodiac': ZodiacSerializer(zodiac.to_dict()).data
        }


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""

    class Meta:
        model = User
        fields = ['name', 'gender', 'seeking', 'location_lat', 'location_lng']

    def update(self, instance, validated_data):
        """Update user and recalculate if name changed."""
        name_changed = 'name' in validated_data and validated_data['name'] != instance.name

        instance = super().update(instance, validated_data)

        # Recalculate name numbers if name changed
        if name_changed:
            instance.soul_urge = calculate_soul_urge(
                instance.name,
                instance.use_turkish_letters
            )
            instance.expression = calculate_expression(
                instance.name,
                instance.use_turkish_letters
            )
            instance.save(update_fields=['soul_urge', 'expression'])

        return instance
