from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'display_name', 'life_path', 'sun_sign', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'is_profile_complete', 'gender', 'sun_sign')
    search_fields = ('email', 'display_name')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': ('display_name', 'birth_date', 'birth_time', 'birth_place',
                      'birth_latitude', 'birth_longitude', 'bio', 'photos')
        }),
        ('Numerology', {
            'fields': ('life_path', 'soul_urge', 'expression', 'personality')
        }),
        ('Astrology', {
            'fields': ('sun_sign', 'moon_sign', 'rising_sign', 'chart_level', 'chart_data')
        }),
        ('Profile', {
            'fields': ('gender', 'interested_in', 'is_verified', 'is_profile_complete')
        }),
        ('Matching Preferences', {
            'fields': ('age_min_preference', 'age_max_preference',
                      'distance_km_preference', 'women_first_messaging')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login', 'last_active', 'last_scan_at')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'display_name', 'birth_date', 'password1', 'password2'),
        }),
    )
