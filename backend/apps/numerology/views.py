"""
Numerology views for daily forecast.
"""

from datetime import datetime, date
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .forecast import get_daily_forecast


class TodayForecastView(APIView):
    """
    Get today's numerology forecast.

    GET /api/v1/forecast/today/
    Returns personalized daily forecast based on user's numerology.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        forecast = get_daily_forecast(
            life_path=user.life_path,
            birth_date=user.birth_date,
            target_date=date.today()
        )

        return Response(forecast)


class DateForecastView(APIView):
    """
    Get forecast for a specific date.

    GET /api/v1/forecast/{date}/
    Date format: YYYY-MM-DD
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, date_str):
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        forecast = get_daily_forecast(
            life_path=user.life_path,
            birth_date=user.birth_date,
            target_date=target_date
        )

        return Response(forecast)


class WeekForecastView(APIView):
    """
    Get forecast for the next 7 days.

    GET /api/v1/forecast/week/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import timedelta

        user = request.user
        today = date.today()

        forecasts = []
        for i in range(7):
            target_date = today + timedelta(days=i)
            forecast = get_daily_forecast(
                life_path=user.life_path,
                birth_date=user.birth_date,
                target_date=target_date
            )
            forecasts.append(forecast)

        return Response({
            'forecasts': forecasts,
            'life_path': user.life_path,
        })
