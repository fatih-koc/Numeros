"""
Messaging URL configuration.
"""

from django.urls import path
from .views import (
    MessageListView,
    MessageCreateView,
    ConversationListView,
    MarkReadView,
)

urlpatterns = [
    # Conversation list
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),

    # Messages for a specific match
    path('matches/<int:match_id>/messages/', MessageListView.as_view(), name='message-list'),
    path('matches/<int:match_id>/messages/send/', MessageCreateView.as_view(), name='message-create'),
    path('matches/<int:match_id>/messages/read/', MarkReadView.as_view(), name='message-mark-read'),
]
