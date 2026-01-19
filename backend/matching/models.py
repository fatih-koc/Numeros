"""
Matching models for numEros.

Compatibility cache and resonance (match) models.
"""

from django.db import models
from django.conf import settings
import uuid


class CompatibilityCache(models.Model):
    """
    Precomputed compatibility scores between users.

    This cache speeds up matching by storing computed compatibility scores.
    Scores are recomputed when users update their profiles or at the start
    of each new year (due to cycle number changes).
    """

    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='compatibility_as_user1'
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='compatibility_as_user2'
    )

    # Axis scores
    structure_score = models.SmallIntegerField(
        help_text='Structure axis score (numerology heavy)'
    )
    dynamics_score = models.SmallIntegerField(
        help_text='Dynamics axis score (asymmetric/directional)'
    )
    culture_score = models.SmallIntegerField(
        help_text='Culture axis score (zodiac)'
    )
    affinity_score = models.SmallIntegerField(
        default=0,
        help_text='Affinity axis score (auxiliary factors)'
    )
    time_score = models.SmallIntegerField(
        help_text='Time axis score (cycle alignment)'
    )

    # Aggregates
    total_score = models.SmallIntegerField(
        help_text='Total compatibility score (0-100)'
    )

    # Classification
    dominant_axis = models.CharField(
        max_length=20,
        help_text='Dominant compatibility axis'
    )
    match_type = models.CharField(
        max_length=30,
        help_text='Match type classification'
    )
    risk_level = models.CharField(
        max_length=10,
        help_text='Risk level (low/medium/high)'
    )

    # Labels
    headline = models.CharField(max_length=100)
    description = models.TextField()
    longevity_forecast = models.CharField(max_length=200)

    # Metadata
    computation_year = models.SmallIntegerField(
        help_text='Year this compatibility was computed for'
    )
    computed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'compatibility_cache'
        unique_together = [['user1', 'user2']]
        indexes = [
            models.Index(fields=['user1', 'total_score']),
            models.Index(fields=['user2', 'total_score']),
            models.Index(fields=['match_type']),
            models.Index(fields=['computation_year']),
        ]

    def __str__(self):
        return f"{self.user1.name} + {self.user2.name} = {self.total_score}"


class Resonance(models.Model):
    """
    Represents a match/resonance between two users.

    A resonance is created when one user "resonates" with another.
    When both users resonate with each other, it becomes a mutual match (Eros activated).
    """

    STATUS_CHOICES = [
        ('pending', 'Pending'),           # One-sided resonance
        ('mutual', 'Mutual'),             # Both resonated (Eros activated)
        ('declined', 'Declined'),         # One user declined
        ('expired', 'Expired'),           # Expired without mutual resonance
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resonances_as_user1'
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resonances_as_user2'
    )

    # Resonance timestamps
    user1_resonated_at = models.DateTimeField(null=True, blank=True)
    user2_resonated_at = models.DateTimeField(null=True, blank=True)

    # Mutual match timestamp (when both resonated)
    eros_activated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when mutual match was achieved'
    )

    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Compatibility snapshot (at time of creation)
    compatibility_score = models.SmallIntegerField(
        help_text='Compatibility score when resonance was created'
    )
    match_type = models.CharField(
        max_length=30,
        help_text='Match type when resonance was created'
    )

    class Meta:
        db_table = 'resonances'
        unique_together = [['user1', 'user2']]
        indexes = [
            models.Index(fields=['user1', 'status']),
            models.Index(fields=['user2', 'status']),
            models.Index(fields=['status', 'eros_activated_at']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Resonance: {self.user1.name} + {self.user2.name} ({self.status})"

    def is_mutual(self) -> bool:
        """Check if this is a mutual resonance."""
        return self.status == 'mutual' and self.eros_activated_at is not None

    def can_chat(self) -> bool:
        """Check if users can chat (mutual match)."""
        return self.is_mutual()
