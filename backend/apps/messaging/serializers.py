"""
Messaging serializers for API responses.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Message

User = get_user_model()


class MessageSenderSerializer(serializers.ModelSerializer):
    """Minimal user info for message sender."""

    class Meta:
        model = User
        fields = ['id', 'display_name', 'photos']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model."""
    sender = MessageSenderSerializer(read_only=True)
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'content',
            'is_mine', 'read_at', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'read_at', 'created_at']

    def get_is_mine(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.sender_id == request.user.id
        return False


class MessageCreateSerializer(serializers.Serializer):
    """Serializer for creating a new message."""
    content = serializers.CharField(max_length=2000, min_length=1)


class ConversationSerializer(serializers.Serializer):
    """Serializer for conversation metadata."""
    match_id = serializers.IntegerField()
    other_user = MessageSenderSerializer()
    last_message = MessageSerializer(allow_null=True)
    unread_count = serializers.IntegerField()
    is_conversation_started = serializers.BooleanField()
