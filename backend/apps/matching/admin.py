from django.contrib import admin
from .models import Resonance, Match


@admin.register(Resonance)
class ResonanceAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'action', 'compatibility_score', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('from_user__email', 'to_user__email')
    ordering = ('-created_at',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'overall_score', 'is_conversation_started', 'created_at')
    list_filter = ('is_conversation_started', 'created_at')
    search_fields = ('user1__email', 'user2__email')
    ordering = ('-created_at',)
