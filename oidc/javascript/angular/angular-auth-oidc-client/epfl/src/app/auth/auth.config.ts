import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../environment/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: `https://login.microsoftonline.com/${environment.auth.tenant_id}/v2.0`,
    redirectUrl: environment.auth.redirect_uri,
    clientId: environment.auth.client_id,
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    maxIdTokenIatOffsetAllowedInSeconds: 600
  }
}
