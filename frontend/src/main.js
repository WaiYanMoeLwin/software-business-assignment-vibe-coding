import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify.js';
import router from './router';
// import { useSocket } from './composables/useSocket.js';

// Create app
const app = createApp(App);

// Use plugins
app.use(createPinia());
app.use(router);
app.use(vuetify);

// Mount app
app.mount('#app');

// Initialize WebSocket connection
// useSocket();
