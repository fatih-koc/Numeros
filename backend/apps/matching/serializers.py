"""
Matching serializers for API responses.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Resonance, Match

User = get_user_model()


class ProfileCardSerializer(serializers.ModelSerializer):
    """
    Serializer for profile cards shown in scan results.
    Includes basic info and numerology, excludes sensitive data.
    """
    age = serializers.IntegerField(read_only=True)
    numerology = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'display_name', 'age',
            'photos', 'bio',
            'sun_sign', 'chart_level',
            'numerology',
        ]

    def get_numerology(self, obj):
        return {
            'life_path': obj.life_path,
            'soul_urge': obj.soul_urge,
            'expression': obj.expression,
            'personality': obj.personality,
        }


class CompatibilitySerializer(serializers.Serializer):
    """Serializer for compatibility data."""
    overall_score = serializers.IntegerField()
    match_type = serializers.CharField()
    match_description = serializers.CharField()
    highlights = serializers.ListField(child=serializers.CharField())

    # Detailed breakdowns (optional)
    numerology = serializers.DictField(required=False)
    astrology = serializers.DictField(required=False, allow_null=True)


class ScanResultSerializer(serializers.Serializer):
    """Serializer for a single scan result."""
    profile = ProfileCardSerializer(source='user')
    compatibility = CompatibilitySerializer()


class ScanResponseSerializer(serializers.Serializer):
    """Serializer for scan endpoint response."""
    profiles = ScanResultSerializer(many=True)
    count = serializers.IntegerField()
    has_more = serializers.BooleanField()


class ScanRequestSerializer(serializers.Serializer):
    """Serializer for scan request filters."""
    limit = serializers.IntegerField(default=10, min_value=1, max_value=50)
    age_min = serializers.IntegerField(required=False, min_value=18)
    age_max = serializers.IntegerField(required=False, max_value=99)


class ResonanceRequestSerializer(serializers.Serializer):
    """Serializer for resonance action request."""
    target_user_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=['resonate', 'decline', 'maybe_later'])


class ResonanceResponseSerializer(serializers.Serializer):
    """Serializer for resonance action response."""
    success = serializers.BooleanField()
    is_match = serializers.BooleanField()
    match = serializers.SerializerMethodField()

    def get_match(self, obj):
        if obj.get('match'):
            return MatchSerializer(obj['match'], context=self.context).data
        return None


class ResonanceSerializer(serializers.ModelSerializer):
    """Serializer for Resonance model."""
    from_user = ProfileCardSerializer(read_only=True)
    to_user = ProfileCardSerializer(read_only=True)

    class Meta:
        model = Resonance
        fields = [
            'id', 'from_user', 'to_user',
            'action', 'compatibility_score',
            'created_at', 'expires_at',
        ]


class MatchUserSerializer(serializers.ModelSerializer):
    """Serializer for user in match context."""
    age = serializers.IntegerField(read_only=True)
    numerology = serializers.SerializerMethodField()
    astrology = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'display_name', 'age',
            'photos', 'bio',
            'sun_sign', 'moon_sign', 'rising_sign',
            'chart_level',
            'numerology', 'astrology',
        ]

    def get_numerology(self, obj):
        return obj.get_numerology()

    def get_astrology(self, obj):
        return obj.get_astrology()


class MatchSerializer(serializers.ModelSerializer):
    """Serializer for Match model."""
    other_user = serializers.SerializerMethodField()
    compatibility = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = [
            'id', 'other_user',
            'overall_score', 'compatibility',
            'is_conversation_started', 'last_message_at',
            'created_at',
        ]

    def get_other_user(self, obj):
        request = self.context.get('request')
        if request:
            other = obj.get_other_user(request.user)
            return MatchUserSerializer(other).data
        # Fallback - return user2
        return MatchUserSerializer(obj.user2).data

    def get_compatibility(self, obj):
        return obj.compatibility_data


class MatchDetailSerializer(MatchSerializer):
    """Detailed serializer for match with full compatibility breakdown."""
    user1 = MatchUserSerializer(read_only=True)
    user2 = MatchUserSerializer(read_only=True)

    class Meta(MatchSerializer.Meta):
        fields = MatchSerializer.Meta.fields + ['user1', 'user2']


class EvaluateRequestSerializer(serializers.Serializer):
    """Serializer for compatibility evaluation request."""
    target_user_id = serializers.IntegerField()


class EvaluateResponseSerializer(serializers.Serializer):
    """Serializer for compatibility evaluation response."""
    profile = MatchUserSerializer()
    compatibility = CompatibilitySerializer()


class IncomingResonanceSerializer(serializers.ModelSerializer):
    """Serializer for incoming resonances (people who liked you)."""
    user = serializers.SerializerMethodField()
    compatibility_score = serializers.IntegerField()

    class Meta:
        model = Resonance
        fields = ['id', 'user', 'compatibility_score', 'created_at']

    def get_user(self, obj):
        return ProfileCardSerializer(obj.from_user).data


class MaybeLaterSerializer(serializers.ModelSerializer):
    """Serializer for Maybe Later queue items."""
    user = serializers.SerializerMethodField()
    compatibility_score = serializers.IntegerField()
    expires_at = serializers.DateTimeField()
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Resonance
        fields = ['id', 'user', 'compatibility_score', 'expires_at', 'days_remaining', 'created_at']

    def get_user(self, obj):
        return ProfileCardSerializer(obj.to_user).data

    def get_days_remaining(self, obj):
        if obj.expires_at:
            from django.utils import timezone
            delta = obj.expires_at - timezone.now()
            return max(0, delta.days)
        return 0
