// Simulation parameters
const CAPACITY = 100; // kWh
const RATED_VOLTAGE = 400; // V
const MAX_CHARGE_RATE = 50; // kW
const MAX_DISCHARGE_RATE = 80; // kW
const BASE_RESISTANCE = 0.05; // Ohms
const DEGRADATION_RATE = 0.0001; // Ohms per tick
const HISTORY_MAX_POINTS = 100;

// Gaussian noise helper (Box-Muller transform)
function gaussianNoise(mean = 0, stdDev = 1) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stdDev + mean;
}

export class Battery {
  constructor(id, options = {}) {
    this.id = id;
    this.capacity = options.capacity ?? CAPACITY;
    this.ratedVoltage = options.ratedVoltage ?? RATED_VOLTAGE;

    // Initial state
    this.soc = options.soc ?? Math.random() * 40 + 50; // 50-90% initial SOC
    this.voltage = options.voltage ?? this.ratedVoltage;
    this.current = options.current ?? 0; // A (positive = charge, negative = discharge)
    this.temperature = options.temperature ?? Math.random() * 10 + 25; // 25-35°C initial temp
    this.chargeRate = options.chargeRate ?? MAX_CHARGE_RATE;
    this.dischargeRate = options.dischargeRate ?? MAX_DISCHARGE_RATE;
    this.internalResistance = options.internalResistance ?? BASE_RESISTANCE;
    this.baseResistance = this.internalResistance; // Track for degradation detection

    // Health status
    this.status = 'normal'; // 'normal' | 'warning' | 'critical'

    // Historical data (time-series)
    this.history = [];

    // Simulation state
    this.discharging = Math.random() > 0.5; // Randomly start charging or discharging
    this.targetSoc = this.discharging ? 20 : 90; // Target SOC to toggle charge/discharge

    // Initial history point
    this._recordHistory();
  }

  /**
   * Update battery state for one simulation tick
   * @param {number} dt - Time delta in seconds
   */
  update(dt = 2) {
    // 1. Determine charge/discharge behavior
    this._updateChargeDischargeState(dt);

    // 2. Update SOC based on current flow
    // Power (kW) = Voltage (V) * Current (A) / 1000
    // Energy change (kWh) = Power (kW) * time (h)
    const powerKw = (this.voltage * this.current) / 1000;
    const energyChangeKwh = powerKw * (dt / 3600);
    const socChange = (energyChangeKwh / this.capacity) * 100;
    this.soc = Math.max(0, Math.min(100, this.soc - socChange)); // Clamp 0-100

    // 3. Temperature fluctuation
    // Higher when discharging, some random variation
    const currentFactor = this.discharging ? 1.5 : 0.5;
    const tempChange = gaussianNoise(0, 0.5) * currentFactor;
    this.temperature = Math.max(15, Math.min(70, this.temperature + tempChange)); // Clamp 15-70°C

    // 4. Internal resistance degradation (accelerated by high temp)
    const tempMultiplier = this.temperature > 40 ? 2 : 1;
    this.internalResistance += DEGRADATION_RATE * tempMultiplier;

    // 5. Add noise to voltage readings
    const voltageNoise = gaussianNoise(0, 0.5);
    this.voltage = Math.max(
      this.ratedVoltage * 0.8,
      Math.min(this.ratedVoltage * 1.2, this.voltage + voltageNoise)
    );

    // 6. Record history
    this._recordHistory();

    // 7. Inject abnormal scenarios occasionally (for demo)
    this._maybeInjectAbnormalScenario();
  }

  /**
   * Update charge/discharge state based on SOC targets
   */
  _updateChargeDischargeState(dt) {
    // Toggle between charging and discharging based on SOC
    if (this.discharging && this.soc <= this.targetSoc) {
      // Switch to charging
      this.discharging = false;
      this.targetSoc = Math.random() * 10 + 85; // 85-95% target
      this.current = this.chargeRate * 1000 / this.voltage; // A = kW * 1000 / V
    } else if (!this.discharging && this.soc >= this.targetSoc) {
      // Switch to discharging
      this.discharging = true;
      this.targetSoc = Math.random() * 20 + 15; // 15-35% target
      this.current = -this.dischargeRate * 1000 / this.voltage; // Negative for discharge
    }
  }

  /**
   * Record current state to history
   */
  _recordHistory() {
    this.history.push({
      timestamp: new Date().toISOString(),
      soc: Number(this.soc.toFixed(2)),
      voltage: Number(this.voltage.toFixed(2)),
      current: Number(this.current.toFixed(2)),
      temperature: Number(this.temperature.toFixed(2))
    });

    // Keep only last N points
    if (this.history.length > HISTORY_MAX_POINTS) {
      this.history.shift();
    }
  }

  /**
   * Occasionally inject abnormal scenarios for demo purposes
   */
  _maybeInjectAbnormalScenario() {
    // 5% chance per tick to have some abnormality
    if (Math.random() < 0.05) {
      const scenario = Math.floor(Math.random() * 3);

      switch (scenario) {
        case 0: // Overheat
          this.temperature = Math.random() * 15 + 50; // 50-65°C
          break;
        case 1: // Rapid SOC drop
          this.soc = Math.max(0, this.soc - Math.random() * 5);
          this.current = -this.dischargeRate * 2 * 1000 / this.voltage; // Double discharge
          break;
        case 2: // Voltage instability
          this.voltage = this.ratedVoltage * (Math.random() > 0.5 ? 0.85 : 1.15);
          break;
      }
    }
  }

  /**
   * Get battery data for API response
   */
  toJSON() {
    return {
      id: this.id,
      capacity: this.capacity,
      soc: Number(this.soc.toFixed(2)),
      voltage: Number(this.voltage.toFixed(2)),
      current: Number(this.current.toFixed(2)),
      temperature: Number(this.temperature.toFixed(2)),
      chargeRate: this.chargeRate,
      dischargeRate: this.dischargeRate,
      internalResistance: Number(this.internalResistance.toFixed(6)),
      status: this.status,
      history: [...this.history]
    };
  }
}
