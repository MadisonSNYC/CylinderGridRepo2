import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { AdvancedTestRunner } from '../src/test/advancedTestRunner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4000", "http://localhost:8000"],
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

// Middleware
app.use(cors({
  origin: ["http://localhost:4000", "http://localhost:8000"],
  credentials: true
}));
app.use(express.json());

// Serve static test artifacts
app.use('/artifacts', express.static(path.join(projectRoot, 'test-results')));

// Active test sessions
const activeSessions = new Map();

class PlaywrightTestSession {
  constructor(sessionId, socket, config) {
    this.sessionId = sessionId;
    this.socket = socket;
    this.config = config;
    this.testRunner = new AdvancedTestRunner();
    this.isRunning = false;
    this.results = null;
    this.artifacts = {
      screenshots: [],
      videos: [],
      reports: []
    };
    
    // Set up test runner progress callback
    this.testRunner.setProgressCallback((progress) => {
      this.socket.emit('testProgress', {
        sessionId: this.sessionId,
        ...progress
      });
    });
  }

  async startTests() {
    if (this.isRunning) {
      throw new Error('Tests are already running');
    }

    this.isRunning = true;
    this.socket.emit('testStarted', { sessionId: this.sessionId });

    try {
      // Configure test runner based on user selections
      if (this.config.selectedScenarios) {
        this.testRunner.selectedScenarios = this.config.selectedScenarios;
      }
      if (this.config.selectedBrowsers) {
        this.testRunner.selectedBrowsers = this.config.selectedBrowsers;
      }

      // Run the test suite
      this.results = await this.testRunner.runAdvancedTestSuite();
      
      // Collect artifacts
      await this.collectArtifacts();
      
      this.socket.emit('testCompleted', {
        sessionId: this.sessionId,
        results: this.results,
        artifacts: this.artifacts
      });

    } catch (error) {
      console.error('Test execution error:', error);
      this.socket.emit('testError', {
        sessionId: this.sessionId,
        error: error.message,
        stack: error.stack
      });
    } finally {
      this.isRunning = false;
    }
  }

  async collectArtifacts() {
    try {
      const testResultsDir = path.join(projectRoot, 'test-results');
      
      // Collect screenshots
      const screenshotsDir = path.join(testResultsDir, 'screenshots', 'current');
      try {
        const screenshots = await fs.readdir(screenshotsDir);
        this.artifacts.screenshots = screenshots
          .filter(file => file.endsWith('.png'))
          .map(file => ({
            name: file,
            path: `/artifacts/screenshots/current/${file}`,
            fullPath: path.join(screenshotsDir, file)
          }));
      } catch (error) {
        console.warn('No screenshots found:', error.message);
      }

      // Collect videos
      const videosDir = path.join(testResultsDir, 'videos');
      try {
        const videos = await fs.readdir(videosDir);
        this.artifacts.videos = videos
          .filter(file => file.endsWith('.webm') || file.endsWith('.mp4'))
          .map(file => ({
            name: file,
            path: `/artifacts/videos/${file}`,
            fullPath: path.join(videosDir, file)
          }));
      } catch (error) {
        console.warn('No videos found:', error.message);
      }

      // Collect reports
      const reportsDir = path.join(testResultsDir, 'reports');
      try {
        const reports = await fs.readdir(reportsDir);
        this.artifacts.reports = reports
          .filter(file => file.endsWith('.json') || file.endsWith('.html'))
          .map(file => ({
            name: file,
            path: `/artifacts/reports/${file}`,
            fullPath: path.join(reportsDir, file)
          }));
      } catch (error) {
        console.warn('No reports found:', error.message);
      }

    } catch (error) {
      console.error('Error collecting artifacts:', error);
    }
  }

  stopTests() {
    if (this.isRunning) {
      // Attempt to stop the test runner gracefully
      this.testRunner = null;
      this.isRunning = false;
      this.socket.emit('testStopped', { sessionId: this.sessionId });
    }
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('startPlaywrightTests', async (config) => {
    const sessionId = `session_${Date.now()}_${socket.id}`;
    console.log(`Starting Playwright tests for session: ${sessionId}`);

    try {
      // Create new test session
      const session = new PlaywrightTestSession(sessionId, socket, config);
      activeSessions.set(sessionId, session);

      // Start the tests
      await session.startTests();

    } catch (error) {
      console.error('Failed to start tests:', error);
      socket.emit('testError', {
        sessionId: sessionId,
        error: error.message
      });
    }
  });

  socket.on('stopPlaywrightTests', (data) => {
    const { sessionId } = data;
    const session = activeSessions.get(sessionId);
    
    if (session) {
      session.stopTests();
      activeSessions.delete(sessionId);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Clean up any active sessions for this socket
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.socket.id === socket.id) {
        session.stopTests();
        activeSessions.delete(sessionId);
      }
    }
  });
});

// REST API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    activeSessions: Array.from(activeSessions.keys()),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/test/start', async (req, res) => {
  const config = req.body;
  const sessionId = `rest_session_${Date.now()}`;
  
  try {
    // Create a mock socket for REST API usage
    const mockSocket = {
      emit: (event, data) => {
        console.log(`Mock Socket Event [${event}]:`, data);
      }
    };

    const session = new PlaywrightTestSession(sessionId, mockSocket, config);
    activeSessions.set(sessionId, session);

    // Start tests in background
    session.startTests().catch(error => {
      console.error('Background test error:', error);
      activeSessions.delete(sessionId);
    });

    res.json({
      success: true,
      sessionId,
      message: 'Tests started successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/test/:sessionId/status', (req, res) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  res.json({
    success: true,
    sessionId,
    isRunning: session.isRunning,
    hasResults: !!session.results,
    artifacts: session.artifacts
  });
});

app.get('/api/test/:sessionId/results', (req, res) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  if (!session.results) {
    return res.status(404).json({
      success: false,
      error: 'Results not available yet'
    });
  }

  res.json({
    success: true,
    sessionId,
    results: session.results,
    artifacts: session.artifacts
  });
});

// Cleanup endpoint
app.delete('/api/test/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);
  
  if (session) {
    session.stopTests();
    activeSessions.delete(sessionId);
  }

  res.json({
    success: true,
    message: 'Session cleaned up'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    activeSessions: activeSessions.size
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🧪 Playwright Test API Server running on http://localhost:${PORT}`);
  console.log(`📊 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🗂️  Artifacts served from: http://localhost:${PORT}/artifacts`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  
  // Stop all active sessions
  for (const session of activeSessions.values()) {
    session.stopTests();
  }
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;