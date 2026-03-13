import { socketHandler } from '../api/socketHandler.js';

const ALERT_AUTO_DISMISS_MS = 5 * 60 * 1000; // 5 minutes

// Generate unique ID
function generateId() {
  return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

class AlertGenerator {
  constructor() {
    this.activeAlerts = new Map();
  }

  /**
   * Process battery health result and generate alert if needed
   */
  process(battery, healthResult) {
    if (healthResult.status === 'normal') {
      return;
    }

    // Check if alert already exists for this battery and type
    const existingAlertKey = `${battery.id}-${healthResult.type}`;
    if (this.activeAlerts.has(existingAlertKey)) {
      // Update existing alert timestamp
      const alert = this.activeAlerts.get(existingAlertKey);
      alert.timestamp = new Date().toISOString();
      return;
    }

    // Create new alert
    const alert = {
      id: generateId(),
      batteryId: battery.id,
      type: healthResult.type,
      severity: healthResult.status, // 'warning' or 'critical'
      reason: healthResult.reason,
      timestamp: new Date().toISOString()
    };

    // Store alert
    this.activeAlerts.set(existingAlertKey, alert);
    alert.id = existingAlertKey; // Use key as ID for easier dismissal

    console.log(`[ALERT] ${alert.severity.toUpperCase()}: Battery ${battery.id} - ${alert.reason}`);

    // Emit via WebSocket
    socketHandler.emitNewAlert(alert);

    // Auto-dismiss after timeout
    setTimeout(() => {
      this.dismissAlert(existingAlertKey);
    }, ALERT_AUTO_DISMISS_MS);
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts() {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Dismiss an alert
   */
  dismissAlert(alertId) {
    if (this.activeAlerts.has(alertId)) {
      this.activeAlerts.delete(alertId);
      console.log(`Alert dismissed: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Get alerts for a specific battery
   */
  getAlertsForBattery(batteryId) {
    return this.getActiveAlerts().filter(alert => alert.batteryId === batteryId);
  }
}

// Export singleton instance
export const alertGenerator = new AlertGenerator();
