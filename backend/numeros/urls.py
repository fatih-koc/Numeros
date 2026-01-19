"""
URL configuration for numeros project.

API Routes:
    /api/auth/register - User registration
    /api/auth/login - User login
    /api/auth/logout - User logout
    /api/profile/me - Get current user profile
    /api/profile/calculate - Calculate numerology from birth data
    /api/profile/blueprint - Get detailed blueprint
    /api/match/scan - Scan for matches
    /api/match/evaluate - Evaluate compatibility
    /api/match/candidates - Get cached match candidates
    /api/resonance/resonate - Resonate with a user
    /api/resonance/decline - Decline a user
    /api/resonance/list - List resonances
    /api/resonance/mutual - Get mutual matches
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('matching.urls')),
]
