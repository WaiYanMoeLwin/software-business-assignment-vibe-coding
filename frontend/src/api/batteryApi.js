// api/batteryApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const batteryApi = {
  /**
   * Get all batteries
   */
  async getBatteries() {
    const response = await api.get('/batteries');
    return response.data;
  },

  /**
   * Get a single battery by ID
   */
  async getBattery(id) {
    const response = await api.get(`/batteries/${id}`);
    return response.data;
  },

  /**
   * Get battery history
   */
  async getBatteryHistory(id) {
    const response = await api.get(`/batteries/${id}/history`);
    return response.data;
  },

  /**
   * Get all active alerts
   */
  async getAlerts() {
    const response = await api.get('/alerts');
    return response.data;
  },

  /**
   * Dismiss an alert
   */
  async dismissAlert(id) {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  }
};

export default api;
