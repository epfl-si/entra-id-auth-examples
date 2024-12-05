# mod_auth_openidc

Apache 2.4 module implementing OpenID Connect Relying Party and OAuth 2.0 Resource Server functionalities.

## Installation

1. Download the [latest release](https://github.com/OpenIDC/mod_auth_openidc/releases)
2. Install the package for your OS:

   ```bash
   # Debian/Ubuntu
   sudo apt install ./libapache2-mod-auth-openidc*.deb

   # RHEL/CentOS
   sudo yum install mod_auth_openidc*.rpm
   ```

## Configuration

Example: see [example configuration](./sample.conf) file.

Enable debugging:

```apache
LogLevel debug auth_openidc:trace8
```

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
