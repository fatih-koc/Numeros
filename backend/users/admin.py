"""
Admin configuration for users app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""

    list_display = [
        'email', 'name', 'birth_date',
        'life_path', 'zodiac_animal',
        'is_staff', 'is_active', 'created_at'
    ]

    list_filter = [
        'is_staff', 'is_active',
        'life_path', 'zodiac_animal', 'zodiac_element',
        'gender', 'seeking',
        'created_at'
    ]

    search_fields = ['email', 'name']

    ordering = ['-created_at']

    fieldsets = (
        ('Authentication', {
            'fields': ('email', 'password', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Profile', {
            'fields': ('name', 'birth_date', 'gender', 'seeking')
        }),
        ('Numerology', {
            'fields': (
                'life_path', 'day_number', 'month_number',
                'soul_urge', 'expression', 'challenge'
            )
        }),
        ('Zodiac', {
            'fields': ('zodiac_animal', 'zodiac_element', 'zodiac_position')
        }),
        ('Location', {
            'fields': ('location_lat', 'location_lng'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('use_turkish_letters',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'last_active'),
            'classes': ('collapse',)
        }),
    )

    add_fieldsets = (
        ('Authentication', {
            'fields': ('email', 'password1', 'password2')
        }),
        ('Profile', {
            'fields': ('name', 'birth_date', 'gender', 'seeking')
        }),
        ('Numerology', {
            'fields': (
                'life_path', 'day_number', 'month_number',
                'soul_urge', 'expression', 'challenge'
            )
        }),
        ('Zodiac', {
            'fields': ('zodiac_animal', 'zodiac_element', 'zodiac_position')
        }),
    )

    readonly_fields = ['created_at', 'updated_at', 'last_active']
