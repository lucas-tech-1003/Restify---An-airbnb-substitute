#!/bin/bash

# Install pip
python -m pip install --upgrade pip
python -m pip install virtualenv
# Create virtual environment for Python
python -m venv env
source env/bin/activate

# Install Django, Django REST framework, Pillow, and SimpleJWT
python -m pip install django
python -m pip install djangorestframework
python -m pip install pillow
python -m pip install djangorestframework-simplejwt
python -m pip install django-multiselectfield
python -m pip install django-filter
python -m pip install django-countries
python -m pip install django-cors-headers


# npm install
cd frontend/  
npm install