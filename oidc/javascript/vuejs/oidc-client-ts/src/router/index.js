// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AuthCallback from '../views/AuthCallback.vue';
import LogoutCallback from '../views/LogoutCallback.vue';
import UnauthorizedView from '../views/UnauthorizedView.vue';
import { userManager } from '../auth/oidc.service'; 

// Allowed emails
const allowedEmailsString = import.meta.env.VITE_ALLOWED_EMAILS || '';
const ALLOWED_EMAILS = allowedEmailsString
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(email => email.length > 0);

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/auth-callback', name: 'authCallback', component: AuthCallback },
  { path: '/logout-callback', name: 'logoutCallback', component: LogoutCallback },
  { path: '/unauthorized', name: 'unauthorized', component: UnauthorizedView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresWhitelistedEmail = to.matched.some(record => record.meta.requiresWhitelistedEmail);

  // Skip auth checks for callback routes
  if (to.name === 'authCallback' || to.name === 'logoutCallback') {
    return next();
  }

  const oidcUser = await userManager.getUser(); // Get user directly from userManager
  const isAuthenticated = !!(oidcUser && !oidcUser.expired);

  if (requiresAuth && !isAuthenticated) {
    console.log("Router guard: Not authenticated, redirecting to login for path:", to.fullPath);
    // Store the original path to redirect back after login
    userManager.signinRedirect({ state: { targetPath: to.fullPath } })
      .catch(err => {
        console.error("Router guard: signinRedirect failed", err);
        next(false); // Prevent navigation if signinRedirect itself errors
      });
    // next(false) => current navigation is cancelled.
    return next(false);
  } else if (requiresWhitelistedEmail && isAuthenticated) {
    const userEmail = oidcUser.profile?.email?.toLowerCase();
    const preferredUsername = oidcUser.profile?.preferred_username?.toLowerCase(); // For Azure AD UPN

    if ((userEmail && ALLOWED_EMAILS.includes(userEmail)) ||
        (preferredUsername && ALLOWED_EMAILS.includes(preferredUsername))) {
      next();
    } else {
      console.warn(`Router guard: User ${userEmail || preferredUsername} is not whitelisted.`);
      next({ name: 'unauthorized' });
    }
  } else {
    next();
  }
});

export default router;


