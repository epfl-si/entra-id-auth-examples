# mod_auth_openidc

Apache 2.4 module implementing OpenID Connect Relying Party and OAuth 2.0 Resource Server functionalities.

## Installation

### Installation from package manager

   ```bash
   # Debian/Ubuntu
   sudo apt install libapache2-mod-auth-openidc
   ```

### Manual Installation (Ubuntu/Debian)

1. Get your release code name:

   ```bash
   lsb_release --codename
   ```

2. Download the [latest release](https://github.com/OpenIDC/mod_auth_openidc/releases) based on your code name
3. Install the package on your OS:

   ```bash
   sudo apt install ./libapache2-mod-auth-openidc.{OS_CODENAME}_amd64.deb
   ```

## Configuration

Example: see [example configuration](./sample.conf) file.

Enable debugging:

```apache
LogLevel debug auth_openidc:trace8
```

If you want to restrict the access to a certain directory, you can require specific claim values:
```apache
AuthType openid-connect
OIDCCookie oidcstate
OIDCCookiePath "/"
Require claim [claim_name]: [claim_value]
```
For example:
```apache
AuthType openid-connect
OIDCCookie oidcstate
OIDCCookiePath "/"
Require claim groups:EPFL_Group
```
We recommend to use these configurations in the main server configuration file.
If the server configuration file can't be accessed, the configuration can be done in .htaccess files (see [Apache documentation](https://httpd.apache.org/docs/2.4/en/howto/htaccess.html#when)).

## Authentication Info Endpoints

The module exposes authentication information through these endpoints:

- `/redirect_uri?info=json` - Authentication data in JSON format
- `/redirect_uri?info=html` - Authentication data in HTML format
- `/redirect_uri?logout=logout_uri` - Logout endpoint

### Available Info Fields

Configure which fields to expose using `OIDCInfoHook`:

```apache
OIDCInfoHook iat access_token id_token userinfo session
```

Fields:

- `iat` - Token issue timestamp
- `access_token` - Opaque access token
- `id_token` - ID token claims
- `userinfo` - UserInfo endpoint claims
- `session` - Session metadata

## Documentation

- [Official Documentation](https://github.com/OpenIDC/mod_auth_openidc)
- [Entra ID Integration Guide](<https://github.com/OpenIDC/mod_auth_openidc/wiki/Microsoft-Entra-ID--(Azure-AD)>)
- [Configuration Reference](https://github.com/OpenIDC/mod_auth_openidc/blob/master/auth_openidc.conf)
