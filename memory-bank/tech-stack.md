# Tech Stack

## Language

### Frontend
- **JavaScript** (ES2022+)
- **Rationale**: Universal language, excellent Vue.js ecosystem, async/await for real-time data handling

### Backend
- **JavaScript** (Node.js 18+)
- **Rationale**: Full-stack consistency, excellent WebSocket support, rich npm ecosystem for simulation and APIs

## Frameworks

### Frontend Framework
- **Vue.js 3** with Composition API
- **Rationale**:
  - Reactive data binding perfect for real-time telemetry
  - Composition API enables clean separation of battery simulation logic
  - Lightweight and fast for dashboard applications
  - Excellent TypeScript support (if needed later)

### Backend Framework
- **Express.js**
- **Rationale**:
  - Minimal, unopinionated, flexible
  - Simple REST API and WebSocket setup
  - Middleware ecosystem for CORS, logging, etc.
  - Proven stability for prototype APIs

### State Management
- **Pinia** (Vue 3 official state management)
- **Rationale**:
  - Lightweight compared to Vuex
  - Excellent TypeScript support
  - Simple DevTools integration
  - Perfect for managing battery list, alerts, real-time updates

## Libraries

### Frontend

**Charting/Visualization**
- **Chart.js** with vue-chartjs wrapper
- **Rationale**: Lightweight, simple API, excellent real-time update support, good for prototype scope

**HTTP/WebSocket Client**
- **Axios** (for REST)
- **Socket.IO client** (for real-time)
- **Rationale**: Axios provides request/response interceptors, error handling. Socket.IO client pairs with backend for robust WebSocket handling.

**UI Component Library** ✅ **CONFIRMED: Vuetify 3**
- **Vuetify** with Material Design Icons (mdi-font)
- **Rationale**:
  - Comprehensive component set (v-card, v-badge, v-alert, v-btn, v-data-table, etc.)
  - Material Design 3 theming
  - Excellent Vue 3 integration
  - Built-in responsive grid system
  - Pre-built styling speeds up dashboard development significantly

### Backend

**Simulation Utilities**
- **Custom simulation layer** (no external library needed)
- **Rationale**: Battery physics are straightforward enough to implement directly

**Data Validation**
- **Joi** OR **Zod**
- **Rationale**: Validate battery IDs, alert parameters, API payloads

**Real-time Communication**
- **Socket.IO** OR **native WebSocket (ws)**
- **Rationale**: Socket.IO provides reconnection, rooms, fallbacks; ws is lighter
- **Decision Point**: Use Socket.IO for robustness in prototype

## Development Tools

### Package Management
- **npm** (comes with Node.js)
- **Rationale**: Standard, no additional tooling needed

### Build Tools

**Frontend**
- **Vite** (recommended for Vue 3)
- **Rationale**: Blazing fast HMR, modern, built-in TypeScript support

**Backend**
- **Node.js directly** (no build step needed for vanilla JS)
- **esbuild** OR **swc** (if using TypeScript later)

### Code Quality

**Linting**
- **ESLint** (JavaScript/TypeScript)
- **Rationale**: Industry standard, highly configurable

**Formatting**
- **Prettier**
- **Rationale**: Consistent code style, auto-fix on save

**Type Checking** (Optional)
- **TypeScript** (can be adopted later)
- **Rationale**: Catch errors early, better IDE support

### Testing

**Frontend**
- **Vitest** (recommended for Vite projects)
- **Rationale**: Fast, native ESM, Jest-compatible API

**Backend**
- **Jest** OR **Mocha + Chai**
- **Rationale**: Jest for simplicity, Mocha for flexibility

**E2E Testing** (Optional)
- **Playwright** OR **Cypress**
- **Rationale**: Test full user flows, critical for dashboard interactions

## Platform Target

### Primary Target
- **Modern web browsers** (Chrome/Edge 90+, Firefox 88+, Safari 14+)
- **Desktop-first** (larger screens for dashboards)
- **Tablet compatible** (touch-friendly controls)

### Responsive Breakpoints
- Desktop: 1280px+
- Tablet: 768px - 1279px
- Mobile: < 768px (not optimized, but should not break)

## Deployment (Prototype Scope)

### Local Development
- **Frontend**: Vite dev server (http://localhost:5173)
- **Backend**: Node.js (http://localhost:3000)
- **Communication**: Proxy configured in Vite config

### Production (Future Consideration)
- **Docker containers** for easy deployment
- **Nginx** as reverse proxy
- **Process manager**: PM2 OR systemd

## Environment Requirements

### Runtime
- **Node.js 18.x** or higher (LTS recommended)
- **npm 9.x** or higher

### Development
- **Git** for version control
- **VS Code** (recommended) with Vue extension
- **Modern browser** with DevTools

## Reasons for Choices Summary

| Category | Choice | Primary Reason |
|----------|--------|----------------|
| Frontend Framework | Vue 3 + Composition API | Reactive, lightweight, great for dashboards |
| Backend Framework | Express.js | Minimal, flexible, proven |
| Real-time Comms | Socket.IO | Robust WebSocket handling |
| Build Tool | Vite | Speed, modern, great DX |
| State Management | Pinia | Lightweight, Vue 3 native |
| Charting | Chart.js | Simple, responsive, real-time updates |

## Alternatives Considered

| Category | Alternative | Why Not Chosen |
|----------|-------------|----------------|
| Frontend | React | More boilerplate, Vue more intuitive for this use case |
| Backend | Koa/Fastify | Less familiar, Express sufficient |
| Real-time | Server-Sent Events | Unidirectional only, need bidirectional |
| Build Tool | Webpack | Slower, more complex configuration |
| State | Zustand/Jotai | React-focused, Pinia is Vue-native |
