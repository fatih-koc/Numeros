"""
Matching views for scan, resonance, and match endpoints.
"""

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Q

from .models import Resonance, Match
from .serializers import (
    ScanRequestSerializer,
    ScanResultSerializer,
    EvaluateRequestSerializer,
    EvaluateResponseSerializer,
    ResonanceRequestSerializer,
    ResonanceResponseSerializer,
    MatchSerializer,
    MatchDetailSerializer,
    IncomingResonanceSerializer,
    MaybeLaterSerializer,
    MatchUserSerializer,
    CompatibilitySerializer,
)
from .services import (
    get_scan_candidates,
    calculate_full_compatibility,
    process_resonance,
)
from core.permissions import IsProfileComplete

User = get_user_model()


class ScanView(APIView):
    """
    Scan for potential matches.

    POST /api/v1/scan/
    Returns profiles with compatibility scores.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ScanRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        limit = serializer.validated_data.get('limit', 10)
        filters = {
            'age_min': serializer.validated_data.get('age_min'),
            'age_max': serializer.validated_data.get('age_max'),
        }
        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}

        # Get candidates with compatibility
        candidates = get_scan_candidates(
            user=request.user,
            limit=limit,
            filters=filters if filters else None
        )

        # Update user's last scan time
        request.user.last_scan_at = timezone.now()
        request.user.save(update_fields=['last_scan_at'])

        # Serialize results
        results = []
        for candidate in candidates:
            results.append({
                'user': candidate['user'],
                'compatibility': candidate['compatibility'],
            })

        return Response({
            'profiles': ScanResultSerializer(results, many=True).data,
            'count': len(results),
            'has_more': len(candidates) >= limit,
        })


class EvaluateView(APIView):
    """
    Get detailed compatibility with a specific user.

    POST /api/v1/scan/evaluate/
    Returns full compatibility breakdown.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EvaluateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_user_id = serializer.validated_data['target_user_id']
        target_user = get_object_or_404(User, id=target_user_id, is_active=True)

        # Calculate full compatibility
        compatibility = calculate_full_compatibility(request.user, target_user)

        return Response({
            'profile': MatchUserSerializer(target_user).data,
            'compatibility': compatibility,
        })


class ResonanceView(APIView):
    """
    Send a resonance action (like/decline/maybe_later).

    POST /api/v1/resonance/
    Returns success status and match info if mutual.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResonanceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_user_id = serializer.validated_data['target_user_id']
        action = serializer.validated_data['action']

        target_user = get_object_or_404(User, id=target_user_id, is_active=True)

        # Can't resonate with yourself
        if target_user.id == request.user.id:
            return Response(
                {'error': 'Cannot resonate with yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process the resonance
        is_match, match = process_resonance(request.user, target_user, action)

        response_data = {
            'success': True,
            'is_match': is_match,
            'match': None,
        }

        if match:
            response_data['match'] = MatchSerializer(
                match,
                context={'request': request}
            ).data

        return Response(response_data)


class MatchListView(generics.ListAPIView):
    """
    List all matches for the current user.

    GET /api/v1/matches/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer

    def get_queryset(self):
        return Match.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        ).order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class MatchDetailView(generics.RetrieveAPIView):
    """
    Get match detail with full compatibility breakdown.

    GET /api/v1/matches/{id}/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MatchDetailSerializer

    def get_queryset(self):
        return Match.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class IncomingResonancesView(generics.ListAPIView):
    """
    List incoming resonances (people who liked you).

    GET /api/v1/resonances/incoming/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = IncomingResonanceSerializer

    def get_queryset(self):
        # Get resonances where others have resonated with current user
        # but current user hasn't responded yet
        responded_ids = Resonance.objects.filter(
            from_user=self.request.user
        ).values_list('to_user_id', flat=True)

        return Resonance.objects.filter(
            to_user=self.request.user,
            action='resonate'
        ).exclude(
            from_user_id__in=responded_ids
        ).order_by('-created_at')


class MaybeLaterView(generics.ListAPIView):
    """
    List Maybe Later queue items.

    GET /api/v1/resonances/maybe-later/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MaybeLaterSerializer

    def get_queryset(self):
        return Resonance.objects.filter(
            from_user=self.request.user,
            action='maybe_later',
            expires_at__gt=timezone.now()
        ).order_by('expires_at')


class ConvertMaybeLaterView(APIView):
    """
    Convert a maybe_later to resonate or decline.

    POST /api/v1/resonances/maybe-later/{id}/convert/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        resonance = get_object_or_404(
            Resonance,
            id=pk,
            from_user=request.user,
            action='maybe_later'
        )

        new_action = request.data.get('action')
        if new_action not in ['resonate', 'decline']:
            return Response(
                {'error': 'Action must be "resonate" or "decline"'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process as new resonance
        is_match, match = process_resonance(
            request.user,
            resonance.to_user,
            new_action
        )

        response_data = {
            'success': True,
            'is_match': is_match,
            'match': None,
        }

        if match:
            response_data['match'] = MatchSerializer(
                match,
                context={'request': request}
            ).data

        return Response(response_data)
