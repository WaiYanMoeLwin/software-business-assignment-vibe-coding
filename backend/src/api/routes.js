import express from 'express';
import { batteryManager } from '../simulation/BatteryManager.js';
import { alertGenerator } from '../detection/AlertGenerator.js';

const router = express.Router();

/**
 * GET /api/batteries
 * Get all batteries
 */
router.get('/batteries', (req, res) => {
  try {
    const batteries = batteryManager.getAllBatteries();
    res.json(batteries);
  } catch (error) {
    console.error('Error fetching batteries:', error);
    res.status(500).json({ error: 'Failed to fetch batteries' });
  }
});

/**
 * GET /api/batteries/:id
 * Get a single battery by ID
 */
router.get('/batteries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const battery = batteryManager.getBattery(id);

    if (!battery) {
      return res.status(404).json({ error: 'Battery not found' });
    }

    res.json(battery.toJSON());
  } catch (error) {
    console.error('Error fetching battery:', error);
    res.status(500).json({ error: 'Failed to fetch battery' });
  }
});

/**
 * GET /api/batteries/:id/history
 * Get battery historical data
 */
router.get('/batteries/:id/history', (req, res) => {
  try {
    const { id } = req.params;
    const history = batteryManager.getBatteryHistory(id);

    if (!history) {
      return res.status(404).json({ error: 'Battery not found' });
    }

    res.json(history);
  } catch (error) {
    console.error('Error fetching battery history:', error);
    res.status(500).json({ error: 'Failed to fetch battery history' });
  }
});

/**
 * GET /api/alerts
 * Get all active alerts
 */
router.get('/alerts', (req, res) => {
  try {
    const alerts = alertGenerator.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

/**
 * DELETE /api/alerts/:id
 * Dismiss an alert
 */
router.delete('/alerts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const dismissed = alertGenerator.dismissAlert(id);

    if (!dismissed) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert dismissed' });
  } catch (error) {
    console.error('Error dismissing alert:', error);
    res.status(500).json({ error: 'Failed to dismiss alert' });
  }
});

export default router;
