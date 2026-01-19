"""
Serializers for matching-related models.
"""

from rest_framework import serializers
from datetime import date
from .models import CompatibilityCache, Resonance
from users.serializers import UserPublicProfileSerializer


class CompatibilityAxesSerializer(serializers.Serializer):
    """Serializer for compatibility axes."""

    structure = serializers.FloatField()
    dynamics = serializers.FloatField()
    culture = serializers.FloatField()
    affinity = serializers.FloatField()
    time = serializers.FloatField()


class CompatibilityLabelsSerializer(serializers.Serializer):
    """Serializer for compatibility labels."""

    match_type = serializers.CharField()
    risk_level = serializers.CharField()
    headline = serializers.CharField()
    description = serializers.CharField()
    longevity_forecast = serializers.CharField()


class RuleTraceSerializer(serializers.Serializer):
    """Serializer for rule trace."""

    rule = serializers.CharField()
    triggered = serializers.BooleanField()
    impact = serializers.FloatField()
    explanation = serializers.CharField()


class CompatibilityResultSerializer(serializers.Serializer):
    """Serializer for complete compatibility result."""

    axes = CompatibilityAxesSerializer()
    total_score = serializers.FloatField()
    dominant_axis = serializers.CharField()
    labels = CompatibilityLabelsSerializer()
    rule_trace = RuleTraceSerializer(many=True)


class CompatibilityCacheSerializer(serializers.ModelSerializer):
    """Serializer for compatibility cache."""

    user1 = UserPublicProfileSerializer(read_only=True)
    user2 = UserPublicProfileSerializer(read_only=True)

    axes = serializers.SerializerMethodField()
    labels = serializers.SerializerMethodField()

    class Meta:
        model = CompatibilityCache
        fields = [
            'user1', 'user2',
            'axes', 'total_score', 'dominant_axis',
            'labels',
            'computation_year', 'computed_at'
        ]

    def get_axes(self, obj):
        """Get axes as dictionary."""
        return {
            'structure': obj.structure_score,
            'dynamics': obj.dynamics_score,
            'culture': obj.culture_score,
            'affinity': obj.affinity_score,
            'time': obj.time_score
        }

    def get_labels(self, obj):
        """Get labels as dictionary."""
        return {
            'match_type': obj.match_type,
            'risk_level': obj.risk_level,
            'headline': obj.headline,
            'description': obj.description,
            'longevity_forecast': obj.longevity_forecast
        }


class MatchCandidateSerializer(serializers.Serializer):
    """Serializer for match candidate (user + compatibility)."""

    user = UserPublicProfileSerializer()
    compatibility = serializers.SerializerMethodField()

    def get_compatibility(self, obj):
        """Get compatibility data."""
        # obj should have a 'compatibility' attribute
        compat = obj.get('compatibility') if isinstance(obj, dict) else getattr(obj, 'compatibility', None)
        if compat:
            return {
                'total_score': compat.total_score,
                'match_type': compat.match_type,
                'risk_level': compat.risk_level,
                'headline': compat.headline,
                'axes': {
                    'structure': compat.structure_score,
                    'dynamics': compat.dynamics_score,
                    'culture': compat.culture_score,
                    'affinity': compat.affinity_score,
                    'time': compat.time_score
                }
            }
        return None


class ResonanceSerializer(serializers.ModelSerializer):
    """Serializer for resonance."""

    user1 = UserPublicProfileSerializer(read_only=True)
    user2 = UserPublicProfileSerializer(read_only=True)
    is_mutual = serializers.BooleanField(read_only=True, source='is_mutual')
    can_chat = serializers.BooleanField(read_only=True, source='can_chat')

    class Meta:
        model = Resonance
        fields = [
            'id', 'user1', 'user2',
            'status', 'is_mutual', 'can_chat',
            'user1_resonated_at', 'user2_resonated_at',
            'eros_activated_at',
            'compatibility_score', 'match_type',
            'created_at'
        ]
        read_only_fields = [
            'id', 'user1', 'user2', 'status',
            'user1_resonated_at', 'user2_resonated_at',
            'eros_activated_at', 'created_at'
        ]


class ResonanceCreateSerializer(serializers.Serializer):
    """Serializer for creating a resonance."""

    target_user_id = serializers.UUIDField()

    def validate_target_user_id(self, value):
        """Validate target user exists and is not current user."""
        from users.models import User

        # Check user exists
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError('User not found')

        # Check not resonating with self
        request = self.context.get('request')
        if request and str(request.user.id) == str(value):
            raise serializers.ValidationError('Cannot resonate with yourself')

        return value


class ScanRequestSerializer(serializers.Serializer):
    """Serializer for scan request."""

    limit = serializers.IntegerField(default=50, min_value=1, max_value=100)
    min_score = serializers.IntegerField(default=50, min_value=0, max_value=100)
    match_types = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text='Filter by match types'
    )
    gender = serializers.CharField(required=False, allow_blank=True)


class ScanResponseSerializer(serializers.Serializer):
    """Serializer for scan response."""

    scanned_count = serializers.IntegerField()
    rejected_count = serializers.IntegerField()
    resonances_found = serializers.IntegerField()
    matches = MatchCandidateSerializer(many=True)


class EvaluateRequestSerializer(serializers.Serializer):
    """Serializer for evaluate compatibility request."""

    target_user_id = serializers.UUIDField()
    include_trace = serializers.BooleanField(default=True)

    def validate_target_user_id(self, value):
        """Validate target user exists."""
        from users.models import User

        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError('User not found')

        return value
