// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import BatteryDetail from '../views/BatteryDetail.vue';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/battery/:id',
    name: 'battery-detail',
    component: BatteryDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
