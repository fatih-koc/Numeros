"""
Django production settings for numeros project.
"""

import os
from .base import *  # noqa: F401, F403

DEBUG = False

SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS = [
    'numeros.app',
    'www.numeros.app',
    'api.numeros.app',
    '164.92.233.197',
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'numeros'),
        'USER': os.environ.get('DB_USER', 'numeros'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# CORS
CORS_ALLOWED_ORIGINS = [
    'https://numeros.app',
    'https://www.numeros.app',
]
CORS_ALLOW_CREDENTIALS = True

# CSRF
CSRF_TRUSTED_ORIGINS = [
    'https://numeros.app',
    'https://api.numeros.app',
]

# Security
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Static/Media
STATIC_ROOT = '/var/www/numeros/static/'
MEDIA_ROOT = '/var/www/numeros/media/'

# Swiss Ephemeris
EPHE_PATH = '/var/www/numeros/ephe/'

# Email (configure as needed)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')
DEFAULT_FROM_EMAIL = 'Numeros <noreply@numeros.app>'
