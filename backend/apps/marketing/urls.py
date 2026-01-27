from django.urls import path
from .views import MarketingCaptureView, UnsubscribeView

urlpatterns = [
    path('capture/', MarketingCaptureView.as_view(), name='marketing-capture'),
    path('unsubscribe/', UnsubscribeView.as_view(), name='marketing-unsubscribe'),
]
