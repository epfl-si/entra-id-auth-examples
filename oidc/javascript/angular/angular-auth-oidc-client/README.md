# Angular Authentication with Entra ID using angular-auth-oidc-client

Open Source implementation of OpenID Connect for Angular web applications.
Tested with Angular v19 and angular-auth-oidc-client v19.

## Prerequisites

- Node.js 18.x or higher
- Angular CLI 19.x (or lower)

## Try this repository in your local environment

1. Clone the repository:

    ```bash
    git clone https://github.com/epfl-si/entra-id-auth-examples.git
    ```

2. Change to the repository directory:

    ```bash
    cd entra-id-auth-examples/oidc/javascript/angular/angular-auth-oidc-client
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Configure environment variables in: `./src/environment/environment.ts`

    ```typescript
    export const environment = {
        auth: {
            tenant_id: 'f6c2556a-c4fb-4ab1-a2c7-9e220df11c43',
            client_id: '<your_client_id>',
            redirect_uri: '<your_redirect_uri>'
        }
    };
    ```

5. Start the application:

    ```bash
    ng serve
    ```

## Installation in your own project

You need to install the package inside your angular application.

You can use these different CLI options to install the needed dependencies:

- angular cli

  ```bash
  ng add angular-auth-oidc-client
  ```

- npm

   ```bash
   npm install angular-auth-oidc-client
   ```

- yarn

   ```bash
   yarn add angular-auth-oidc-client
   ```

- pnpm

   ```bash
   pnpm add angular-auth-oidc-client
   ```

## Configuring Entra ID

Use the App Portal of EPFL to create and manage your applications.

For an angular application, select `SPA` application as application type.

## Authentication Configuration

### Important Configuration Options

When setting up your authentication configuration, there are several key parameters to configure:

- **authority**: The OpenID Connect provider's URL (Entra ID endpoint)
- **redirectUrl**: Where to redirect after authentication
- **clientId**: Your application's client ID from Entra ID
- **postLogoutRedirectUri**: Where to redirect after logout (optional)
- **scope**: The OAuth scopes to request
- **responseType**: The OAuth flow type ('code' recommended)
- **silentRenew**: Whether to automatically renew tokens
- **useRefreshToken**: Whether to utilize refresh tokens
- **secureRoutes**: API endpoints that require authentication

Refer to the `epfl/src/app/auth/auth.config.ts` file in the example project for a complete implementation.

### Enable debugging

Configure the loglevel based on your needs:

```typescript
// src/app/auth/auth.config.ts
export const authConfig: PassedInitialConfig = {
  config: {
      // ...
      logLevel: LogLevel.Debug, // Options: Debug, Warn, Error, None
    }
}
```

### Configure based on application type

#### Standalone application (Angular v19+)

Since Angular v19, applications are standalone by default.
To configure this kind of application, you will need to modify `src/app/app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth, withAppInitializerAuthCheck } from 'angular-auth-oidc-client';
import { authConfig } from './auth/auth.config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAuth(authConfig, withAppInitializerAuthCheck())
  ]
};
```

#### NgModule (pre-Angular v19)

For older Angular versions using NgModule, import and configure the authentication module:

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from 'angular-auth-oidc-client';
import { authConfig } from './auth/auth.config';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    // ...
  ],
  imports: [
    BrowserModule,
    // ...
    AuthModule.forRoot(authConfig)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Example Project Structure (epfl folder)

The repository includes a complete working example in the `epfl` folder. This section explains the key files and their purposes to help you understand how the authentication is implemented.

### Key Files and Their Roles

#### Configuration Files

- **`epfl/src/app/auth/auth.config.ts`**
  - Contains the main authentication configuration
  - Defines parameters like authority URL, client ID, redirect URLs, and scopes
  - Sets up token management and security options
  - Controls logging level for debugging

- **`epfl/src/app/app.config.ts`** (for standalone applications)
  - Registers the authentication module using `provideAuth(authConfig)`
  - Sets up other application-wide providers and configurations

#### Route Protection

- **`epfl/src/app/auth/auth.guard.ts`**
  - Implements route guards to protect private routes
  - Redirects unauthenticated users to the unauthorized component OR login process (optional)
  - Allows access only to authenticated users

- **`epfl/src/app/app.routes.ts`**
  - Defines application routes
  - Applies the AuthGuard to protected routes
  - Sets up callback routes for the authentication flow (optional, can set up callback as main route `/`)

## Implementation Guidelines

When implementing authentication in your own application, you should:

1. **Review the configuration** in `auth.config.ts` and adjust it to your Entra ID settings
2. **Register the authentication module** in your application using the appropriate method for your Angular version
3. **Protect routes** using guards where needed

Refer to the example project files for implementation details and patterns to follow in your own application.

## Troubleshooting

### Common Issues and Solutions

1. **Login redirects but immediately returns to the application without authentication**
   - Check that your redirect URI is correctly configured in both Entra ID and your application
   - Ensure the tenant ID and client ID match what's in your Entra ID portal

2. **"Invalid client" error during login**
   - Verify your client ID in the configuration
   - Check that the application is properly registered in Entra ID

3. **Tokens not being stored or found**
   - Check browser console for CORS issues
   - Verify that you haven't disabled cookies or storage in your browser

4. **Silent token renewal not working**
   - Ensure `silentRenew` is set to true in your configuration
   - Check if `useRefreshToken` is enabled

### Debugging Tips

- Enable debug logging: `logLevel: LogLevel.Debug`
- Use browser developer tools to inspect token storage (Application > Storage)
- Examine network requests during authentication flow
- Subscribe to events for more detailed information:

## Documentation References

- [Official Documentation](https://www.angular-auth-oidc-client.com/docs/intro)
- [Entra ID Integration Guide](https://github.com/damienbod/angular-auth-oidc-client/tree/main/projects/sample-code-flow-azuread)
- [Configuration Reference](https://www.angular-auth-oidc-client.com/docs/documentation/configuration)
