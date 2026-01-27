from django.db import models


class MarketingLead(models.Model):
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=200)
    birth_date = models.DateField()

    # Captured numerology
    life_path = models.IntegerField(null=True, blank=True)
    soul_urge = models.IntegerField(null=True, blank=True)
    expression = models.IntegerField(null=True, blank=True)
    personality = models.IntegerField(null=True, blank=True)

    # Tracking
    source = models.CharField(max_length=50, db_index=True)  # 'calculator', 'waitlist', 'download'
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    # Status
    email_sent = models.BooleanField(default=False)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    subscribed = models.BooleanField(default=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'marketing_leads'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email_sent', 'subscribed']),
            models.Index(fields=['source', 'created_at']),
        ]

    def __str__(self):
        return f"{self.name} <{self.email}>"
