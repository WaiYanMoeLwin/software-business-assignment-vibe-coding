<template>
  <v-container fluid class="bg-grey-lighten-4">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center py-3">
            <v-icon icon="mdi-battery-charging" size="large" class="mr-3"></v-icon>
            <span class="text-h5">Battery Monitoring Dashboard</span>
            <v-spacer></v-spacer>
            <v-chip
              :color="isConnected ? 'success' : 'error'"
              size="small"
              class="mr-2"
            >
              {{ isConnected ? 'Connected' : 'Disconnected' }}
            </v-chip>
            <v-chip color="info" size="small">
              {{ batteries.length }} Batteries
            </v-chip>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alerts Panel -->
    <v-row v-if="alerts.length > 0">
      <v-col cols="12">
        <alerts-panel />
      </v-col>
    </v-row>

    <!-- Battery Grid -->
    <v-row>
      <v-col
        v-for="battery in batteries"
        :key="battery.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <battery-card
          :battery="battery"
          @click="goToDetail(battery.id)"
        />
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading && batteries.length === 0">
      <v-col cols="12" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">Loading batteries...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-if="error">
      <v-col cols="12">
        <v-alert type="error" variant="tonal">
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBatteryStore } from '../stores/batteries.js';
import BatteryCard from '../components/BatteryCard.vue';
import AlertsPanel from '../components/AlertsPanel.vue';

const router = useRouter();
const store = useBatteryStore();

// Use store properties directly as refs
const batteries = computed(() => store.batteries);
const alerts = computed(() => store.alerts);
const loading = computed(() => store.loading);
const error = computed(() => store.error);
const isConnected = computed(() => store.isConnected);

/**
 * Navigate to battery detail page
 */
const goToDetail = (batteryId) => {
  router.push({ name: 'battery-detail', params: { id: batteryId } });
};

/**
 * Initialize dashboard
 */
onMounted(async () => {
  await Promise.all([
    store.fetchBatteries(),
    store.fetchAlerts()
  ]);
});
</script>
