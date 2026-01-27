"""
Custom DRF permissions.
"""

from rest_framework.permissions import BasePermission


class IsVerified(BasePermission):
    """
    Allows access only to verified users.
    """
    message = 'You must verify your account to perform this action.'

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.is_verified
        )


class IsProfileComplete(BasePermission):
    """
    Allows access only to users with complete profiles.
    """
    message = 'You must complete your profile to perform this action.'

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.is_profile_complete
        )


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Write permissions are only allowed to the owner
        return obj.user == request.user
