"""
URL configuration for numeros project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.users.urls.auth')),
    path('api/v1/profile/', include('apps.users.urls.profile')),
    path('api/v1/', include('apps.matching.urls')),
    path('api/v1/', include('apps.messaging.urls')),
    path('api/v1/forecast/', include('apps.numerology.urls')),
    path('api/v1/marketing/', include('apps.marketing.urls')),
]
