<template>
  <div id="nav" v-if="!isProcessingCallback && !isLoading">
    <router-link to="/">Home</router-link> |
    <span v-if="isAuthenticated">
      Welcome, {{ userProfile?.mail }}!
      <button @click="handleLogout">Logout</button>
    </span>
    <button v-else @click="handleLogin">Login</button>
  </div>
  <div v-if="isProcessingCallback || isLoading">
    Processing authentication, please wait...
  </div>
  <div v-if="authError" class="error-message">
     Authentication Error: {{ authError }}
     <button @click="clearAuthErrorAndRetryLogin">Try Logging In Again</button>
  </div>

  <!-- Only render router-view if not processing callback and not in initial load without error -->
  <router-view v-if="!isProcessingCallback && !isLoading && !authError" />
</template>


<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userManager } from './auth/oidc.service'; // Adjust path
import { useAuth } from './auth/useAuth';   // Adjust path

const {
  isAuthenticated,
  isAuthorizedUser,
  userProfile,
  login,
  logout,
  initializeAuth,
  isLoading: isAuthLoading
} = useAuth();

const router = useRouter();
const route = useRoute();

const isProcessingCallback = ref(false);
const authError = ref(null); // For errors during callback processing specifically
const isLoading = ref(true); // General loading, combines initial auth load and callback processing

// Watch the main isLoading from useAuth
watch(isAuthLoading, (newVal) => {
    if (!isProcessingCallback.value) { // Only update general isLoading if not in callback
        isLoading.value = newVal;
    }
});


onMounted(async () => {
  console.log("App.vue: Mounted.");
  isLoading.value = true; // Start with loading true

  // Check if the current URL contains OIDC callback parameters
  const urlParams = new URLSearchParams(window.location.search); // For query params
  const hashParams = new URLSearchParams(window.location.hash.substring(1)); // For hash params (OIDC can use either)

  // OIDC response parameters (code, state, error)
  const code = urlParams.get('code') || hashParams.get('code');
  const state = urlParams.get('state') || hashParams.get('state');
  const errorParam = urlParams.get('error') || hashParams.get('error');

  if (errorParam) {
    console.error("App.vue: OIDC error received from IdP in URL:", errorParam, urlParams.get('error_description'));
    authError.value = `Login failed: ${urlParams.get('error_description') || errorParam}`;
    isProcessingCallback.value = false;
    isLoading.value = false;
    // Clear the error params from URL using history.replaceState
    window.history.replaceState({}, document.title, window.location.pathname);
    return; // Stop further processing
  }

  if (code && state) { // Presence of 'code' and 'state' indicates an OIDC callback
    isProcessingCallback.value = true;
    isLoading.value = true; 
    authError.value = null;
    console.log("App.vue: Detected OIDC callback parameters. Processing signinRedirectCallback...");
    try {
      const user = await userManager.signinRedirectCallback(); // Process the callback
      if (user) {
        console.log("App.vue: OIDC signinRedirectCallback successful. User profile:", user.profile);
        // Calling initializeAuth again to ensure UI reflects it immediately if events are slow.
        await initializeAuth(); // Re-check auth state after callback
        const targetPath = user.state?.targetPath || '/';
        console.log("App.vue: Navigating to targetPath after callback:", targetPath);
        router.replace(targetPath); // Navigate, replacing callback URL in history
      } else {
        console.error("App.vue: signinRedirectCallback completed but returned no user.");
        authError.value = "Login process completed, but no user information was returned.";
      }
    } catch (e) {
      console.error("App.vue: CRITICAL FAILURE - error during signinRedirectCallback:", e);
      authError.value = e.message || "An unknown error occurred during login processing.";
      // Log the full error object for more details
      console.log("Full error object from signinRedirectCallback:", e);
    } finally {
      isProcessingCallback.value = false;
      if (!authError.value) { // Only clean URL if successful and navigated
      }
    }
  } else {
    // Not an OIDC callback, proceed with normal auth initialization
    console.log("App.vue: Not an OIDC callback. Initializing auth state...");
    await initializeAuth(); // From useAuth
  }
  isLoading.value = isAuthLoading.value || isProcessingCallback.value; // Final loading state
});

const handleLogin = async () => { await login(); };
const handleLogout = async () => { await logout(); };

function clearAuthErrorAndRetryLogin() {
    authError.value = null;
    isLoading.value = true; // Show loading while redirecting
    login();
}

</script>

<style>
.error-message { color: red; border: 1px solid red; padding: 10px; margin: 20px; text-align: center; }
</style>