#!/bin/bash

# Install pip
python3 -m pip install --upgrade pip
python3 -m pip install virtualenv
# Create virtual environment for Python
python3 -m venv env
source env/bin/activate

# Install Django, Django REST framework, Pillow, and SimpleJWT
python3 -m pip install django
python3 -m pip install djangorestframework
python3 -m pip install pillow
python3 -m pip install djangorestframework-simplejwt
python3 -m pip install django-multiselectfield
python3 -m pip install django-filter
python3 -m pip install django-countries
python3 -m pip install django-cors-headers


# npm install  
npm install