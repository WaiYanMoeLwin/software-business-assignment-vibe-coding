import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import routes from './src/api/routes.js';
import { socketHandler } from './src/api/socketHandler.js';
import { batteryManager } from './src/simulation/BatteryManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO handler
socketHandler.initialize(io);

// Start simulation loop
batteryManager.startSimulation();

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Simulating ${batteryManager.batteries.size} batteries`);
});
