import hashlib
import boto3
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from botocore.exceptions import ClientError

from apps.numerology.engine import get_number_meaning


def get_unsubscribe_token(email: str) -> str:
    """Generate unsubscribe token for email."""
    secret = settings.SECRET_KEY
    return hashlib.sha256(f"{email}{secret}".encode()).hexdigest()[:32]


def send_numerology_results_email(lead) -> bool:
    """Send numerology results email via Amazon SES."""

    if not getattr(settings, 'AWS_SES_ENABLED', False):
        # Dev mode - just log
        print(f"[DEV] Would send email to {lead.email}")
        lead.email_sent = True
        lead.email_sent_at = timezone.now()
        lead.save(update_fields=['email_sent', 'email_sent_at'])
        return True

    try:
        ses = boto3.client(
            'ses',
            region_name=getattr(settings, 'AWS_SES_REGION', 'us-east-1'),
            aws_access_key_id=getattr(settings, 'AWS_ACCESS_KEY_ID', ''),
            aws_secret_access_key=getattr(settings, 'AWS_SECRET_ACCESS_KEY', ''),
        )
    except Exception as e:
        print(f"SES client error: {e}")
        return False

    # Build context for template
    context = {
        'name': lead.name,
        'life_path': lead.life_path,
        'soul_urge': lead.soul_urge,
        'expression': lead.expression,
        'personality': lead.personality,
        'life_path_meaning': get_number_meaning(lead.life_path),
        'soul_urge_meaning': get_number_meaning(lead.soul_urge),
        'expression_meaning': get_number_meaning(lead.expression),
        'personality_meaning': get_number_meaning(lead.personality),
        'unsubscribe_url': f"{getattr(settings, 'FRONTEND_URL', 'https://numeros.app')}/unsubscribe?email={lead.email}&token={get_unsubscribe_token(lead.email)}",
        'app_store_url': getattr(settings, 'APP_STORE_URL', 'https://apps.apple.com/app/numeros'),
        'play_store_url': getattr(settings, 'PLAY_STORE_URL', 'https://play.google.com/store/apps/details?id=com.numeros'),
    }

    html_body = render_to_string('email/numerology_results.html', context)
    text_body = render_to_string('email/numerology_results.txt', context)

    try:
        ses.send_email(
            Source=getattr(settings, 'DEFAULT_FROM_EMAIL', 'hello@numeros.app'),
            Destination={'ToAddresses': [lead.email]},
            Message={
                'Subject': {'Data': f'{lead.name}, your cosmic numbers are ready'},
                'Body': {
                    'Html': {'Data': html_body},
                    'Text': {'Data': text_body},
                }
            }
        )

        # Update lead status
        lead.email_sent = True
        lead.email_sent_at = timezone.now()
        lead.save(update_fields=['email_sent', 'email_sent_at'])

        return True

    except ClientError as e:
        print(f"SES Error: {e}")
        return False
