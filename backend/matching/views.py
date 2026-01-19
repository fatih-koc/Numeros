"""
Views for matching-related endpoints.
"""

from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Case, When, IntegerField
from django.utils import timezone
from datetime import date
from users.models import User
from .models import CompatibilityCache, Resonance
from .serializers import (
    CompatibilityResultSerializer,
    CompatibilityCacheSerializer,
    ResonanceSerializer,
    ResonanceCreateSerializer,
    ScanRequestSerializer,
    ScanResponseSerializer,
    EvaluateRequestSerializer,
    MatchCandidateSerializer
)
from .compatibility import evaluate_compatibility


class MatchingViewSet(viewsets.ViewSet):
    """
    ViewSet for matching operations.
    """

    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def scan(self, request):
        """
        Scan for potential matches.

        POST /api/match/scan
        Body: {
            "limit": 50,
            "min_score": 50,
            "match_types": ["magnetic_stability", "passionate_tension"],
            "gender": "female"
        }
        """
        serializer = ScanRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        current_user = request.user
        current_year = date.today().year

        # Build query for potential matches
        query = User.objects.exclude(id=current_user.id)

        # Filter by gender preference
        if current_user.seeking:
            query = query.filter(gender=current_user.seeking)

        # Filter by who is seeking current user
        if data.get('gender'):
            query = query.filter(seeking=current_user.gender)

        # Get all candidates
        all_candidates = query.all()
        scanned_count = len(all_candidates)

        # Evaluate compatibility for each candidate
        matches = []
        rejected_count = 0

        for candidate in all_candidates:
            # Check if compatibility is cached
            cache_key_1 = Q(user1=current_user, user2=candidate, computation_year=current_year)
            cache_key_2 = Q(user1=candidate, user2=current_user, computation_year=current_year)

            cached = CompatibilityCache.objects.filter(cache_key_1 | cache_key_2).first()

            if cached:
                # Use cached result
                compat = cached
            else:
                # Calculate compatibility
                result = current_user.calculate_compatibility_with(candidate, current_year)

                # Cache the result
                compat = CompatibilityCache.objects.create(
                    user1=current_user,
                    user2=candidate,
                    structure_score=int(result.axes.structure),
                    dynamics_score=int(result.axes.dynamics),
                    culture_score=int(result.axes.culture),
                    affinity_score=int(result.axes.affinity),
                    time_score=int(result.axes.time),
                    total_score=int(result.total_score),
                    dominant_axis=result.dominant_axis.value,
                    match_type=result.labels.match_type.value,
                    risk_level=result.labels.risk_level.value,
                    headline=result.labels.headline,
                    description=result.labels.description,
                    longevity_forecast=result.labels.longevity_forecast,
                    computation_year=current_year
                )

            # Filter by min_score
            if compat.total_score < data['min_score']:
                rejected_count += 1
                continue

            # Filter by match_types
            if data.get('match_types') and compat.match_type not in data['match_types']:
                rejected_count += 1
                continue

            # Add to matches
            matches.append({
                'user': candidate,
                'compatibility': compat
            })

        # Sort by total_score descending
        matches = sorted(matches, key=lambda x: x['compatibility'].total_score, reverse=True)

        # Limit results
        matches = matches[:data['limit']]

        # Count resonances found
        resonances_found = Resonance.objects.filter(
            Q(user1=current_user) | Q(user2=current_user),
            status='mutual'
        ).count()

        response_data = {
            'scanned_count': scanned_count,
            'rejected_count': rejected_count,
            'resonances_found': resonances_found,
            'matches': matches
        }

        return Response(response_data)

    @action(detail=False, methods=['post'])
    def evaluate(self, request):
        """
        Evaluate compatibility with specific user.

        POST /api/match/evaluate
        Body: {
            "target_user_id": "uuid",
            "include_trace": true
        }
        """
        serializer = EvaluateRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        current_user = request.user

        try:
            target_user = User.objects.get(id=data['target_user_id'])
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Calculate compatibility
        result = current_user.calculate_compatibility_with(target_user)

        # Serialize result
        result_dict = result.to_dict()

        # Remove trace if not requested
        if not data.get('include_trace', True):
            result_dict.pop('rule_trace', None)

        return Response(result_dict)

    @action(detail=False, methods=['get'])
    def candidates(self, request):
        """
        Get match candidates sorted by compatibility.

        GET /api/match/candidates?limit=20&min_score=60
        """
        limit = int(request.query_params.get('limit', 20))
        min_score = int(request.query_params.get('min_score', 50))

        current_user = request.user
        current_year = date.today().year

        # Get cached compatibilities
        cache_query = CompatibilityCache.objects.filter(
            Q(user1=current_user) | Q(user2=current_user),
            computation_year=current_year,
            total_score__gte=min_score
        ).order_by('-total_score')[:limit]

        results = []
        for compat in cache_query:
            # Determine which user is the match
            match_user = compat.user2 if compat.user1 == current_user else compat.user1

            results.append({
                'user': match_user,
                'compatibility': compat
            })

        return Response(results)


