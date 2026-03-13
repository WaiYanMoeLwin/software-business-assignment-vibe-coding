<template>
  <v-container fluid class="bg-grey-lighten-4">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center py-3">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="goBack"
              class="mr-3"
            ></v-btn>
            <v-icon
              :icon="statusIcon"
              :color="statusColor"
              size="large"
              class="mr-3"
            ></v-icon>
            <div>
              <div class="text-h5">{{ battery?.id }}</div>
              <div class="text-caption text-grey-darken-1">
                Status: <span :class="`text-${statusColor}`">{{ battery?.status?.toUpperCase() }}</span>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Battery Details -->
    <template v-if="battery">
      <!-- Metrics Grid -->
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal" :color="socColor">
            <v-card-text class="text-center">
              <div class="text-h4 font-weight-bold">{{ battery.soc.toFixed(1) }}%</div>
              <div class="text-caption text-grey-darken-1">State of Charge</div>
              <v-progress-linear
                :model-value="battery.soc"
                :color="socColor"
                class="mt-2"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal" :color="tempColor">
            <v-card-text class="text-center">
              <v-icon :icon="tempIcon" :color="tempColor" size="large"></v-icon>
              <div class="text-h4 font-weight-bold">{{ battery.temperature.toFixed(1) }}°C</div>
              <div class="text-caption text-grey-darken-1">Temperature</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal">
            <v-card-text class="text-center">
              <v-icon icon="mdi-flash" color="amber" size="large"></v-icon>
              <div class="text-h4 font-weight-bold">{{ battery.voltage.toFixed(1) }}V</div>
              <div class="text-caption text-grey-darken-1">Voltage</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card variant="tonal">
            <v-card-text class="text-center">
              <v-icon
                :icon="currentIcon"
                :color="battery.current >= 0 ? 'success' : 'orange'"
                size="large"
              ></v-icon>
              <div class="text-h4 font-weight-bold">{{ Math.abs(battery.current).toFixed(1) }}A</div>
              <div class="text-caption text-grey-darken-1">Current</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Additional Details -->
      <v-row>
        <v-col cols="12">
          <v-card variant="tonal">
            <v-card-title>Battery Specifications</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey-darken-1">Capacity</div>
                  <div class="text-h6">{{ battery.capacity }} kWh</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey-darken-1">Rated Voltage</div>
                  <div class="text-h6">{{ battery.ratedVoltage }} V</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey-darken-1">Internal Resistance</div>
                  <div class="text-h6">{{ battery.internalResistance.toFixed(6) }} Ω</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey-darken-1">Charge Rate</div>
                  <div class="text-h6">{{ battery.chargeRate }} kW</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts -->
      <v-row>
        <v-col cols="12" md="4">
          <time-series-chart
            title="State of Charge"
            :data="history"
            data-key="soc"
            color="rgb(34, 197, 94)"
            icon="mdi-battery-90"
          />
        </v-col>
        <v-col cols="12" md="4">
          <time-series-chart
            title="Temperature"
            :data="history"
            data-key="temperature"
            color="rgb(249, 115, 22)"
            icon="mdi-thermometer"
          />
        </v-col>
        <v-col cols="12" md="4">
          <time-series-chart
            title="Voltage"
            :data="history"
            data-key="voltage"
            color="rgb(168, 85, 247)"
            icon="mdi-flash"
          />
        </v-col>
      </v-row>

      <!-- Alerts for this battery -->
      <v-row v-if="batteryAlerts.length > 0">
        <v-col cols="12">
          <v-card variant="tonal">
            <v-card-title>
              <v-icon icon="mdi-bell-ring" class="mr-2"></v-icon>
              Alert History
            </v-card-title>
            <v-card-text>
              <v-alert
                v-for="alert in batteryAlerts"
                :key="alert.id"
                :type="alert.severity"
                variant="tonal"
                class="mb-2"
              >
                <template v-slot:title>
                  <div class="d-flex align-center">
                    <span>{{ alert.type }}</span>
                    <v-spacer></v-spacer>
                    <span class="text-caption">{{ formatTime(alert.timestamp) }}</span>
                  </div>
                </template>
                {{ alert.reason }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import TimeSeriesChart from '../components/TimeSeriesChart.vue';
import { useBatteryStore } from '../stores/batteries.js';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const store = useBatteryStore();

const history = ref([]);
const loading = ref(false);

// Get battery from store (reactive)
const battery = computed(() => store.getBatteryById(props.id));

// Get alerts for this battery
const batteryAlerts = computed(() => store.getAlertsForBattery(props.id));

// Status helpers
const statusColor = computed(() => {
  switch (battery.value?.status) {
    case 'critical': return 'error';
    case 'warning': return 'warning';
    default: return 'success';
  }
});

const statusIcon = computed(() => {
  switch (battery.value?.status) {
    case 'critical': return 'mdi-alert-circle';
    case 'warning': return 'mdi-alert';
    default: return 'mdi-check-circle';
  }
});

const socColor = computed(() => {
  const soc = battery.value?.soc || 0;
  if (soc < 20) return 'error';
  if (soc < 40) return 'warning';
  return 'success';
});

const tempColor = computed(() => {
  const temp = battery.value?.temperature || 0;
  if (temp > 60) return 'error';
  if (temp > 45) return 'warning';
  return 'success';
});

const tempIcon = computed(() => {
  const temp = battery.value?.temperature || 0;
  if (temp > 60) return 'mdi-thermometer-alert';
  if (temp > 45) return 'mdi-thermometer-high';
  return 'mdi-thermometer';
});

const currentIcon = computed(() => {
  return battery.value?.current >= 0 ? 'mdi-battery-charging' : 'mdi-battery-charging-100';
});

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

const goBack = () => {
  router.push({ name: 'dashboard' });
};

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch battery data if not in store
    if (!battery.value) {
      await store.fetchBattery(props.id);
    }

    // Fetch history
    history.value = await store.fetchBatteryHistory(props.id);
  } finally {
    loading.value = false;
  }
});

// Update history when battery updates (optional: could update via WebSocket too)
watch(battery, async () => {
  if (battery.value) {
    history.value = await store.fetchBatteryHistory(props.id);
  }
}, { deep: true });
</script>
