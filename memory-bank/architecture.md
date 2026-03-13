# Architecture

## High-Level System Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (User)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP + WebSocket
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Vue 3)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Dashboard  │  │  Battery     │  │   Alerts Panel       │  │
│  │   View       │  │  Detail View │  │   Component          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                  │                                      │
│         └──────────────────┼──────────────────┐                 │
│                            │                  │                 │
│                    ┌───────▼────────┐  ┌──────▼──────┐         │
│                    │   Pinia Store  │  │  Charting   │         │
│                    │   (State)      │  │  Components │         │
│                    └───────┬────────┘  └─────────────┘         │
└────────────────────────────┼───────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Socket.IO     │
                    │   Client        │
                    └────────┬────────┘
                             │ WebSocket (real-time)
                             │ REST (initial data)
┌────────────────────────────┼───────────────────────────────────┐
│                    ┌───────▼────────┐                          │
│                    │   Express API  │                          │
│                    │   / Socket.IO  │                          │
│                    └───────┬────────┘                          │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐               │
│         │                  │                  │               │
│    ┌────▼────┐      ┌─────▼──────┐    ┌──────▼──────┐        │
│    │ Routes  │      │   Socket   │    │    Alert    │        │
│    │ (REST)  │      │   Handler  │    │  Generator  │        │
│    └────┬────┘      └─────┬──────┘    └──────┬──────┘        │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            │                                  │
│                    ┌───────▼────────┐                          │
│                    │  Health Checker│                          │
│                    │  (Detection)   │                          │
│                    └───────┬────────┘                          │
│                            │                                  │
│                    ┌───────▼────────┐                          │
│                    │ Battery Manager│                          │
│                    │   (Simulation) │                          │
│                    └───────┬────────┘                          │
│                            │                                  │
│                    ┌───────▼────────┐                          │
│                    │  Battery Pool  │                          │
│                    │  (Instances)   │                          │
│                    └────────────────┘                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Major Components

### Frontend Components

#### Dashboard View
**Location**: `frontend/src/views/Dashboard.vue`
**Responsibility**:
- Display overview of all 5 batteries
- Show status indicators and key metrics
- Provide navigation to battery details
- Handle real-time updates from WebSocket
**Vuetify Components Used**: `v-container`, `v-row`, `v-col`, `v-card`, `v-badge`

#### Battery Detail View
**Location**: `frontend/src/views/BatteryDetail.vue`
**Responsibility**:
- Display comprehensive battery information
- Show time-series charts for all metrics
- Display alert history for specific battery
- Navigate back to dashboard

#### Alerts Panel
**Location**: `frontend/src/components/AlertsPanel.vue`
**Responsibility**:
- List active alerts with severity coloring
- Display alert details (battery, type, reason, time)
- Allow alert dismissal
- Filter alerts by severity
**Vuetify Components Used**: `v-alert`, `v-list` or `v-expansion-panels`, `v-chip`, `v-btn`, `v-icon`

#### Time-Series Chart Component
**Location**: `frontend/src/components/TimeSeriesChart.vue`
**Responsibility**:
- Render line charts for metrics (SOC, temp, voltage)
- Handle real-time data updates
- Support zooming and tooltip interactions
- Configure chart appearance and labels

#### Pinia Store
**Location**: `frontend/src/stores/batteries.js`
**Responsibility**:
- Manage global state (batteries, alerts, current selection)
- Provide actions to fetch data from API
- Handle WebSocket updates
- Enable reactive UI updates

#### WebSocket Client (Composable)
**Location**: `frontend/src/composables/useSocket.js`
**Responsibility**:
- Establish connection to backend Socket.IO server
- Listen for battery telemetry updates
- Listen for new alert events
- Handle reconnection logic

#### API Client
**Location**: `frontend/src/api/batteryApi.js`
**Responsibility**:
- Make HTTP requests to REST API
- Fetch initial data (batteries, alerts, history)
- Handle errors and loading states
- Configure Axios instance with base URL

### Backend Components

#### Express Server
**Location**: `backend/server.js`
**Responsibility**:
- Configure Express application
- Set up middleware (CORS, JSON parsing, logging)
- Mount API routes
- Initialize Socket.IO server
- Start simulation loop

#### REST API Routes
**Location**: `backend/src/api/routes.js`
**Responsibility**:
- Define API endpoints
- Validate request parameters
- Query BatteryManager for data
- Return JSON responses
- Handle errors gracefully

**Endpoints**:
- `GET /api/batteries` - List all batteries
- `GET /api/batteries/:id` - Get single battery details
- `GET /api/batteries/:id/history` - Get historical data for charts
- `GET /api/alerts` - Get active alerts

#### Socket.IO Handler
**Location**: `backend/src/api/socketHandler.js`
**Responsibility**:
- Handle client WebSocket connections
- Broadcast battery telemetry updates
- Emit new alerts to connected clients
- Manage connection lifecycle

**Events**:
- `battery:update` - Broadcasted on each simulation tick
- `alert:new` - Emitted when new alert is generated

#### Alert Generator
**Location**: `backend/src/detection/AlertGenerator.js`
**Responsibility**:
- Receive health check results
- Generate alert objects when issues detected
- Store active alerts in memory
- Remove expired/dismissed alerts
- Notify Socket.IO handler of new alerts

**Alert Structure**:
```javascript
{
  id: string,
  batteryId: string,
  type: 'degradation' | 'drain' | 'temperature' | 'voltage',
  severity: 'warning' | 'critical',
  reason: string,
  timestamp: Date
}
```

