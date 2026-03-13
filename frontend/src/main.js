import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify.js';
import { useSocket } from './composables/useSocket.js';

// Create app
const app = createApp(App);

// Use plugins
app.use(createPinia());
app.use(router);
app.use(vuetify);

// Mount app
app.mount('#app');

// Initialize WebSocket connection
useSocket();
