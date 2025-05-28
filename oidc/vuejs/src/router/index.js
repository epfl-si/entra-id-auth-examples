// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'; // Make sure this file exists
import UnauthorizedView from '../views/UnauthorizedView.vue'; // Make sure this file exists

import { msalInstance, loginRequest } from '../auth/msal.service';
//import { InteractionStatus } from '@azure/msal-browser'; // Import InteractionStatus
import { useAuth } from '../auth/useAuth.js';
const { interactionStatus } = useAuth();

// Whitelist of allowed email addresses from .env
const allowedEmailsString = import.meta.env.VITE_ALLOWED_EMAILS || '';
const ALLOWED_EMAILS = allowedEmailsString
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(email => email.length > 0);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresWhitelistedEmail = to.matched.some(record => record.meta.requiresWhitelistedEmail);

  const account = msalInstance.getActiveAccount(); // Get current active account from MSAL
  const isAuthenticated = !!account; // Determine if authenticated
  //const interactionStatus = msalInstance.getInteractionStatus(); // Get current MSAL interaction status

  // console.log(`Router Guard: Path='${to.path}', isAuthenticated=${isAuthenticated}, interactionStatus='${interactionStatus}'`);

  if (interactionStatus.value !== "None") {
    // If MSAL is in the middle of an interaction (e.g., redirect, popup),
    // let MSAL complete its process. It will typically redirect.
    // Calling next() might allow the navigation to a protected route prematurely.
    // Calling next(false) might interfere with MSAL's redirect.
    // Often, the best is to just wait for MSAL to handle it.
    // The browser will be redirected by MSAL if login is required or in progress.
    // If you want to show a loading screen, that should be handled at the App level based on interactionStatus.
    console.log("Router Guard: MSAL interaction in progress. Waiting for MSAL.");
    // It might be that `next()` is fine here, as handleRedirectPromise and events will update App state.
    // Or, if MSAL is expected to redirect, we don't even need to call next().
    // Let's try not calling next() if interaction is in progress and auth is required.
    if (requiresAuth && !isAuthenticated) {
        // If auth is required, not authenticated, and interaction is in progress,
        // MSAL is likely handling a redirect. So, we do nothing and let MSAL redirect.
        return;
    }
    // If auth is not required, or user is already authenticated despite interaction, allow navigation
    // (e.g. user refreshes page while a silent token call is happening)
    return next();
  }

  if (requiresAuth && !isAuthenticated) {
    // Not authenticated and no MSAL interaction is in progress, so initiate login.
    try {
      // console.log("Router Guard: Not authenticated, no interaction. Attempting loginRedirect for route:", to.fullPath);
      await msalInstance.loginRedirect({
        ...loginRequest, // from msal.service.js
        redirectStartPage: to.fullPath // Attempt to redirect back to the intended page
      });
      // loginRedirect causes a full page navigation, so next() is not called.
      return; // Explicitly return to stop further execution of the guard.
    } catch (error) {
      console.error("Router Guard: Login redirect failed:", error);
      return next(false); // Stop navigation on error
    }
  }

  if (requiresWhitelistedEmail && isAuthenticated) { // Check if already authenticated
    const userEmail = account?.username?.toLowerCase(); // username usually holds UPN/email
    if (userEmail && ALLOWED_EMAILS.includes(userEmail)) {
      next(); // Authenticated and email is whitelisted
    } else {
      // console.warn(`Router Guard: User ${userEmail} is authenticated but not in the allowed email list.`);
      next({ name: 'unauthorized' }); // Authenticated but email not whitelisted
    }
  } else {
    next(); // Route doesn't require auth, or doesn't require whitelisted email, or already handled.
  }
});

export default router;
