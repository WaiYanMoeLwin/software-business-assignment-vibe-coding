class SocketHandler {
  constructor() {
    this.io = null;
  }

  /**
   * Initialize Socket.IO handler
   */
  initialize(io) {
    this.io = io;

    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      // Send initial data on connection
      socket.emit('connected', {
        message: 'Connected to Battery Monitoring System',
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Broadcast battery update to all connected clients
   */
  broadcastBatteryUpdate(battery) {
    if (this.io) {
      this.io.emit('battery:update', battery.toJSON());
    }
  }

  /**
   * Emit new alert to all connected clients
   */
  emitNewAlert(alert) {
    if (this.io) {
      this.io.emit('alert:new', alert);
    }
  }
}

// Export singleton instance
export const socketHandler = new SocketHandler();
