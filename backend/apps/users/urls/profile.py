"""
Profile URL configuration.
"""

from django.urls import path
from apps.users.views import (
    ProfileView,
    CalculateView,
    PhotoUploadView,
    PhotoDeleteView,
    PhotoReorderView,
    DeviceRegisterView,
    DeviceUnregisterView,
    NotificationSettingsView,
)

urlpatterns = [
    path('me/', ProfileView.as_view(), name='profile-me'),
    path('calculate/', CalculateView.as_view(), name='profile-calculate'),

    # Photo management
    path('photos/', PhotoUploadView.as_view(), name='photo-upload'),
    path('photos/delete/', PhotoDeleteView.as_view(), name='photo-delete'),
    path('photos/reorder/', PhotoReorderView.as_view(), name='photo-reorder'),

    # Device registration for push notifications
    path('devices/', DeviceRegisterView.as_view(), name='device-register'),
    path('devices/unregister/', DeviceUnregisterView.as_view(), name='device-unregister'),
    path('devices/settings/', NotificationSettingsView.as_view(), name='notification-settings'),
]
