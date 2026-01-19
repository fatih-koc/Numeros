"""
Views for user-related endpoints.
"""

from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    ProfileCalculationSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """
    Register a new user.

    POST /api/auth/register
    Body: {
        "email": "user@example.com",
        "password": "password123",
        "password_confirm": "password123",
        "name": "John Doe",
        "birth_date": "1990-05-15",
        "gender": "male",
        "seeking": "female",
        "use_turkish_letters": false
    }
    """
    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': UserProfileSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """
    Login and get authentication token.

    POST /api/auth/login
    Body: {
        "email": "user@example.com",
        "password": "password123"
    }
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=email, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserProfileSerializer(user).data
        })

    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """
    Logout and delete authentication token.

    POST /api/auth/logout
    """
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ProfileViewSet(viewsets.ViewSet):
    """
    ViewSet for user profile operations.
    """

    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get current user profile.

        GET /api/profile/me
        """
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """
        Update current user profile.

        PUT/PATCH /api/profile/me
        Body: {
            "name": "John Doe",
            "gender": "male",
            "seeking": "female"
        }
        """
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=request.method == 'PATCH'
        )

        if serializer.is_valid():
            serializer.save()
            return Response(UserProfileSerializer(request.user).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def calculate(self, request):
        """
        Calculate numerology and zodiac from birth data.

        POST /api/profile/calculate
        Body: {
            "name": "John Doe",
            "birth_date": "1990-05-15",
            "use_turkish_letters": false,
            "current_year": 2026
        }
        """
        serializer = ProfileCalculationSerializer(data=request.data)

        if serializer.is_valid():
            result = serializer.calculate()
            return Response(result)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def blueprint(self, request):
        """
        Get detailed numerology blueprint for current user.

        GET /api/profile/blueprint
        """
        from datetime import date
        from matching.numerology import get_number_meaning

        user = request.user
        year = date.today().year
        numerology = user.get_numerology_profile(year)
        zodiac = user.get_zodiac_profile()

        blueprint = {
            'core': {
                'number': numerology.life_path,
                'meaning': get_number_meaning(numerology.life_path)
            },
            'desire': {
                'number': numerology.soul_urge,
                'meaning': get_number_meaning(numerology.soul_urge) if numerology.soul_urge else None
            },
            'bond': {
                'number': numerology.expression,
                'meaning': get_number_meaning(numerology.expression) if numerology.expression else None
            },
            'friction': {
                'number': numerology.challenge,
                'description': f'Challenge number {numerology.challenge}' if numerology.challenge is not None else None
            },
            'cycle': {
                'number': numerology.cycle_number,
                'year': year,
                'description': f'You are in cycle {numerology.cycle_number} for {year}'
            },
            'zodiac': {
                'animal': zodiac.animal.value,
                'element': zodiac.element.value,
                'name_en': zodiac.get_name('en'),
                'name_tr': zodiac.get_name('tr')
            }
        }

        return Response(blueprint)
