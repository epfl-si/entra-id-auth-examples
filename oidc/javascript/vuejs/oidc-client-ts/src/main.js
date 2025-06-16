import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // #  make sure this matches your path

const app = createApp(App);
app.use(router);              // #  this is critical
app.mount('#app');
