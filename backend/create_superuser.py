"""
Script to create a superuser with calculated numerology and zodiac.
"""

import os
import sys
import django
from datetime import date

# Setup Django
sys.path.insert(0, '/Users/fatih/Documents/Works/numeros/apps/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numeros.settings')
django.setup()

from users.models import User

# Create superuser
try:
    # Check if user already exists
    if User.objects.filter(email='fatihinemaili@gmail.com').exists():
        print('User already exists!')
        user = User.objects.get(email='fatihinemaili@gmail.com')
    else:
        user = User.objects.create_superuser(
            email='fatihinemaili@gmail.com',
            password='admin123',
            name='Fatih Koçkesen',
            birth_date=date(1987, 5, 7)
        )
        print('Superuser created successfully!')

    print(f'\nUser Details:')
    print(f'Email: {user.email}')
    print(f'Name: {user.name}')
    print(f'Birth Date: {user.birth_date}')
    print(f'\nNumerology:')
    print(f'Life Path: {user.life_path}')
    print(f'Day Number: {user.day_number}')
    print(f'Month Number: {user.month_number}')
    if user.soul_urge:
        print(f'Soul Urge: {user.soul_urge}')
    if user.expression:
        print(f'Expression: {user.expression}')
    if user.challenge:
        print(f'Challenge: {user.challenge}')
    print(f'\nZodiac:')
    print(f'Animal: {user.zodiac_animal}')
    print(f'Element: {user.zodiac_element}')
    print(f'Position: {user.zodiac_position}')
    print(f'\nPassword: admin123')

except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
