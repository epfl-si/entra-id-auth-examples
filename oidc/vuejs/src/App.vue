<template>
  <div id="nav" v-if="!isLoading">
    <router-link to="/">Home</router-link> |
    <span v-if="isAuthenticated">
      Welcome, {{ user?.name || user?.username }}!
      <button @click="handleLogout">Logout</button>
    </span>
    <button v-else @click="handleLogin">Login</button>
  </div>
  <div v-if="isLoading">Loading authentication state...</div>
  <router-view v-if="!isLoading" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from './auth/useAuth';

const { isAuthenticated, isAuthorizedUser, user, login, logout, isLoading } = useAuth();
const router = useRouter();

const handleLogin = async () => {
  await login();
  // Redirect or refresh may happen automatically via MSAL's redirect flow
  // If using popup, you might need to manually update state or refresh
};

const handleLogout = async () => {
  await logout();
  // Redirect to home or login page after logout (MSAL might handle postLogoutRedirectUri)
  // router.push('/');
};
</script>

<style>
/* Basic styling */
#nav { padding: 20px; background-color: #f0f0f0; margin-bottom: 20px; }
#nav a { font-weight: bold; color: #2c3e50; margin: 0 5px; }
#nav a.router-link-exact-active { color: #42b983; }
button { margin-left: 10px; }
.unauthorized-message {
  color: red;
  border: 1px solid red;
  padding: 10px;
  margin: 20px;
  text-align: center;
}
</style>