"""
Matching models: Resonance and Match.
"""

from django.db import models
from django.conf import settings


class Resonance(models.Model):
    """User interactions (likes/passes/maybe_later)."""

    class Action(models.TextChoices):
        RESONATE = 'resonate', 'Resonate'  # Like
        DECLINE = 'decline', 'Decline'      # Pass
        MAYBE_LATER = 'maybe_later', 'Maybe Later'

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_resonances'
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_resonances'
    )
    action = models.CharField(max_length=15, choices=Action.choices)
    compatibility_score = models.IntegerField(null=True)
    compatibility_data = models.JSONField(null=True, blank=True)

    # Maybe Later queue handling
    expires_at = models.DateTimeField(null=True, blank=True)  # 7 days for maybe_later

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resonances'
        unique_together = ('from_user', 'to_user')
        indexes = [
            models.Index(fields=['from_user', 'action']),
            models.Index(fields=['to_user', 'action']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"{self.from_user} -> {self.to_user}: {self.action}"


class Match(models.Model):
    """Mutual resonances - created when both users resonate."""

    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='matches_as_user1'
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='matches_as_user2'
    )

    compatibility_data = models.JSONField()  # Full breakdown
    overall_score = models.IntegerField()

    # Messaging state
    is_conversation_started = models.BooleanField(default=False)
    last_message_at = models.DateTimeField(null=True, blank=True)

    # Match timing (for time-gating feature)
    reveal_slot = models.IntegerField(null=True)  # 0-5 for 6 slots per day

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'matches'
        unique_together = ('user1', 'user2')
        indexes = [
            models.Index(fields=['user1', 'created_at']),
            models.Index(fields=['user2', 'created_at']),
        ]

    def __str__(self):
        return f"Match: {self.user1} <-> {self.user2}"

    def get_other_user(self, user):
        """Return the other user in the match."""
        return self.user2 if self.user1_id == user.id else self.user1
