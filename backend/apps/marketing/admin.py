import csv
from django.contrib import admin
from django.http import HttpResponse
from .models import MarketingLead


@admin.register(MarketingLead)
class MarketingLeadAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'source', 'email_sent', 'subscribed', 'created_at']
    list_filter = ['source', 'email_sent', 'subscribed', 'created_at']
    search_fields = ['email', 'name']
    readonly_fields = ['created_at', 'updated_at', 'email_sent_at', 'unsubscribed_at']
    ordering = ['-created_at']

    actions = ['export_as_csv', 'resend_email']

    def export_as_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="marketing_leads.csv"'

        writer = csv.writer(response)
        writer.writerow(['Email', 'Name', 'Birth Date', 'Source', 'Life Path',
                        'Email Sent', 'Subscribed', 'Created At'])

        for lead in queryset:
            writer.writerow([
                lead.email, lead.name, lead.birth_date, lead.source,
                lead.life_path, lead.email_sent, lead.subscribed, lead.created_at
            ])

        return response
    export_as_csv.short_description = "Export selected leads to CSV"

    def resend_email(self, request, queryset):
        from .email import send_numerology_results_email
        count = 0
        for lead in queryset.filter(subscribed=True):
            if send_numerology_results_email(lead):
                count += 1
        self.message_user(request, f"Resent emails to {count} leads")
    resend_email.short_description = "Resend results email"
