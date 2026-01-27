"""
Custom DRF pagination classes.
"""

from rest_framework.pagination import CursorPagination, PageNumberPagination


class StandardCursorPagination(CursorPagination):
    """
    Cursor pagination for infinite scroll lists.
    """
    page_size = 20
    ordering = '-created_at'
    cursor_query_param = 'cursor'


class StandardPagePagination(PageNumberPagination):
    """
    Page number pagination for finite lists.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class MessagePagination(CursorPagination):
    """
    Pagination for chat messages (newest first).
    """
    page_size = 50
    ordering = '-created_at'
    cursor_query_param = 'before'