class ResonanceViewSet(viewsets.ViewSet):
    """
    ViewSet for resonance (match) operations.
    """

    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def resonate(self, request):
        """
        Resonate with (like) a user.

        POST /api/match/resonate
        Body: {
            "target_user_id": "uuid"
        }
        """
        serializer = ResonanceCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        target_user_id = serializer.validated_data['target_user_id']
        current_user = request.user

        try:
            target_user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if resonance already exists (either direction)
        existing = Resonance.objects.filter(
            Q(user1=current_user, user2=target_user) |
            Q(user1=target_user, user2=current_user)
        ).first()

        if existing:
            # Update existing resonance
            if existing.user1 == current_user:
                if existing.user1_resonated_at:
                    return Response(
                        {'message': 'Already resonated with this user'},
                        status=status.HTTP_200_OK
                    )
                existing.user1_resonated_at = timezone.now()
            else:
                if existing.user2_resonated_at:
                    return Response(
                        {'message': 'Already resonated with this user'},
                        status=status.HTTP_200_OK
                    )
                existing.user2_resonated_at = timezone.now()

            # Check if mutual
            if existing.user1_resonated_at and existing.user2_resonated_at:
                existing.status = 'mutual'
                existing.eros_activated_at = timezone.now()

            existing.save()
            resonance = existing

        else:
            # Create new resonance
            # Get compatibility for snapshot
            result = current_user.calculate_compatibility_with(target_user)

            resonance = Resonance.objects.create(
                user1=current_user,
                user2=target_user,
                user1_resonated_at=timezone.now(),
                compatibility_score=int(result.total_score),
                match_type=result.labels.match_type.value
            )

        return Response(
            ResonanceSerializer(resonance).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'])
    def decline(self, request):
        """
        Decline a user.

        POST /api/match/decline
        Body: {
            "target_user_id": "uuid"
        }
        """
        serializer = ResonanceCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        target_user_id = serializer.validated_data['target_user_id']
        current_user = request.user

        try:
            target_user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if resonance exists
        existing = Resonance.objects.filter(
            Q(user1=current_user, user2=target_user) |
            Q(user1=target_user, user2=current_user)
        ).first()

        if existing:
            existing.status = 'declined'
            existing.save()
            message = 'User declined'
        else:
            message = 'No resonance found to decline'

        return Response({'message': message})

    @action(detail=False, methods=['get'])
    def all(self, request):
        """
        Get all resonances for current user.

        GET /api/resonance/all?status=pending
        """
        current_user = request.user
        status_filter = request.query_params.get('status')

        query = Resonance.objects.filter(
            Q(user1=current_user) | Q(user2=current_user)
        ).order_by('-created_at')

        if status_filter:
            query = query.filter(status=status_filter)

        resonances = query.all()
        return Response(ResonanceSerializer(resonances, many=True).data)

    @action(detail=False, methods=['get'])
    def mutual(self, request):
        """
        Get mutual matches only.

        GET /api/match/mutual
        """
        current_user = request.user

        resonances = Resonance.objects.filter(
            Q(user1=current_user) | Q(user2=current_user),
            status='mutual'
        ).order_by('-eros_activated_at')

        return Response(ResonanceSerializer(resonances, many=True).data)
