"""
Django settings for mysite project.

Generated by 'django-admin startproject' using Django 5.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-7suckmg%ueeixs$#!0=%@oz)my3he!*t$ixf&5__3n!-104g8n"
DEBUG = True
ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "mozilla_django_oidc",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "login_required.middleware.LoginRequiredMiddleware",
]

ROOT_URLCONF = "mysite.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "mysite.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTHENTICATION_BACKENDS = ("accounts.backend.MyOIDCAB","django.contrib.auth.backends.ModelBackend")

# Not necessary for the OIDC configuration but allow to configure environment variables through a .env file
from dotenv import load_dotenv
load_dotenv()

####################################################
# Authentication settings
####################################################
TENANT_ID = os.environ["TENANT_ID"]

OIDC_RP_CLIENT_ID = os.environ["OIDC_RP_CLIENT_ID"]
OIDC_RP_CLIENT_SECRET = os.environ["OIDC_RP_CLIENT_SECRET"]

AUTH_DOMAIN = f"https://login.microsoftonline.com/{TENANT_ID}"
OIDC_OP_AUTHORIZATION_ENDPOINT = f"{AUTH_DOMAIN}/oauth2/v2.0/authorize"
OIDC_OP_TOKEN_ENDPOINT = f"{AUTH_DOMAIN}/oauth2/v2.0/token"
OIDC_OP_JWKS_ENDPOINT = f"{AUTH_DOMAIN}/discovery/v2.0/keys"
OIDC_OP_USER_ENDPOINT = "https://graph.microsoft.com/oidc/userinfo"
OIDC_RP_SIGN_ALGO = "RS256"

LOGIN_REDIRECT_URL = "/polls"
LOGOUT_REDIRECT_URL = "/accounts/login"

# Only use this setting if you want to store the access token in the session
# To use access token to call API
OIDC_STORE_ACCESS_TOKEN = True

LOGIN_REQUIRED_IGNORE_PATHS = [
    r'/accounts/login/$',
    r'/accounts/logout/$',
    r'^/oidc/.*$',  # All OIDC-related URLs
    r'^/admin/.*$',
    r'^/admin$',
    r'^/static/.*$',
    r'^/media/.*$',

]
LOGIN_REQUIRED_REDIRECT_FIELD_NAME = 'next_url'