<template>
  <v-card
    :color="cardColor"
    variant="tonal"
    class="battery-card"
    hover
    @click="$emit('click')"
  >
    <v-card-title class="d-flex align-center py-2">
      <v-icon
        :icon="statusIcon"
        :color="statusColor"
        size="small"
        class="mr-2"
      ></v-icon>
      <span class="text-subtitle-1 font-weight-bold">{{ battery.id }}</span>
      <v-spacer></v-spacer>
      <v-badge
        :color="statusColor"
        :content="battery.status.toUpperCase()"
        inline
      ></v-badge>
    </v-card-title>

    <v-card-text>
      <!-- SOC Display -->
      <v-row align="center" class="mb-2">
        <v-col cols="4" class="text-grey-darken-1 text-caption">SOC</v-col>
        <v-col cols="8">
          <v-progress-linear
            :model-value="battery.soc"
            :color="socColor"
            height="20"
            rounded
          >
            <template v-slot:default="{ value }">
              <span class="text-caption font-weight-bold">{{ Math.ceil(value) }}%</span>
            </template>
          </v-progress-linear>
        </v-col>
      </v-row>

      <!-- Temperature -->
      <v-row align="center" class="mb-1">
        <v-col cols="4" class="text-grey-darken-1 text-caption">Temp</v-col>
        <v-col cols="8" class="text-subtitle-2 text-black">
          <v-icon
            :icon="temperatureIcon"
            :color="tempColor"
            size="small"
            class="mr-1"
          ></v-icon>
          {{ battery.temperature.toFixed(1) }}°C
        </v-col>
      </v-row>

      <!-- Voltage -->
      <v-row align="center" class="mb-1">
        <v-col cols="4" class="text-grey-darken-1 text-caption">Voltage</v-col>
        <v-col cols="8" class="text-subtitle-2 text-black">
          <v-icon icon="mdi-flash" color="amber" size="small" class="mr-1"></v-icon>
          {{ battery.voltage.toFixed(1) }}V
        </v-col>
      </v-row>

      <!-- Current -->
      <v-row align="center">
        <v-col cols="4" class="text-grey-darken-1 text-caption">Current</v-col>
        <v-col cols="8" class="text-subtitle-2 text-black">
          <v-icon
            :icon="currentIcon"
            :color="battery.current >= 0 ? 'success' : 'orange'"
            size="small"
            class="mr-1"
          ></v-icon>
          {{ Math.abs(battery.current).toFixed(1) }}A
          <span class="text-caption text-grey-darken-1 ml-1">
            {{ battery.current >= 0 ? '(Chg)' : '(Dsg)' }}
          </span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  battery: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);

// Status color
const statusColor = computed(() => {
  switch (props.battery.status) {
    case 'critical': return 'error';
    case 'warning': return 'warning';
    default: return 'success';
  }
});

// Status icon
const statusIcon = computed(() => {
  switch (props.battery.status) {
    case 'critical': return 'mdi-alert-circle';
    case 'warning': return 'mdi-alert';
    default: return 'mdi-check-circle';
  }
});

// Card background color
const cardColor = computed(() => {
  switch (props.battery.status) {
    case 'critical': return 'red-lighten-5';
    case 'warning': return 'yellow-lighten-5';
    default: return 'white';
  }
});

// SOC color
const socColor = computed(() => {
  const soc = props.battery.soc;
  if (soc < 20) return 'error';
  if (soc < 40) return 'warning';
  return 'success';
});

// Temperature color
const tempColor = computed(() => {
  const temp = props.battery.temperature;
  if (temp > 60) return 'error';
  if (temp > 45) return 'warning';
  return 'success';
});

// Temperature icon
const temperatureIcon = computed(() => {
  const temp = props.battery.temperature;
  if (temp > 60) return 'mdi-thermometer-alert';
  if (temp > 45) return 'mdi-thermometer-high';
  return 'mdi-thermometer';
});

// Current icon
const currentIcon = computed(() => {
  return props.battery.current >= 0 ? 'mdi-battery-charging' : 'mdi-battery-charging-100';
});
</script>

<style scoped>
.battery-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.battery-card:hover {
  transform: translateY(-2px);
}
</style>
