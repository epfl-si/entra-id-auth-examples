# mozilla-django-oidc

Open Source implementation of OpenID Connect for Django web applications.

## Try this repository in your local environment

1. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

2. Change to the repository directory:

   ```bash
   cd entra-id-auth-examples/oidc/python/django/mozilla-django-oidc
   ```

3. Setup python environment:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:

   ```bash
   export OIDC_RP_CLIENT_ID=your_client_id
   export OIDC_RP_CLIENT_SECRET=your_client_secret
   export TENANT_ID=your_tenant_id
   ```

5. Run the server:

   ```bash
   cd epfl && \
   python manage.py migrate && \
   python manage.py runserver
   ```

## Installation

You can install the library using pip:

```bash
pip install mozilla-django-oidc
```

You can also install `django-login-required-middleware` library to force login to any view:

```bash
pip install django-login-required-middleware
```

But you will need to exclude paths that you don't want to force login in your Django settings file.

```python
LOGIN_REQUIRED_IGNORE_PATHS = [
    r'/accounts/login/$',
    r'/accounts/logout/$',
    r'^/oidc/.*$',  # All OIDC-related URLs
    r'^/admin/.*$',
    r'^/admin$',
    r'^/static/.*$',
    r'^/media/.*$',
]
```

## Configuration

You can configure the most important settings in your Django settings file: see [Configuration](/oidc/python/django/mozilla-django-oidc/epfl/mysite/settings.py). From line 121 to end of the file.

1. Add to installed apps:

   ```python
   INSTALLED_APPS = [
        ...
        'django.contrib.auth',
        'mozilla_django_oidc',
        ...
   ]
   ```

2. Add to middleware (optional):

   ```python
    MIDDLEWARE = [
          ...
          'login_required.middleware.LoginRequiredMiddleware',
          ...
    ]
   ```

3. Add to authentication backends:

   ```python
   AUTHENTICATION_BACKENDS = ("mozilla_django_oidc.auth.OIDCAuthenticationBackend","django.contrib.auth.backends.ModelBackend")
   ```

   In the provided example, we use our own implementation of `OIDCAuthenticationBackend` that allow us to customize username or any other claim ([see our backend implementation](./epfl/accounts/backend.py))

4. Add OIDC configuration:

   ```python
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
   ```

5. Configure required ignore paths

   ```python
   LOGIN_REQUIRED_IGNORE_PATHS = [
       r'/accounts/login/$',
       r'/accounts/logout/$',
       r'^/oidc/.*$',  # All OIDC-related URLs
       r'^/admin/.*$',
       r'^/admin$',
       r'^/static/.*$',
       r'^/media/.*$',

   ]
   ```

## Documentation

- [Official Settings documentation](https://mozilla-django-oidc.readthedocs.io/en/stable/settings.html)
