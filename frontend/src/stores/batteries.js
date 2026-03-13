// stores/batteries.js
import { defineStore } from 'pinia';
import { batteryApi } from '../api/batteryApi.js';

export const useBatteryStore = defineStore('batteries', {
  state: () => ({
    batteries: [],
    alerts: [],
    currentBattery: null,
    loading: false,
    error: null,
    isConnected: false
  }),

  getters: {
    /**
     * Get battery by ID
     */
    getBatteryById: (state) => (id) => {
      return state.batteries.find(b => b.id === id);
    },

    /**
     * Count of active alerts
     */
    alertCount: (state) => state.alerts.length,

    /**
     * Critical alerts only
     */
    criticalAlerts: (state) => {
      return state.alerts.filter(a => a.severity === 'critical');
    },

    /**
     * Warning alerts only
     */
    warningAlerts: (state) => {
      return state.alerts.filter(a => a.severity === 'warning');
    },

    /**
     * Get alerts for a specific battery
     */
    getAlertsForBattery: (state) => (batteryId) => {
      return state.alerts.filter(a => a.batteryId === batteryId);
    }
  },

  actions: {
    /**
     * Fetch all batteries
     */
    async fetchBatteries() {
      this.loading = true;
      this.error = null;
      try {
        this.batteries = await batteryApi.getBatteries();
      } catch (error) {
        this.error = 'Failed to fetch batteries';
        console.error('Error fetching batteries:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch a single battery
     */
    async fetchBattery(id) {
      this.loading = true;
      this.error = null;
      try {
        this.currentBattery = await batteryApi.getBattery(id);
      } catch (error) {
        this.error = 'Failed to fetch battery';
        console.error('Error fetching battery:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch all alerts
     */
    async fetchAlerts() {
      this.error = null;
      try {
        this.alerts = await batteryApi.getAlerts();
      } catch (error) {
        this.error = 'Failed to fetch alerts';
        console.error('Error fetching alerts:', error);
      }
    },

    /**
     * Dismiss an alert
     */
    async dismissAlert(alertId) {
      try {
        await batteryApi.dismissAlert(alertId);
        this.alerts = this.alerts.filter(a => a.id !== alertId);
      } catch (error) {
        console.error('Error dismissing alert:', error);
      }
    },

    /**
     * Update battery from WebSocket
     */
    updateBattery(battery) {
      const index = this.batteries.findIndex(b => b.id === battery.id);
      if (index !== -1) {
        this.batteries[index] = battery;
      } else {
        this.batteries.push(battery);
      }

      // Update current battery if it matches
      if (this.currentBattery && this.currentBattery.id === battery.id) {
        this.currentBattery = battery;
      }
    },

    /**
     * Add new alert from WebSocket
     */
    addAlert(alert) {
      // Check if alert already exists
      const exists = this.alerts.some(a => a.id === alert.id);
      if (!exists) {
        this.alerts.unshift(alert);
      }
    },

    /**
     * Remove alert by ID
     */
    removeAlert(alertId) {
      this.alerts = this.alerts.filter(a => a.id !== alertId);
    },

    /**
     * Set connection status
     */
    setConnected(connected) {
      this.isConnected = connected;
    }
  }
});
