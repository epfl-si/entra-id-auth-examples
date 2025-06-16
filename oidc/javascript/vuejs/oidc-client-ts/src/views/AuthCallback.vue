<template>
  <div class="auth-callback-container">
    <p v-if="isLoading">Processing login, please wait...</p>
    <p v-if="error" class="error-message">
      Login failed: {{ error }} <br />
      Please try <router-link to="/">logging in again</router-link>.
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { userManager } from '../auth/oidc.service';

const router = useRouter();
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    console.log("AuthCallback: Mounted. Processing signinRedirectCallback...");
    // This function processes the response from the OIDC provider (e.g., Azure AD)
    // It exchanges the authorization code for tokens and signs the user in.
    const user = await userManager.signinRedirectCallback();
    // `user` here is the oidc-client-ts User object, containing id_token, access_token, profile, etc.

    if (user) {
      console.log("AuthCallback: Login successful. User profile:", user.profile);
      // The userManager.events.addUserLoaded event should fire

      // Navigate to the originally intended page (stored in 'state' during login) or to a default page.
      const targetPath = user.state?.targetPath || '/'; // Retrieve targetPath from state
      console.log("AuthCallback: Navigating to targetPath:", targetPath);
      router.replace(targetPath); // Use replace to avoid the callback URL in browser history
    } else {
      // This case should ideally not be reached if signinRedirectCallback resolves without error and no user.
      // But as a fallback:
      console.error("AuthCallback: signinRedirectCallback completed but returned no user.");
      error.value = "Login process completed, but no user information was returned.";
    }
  } catch (e) {
    console.error("AuthCallback: Failed to process login callback:", e);
    error.value = e.message || "An unknown error occurred during login processing.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.auth-callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
}
.error-message {
  color: red;
  margin-top: 20px;
}
</style>