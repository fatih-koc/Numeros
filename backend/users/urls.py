"""
URL configuration for users app.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

# Router for ViewSets
router = DefaultRouter()
router.register(r'profile', views.ProfileViewSet, basename='profile')

# URL patterns
urlpatterns = [
    # Authentication
    path('auth/register', views.register, name='register'),
    path('auth/login', views.login, name='login'),
    path('auth/logout', views.logout, name='logout'),
] + router.urls
