import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

// Firebase configuration - using the provided database URL
const firebaseConfig = {
  databaseURL: 'https://smartwatersystem-74f77-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export class FirebaseService {
  constructor() {
    this.listeners = new Map();
  }

  // Listen to real-time sensor data
  listenToSensorData(callback) {
    const sensorRef = ref(database, 'sensorData');
    
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    }, (error) => {
      console.error('Error listening to sensor data:', error);
      callback(null);
    });

    this.listeners.set('sensorData', unsubscribe);
    return unsubscribe;
  }

  // Stop listening to sensor data
  stopListening(key) {
    if (this.listeners.has(key)) {
      const sensorRef = ref(database, key);
      off(sensorRef);
      this.listeners.delete(key);
    }
  }

  // Stop all listeners
  stopAllListeners() {
    this.listeners.forEach((unsubscribe, key) => {
      const sensorRef = ref(database, key);
      off(sensorRef);
    });
    this.listeners.clear();
  }

  // Get sensor data once (not real-time)
  async getSensorData() {
    try {
      const sensorRef = ref(database, 'sensorData');
      return new Promise((resolve, reject) => {
        onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          resolve(data);
        }, (error) => {
          reject(error);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Error getting sensor data:', error);
      return null;
    }
  }

  // Utility function to determine status based on values
  getParameterStatus(parameter, value) {
    const ranges = {
      TDS: {
        excellent: [0, 300],
        good: [300, 600],
        warning: [600, 900],
        danger: [900, Infinity]
      },
      Temperature: {
        excellent: [20, 25],
        good: [15, 30],
        warning: [10, 35],
        danger: [-Infinity, 10, 35, Infinity]
      },
      Turbidity: {
        excellent: [0, 1],
        good: [1, 4],
        warning: [4, 10],
        danger: [10, Infinity]
      },
      pH: {
        excellent: [6.5, 8.5],
        good: [6.0, 9.0],
        warning: [5.5, 9.5],
        danger: [-Infinity, 5.5, 9.5, Infinity]
      }
    };

    const range = ranges[parameter];
    if (!range) return 'unknown';

    if (parameter === 'Temperature' || parameter === 'pH') {
      if (value >= range.excellent[0] && value <= range.excellent[1]) return 'excellent';
      if (value >= range.good[0] && value <= range.good[1]) return 'good';
      if (value >= range.warning[0] && value <= range.warning[1]) return 'warning';
      return 'danger';
    } else {
      if (value >= range.excellent[0] && value < range.excellent[1]) return 'excellent';
      if (value >= range.good[0] && value < range.good[1]) return 'good';
      if (value >= range.warning[0] && value < range.warning[1]) return 'warning';
      return 'danger';
    }
  }

  // Format timestamp
  formatTimestamp(timestamp) {
    if (!timestamp) return new Date();
    return new Date(timestamp);
  }
}

export default new FirebaseService(); 