// // composables/useSocket.js
// import { io } from 'socket.io-client';
// import { useBatteryStore } from '../stores/batteries.js';

// // Use relative URL for proxy
// const SOCKET_URL = '';

// export function useSocket() {
//   const store = useBatteryStore();
//   let socket = null;

//   /**
//    * Connect to WebSocket server
//    */
//   const connect = () => {
//     if (socket) {
//       return socket;
//     }

//     socket = io(SOCKET_URL, {
//       autoConnect: true,
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 10
//     });

//     socket.on('connect', () => {
//       console.log('Connected to WebSocket server');
//       store.setConnected(true);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from WebSocket server');
//       store.setConnected(false);
//     });

//     socket.on('connect_error', (error) => {
//       console.error('WebSocket connection error:', error);
//       store.setConnected(false);
//     });

//     // Listen for battery updates
//     socket.on('battery:update', (battery) => {
//       store.updateBattery(battery);
//     });

//     // Listen for new alerts
//     socket.on('alert:new', (alert) => {
//       store.addAlert(alert);
//     });

//     return socket;
//   };

//   /**
//    * Disconnect from WebSocket server
//    */
//   const disconnect = () => {
//     if (socket) {
//       socket.disconnect();
//       socket = null;
//       store.setConnected(false);
//     }
//   };

//   // Auto-connect on composable use
//   if (!socket) {
//     connect();
//   }

//   return {
//     socket,
//     connect,
//     disconnect,
//     isConnected: () => store.isConnected
//   };
// }
