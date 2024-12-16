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

3. Setup environment:
```bash

```

4. Configure environment variables:
In ./src/environment/environment.ts

```bash
tenant_id: 'your_tenant_id',
client_id: 'your_client_id',
```

5. Run:
```bash

```

## Installation

1. Download the [latest release](https://github.com/OpenIDC/mod_auth_openidc/releases)
2. Install the package for your OS:

   ```bash
   ng add angular-auth-oidc-client

   # NPM
   npm install angular-auth-oidc-client

   # Yarn
   yarn add angular-auth-oidc-client

   # PNPM
   pnpm add angular-auth-oidc-client
   ```

## Configuration

Example: see [example configuration](./Sample conf) folder.

Enable debugging:

```typescript
logLevel: LogLevel.Debug,
```
### Standalone
Example: see the app.config file (./Sample conf/app.config.ts)

```typescript
import { provideAuth } from 'angular-auth-oidc-client';
providers: [
    // ...
    provideAuth(authConfig)
  ]
```

### NgModule
Example: see the app.module file (./Sample conf/app.module.ts)

```typescript
import { AuthModule } from 'angular-auth-oidc-client';
imports: [
    // ...
    AuthModule.forRoot(authConfig)
  ],
```

## Authentication Info
The angular-auth-oidc-client uses the SessionStorage by default.

For more information, you can check the documentation: https://www.angular-auth-oidc-client.com/docs/documentation/custom-storage

## Documentation

- [Official Documentation](https://www.angular-auth-oidc-client.com/docs/intro)
- [Entra ID Integration Guide](<https://github.com/damienbod/angular-auth-oidc-client/tree/main/projects/sample-code-flow-azuread>)
- [Configuration Reference](https://www.angular-auth-oidc-client.com/docs/documentation/configuration)
