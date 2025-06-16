// src/auth/useAuth.js
import { ref, onMounted, computed, watch } from 'vue';
import { userManager } from './oidc.service'; // Import the UserManager instance
import { useRouter } from 'vue-router'; // If needed for navigation after logout

const isAuthenticated = ref(false);
const userProfile = ref(null); // To store OIDC user profile claims
const isLoading = ref(true); // Initial loading state

const allowedEmailsString = import.meta.env.VITE_ALLOWED_EMAILS || '';
const ALLOWED_EMAILS = allowedEmailsString
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(email => email.length > 0);

const isAuthorizedUser = computed(() => {
    console.log("userProfile.value:", userProfile.value)
  if (isAuthenticated.value && userProfile.value?.email) {
    return ALLOWED_EMAILS.includes(userProfile.value.email.toLowerCase());
  }
  // Azure AD sometimes puts UPN in 'preferred_username' if email isn't directly in profile
  if (isAuthenticated.value && userProfile.value?.preferred_username && ALLOWED_EMAILS.includes(userProfile.value.preferred_username.toLowerCase())) {
    return true;
  }
  return false;
});

async function initializeAuth() {
  isLoading.value = true;
  try {
    const oidcUser = await userManager.getUser();
    if (oidcUser && !oidcUser.expired) {
      userProfile.value = oidcUser.profile;
      isAuthenticated.value = true;
      console.log('User initialized from storage:', oidcUser.profile);
    } else {
	// No user in storage or token expired, ensure clean state
	console.log("no user in storage...")
	isAuthenticated.value = false;
	userProfile.value = null;
    }
  } catch (e) {
    console.error("Error initializing OIDC auth state:", e);
    isAuthenticated.value = false;
    userProfile.value = null;
  }
  isLoading.value = false;
}

async function login() {
  try {
    await userManager.signinRedirect(); // Redirects to IdP login page
  } catch (error) {
    console.error('OIDC Login failed to initiate:', error);
  }
}

async function logout() {
  try {
    const user = await userManager.getUser();
    if (user) {
      // If supported, pass id_token_hint for faster logout
      // await userManager.signoutRedirect({ id_token_hint: user.id_token });
      await userManager.signoutRedirect();
    } else {
      // If no user, just clear local state and optionally redirect
      isAuthenticated.value = false;
      userProfile.value = null;
      // router.push('/'); 
    }
  } catch (error) {
    console.error('OIDC Logout failed to initiate:', error);
  }
}

// This composable will be used by the App and Router
export function useAuth() {
  // Initialize auth state when first used

  // Watch for changes from userManager events
  const eventCallback = (user) => {
    if (user && !user.expired) {
      userProfile.value = user.profile;
      isAuthenticated.value = true;
    } else {
      userProfile.value = null;
      isAuthenticated.value = false;
    }
    isLoading.value = false; // Stop loading once user state is determined
  };

  userManager.events.addUserLoaded(eventCallback);
  userManager.events.addUserUnloaded(() => eventCallback(null)); // User unloaded means not authenticated

  return {
    isAuthenticated,
    isAuthorizedUser,
    userProfile, 
    login,
    logout,
    isLoading,
    initializeAuth // Expose this so App.vue can call it on mount
  };
}

