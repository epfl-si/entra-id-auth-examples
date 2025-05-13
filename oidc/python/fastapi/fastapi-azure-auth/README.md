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
   TENANT_ID=your_tenant_id
   APP_CLIENT_ID=your_client_id
   OPENAPI_CLIENT_ID=your_openapi_client_id
   ```

   See below in the configuration part where to get the ID values

   Update `.env` file to adapt these variables.

   `APP_CLIENT_ID` must be the Client ID of the application created to protect your API. `OPENAPI_CLIENT_ID` (optional) is the Client ID for the Swagger documentation to try the API.

5. Run the server:

   ```bash
   python main.py
   ```

## Installation

You can install the library using the [official link](https://intility.github.io/fastapi-azure-auth/installation).

## Configuration

### Fast API

In order to configure Fast API application, please consider these steps

- Create your application on App Portal
  - This application must be of type **Web App**
  - Configure the **redirect URI** to match any URL (not used)

```python
azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
    app_client_id=settings.APP_CLIENT_ID,
    tenant_id=settings.TENANT_ID,
    scopes=settings.SCOPES,
)
```

For the example, we use security on global endpoint:

```python
app = FastAPI(dependencies=[Security(azure_scheme)])
```

### OpenAPI / Swagger configuration

In order to use Swagger, please consider these steps:

- Create another application in the App Portal to be used by the Swagger
  - This application must be of type **SPA**
  - Configure the **redirect URI** to match the one defined in `BACKEND_CORS_ORIGINS`
- Your Entra ID's backend application must be configured to **expose an API** and having at least one custom scope
- Then add to `api permissions` on Entra ID the scope you created

Configure Fast API as is:

```python
app = FastAPI(
   dependencies=[Security(azure_scheme)],
    swagger_ui_oauth2_redirect_url='/oauth2-redirect',
    swagger_ui_init_oauth={
        'usePkceWithAuthorizationCodeGrant': True,
        'clientId': settings.OPENAPI_CLIENT_ID
    },
)
```

## Documentation

- [Official Settings documentation](https://github.com/intility/fastapi-azure-auth)
- [Official website](https://intility.github.io/fastapi-azure-auth/)
