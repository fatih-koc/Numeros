# Import development settings by default for local development
# In production, set DJANGO_SETTINGS_MODULE=config.settings.production
from .development import *  # noqa: F401, F403
