"""
User views for authentication and profile management.
"""

import uuid
import os
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.files.storage import default_storage

from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    CalculateRequestSerializer,
    CalculateResponseSerializer,
    ProfileUpdateSerializer,
)
from apps.numerology.engine import calculate_all as calculate_numerology
from apps.astrology.engine import calculate_full_chart, serialize_chart

User = get_user_model()


class RegisterView(APIView):
    """
    User registration endpoint.

    POST /api/v1/auth/register/
    Creates a new user with auto-calculated numerology and astrology.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """
    User login endpoint.

    POST /api/v1/auth/login/
    Returns JWT tokens and user profile.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            # Add user data to response
            user = User.objects.get(email=request.data.get('email'))
            response.data['user'] = UserSerializer(user).data

        return response


class LogoutView(APIView):
    """
    User logout endpoint.

    POST /api/v1/auth/logout/
    Blacklists the refresh token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'success': True}, status=status.HTTP_200_OK)


class RefreshView(TokenRefreshView):
    """
    Token refresh endpoint.

    POST /api/v1/auth/refresh/
    Returns new access token.
    """
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    User profile endpoint.

    GET /api/v1/profile/me/
    PATCH /api/v1/profile/me/
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return ProfileUpdateSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user


class CalculateView(APIView):
    """
    Anonymous profile calculation endpoint.

    POST /api/v1/profile/calculate/
    Calculates numerology and astrology without creating a user.
    Used during onboarding before registration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CalculateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Calculate numerology
        name = data['name']
        birth_date = str(data['birth_date'])
        numerology = calculate_numerology(name, birth_date)

        # Calculate astrology
        birth_time = data.get('birth_time')
        birth_time_str = birth_time.strftime('%H:%M') if birth_time else None
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        chart = calculate_full_chart(
            birth_date,
            birth_time_str,
            latitude,
            longitude
        )

        response_data = {
            'chart_level': chart.chart_level,
            'numerology': numerology,
            'astrology': serialize_chart(chart),
        }

        return Response(response_data, status=status.HTTP_200_OK)


class PhotoUploadView(APIView):
    """
    Upload a profile photo.

    POST /api/v1/profile/photos/
    Accepts multipart/form-data with 'photo' field.
    Returns the photo URL and updated photos list.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    MAX_PHOTOS = 6
    ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
    MAX_SIZE_MB = 10

    def post(self, request):
        if 'photo' not in request.FILES:
            return Response(
                {'error': 'No photo provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        photo = request.FILES['photo']

        # Validate file type
        if photo.content_type not in self.ALLOWED_TYPES:
            return Response(
                {'error': f'Invalid file type. Allowed: {", ".join(self.ALLOWED_TYPES)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file size
        if photo.size > self.MAX_SIZE_MB * 1024 * 1024:
            return Response(
                {'error': f'File too large. Max size: {self.MAX_SIZE_MB}MB'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check photo limit
        user = request.user
        if len(user.photos) >= self.MAX_PHOTOS:
            return Response(
                {'error': f'Maximum {self.MAX_PHOTOS} photos allowed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate unique filename
        ext = photo.name.split('.')[-1].lower()
        if ext not in ['jpg', 'jpeg', 'png', 'webp']:
            ext = 'jpg'
        filename = f"photos/{user.id}/{uuid.uuid4().hex}.{ext}"

        # Save file
        path = default_storage.save(filename, photo)
        photo_url = f"{settings.MEDIA_URL}{path}"

        # Update user's photos list
        user.photos.append(photo_url)
        user.save(update_fields=['photos'])

        return Response({
            'photo_url': photo_url,
            'photos': user.photos,
        }, status=status.HTTP_201_CREATED)


class PhotoDeleteView(APIView):
    """
    Delete a profile photo.

    DELETE /api/v1/profile/photos/
    Body: {"photo_url": "..."}
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        photo_url = request.data.get('photo_url')
        if not photo_url:
            return Response(
                {'error': 'photo_url required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        if photo_url not in user.photos:
            return Response(
                {'error': 'Photo not found in your profile'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Remove from user's list
        user.photos.remove(photo_url)
        user.save(update_fields=['photos'])

        # Delete file from storage
        try:
            file_path = photo_url.replace(settings.MEDIA_URL, '')
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
        except Exception:
            pass  # File deletion is best-effort

        return Response({
            'success': True,
            'photos': user.photos,
        })


class PhotoReorderView(APIView):
    """
    Reorder profile photos.

    PUT /api/v1/profile/photos/reorder/
    Body: {"photos": ["url1", "url2", ...]}
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        new_order = request.data.get('photos', [])
        user = request.user

        # Validate all URLs are in user's photos
        if set(new_order) != set(user.photos):
            return Response(
                {'error': 'Invalid photo list - must contain same photos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.photos = new_order
        user.save(update_fields=['photos'])

        return Response({
            'success': True,
            'photos': user.photos,
        })


class DeviceRegisterView(APIView):
    """
    Register a device for push notifications.

    POST /api/v1/profile/devices/
    Body: {
        "platform": "ios" | "android",
        "token": "push_notification_token",
        "device_id": "unique_device_identifier",
        "app_version": "1.0.0",
        "os_version": "17.0"
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from .models import Device

        platform = request.data.get('platform')
        token = request.data.get('token')
        device_id = request.data.get('device_id')

        if not all([platform, token, device_id]):
            return Response(
                {'error': 'platform, token, and device_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if platform not in ['ios', 'android']:
            return Response(
                {'error': 'platform must be "ios" or "android"'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update or create device
        device, created = Device.objects.update_or_create(
            device_id=device_id,
            defaults={
                'user': request.user,
                'platform': platform,
                'token': token,
                'app_version': request.data.get('app_version', ''),
                'os_version': request.data.get('os_version', ''),
            }
        )

        return Response({
            'success': True,
            'device_id': device.device_id,
            'created': created,
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class DeviceUnregisterView(APIView):
    """
    Unregister a device from push notifications.

    DELETE /api/v1/profile/devices/
    Body: {"device_id": "unique_device_identifier"}
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        from .models import Device

        device_id = request.data.get('device_id')
        if not device_id:
            return Response(
                {'error': 'device_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        deleted, _ = Device.objects.filter(
            device_id=device_id,
            user=request.user
        ).delete()

        return Response({
            'success': True,
            'deleted': deleted > 0,
        })


class NotificationSettingsView(APIView):
    """
    Update notification settings for a device.

    PATCH /api/v1/profile/devices/settings/
    Body: {
        "device_id": "...",
        "notifications_enabled": true,
        "match_notifications": true,
        "message_notifications": true,
        "forecast_notifications": true
    }
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        from .models import Device

        device_id = request.data.get('device_id')
        if not device_id:
            return Response(
                {'error': 'device_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            device = Device.objects.get(device_id=device_id, user=request.user)
        except Device.DoesNotExist:
            return Response(
                {'error': 'Device not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update settings
        update_fields = []
        for field in ['notifications_enabled', 'match_notifications',
                      'message_notifications', 'forecast_notifications']:
            if field in request.data:
                setattr(device, field, request.data[field])
                update_fields.append(field)

        if update_fields:
            device.save(update_fields=update_fields)

        return Response({
            'success': True,
            'settings': {
                'notifications_enabled': device.notifications_enabled,
                'match_notifications': device.match_notifications,
                'message_notifications': device.message_notifications,
                'forecast_notifications': device.forecast_notifications,
            }
        })
