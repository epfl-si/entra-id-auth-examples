# flask-OIDC

Implementation of OIDC and OAuth2 flow inside Flask Webapp.

## Try this repository in your local environment

1. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

2. Change to the repository directory:

   ```bash
   cd entra-id-auth-examples/oidc/python/flask/flask-oidc
   ```

3. Setup python environment:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:

   ```bash
   APP_SECRET_KEY="yoursecret"
   ```

   Update `.env` file to adapt this variables.

5. Configure `client_secrets.json`

   ```json
   {
      "web": {
         "client_id": "REDACTED",
         "client_secret": "REDACTED",
         "auth_uri": "https://login.microsoftonline.com/REDACTED/oauth2/v2.0/authorize",
         "token_uri": "https://login.microsoftonline.com/REDACTED/oauth2/v2.0/token",
         "userinfo_uri": "https://graph.microsoft.com/oidc/userinfo",
         "issuer": "https://login.microsoftonline.com/REDACTED/v2.0", // OR https://sts.windows.net/REDACTED/
         "redirect_uris": [
            "http://localhost:5000/authorize"
         ]
      }
   }

6. Run the server:

   ```bash
   flask --app authentification_web run
   ```

## Installation

You can install the library using pip:

```bash
pip install Flask-OIDC
```

## Limitation due to Entra ID

Entra ID does not support introspection for token validation.
This library use only introspection to validate token when [protecting API](https://flask-oidc.readthedocs.io/en/latest/#resource-server).

The current documentation only provides examples for web-based authentication flows where the application handles the OAuth/OIDC redirect flow directly. This limits users who need to implement other authentication patterns.

## Configuration

All configuration references are available on [official documentation](https://flask-oidc.readthedocs.io/en/latest/#settings-reference)

## Documentation

- [Official Settings documentation](https://flask-oidc.readthedocs.io/en/latest/)
