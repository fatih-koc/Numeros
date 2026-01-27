from django.contrib import admin
from .models import DailyForecast


@admin.register(DailyForecast)
class DailyForecastAdmin(admin.ModelAdmin):
    list_display = ('date', 'universal_day_number', 'created_at')
    list_filter = ('universal_day_number',)
    ordering = ('-date',)
