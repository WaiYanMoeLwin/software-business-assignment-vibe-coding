You are a senior full-stack engineer and systems architect building a prototype battery monitoring web application for industrial / agricultural energy storage systems (solar, wind, other green sources).
This system has no physical hardware; all batteries must be simulated in software.

Core Goal

Build a web-based monitoring dashboard that:

Simulates multiple industrial batteries

Continuously generates realistic battery telemetry

Detects early signs of battery degradation, abnormal draining, and fault conditions

Alerts users when thresholds or anomaly rules are violated

This is a prototype, not a production system. Favor clarity, modularity, and correctness over scale.

System Architecture (must follow this structure)

1. Frontend

Framework: Vue.js (Vue 3 + Composition API)

Responsibilities:

Display real-time battery metrics

Show battery health status (Normal / Warning / Critical)

Visualize time-series data (charts)

Display alerts clearly

Use a component-based structure

2. Backend

Language: JavaScript (Node.js + Express)

Responsibilities:

Simulate batteries and telemetry

Expose REST APIs (or WebSocket for live updates)

Run health checks and rule-based anomaly detection

Generate alerts

3. Battery Simulation Layer
   Each simulated battery must have:

Battery ID

Capacity (kWh)

State of Charge (SOC %)

Voltage (V)

Current (A)

Temperature (°C)

Charge / Discharge rate

Internal resistance (slowly increases over time to simulate degradation)

Simulation rules:

SOC decreases when discharging and increases when charging

Higher temperature accelerates degradation

Random noise must be added to readings (within realistic bounds)

Abnormal cases must exist (overheating, rapid SOC drop, voltage instability)

Battery Health & Fault Detection Logic

Implement rule-based detection (no ML in this prototype):

Degradation indicators

Increasing internal resistance over time

Reduced effective capacity

Drain detection

SOC drop rate exceeds expected discharge rate

Fault conditions

Temperature above safe threshold

Voltage outside normal operating range

Each battery must be classified as:

Normal

Warning

Critical

Alerts must include:

Battery ID

Alert type

Reason

Timestamp

Frontend Features

Dashboard showing:

List of batteries with status indicators

Key metrics (SOC, temperature, voltage)

Battery detail view:

Time-series charts (SOC, temperature, voltage)

Alerts panel:

Active alerts

Severity coloring

Development Requirements

Provide:

Folder structure

Key files with code

Clear comments explaining simulation and detection logic

Use mock data only (no external APIs)

Keep everything runnable locally

Do not over-engineer authentication or deployment

Output Format

High-level architecture explanation

Backend implementation (simulation + APIs)

Frontend implementation (Vue components)

Instructions to run the prototype locally

Build this as if it were a technical demo for stakeholders, not a toy example.

Be precise. Avoid placeholder logic. Explain assumptions clearly.
