# oauth4webapi

Open Source implementation of OpenID Connect for NodeJS x Express applications.

## Try this repository in your local environment

1. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

2. Change to the repository directory:

   ```bash
   cd entra-id-auth-examples/oidc/NodeJS
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure environment variables:

   For authorization code flow:

   ```bash
   AUTH_URL = 'your_auth_url'
   CLIENT_ID = 'your_client_id'
   CLIENT_SECRET = 'your_client_secret'
   REDIRECT_URI = 'your_redirect_uri'
   SCOPE = 'https://graph.microsoft.com/.default'
   ```

   For client credentials flow:

   ```bash
   AUTH_URL = 'your_auth_url'
   CLIENT_ID = 'your_client_id'
   CLIENT_SECRET = 'your_client_secret'
   SCOPE = 'https://graph.microsoft.com/.default'
   ```

5. Run the server:

   ```bash
   node index_client_credential_flow.js
   ```

   or

   ```bash
   node index_authorization_code_flow.js
   ```

## Installation

You can install the oauth4webapi using npm:

```bash
npm install oauth4webapi
```

## Configuration

You can find 2 examples whether you use [authorization code flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow#how-authorization-code-flow-works) or [client credentials flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow).

## Documentation

- [Official documentation](https://github.com/panva/oauth4webapi)
