import { Battery } from '../models/Battery.js';
import { healthChecker } from '../detection/HealthChecker.js';
import { alertGenerator } from '../detection/AlertGenerator.js';
import { socketHandler } from '../api/socketHandler.js';

const SIMULATION_INTERVAL = 2000; // 2 seconds
const NUM_BATTERIES = 5;

class BatteryManager {
  constructor() {
    this.batteries = new Map();
    this.simulationTimer = null;
  }

  /**
   * Create battery instances
   */
  initialize(count = NUM_BATTERIES) {
    for (let i = 0; i < count; i++) {
      const id = `BAT-${String(i + 1).padStart(3, '0')}`;
      this.batteries.set(id, new Battery(id));
    }
    console.log(`Initialized ${this.batteries.size} batteries`);
  }

  /**
   * Start the simulation loop
   */
  startSimulation() {
    if (this.simulationTimer) {
      console.warn('Simulation already running');
      return;
    }

    console.log(`Starting simulation (${SIMULATION_INTERVAL}ms interval)`);

    this.simulationTimer = setInterval(() => {
      this.updateAll();
    }, SIMULATION_INTERVAL);
  }

  /**
   * Stop the simulation loop
   */
  stopSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
      console.log('Simulation stopped');
    }
  }

  /**
   * Update all batteries (one simulation tick)
   */
  updateAll() {
    for (const [id, battery] of this.batteries) {
      // Update battery simulation
      battery.update();

      // Check health status
      const healthResult = healthChecker.check(battery);

      // Update battery status
      const previousStatus = battery.status;
      battery.status = healthResult.status;

      // Generate alert if status changed to non-normal
      if (healthResult.status !== 'normal' && previousStatus === 'normal') {
        alertGenerator.process(battery, healthResult);
      }

      // Broadcast battery update via WebSocket
      socketHandler.broadcastBatteryUpdate(battery);
    }
  }

  /**
   * Get a battery by ID
   */
  getBattery(id) {
    return this.batteries.get(id);
  }

  /**
   * Get all batteries
   */
  getAllBatteries() {
    return Array.from(this.batteries.values()).map(b => b.toJSON());
  }

  /**
   * Get battery history
   */
  getBatteryHistory(id) {
    const battery = this.batteries.get(id);
    return battery ? battery.history : [];
  }
}

// Export singleton instance
export const batteryManager = new BatteryManager();
batteryManager.initialize();