#### Health Checker
**Location**: `backend/src/detection/HealthChecker.js`
**Responsibility**:
- Analyze battery state for anomalies
- Check degradation indicators (resistance increase)
- Check drain detection (SOC drop rate)
- Check fault conditions (temp/voltage thresholds)
- Return battery status (Normal/Warning/Critical)
- Provide reasons for status classification

**Detection Rules**:
1. **Degradation**: Internal resistance increased >10% from baseline
2. **Drain**: SOC dropping faster than expected discharge rate
3. **Temperature**: >60°C (critical), 45-60°C (warning)
4. **Voltage**: Outside ±10% of rated voltage

#### Battery Manager
**Location**: `backend/src/simulation/BatteryManager.js`
**Responsibility**:
- Create 5 battery instances by default (configurable)
- Run simulation loop (ticks every 2 seconds)
- Update all batteries on each tick
- Maintain historical data for charts
- Provide query interface for API routes

#### Battery Model
**Location**: `backend/src/models/Battery.js`
**Responsibility**:
- Store battery state and properties
- Simulate charge/discharge physics
- Update SOC based on current flow
- Simulate temperature changes
- Increase internal resistance over time (degradation)
- Add realistic noise to readings
- Track historical data points

**Battery Properties**:
```javascript
{
  id: string,
  capacity: number,        // kWh
  soc: number,             // % (0-100)
  voltage: number,         // V
  current: number,         // A (positive = charge, negative = discharge)
  temperature: number,     // °C
  chargeRate: number,      // kW
  dischargeRate: number,   // kW
  internalResistance: number, // Ω (increases over time)
  status: 'normal' | 'warning' | 'critical',
  history: Array<{timestamp, soc, voltage, current, temperature}>
}
```

## Data Flow

### Real-Time Telemetry Flow
```
BatteryManager.updateAll() (every 1-5s)
  ↓
Battery.update() for each battery
  ↓
HealthChecker.check(battery)
  ↓
AlertGenerator.process(battery, healthResult) [if issue]
  ↓
SocketIOHandler.emit('battery:update', battery)
  ↓
Frontend: useSocket receives update
  ↓
Pinia Store: batteries.updateState(battery)
  ↓
Dashboard/Detail View: Reactively updates UI
```

### Alert Flow
```
HealthChecker detects anomaly
  ↓
AlertGenerator.generateAlert(battery, issue)
  ↓
SocketIOHandler.emit('alert:new', alert)
  ↓
Frontend: useSocket receives alert
  ↓
Pinia Store: alerts.addAlert(alert)
  ↓
Alerts Panel: Reactively displays new alert
```

### Historical Data Flow (User opens detail view)
```
User clicks battery in Dashboard
  ↓
Vue Router navigates to BatteryDetail view
  ↓
onMounted: Call batteryApi.getBatteryHistory(id)
  ↓
Axios: GET /api/batteries/:id/history
  ↓
Routes: Query BatteryManager for history
  ↓
BatteryManager: Return battery.history array
  ↓
Frontend: Update chart data
  ↓
TimeSeriesChart: Renders chart with history
```

## Component Interaction Diagram

```
┌──────────────────┐
│   User Actions   │
└────────┬─────────┘
         │
         ▼
┌───────────────────────────────────────────────┐
│              Vue Router                        │
│  (navigates between Dashboard and Detail)     │
└──────────────┬────────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│  Dashboard  │  │ BatteryDetail│
└──────┬──────┘  └──────┬───────┘
       │                │
       │         ┌──────┴───────┐
       │         ▼              ▼
       │  ┌─────────────┐  ┌────────────┐
       │  │  TimeSeries │  │   Alerts   │
       │  │   Charts    │  │   Panel    │
       │  └─────────────┘  └────────────┘
       │
       └────────────┬─────────────┐
                    ▼             ▼
            ┌─────────────┐  ┌──────────┐
            │ Pinia Store │←→│ useSocket│
            └──────┬──────┘  └──────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
  ┌──────────────┐   ┌──────────────┐
  │  batteryApi  │   │ Socket Client│
  └──────┬───────┘   └──────┬───────┘
         │                   │
         └─────────┬─────────┘
                   ▼
          ┌────────────────┐
          │ Backend API    │
          │ (Express + WS) │
          └────────────────┘
```

## Key Architectural Decisions

### 1. Simulation as Backend Responsibility
**Why**: Frontend should be stateless and purely presentational. Simulation logic belongs on the server where it can be shared across multiple clients.

### 2. WebSocket for Real-Time Updates
**Why**: Polling REST API is inefficient for continuous telemetry. WebSocket provides instant updates with lower latency.

### 3. REST for Initial Data
**Why**: WebSocket doesn't handle initial connection well. REST provides reliable, cacheable initial load.

### 4. Pinia for State Management
**Why**: Centralized state makes real-time updates easier. All components react to the same source of truth.

### 5. Component-Based Charts
**Why**: Reusable chart component can be used across multiple views (Dashboard and Detail).

### 6. Historical Data Stored in Memory
**Why**: Prototype scope. In production, this would use a time-series database (e.g., InfluxDB, TimescaleDB).

### 7. Rule-Based Detection (No ML)
**Why**: Simpler, more explainable, sufficient for prototype. ML adds complexity without clear benefit for demo.

## Scalability Considerations

### Current Limitations (Prototype Scope)
- All data stored in memory (lost on restart)
- Single server instance
- No persistence layer
- No authentication
- No horizontal scaling

### Future Production Improvements
- Add database for persistence (PostgreSQL + TimescaleDB)
- Implement Redis for shared state across instances
- Add JWT authentication and RBAC
- Containerize with Docker
- Load balancing with Nginx
- Deploy to cloud (AWS/GCP/Azure)
