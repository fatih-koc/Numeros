"""
Numerology/Forecast URL configuration.
"""

from django.urls import path
from .views import TodayForecastView, DateForecastView, WeekForecastView

urlpatterns = [
    path('today/', TodayForecastView.as_view(), name='forecast-today'),
    path('week/', WeekForecastView.as_view(), name='forecast-week'),
    path('<str:date_str>/', DateForecastView.as_view(), name='forecast-date'),
]
