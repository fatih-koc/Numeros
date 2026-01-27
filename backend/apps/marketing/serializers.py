from rest_framework import serializers

from .models import MarketingLead


class NumerologyDataSerializer(serializers.Serializer):
    life_path = serializers.IntegerField(required=False)
    soul_urge = serializers.IntegerField(required=False)
    expression = serializers.IntegerField(required=False)
    personality = serializers.IntegerField(required=False)


class MarketingCaptureSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=200)
    birth_date = serializers.DateField()
    numerology = NumerologyDataSerializer(required=False)
    source = serializers.ChoiceField(
        choices=['calculator', 'waitlist', 'download'],
        default='calculator'
    )


class UnsubscribeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField(required=False)  # Optional verification token
