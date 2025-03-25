# NodeJS Authentication with Entra ID using oauth4webapi

Open Source implementation of OpenID Connect for NodeJS applications using the low-level oauth4webapi library.

## Prerequisites

- Node.js 14.x or higher
- NPM or another package manager
- A access to App Portal

## Try this repository in your local environment

1. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

2. Change to the repository directory:

   ```bash
   cd entra-id-auth-examples/oidc/nodejs
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure environment variables:

   For authorization code flow:

   ```bash
   AUTH_URL = '<your_auth_url>'
   CLIENT_ID = '<your_client_id>'
   CLIENT_SECRET = '<your_client_secret>'
   REDIRECT_URI = '<your_redirect_uri>'
   SCOPE = 'https://graph.microsoft.com/.default'
   ```

   For client credentials flow:

   ```bash
   AUTH_URL = '<your_auth_url>'
   CLIENT_ID = '<your_client_id>'
   CLIENT_SECRET = '<your_client_secret>'
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

## Example Project Structure

The repository contains two example implementations using the low-level oauth4webapi library without any additional frameworks:

### Authorization Code Flow Example

The Authorization Code Flow is used for user authentication in web applications where the user needs to log in and authorize the application. This flow is suitable for applications that can securely store client secrets.

#### Key Files and Their Roles

- **`index_authorization_code_flow.js`**
  - Main application entry point
  - Implements the complete authorization code flow
  - Generates authorization URLs for redirecting users
  - Handles authorization code exchange for tokens
  - Demonstrates token validation and usage
  - Initialize express application

### Client Credentials Flow Example

The Client Credentials Flow is used for service-to-service authentication where no user interaction is required. This flow is suitable for backend services that need to access resources directly.

#### Key Files and Their Roles

- **`index_client_credential_flow.js`**
  - Main application entry point
  - Implements the client credentials flow
  - Acquires tokens directly without user interaction
  - Demonstrates API access with the acquired token

## Configuring App Portal

Use the App Portal of EPFL to create and manage your applications.

For an a nodejs application, select `Web` application as application type.

To use these examples, you need to register your application in App Portal:

1. **For Authorization Code Flow:**
   - Register a web application as `Web`
   - Configure redirect URIs
   - Generate a client secret (automatically created at applicatiob creation)
   - Configure appropriate API permissions

2. **For Client Credentials Flow:**
   - Register an application: `Web` type can be utilized
   - Generate a client secret (automatically created at applicatiob creation)

## Troubleshooting

### Common Issues

1. **"invalid_client" error**
   - Check your client ID and client secret
   - Ensure the application is properly registered in Entra ID

2. **Redirect URI mismatch**
   - Ensure the redirect URI in your code matches exactly what's registered in Entra ID
   - Note that even minor differences (trailing slashes, http vs https) will cause this error

3. **Insufficient permissions**
   - Check that you've configured the right scopes
   - Ensure admin consent has been granted for the required permissions

4. **Token validation failures**
   - Verify that the tokens are being properly validated
   - Check that the issuer URL is correct
   - Ensure you're using the proper validation methods from oauth4webapi

### Debugging Tips

- Use `console.log()` to output key values and API responses
- Examine the full error objects returned by oauth4webapi (they contain detailed information)
- Use the Microsoft Graph Explorer to test API access separately
- Verify token contents using tools like [jwt.io](https://jwt.io)
- Add timeout handling for network requests

## Documentation

- [oauth4webapi Official Documentation](https://github.com/panva/oauth4webapi)
- [Microsoft Entra ID Documentation](https://learn.microsoft.com/en-us/entra/identity-platform/)
- [Authorization Code Flow Documentation](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)
- [Client Credentials Flow Documentation](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)
