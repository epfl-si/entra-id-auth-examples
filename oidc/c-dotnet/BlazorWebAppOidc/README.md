# .Net OIDC

OpenID inside Blazor Server side application.

## Try this repository in your local environment

1. Clone the repository:

   ```bash
   git clone https://github.com/epfl-si/entra-id-auth-examples.git
   ```

2. Change to the repository directory:

   ```bash
   cd entra-id-auth-examples/oidc/c-dotnet/BlazorWebAppOidc
   ```

3. Configure environment variables:

   ```bash
   export OIDC_CLIENT_ID=your_client_id
   export OIDC_TENANT_ID=your_tenant_id
   ```

   and secrets:

   ```bash
   dotnet user-secrets set "Authentication:Schemes:MicrosoftOidc:ClientSecret" "your_secret"
   ```

4. Run the application using Visual Studio

## Installation

Use the official documentation : [available inside Microsoft website](https://learn.microsoft.com/en-us/aspnet/core/blazor/security/blazor-web-app-with-oidc?view=aspnetcore-9.0&pivots=without-bff-pattern)

## Configuration

Use `builder.Services.AddAuthentication(MS_OIDC_SCHEME).AddOpenIdConnect(MS_OIDC_SCHEME, oidcOptions =>{});` to enable and configure OIDC parameters.

Then you can protect page using:

```dotnet
@attribute [Authorize]
```

Inside Razor pages.
