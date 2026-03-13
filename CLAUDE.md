# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a prototype battery monitoring web application for industrial/agricultural energy storage systems. The system has no physical hardware—all batteries are simulated in software.

## Architecture

### Frontend (Vue.js 3 + Composition API)
- **Location**: `frontend/` directory
- **Framework**: Vue 3 with Composition API
- **Responsibilities**:
  - Display real-time battery metrics (SOC, voltage, current, temperature)
  - Show battery health status (Normal/Warning/Critical)
  - Visualize time-series data with charts
  - Display alerts with severity coloring
- **Key Components**:
  - Dashboard view with battery list and status indicators
  - Battery detail view with time-series charts
  - Alerts panel showing active alerts

### Backend (Node.js + Express)
- **Location**: `backend/` directory
- **Framework**: Express.js
- **Responsibilities**:
  - Simulate batteries and generate realistic telemetry
  - Expose REST APIs (or WebSocket for real-time updates)
  - Run health checks and rule-based anomaly detection
  - Generate and manage alerts

### Battery Simulation Layer

Each simulated battery must track:
- Battery ID
- Capacity (kWh)
- State of Charge (SOC %)
- Voltage (V)
- Current (A)
- Temperature (°C)
- Charge/Discharge rate
- Internal resistance (increases over time to simulate degradation)

**Simulation Rules**:
- SOC decreases when discharging, increases when charging
- Higher temperature accelerates degradation
- Add random noise to readings (within realistic bounds)
- Include abnormal cases: overheating, rapid SOC drop, voltage instability

### Health & Fault Detection Logic

**Rule-based detection** (no ML in this prototype):

1. **Degradation indicators**:
   - Increasing internal resistance over time
   - Reduced effective capacity

2. **Drain detection**:
   - SOC drop rate exceeds expected discharge rate

3. **Fault conditions**:
   - Temperature above safe threshold
   - Voltage outside normal operating range

**Battery classification**: Normal, Warning, or Critical

**Alert structure**: Battery ID, alert type, reason, timestamp

## Development Commands

### Running the application
```bash
# Backend
cd backend
npm install
npm run dev        # Development server with hot reload
npm start          # Production server

# Frontend
cd frontend
npm install
npm run dev        # Development server
npm run build      # Production build
```

### Testing
```bash
# Backend tests
cd backend
npm test           # Run all tests
npm run test:watch # Watch mode

# Frontend tests
cd frontend
npm test           # Run all tests
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Key Design Decisions

- **Prototype scope**: Favor clarity, modularity, and correctness over scale
- **No external APIs**: Use mock data only
- **Local development**: Keep everything runnable locally without complex deployment
- **No authentication**: Do not over-engineer auth for this prototype
- **Real-time updates**: Consider WebSocket implementation for live telemetry
- **Chart library**: Use a library like Chart.js or ECharts for time-series visualization

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── simulation/     # Battery simulation logic
│   │   ├── detection/      # Health check & anomaly detection
│   │   ├── api/           # REST API endpoints / WebSocket handlers
│   │   └── models/        # Battery models and schemas
│   ├── server.js          # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Vue components (Dashboard, BatteryDetail, AlertsPanel)
│   │   ├── views/         # Page views
│   │   ├── api/           # API client for backend communication
│   │   └── stores/        # Pinia/Vuex state management
│   └── package.json
└── CLAUDE.md
```

## Implementation Notes

- **Telemetry noise**: Add Gaussian noise within ±2-3% of sensor readings to simulate real-world conditions
- **Degradation simulation**: Increase internal resistance by 0.1-0.5% per simulated day
- **Temperature thresholds**: Safe < 45°C, Warning 45-60°C, Critical > 60°C
- **Voltage range**: Normal ±10% of rated voltage
- **SOC critical threshold**: < 20%
- **Update frequency**: Simulate telemetry every 1-5 seconds
