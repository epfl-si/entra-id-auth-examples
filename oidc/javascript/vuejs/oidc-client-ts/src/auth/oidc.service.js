import { UserManager, WebStorageStateStore, Log } from 'oidc-client-ts';

// Configure OIDC client logging
Log.setLogger(console);
Log.setLevel(Log.INFO); 

const oidcSettings = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI,
  response_type: 'code', // Use Authorization Code Flow
  scope: import.meta.env.VITE_OIDC_SCOPE,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }), // Or localStorage
  automaticSilentRenew: true, // Enable automatic token renewal
  // silent_redirect_uri: `${window.location.origin}/silent-renew.html`, // Optional: for iframe-based silent renew
  monitorSession: true, // Optional: for session management features like checkSession
  // filterProtocolClaims: true, // Optional: removes protocol claims (nonce, at_hash, etc.) from profile
  // loadUserInfo: true, // Optional: fetches user info from userinfo_endpoint after login
};

if (!oidcSettings.authority || !oidcSettings.client_id) {
    console.error("OIDC configuration is missing or incomplete. Check VITE_OIDC_AUTHORITY and VITE_OIDC_CLIENT_ID in your .env file.");
}

export const userManager = new UserManager(oidcSettings);

// Event listeners for token lifecycle (optional but useful)
userManager.events.addUserLoaded((user) => {
  console.log('OIDC User loaded:', user);
});

userManager.events.addSilentRenewError((error) => {
  console.error('OIDC Silent renew error:', error);
});

userManager.events.addUserUnloaded(() => {
  console.log('OIDC User unloaded (logged out locally or session ended)');
});

userManager.events.addAccessTokenExpired(() => {
  console.log('OIDC Access token expired. Attempting silent renew.');
});

