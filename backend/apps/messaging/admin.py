from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('match', 'sender', 'content_preview', 'read_at', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('sender__email', 'content')
    ordering = ('-created_at',)

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'
