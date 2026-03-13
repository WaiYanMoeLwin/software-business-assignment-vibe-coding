// Detection thresholds
const TEMP_WARNING = 45; // °C
const TEMP_CRITICAL = 60; // °C
const VOLTAGE_TOLERANCE = 0.10; // ±10%
const DEGRADATION_THRESHOLD = 1.10; // 10% increase in resistance

class HealthChecker {
  /**
   * Check battery health and return status
   * @param {Battery} battery - Battery instance to check
   * @returns {Object} - { status: 'normal'|'warning'|'critical', reason: string }
   */
  check(battery) {
    // 1. Check temperature (highest priority)
    if (battery.temperature > TEMP_CRITICAL) {
      return {
        status: 'critical',
        reason: `Temperature critical: ${battery.temperature.toFixed(1)}°C exceeds ${TEMP_CRITICAL}°C threshold`,
        type: 'temperature'
      };
    }
    if (battery.temperature > TEMP_WARNING) {
      return {
        status: 'warning',
        reason: `Temperature elevated: ${battery.temperature.toFixed(1)}°C exceeds ${TEMP_WARNING}°C threshold`,
        type: 'temperature'
      };
    }

    // 2. Check voltage range
    const voltageMin = battery.ratedVoltage * (1 - VOLTAGE_TOLERANCE);
    const voltageMax = battery.ratedVoltage * (1 + VOLTAGE_TOLERANCE);

    if (battery.voltage < voltageMin) {
      return {
        status: 'critical',
        reason: `Undervoltage: ${battery.voltage.toFixed(1)}V below ${voltageMin.toFixed(1)}V threshold`,
        type: 'voltage'
      };
    }
    if (battery.voltage > voltageMax) {
      return {
        status: 'critical',
        reason: `Overvoltage: ${battery.voltage.toFixed(1)}V exceeds ${voltageMax.toFixed(1)}V threshold`,
        type: 'voltage'
      };
    }

    // 3. Check degradation (internal resistance increase)
    const resistanceRatio = battery.internalResistance / battery.baseResistance;
    if (resistanceRatio > DEGRADATION_THRESHOLD) {
      return {
        status: 'warning',
        reason: `Degradation detected: Internal resistance increased by ${((resistanceRatio - 1) * 100).toFixed(1)}%`,
        type: 'degradation'
      };
    }

    // 4. Check abnormal drain (high current when discharging)
    // If current is more than 1.5x the rated discharge rate
    const maxExpectedCurrent = (battery.dischargeRate * 1000 / battery.voltage) * 1.5;
    if (battery.current < 0 && Math.abs(battery.current) > maxExpectedCurrent) {
      return {
        status: 'warning',
        reason: `Abnormal drain: Current ${Math.abs(battery.current).toFixed(1)}A exceeds expected ${maxExpectedCurrent.toFixed(1)}A`,
        type: 'drain'
      };
    }

    // All checks passed
    return {
      status: 'normal',
      reason: 'All parameters within normal range',
      type: null
    };
  }
}

// Export singleton instance
export const healthChecker = new HealthChecker();
