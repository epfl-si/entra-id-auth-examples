# fastapi-azure-auth

Implementation of OIDC and OAuth2 flow inside FastAPI.

## Try this repository in your local environment

1. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

2. Change to the repository directory:

   ```bash
   cd entra-id-auth-examples/oidc/python/fastapi/fastapi-azure-auth
   ```

3. Setup python environment:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:

   ```bash
   TENANT_ID=
   APP_CLIENT_ID=
   OPENAPI_CLIENT_ID=
   ```
Update `.env` file to adapt these variables.

5. Run the server:

   ```bash
   python main.py
   ```

## Installation

You can install the library using the [official link](https://intility.github.io/fastapi-azure-auth/installation).

## Configuration

### OpenAPI / Swagger configuration

Ask for a new app registration in entra ID or another entry in shared application.

Then configure Fast API:

```python
app = FastAPI(
    swagger_ui_oauth2_redirect_url='/oauth2-redirect',
    swagger_ui_init_oauth={
        'usePkceWithAuthorizationCodeGrant': True,
        'clientId': settings.APP_CLIENT_ID
    },
)
```

### Fast API

```python
azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id=settings.APP_CLIENT_ID,
    tenant_id=settings.TENANT_ID,
    scopes=settings.SCOPES,
)
```

For the example, we use security on global endpoint:

```
app = FastAPI(dependencies=[Security(azure_scheme)])
```

## Documentation

- [Official Settings documentation](https://github.com/intility/fastapi-azure-auth)
- [Official website](https://intility.github.io/fastapi-azure-auth/)
