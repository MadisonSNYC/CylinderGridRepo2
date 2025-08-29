import { io } from 'socket.io-client';

export class PlaywrightApiClient {
  constructor() {
    this.socket = null;
    this.apiBaseUrl = 'http://localhost:3001';
    this.isConnected = false;
    this.currentSession = null;
    this.eventListeners = new Map();
  }

  // Connect to the WebSocket server
  async connect() {
    if (this.socket) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.apiBaseUrl, {
          transports: ['websocket', 'polling'],
          timeout: 5000
        });

        this.socket.on('connect', () => {
          console.log('Connected to Playwright API server');
          this.isConnected = true;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Disconnected from Playwright API server:', reason);
          this.isConnected = false;
          this.emit('disconnected', { reason });
        });

        this.socket.on('connect_error', (error) => {
          console.error('Failed to connect to Playwright API server:', error);
          this.isConnected = false;
          reject(new Error(`Connection failed: ${error.message}`));
        });

        // Set up event forwarding
        this.setupEventForwarding();

        // Auto-reconnect logic
        this.socket.on('reconnect', (attemptNumber) => {
          console.log(`Reconnected to Playwright API server (attempt ${attemptNumber})`);
          this.isConnected = true;
          this.emit('reconnected', { attemptNumber });
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  // Set up event forwarding from socket to our event system
  setupEventForwarding() {
    const events = [
      'testStarted',
      'testProgress', 
      'testCompleted',
      'testError',
      'testStopped'
    ];

    events.forEach(eventName => {
      this.socket.on(eventName, (data) => {
        console.log(`Received ${eventName}:`, data);
        this.emit(eventName, data);
      });
    });
  }

  // Event listener management
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Start Playwright tests
  async startTests(config = {}) {
    await this.connect();
    
    if (!this.isConnected) {
      throw new Error('Not connected to Playwright API server');
    }

    return new Promise((resolve, reject) => {
      // Set up one-time listeners for this test session
      const onTestStarted = (data) => {
        this.currentSession = data.sessionId;
        console.log('Test session started:', this.currentSession);
        resolve(data);
      };

      const onTestError = (data) => {
        console.error('Test session error:', data);
        reject(new Error(data.error));
        cleanup();
      };

      const cleanup = () => {
        this.off('testStarted', onTestStarted);
        this.off('testError', onTestError);
      };

      this.on('testStarted', onTestStarted);
      this.on('testError', onTestError);

      // Send the start command
      this.socket.emit('startPlaywrightTests', {
        selectedBrowsers: config.selectedBrowsers || ['chromium'],
        selectedScenarios: config.selectedScenarios || ['performance-deep'],
        ...config
      });

      // Cleanup timeout
      setTimeout(() => {
        cleanup();
        reject(new Error('Test start timeout'));
      }, 30000);
    });
  }

  // Stop current tests
  async stopTests() {
    if (!this.currentSession) {
      throw new Error('No active test session');
    }

    if (this.socket && this.isConnected) {
      this.socket.emit('stopPlaywrightTests', {
        sessionId: this.currentSession
      });
    }

    this.currentSession = null;
  }

  // REST API methods for when WebSocket isn't available
  async makeApiCall(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Get server status
  async getStatus() {
    return await this.makeApiCall('/api/status');
  }

  // Start tests via REST API (fallback)
  async startTestsRest(config = {}) {
    const response = await this.makeApiCall('/api/test/start', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    
    if (response.success) {
      this.currentSession = response.sessionId;
    }
    
    return response;
  }

  // Get test results
  async getTestResults(sessionId = null) {
    const session = sessionId || this.currentSession;
    if (!session) {
      throw new Error('No session ID available');
    }

    return await this.makeApiCall(`/api/test/${session}/results`);
  }

  // Get test status
  async getTestStatus(sessionId = null) {
    const session = sessionId || this.currentSession;
    if (!session) {
      throw new Error('No session ID available');
    }

    return await this.makeApiCall(`/api/test/${session}/status`);
  }

  // Clean up session
  async cleanupSession(sessionId = null) {
    const session = sessionId || this.currentSession;
    if (!session) {
      return;
    }

    await this.makeApiCall(`/api/test/${session}`, {
      method: 'DELETE'
    });

    if (session === this.currentSession) {
      this.currentSession = null;
    }
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentSession = null;
    }
  }

  // Check if server is available
  async checkServerHealth() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get artifact URL
  getArtifactUrl(artifactPath) {
    return `${this.apiBaseUrl}${artifactPath}`;
  }

  // Download artifact
  async downloadArtifact(artifactPath, filename = null) {
    const url = this.getArtifactUrl(artifactPath);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename || artifactPath.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  }

  // Utility method to format progress data
  formatProgress(progressData) {
    const { current, total, message, phase } = progressData;
    
    return {
      percentage: total > 0 ? Math.round((current / total) * 100) : 0,
      message: message || 'Processing...',
      phase: phase || 'unknown',
      current: current || 0,
      total: total || 0
    };
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      hasActiveSession: !!this.currentSession,
      sessionId: this.currentSession,
      socketId: this.socket?.id
    };
  }
}

// Singleton instance
export const playwrightApiClient = new PlaywrightApiClient();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    playwrightApiClient.disconnect();
  });
}