<template>
  <v-card variant="tonal">
    <v-card-title class="text-subtitle-1 py-2">
      <v-icon :icon="icon" class="mr-2"></v-icon>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <div class="chart-container">
        <canvas :id="chartId"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler
);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  dataKey: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'rgb(59, 130, 246)'
  },
  icon: {
    type: String,
    default: 'mdi-chart-line'
  }
});

const chartId = computed(() => `chart-${props.title.toLowerCase().replace(/\s+/g, '-')}`);
let chartInstance = null;

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });

function initChart() {
  const ctx = document.getElementById(chartId.value);
  if (!ctx) return;

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.data.map(d => new Date(d.timestamp)),
      datasets: [{
        label: props.title,
        data: props.data.map(d => d[props.dataKey]),
        borderColor: props.color,
        backgroundColor: `${props.color}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300
      },
      scales: {
        x: {
          type: 'time',
          time: {
            displayFormats: {
              minute: 'HH:mm'
            }
          },
          ticks: {
            maxTicksLimit: 6
          }
        },
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return value.toFixed(1);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${props.title}: ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
}

function updateChart() {
  if (!chartInstance) return;

  chartInstance.data.labels = props.data.map(d => new Date(d.timestamp));
  chartInstance.data.datasets[0].data = props.data.map(d => d[props.dataKey]);
  chartInstance.update('none');
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 200px;
  width: 100%;
}
</style>
