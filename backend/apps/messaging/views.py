"""
Messaging views for chat functionality.
"""

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count

from apps.matching.models import Match
from .models import Message
from .serializers import (
    MessageSerializer,
    MessageCreateSerializer,
    ConversationSerializer,
    MessageSenderSerializer,
)


class MessageListView(generics.ListAPIView):
    """
    List messages for a match conversation.

    GET /api/v1/matches/{match_id}/messages/
    Returns paginated messages, oldest first.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_match(self):
        """Get match and verify user is a participant."""
        match = get_object_or_404(Match, id=self.kwargs['match_id'])
        if match.user1_id != self.request.user.id and match.user2_id != self.request.user.id:
            return None
        return match

    def get_queryset(self):
        match = self.get_match()
        if not match:
            return Message.objects.none()

        return Message.objects.filter(match=match).order_by('created_at')

    def list(self, request, *args, **kwargs):
        match = self.get_match()
        if not match:
            return Response(
                {'error': 'Match not found or access denied'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Mark unread messages as read
        Message.objects.filter(
            match=match,
            read_at__isnull=True
        ).exclude(
            sender=request.user
        ).update(read_at=timezone.now())

        return super().list(request, *args, **kwargs)


class MessageCreateView(APIView):
    """
    Send a message in a match conversation.

    POST /api/v1/matches/{match_id}/messages/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        # Get and verify match
        match = get_object_or_404(Match, id=match_id)
        if match.user1_id != request.user.id and match.user2_id != request.user.id:
            return Response(
                {'error': 'Match not found or access denied'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate content
        serializer = MessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create message
        message = Message.objects.create(
            match=match,
            sender=request.user,
            content=serializer.validated_data['content'],
        )

        # Update match conversation status
        if not match.is_conversation_started:
            match.is_conversation_started = True
        match.last_message_at = message.created_at
        match.save(update_fields=['is_conversation_started', 'last_message_at'])

        return Response(
            MessageSerializer(message, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class ConversationListView(APIView):
    """
    List all conversations (matches with message metadata).

    GET /api/v1/conversations/
    Returns matches with last message and unread count.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get user's matches
        matches = Match.objects.filter(
            Q(user1=request.user) | Q(user2=request.user)
        ).order_by('-last_message_at', '-created_at')

        conversations = []
        for match in matches:
            other_user = match.get_other_user(request.user)

            # Get last message
            last_message = Message.objects.filter(
                match=match
            ).order_by('-created_at').first()

            # Count unread messages
            unread_count = Message.objects.filter(
                match=match,
                read_at__isnull=True
            ).exclude(
                sender=request.user
            ).count()

            conversations.append({
                'match_id': match.id,
                'other_user': MessageSenderSerializer(other_user).data,
                'last_message': MessageSerializer(
                    last_message,
                    context={'request': request}
                ).data if last_message else None,
                'unread_count': unread_count,
                'is_conversation_started': match.is_conversation_started,
            })

        return Response({
            'conversations': conversations,
            'count': len(conversations),
        })


class MarkReadView(APIView):
    """
    Mark all messages in a conversation as read.

    POST /api/v1/matches/{match_id}/messages/read/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        if match.user1_id != request.user.id and match.user2_id != request.user.id:
            return Response(
                {'error': 'Match not found or access denied'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Mark all unread messages from other user as read
        updated = Message.objects.filter(
            match=match,
            read_at__isnull=True
        ).exclude(
            sender=request.user
        ).update(read_at=timezone.now())

        return Response({
            'success': True,
            'messages_marked_read': updated,
        })
