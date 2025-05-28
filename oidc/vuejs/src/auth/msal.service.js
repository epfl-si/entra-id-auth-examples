import { PublicClientApplication, LogLevel } from '@azure/msal-browser';

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_ENTRA_ID}`,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.VITE_MSAL_POST_LOGOUT_REDIRECT_URI, // Optional
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            // console.info(message);
            return;
          case LogLevel.Verbose:
            // console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      logLevel: LogLevel.Info, // Adjust LogLevel.Error for production if too verbose
    },
  },
};

// Check if essential MSAL config values are present
if (!msalConfig.auth.clientId || !msalConfig.auth.authority.includes(import.meta.env.VITE_MSAL_ENTRA_ID) ) {
    console.error("MSAL configuration is missing or incomplete. Please check your .env file and VITE_MSAL_CLIENT_ID / VITE_MSAL_ENTRA_ID variables.");
}


export const msalInstance = new PublicClientApplication(msalConfig);

// Export an initialization promise you can await from anywhere
export const msalInitPromise = (async () => {
  await msalInstance.initialize();

  try {
    const response = await msalInstance.handleRedirectPromise();

    if (response?.account) {
      msalInstance.setActiveAccount(response.account);
    }
  } catch (e) {
    console.error('handleRedirectPromise failed:', e);
  }
})();


export const loginRequest = {
  scopes: ['User.Read'],
};

export const acquireToken = async () => {
 const account = msalInstance.getActiveAccount();
 if (!account) {
   throw new Error('No active account! Please log in.');
 }

 const tokenRequest = {
   scopes: ['User.Read'],
   account: account,
 };

 try {
   const response = await msalInstance.acquireTokenSilent(tokenRequest);
   return response;
 } catch (error) {
   console.warn('Silent token acquisition failed. Acquiring token using popup/redirect.', error);
   if (error.name === "InteractionRequiredAuthError" || error.name === "BrowserAuthError") {
     try {
       const response = await msalInstance.acquireTokenPopup(tokenRequest);
       return response;
     } catch (popupError) {
       console.error('Interactive token acquisition failed.', popupError);
       throw popupError;
     }
   }
   throw error;
 }
};

export const handleRedirectPromise = async () => {
 try {
   const response = await msalInstance.handleRedirectPromise();
   if (response && response.account) {
     msalInstance.setActiveAccount(response.account);
   }
   return response;
 } catch (error) {
   console.error('Redirect handling error:', error);
   return null;
 }
};
