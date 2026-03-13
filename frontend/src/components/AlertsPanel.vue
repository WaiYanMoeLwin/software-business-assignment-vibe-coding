<template>
  <v-card variant="tonal">
    <v-card-title class="d-flex align-center py-2">
      <v-icon icon="mdi-bell-ring" color="warning" class="mr-2"></v-icon>
      <span class="text-h6">Active Alerts ({{ alerts.length }})</span>
      <v-spacer></v-spacer>
      <v-chip
        v-if="criticalCount > 0"
        color="error"
        size="small"
        class="mr-2"
      >
        {{ criticalCount }} Critical
      </v-chip>
      <v-chip
        v-if="warningCount > 0"
        color="warning"
        size="small"
      >
        {{ warningCount }} Warning
      </v-chip>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list>
        <v-list-item
          v-for="alert in alerts"
          :key="alert.id"
          :class="`bg-${alert.severity}-lighten-4`"
        >
          <template v-slot:prepend>
            <v-icon
              :icon="alertIcon(alert)"
              :color="alert.severity"
              class="mr-2"
            ></v-icon>
          </template>

          <v-list-item-title class="font-weight-bold">
            {{ alert.batteryId }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ alert.reason }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <div class="d-flex flex-column align-end">
              <v-chip
                :color="alert.severity"
                size="x-small"
                class="mb-1"
              >
                {{ alert.type }}
              </v-chip>
              <span class="text-caption text-grey-darken-1">
                {{ formatTime(alert.timestamp) }}
              </span>
              <v-btn
                icon="mdi-close"
                size="x-small"
                variant="text"
                color="grey"
                class="mt-1"
                @click.stop="dismissAlert(alert.id)"
              ></v-btn>
            </div>
          </template>
        </v-list-item>

        <v-list-item v-if="alerts.length === 0" class="text-center text-grey">
          <v-list-item-title>No active alerts</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useBatteryStore } from '../stores/batteries.js';

const store = useBatteryStore();

const alerts = computed(() => store.alerts);

const criticalCount = computed(() =>
  alerts.value.filter(a => a.severity === 'critical').length
);

const warningCount = computed(() =>
  alerts.value.filter(a => a.severity === 'warning').length
);

/**
 * Get icon for alert type
 */
const alertIcon = (alert) => {
  switch (alert.type) {
    case 'temperature': return 'mdi-thermometer-alert';
    case 'voltage': return 'mdi-flash-alert';
    case 'degradation': return 'mdi-arrow-down-thick';
    case 'drain': return 'mdi-battery-alert';
    default: return 'mdi-alert';
  }
};

/**
 * Format timestamp
 */
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString();
};

/**
 * Dismiss an alert
 */
const dismissAlert = async (alertId) => {
  await store.dismissAlert(alertId);
};
</script>
