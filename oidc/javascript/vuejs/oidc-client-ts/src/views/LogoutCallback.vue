<template>
  <div>Processing logout...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userManager } from '../auth/oidc.service';

const router = useRouter();

onMounted(async () => {
  try {
    // This completes the signout process with the OIDC provider
    await userManager.signoutRedirectCallback();
    console.log("OIDC Logout callback processed.");
  } catch (e) {
    console.error("Failed to process logout callback:", e);
  } finally {
    // Navigate to the post-logout redirect URI
    router.replace(userManager.settings.post_logout_redirect_uri || '/');
  }
});
</script>

    