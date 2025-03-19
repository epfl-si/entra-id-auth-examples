# angular-auth-oidc-client

Open Source implementation of OpenID Connect for Angular web applications.
Tested with Angular v19 and angular-auth-oidc-client v19.

## Try this repository in your local environment

1. Clone the repository:

```bash
git clone https://github.com/epfl-si/entra-id-auth-examples.git
```

2. Change to the repository directory:

```bash
cd entra-id-auth-examples/oidc/JavaScript/Angular/angular-auth-oidc-client
```

3. Configure environment variables in: `./src/environment/environment.ts`

```bash
tenant_id: 'your_tenant_id',
client_id: 'your_client_id',
```

## Installation

You need to install the package inside your angular application.

You can use these differents CLI to install the needed dependencies:

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

## Configuration

Example: see example projet (folder epfl).

### Enable debugging

Configure the loglevel based on your needs:

```typescript
// epfl/src/app/auth/auth.config.ts
export const authConfig: PassedInitialConfig = {
  config: {
      // ...
      logLevel: LogLevel.Debug,
    }
}
```

### configuration based on application type

#### Standalone application

Since Angular v19 application are standalone by default.
To configure this kind of application, you will need to configure it on this file: `epfl/src/app/app.config.ts`:

```typescript
import { provideAuth } from 'angular-auth-oidc-client';
providers: [
    // ...
    provideAuth(authConfig)
  ]
```

#### NgModule

Before Angular v19 you can have modules to configure libraries. Import and configure authentication module in it:

```typescript
import { AuthModule } from 'angular-auth-oidc-client';
imports: [
    // ...
    AuthModule.forRoot(authConfig)
  ],
```

## Authentication Info

The angular-auth-oidc-client uses the SessionStorage by default to store tokens.

For more information, you can check the documentation: <https://www.angular-auth-oidc-client.com/docs/documentation/custom-storage>

## Documentation

- [Official Documentation](https://www.angular-auth-oidc-client.com/docs/intro)
- [Entra ID Integration Guide](<https://github.com/damienbod/angular-auth-oidc-client/tree/main/projects/sample-code-flow-azuread>)
- [Configuration Reference](https://www.angular-auth-oidc-client.com/docs/documentation/configuration)
