"""
URL configuration for matching app.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

# Router for ViewSets
router = DefaultRouter()
router.register(r'match', views.MatchingViewSet, basename='match')
router.register(r'resonance', views.ResonanceViewSet, basename='resonance')

# URL patterns
urlpatterns = router.urls
