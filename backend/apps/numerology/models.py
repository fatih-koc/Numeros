"""
Numerology models.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class DailyForecast(models.Model):
    """Cached daily numerology forecasts."""

    date = models.DateField(unique=True)
    universal_day_number = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(9)]
    )
    forecast_data = models.JSONField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daily_forecasts'

    def __str__(self):
        return f"Forecast for {self.date}: Day {self.universal_day_number}"
