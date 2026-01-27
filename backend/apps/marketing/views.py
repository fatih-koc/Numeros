from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from django.utils import timezone

from .models import MarketingLead
from .serializers import MarketingCaptureSerializer, UnsubscribeSerializer
from .email import send_numerology_results_email, get_unsubscribe_token


class MarketingCaptureThrottle(AnonRateThrottle):
    rate = '10/minute'


class MarketingCaptureView(APIView):
    """
    Capture email lead and send numerology results.

    POST /api/v1/marketing/capture/
    """
    permission_classes = [AllowAny]
    throttle_classes = [MarketingCaptureThrottle]

    def post(self, request):
        serializer = MarketingCaptureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Get IP and user agent
        ip = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        # Get numerology data
        numerology = data.get('numerology', {})

        # Create or update lead
        lead, created = MarketingLead.objects.update_or_create(
            email=data['email'],
            defaults={
                'name': data['name'],
                'birth_date': data['birth_date'],
                'life_path': numerology.get('life_path'),
                'soul_urge': numerology.get('soul_urge'),
                'expression': numerology.get('expression'),
                'personality': numerology.get('personality'),
                'source': data['source'],
                'ip_address': ip,
                'user_agent': user_agent[:500],  # Truncate
                'subscribed': True,  # Re-subscribe if updating
            }
        )

        # Send email
        email_sent = send_numerology_results_email(lead)

        return Response({
            'success': True,
            'message': f'Your results have been sent to {data["email"]}',
            'email_sent': email_sent,
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')


class UnsubscribeView(APIView):
    """
    Unsubscribe from marketing emails.

    POST /api/v1/marketing/unsubscribe/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UnsubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        email = data['email']
        token = data.get('token')

        # Verify token if provided
        if token and token != get_unsubscribe_token(email):
            return Response(
                {'error': 'Invalid unsubscribe token'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lead = MarketingLead.objects.get(email=email)
            lead.subscribed = False
            lead.unsubscribed_at = timezone.now()
            lead.save(update_fields=['subscribed', 'unsubscribed_at'])

            return Response({
                'success': True,
                'message': 'You have been unsubscribed successfully',
            })
        except MarketingLead.DoesNotExist:
            return Response({
                'success': True,
                'message': 'Email not found in our system',
            })
