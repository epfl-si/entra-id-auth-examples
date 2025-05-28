      
<template>
  <div class="home">
   <img alt="Vue logo" src="../assets/vuejs.svg" />

    <div v-if="isLoading" class="loading-message">
      <p>Checking authentication status...</p>
    </div>

    <div v-else>
      <!-- Case 1: Logged in AND Authorized -->
      <div v-if="isAuthenticated && isAuthorizedUser" class="status-message authorized">
        <h1>Welcome back, {{ user?.name || user?.username }}!</h1>
        <p>You are logged in and authorized to access all features.</p>
        <p>Your email: {{ user?.username }} is on the approved list.</p>
      </div>

      <!-- Case 2: Logged in BUT NOT Authorized -->
      <div v-else-if="isAuthenticated && !isAuthorizedUser" class="status-message unauthorized">
        <h1>Welcome, {{ user?.name || user?.username }}!</h1>
        <p>You are successfully logged in.</p>
        <p>However, your email ({{ user?.username }}) is not currently on the whitelist to access the application.</p>
        <p>If you believe this is an error, please contact an administrator.</p>
      </div>

      <!-- Case 3: Not Logged In -->
      <div v-else class="status-message not-logged-in">
      	<p>Please log in to access the content.</p>
       <!-- <button @click="handleLogin" :disabled="interactionStatus !== 'none'">
          {{ interactionStatus !== 'none' ? 'Processing...' : 'Login with Microsoft Entra ID' }}
        </button>-->
      </div>
    </div>

    <div class="info-section">
      <h3>About this App</h3>
      <p>This application demonstrates secure access to a Vue.js app using Microsoft Entra ID authentication and an email-based authorization whitelist.</p>
    </div>


  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../auth/useAuth';

const { isAuthenticated, isAuthorizedUser, user, login, logout, isLoading } = useAuth();
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

.home {
  text-align: center;
  padding: 20px;
}

.home img {
  width: 100px;
  margin-bottom: 20px;
}

.status-message {
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  border: 1px solid #ccc;
}

.status-message.authorized {
  background-color: #e6ffed; /* Light green */
  border-color: #5cb85c; /* Green */
  color: #3c763d;
}

.status-message.unauthorized {
  background-color: #fff0f0; /* Light red */
  border-color: #d9534f; /* Red */
  color: #a94442;
}

.status-message.not-logged-in {
  background-color: #e7f3fe; /* Light blue */
  border-color: #5bc0de; /* Blue */
  color: #31708f;
}

.status-message h1 {
  margin-top: 0;
}

.status-message button {
  background-color: #0078d4;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-message button:hover {
  background-color: #005a9e;
}
.status-message button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-message {
  margin-top: 30px;
  font-style: italic;
  color: #555;
}

.info-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

</style>

    