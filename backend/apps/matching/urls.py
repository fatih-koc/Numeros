"""
Matching URL configuration.
"""

from django.urls import path
from .views import (
    ScanView,
    EvaluateView,
    ResonanceView,
    MatchListView,
    MatchDetailView,
    IncomingResonancesView,
    MaybeLaterView,
    ConvertMaybeLaterView,
)

urlpatterns = [
    # Scan endpoints
    path('scan/', ScanView.as_view(), name='scan'),
    path('scan/evaluate/', EvaluateView.as_view(), name='scan-evaluate'),

    # Resonance endpoints
    path('resonance/', ResonanceView.as_view(), name='resonance'),
    path('resonances/incoming/', IncomingResonancesView.as_view(), name='resonances-incoming'),
    path('resonances/maybe-later/', MaybeLaterView.as_view(), name='resonances-maybe-later'),
    path('resonances/maybe-later/<int:pk>/convert/', ConvertMaybeLaterView.as_view(), name='resonances-convert'),

    # Match endpoints
    path('matches/', MatchListView.as_view(), name='match-list'),
    path('matches/<int:pk>/', MatchDetailView.as_view(), name='match-detail'),
]
