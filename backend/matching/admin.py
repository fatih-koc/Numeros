"""
Admin configuration for matching app.
"""

from django.contrib import admin
from .models import CompatibilityCache, Resonance


@admin.register(CompatibilityCache)
class CompatibilityCacheAdmin(admin.ModelAdmin):
    """Admin configuration for CompatibilityCache model."""

    list_display = [
        'user1', 'user2', 'total_score',
        'match_type', 'risk_level',
        'computation_year', 'computed_at'
    ]

    list_filter = [
        'match_type', 'risk_level',
        'computation_year', 'computed_at'
    ]

    search_fields = ['user1__email', 'user1__name', 'user2__email', 'user2__name']

    readonly_fields = [
        'user1', 'user2',
        'structure_score', 'dynamics_score', 'culture_score',
        'affinity_score', 'time_score',
        'total_score', 'dominant_axis', 'match_type', 'risk_level',
        'headline', 'description', 'longevity_forecast',
        'computation_year', 'computed_at', 'updated_at'
    ]

    ordering = ['-total_score', '-computed_at']

    fieldsets = (
        ('Users', {
            'fields': ('user1', 'user2')
        }),
        ('Axes', {
            'fields': (
                'structure_score', 'dynamics_score', 'culture_score',
                'affinity_score', 'time_score'
            )
        }),
        ('Classification', {
            'fields': (
                'total_score', 'dominant_axis',
                'match_type', 'risk_level'
            )
        }),
        ('Labels', {
            'fields': ('headline', 'description', 'longevity_forecast')
        }),
        ('Metadata', {
            'fields': ('computation_year', 'computed_at', 'updated_at')
        }),
    )

    def has_add_permission(self, request):
        """Disable manual creation - computed automatically."""
        return False


@admin.register(Resonance)
class ResonanceAdmin(admin.ModelAdmin):
    """Admin configuration for Resonance model."""

    list_display = [
        'user1', 'user2', 'status',
        'compatibility_score', 'match_type',
        'eros_activated_at', 'created_at'
    ]

    list_filter = [
        'status', 'match_type', 'created_at', 'eros_activated_at'
    ]

    search_fields = ['user1__email', 'user1__name', 'user2__email', 'user2__name']

    readonly_fields = [
        'user1', 'user2',
        'user1_resonated_at', 'user2_resonated_at',
        'eros_activated_at',
        'compatibility_score', 'match_type',
        'created_at', 'updated_at'
    ]

    ordering = ['-eros_activated_at', '-created_at']

    fieldsets = (
        ('Users', {
            'fields': ('user1', 'user2')
        }),
        ('Resonance', {
            'fields': (
                'status',
                'user1_resonated_at', 'user2_resonated_at',
                'eros_activated_at'
            )
        }),
        ('Compatibility Snapshot', {
            'fields': ('compatibility_score', 'match_type')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def has_add_permission(self, request):
        """Disable manual creation - created through API."""
        return False
