# Testing System Documentation

## Overview
This project implements a comprehensive multi-layered testing system with real-time monitoring, automated E2E testing, and performance analysis capabilities.

## Architecture Components

### 1. Playwright End-to-End Testing Framework

#### Configuration
- **File**: `playwright.config.js`
- **Test Directory**: `./tests/specs`
- **Output**: `./test-results/artifacts`
- **Base URL**: `http://localhost:4000`

#### Features
- **Multi-Browser Support**:
  - Chromium (Desktop & Mobile)
  - Firefox (Desktop)
  - WebKit/Safari (Desktop & Mobile)
  - Microsoft Edge
  - Google Chrome
- **Viewport Configurations**:
  - Desktop: 1366x900
  - Mobile: Pixel 5, iPhone 12
  - Tablet: iPad Pro
- **Test Artifacts**:
  - Screenshots on failure
  - Video recording on failure
  - Trace collection on retry
  - HTML, JSON, and JUnit reports

#### Test Runner Components
- **Core Runner**: `src/test/testRunner.js`
  - Lighthouse integration for performance metrics
  - Axe-core integration for accessibility testing
  - Custom helix-specific test scenarios
  - Memory leak detection
  - FPS and render time monitoring
- **Advanced Runner**: `src/test/advancedTestRunner.js`
  - Extended test scenarios
  - Network condition simulation
  - Cross-browser compatibility checks

### 2. Test API Server

#### Server Details
- **File**: `server/testApiServer.js`
- **Port**: 3001
- **Protocol**: HTTP + WebSocket (Socket.IO)

#### API Endpoints

##### WebSocket Events
```javascript
// Client -> Server
'startPlaywrightTests' - Start test session with config
'stopPlaywrightTests' - Stop running tests

// Server -> Client
'testStarted' - Test session started
'testProgress' - Real-time progress updates
'testCompleted' - Tests finished with results
'testError' - Error occurred during testing
```

##### REST API
```
GET  /api/status - Server status and active sessions
POST /api/test/start - Start new test session
GET  /api/test/:sessionId/status - Get session status
GET  /api/test/:sessionId/results - Get test results
DELETE /api/test/:sessionId - Stop and cleanup session
GET  /health - Health check endpoint
GET  /artifacts/* - Static artifact serving
```

### 3. React Test Components

#### ComprehensiveTestSuite Component
**Location**: `src/components/ComprehensiveTestSuite.jsx`

**Test Phases**:
1. **Baseline Performance** (5s)
   - Static measurement without interaction
   - Metrics: FPS, render time, memory, aspect ratio

2. **Light Scrolling** (8s)
   - Gentle scroll interactions (25px/800ms)
   - Metrics: FPS, render time, scroll velocity, responsiveness

3. **Moderate Scrolling** (8s)
   - Medium-speed scrolling (50px/600ms)
   - Additional scroll responsiveness metrics

4. **Intensive Scrolling** (8s)
   - High-speed scroll stress test (75px/500ms)
   - Frame drop detection

5. **Stress Test** (10s)
   - Maximum load with rapid interactions
   - Full metric collection including memory

6. **Recovery Test** (5s)
   - Return to baseline after stress
   - Memory leak detection

**Metrics Collected**:
- Performance: FPS (current/average), render times
- Memory: Heap usage, growth patterns
- Scrolling: Velocity, total distance, frame drops
- Cards: Aspect ratio compliance, visibility, rotation
- Viewport: Dimensions, device pixel ratio

**Report Generation**:
- JSON export with raw data
- Text report for clipboard copying
- Pass/Warning/Fail status determination
- Issue identification and categorization

#### PlaywrightTestDashboard Component
**Location**: `src/components/PlaywrightTestDashboard.jsx`

**Features**:
- Test scenario selection interface
- Browser selection (Chromium, Firefox, WebKit)
- Real-time WebSocket connection status
- Live test progress updates
- Artifact viewer (screenshots, videos)
- Test report visualization
- Error handling and display

**Test Scenarios**:
- Visual Regression
- Performance Deep Dive
- Accessibility Comprehensive
- Cross-Browser Compatibility
- Helix-Specific Tests
- Network Condition Tests

#### TestRecorder Component
**Location**: `src/components/TestRecorder.jsx`

**Capabilities**:
- Records user interactions in real-time
- Captures performance metrics during manual testing
- Session export for test replay
- Custom event tracking

### 4. Performance Monitoring System

#### Performance Monitor
**File**: `src/utils/performanceMonitor.js`

**Tracked Metrics**:
- Frame rate (FPS)
- Render times
- Cache hit rates
- Memory usage patterns
- Performance marks and measures

**Features**:
- Real-time data collection
- Summary generation
- Performance history tracking
- Threshold monitoring

### 5. Test Execution Commands

```bash
# Development with test server
npm run dev:full        # Runs dev server + test API server concurrently

# Playwright tests
npm test               # Run all tests headless
npm run test:headed    # Run tests with browser UI
npm run test:debug     # Debug mode with inspector
npm run test:report    # Show HTML test report

# Test server
npm run test:server    # Start test API server on port 3001

# Development
npm run dev           # Start Vite dev server on port 4000
npm run build         # Build for production
npm run lint          # Run ESLint
```

### 6. Test Configuration Structure

#### Test Pages Configuration
```javascript
TEST_PAGES = [
  { label: 'Main Page', url: '/' },
  { label: 'With Dev Tools', url: '/?dev=true' },
  // ...additional pages
]
```

#### Device Profiles
```javascript
DEVICE_PROFILES = [
  { name: 'desktop', viewport: { width: 1366, height: 900 }, userAgent: '...' },
  { name: 'mobile', viewport: { width: 375, height: 812 }, userAgent: '...' },
  { name: 'tablet', viewport: { width: 768, height: 1024 }, userAgent: '...' }
]
```

#### Performance Thresholds
```javascript
PERFORMANCE_THRESHOLDS = {
  lighthouse: {
    performance: 70,
    accessibility: 85,
    bestPractices: 80,
    seo: 80
  },
  metrics: {
    LCP: 2500,  // Largest Contentful Paint (ms)
    CLS: 0.1,   // Cumulative Layout Shift
    FID: 100,   // First Input Delay (ms)
    TBT: 300    // Total Blocking Time (ms)
  },
  helix_specific: {
    minFPS: 30,
    maxRenderTime: 50,
    maxMemoryIncrease: 50  // MB
  }
}
```

### 7. Test Artifacts Organization

```
test-results/
├── artifacts/
│   ├── screenshots/
│   │   └── current/
│   ├── videos/
│   └── traces/
├── reports/
│   ├── test-results.json
│   ├── junit.xml
│   └── lighthouse-reports/
└── html-report/
    └── index.html
```

### 8. Testing Workflow

#### Manual Testing Flow
1. Open application with dev tools: `http://localhost:4000/?dev=true`
2. Enable ComprehensiveTestSuite from UI
3. Run through test phases
4. Review real-time metrics
5. Export report

#### Automated Testing Flow
1. Start development server: `npm run dev`
2. Start test API server: `npm run test:server`
3. Open PlaywrightTestDashboard in browser
4. Select test scenarios and browsers
5. Start tests and monitor progress
6. Review artifacts and reports

#### CI/CD Testing Flow
1. Build application: `npm run build`
2. Run Playwright tests: `npm test`
3. Generate reports: `playwright show-report`
4. Archive artifacts for review

### 9. Key Testing Metrics Explained

#### Performance Metrics
- **FPS (Frames Per Second)**: Target > 30fps, ideal > 60fps
- **Render Time**: Time to render each frame, target < 16.67ms
- **LCP (Largest Contentful Paint)**: Main content load time, target < 2.5s
- **CLS (Cumulative Layout Shift)**: Visual stability, target < 0.1
- **FID (First Input Delay)**: Interactivity, target < 100ms

#### Helix-Specific Metrics
- **Aspect Ratio Compliance**: % of cards maintaining 16:9 ratio
- **Scroll Velocity**: Smoothness of scroll animations
- **Card Visibility**: Number of properly rendered cards
- **Memory Growth**: Memory usage increase during interactions

#### Accessibility Metrics
- **WCAG Violations**: Critical and serious accessibility issues
- **ARIA Compliance**: Proper use of ARIA attributes
- **Color Contrast**: Sufficient contrast ratios
- **Keyboard Navigation**: Full keyboard accessibility

### 10. Troubleshooting

#### Common Issues
1. **Test Server Connection Failed**
   - Ensure server is running: `npm run test:server`
   - Check port 3001 is available
   - Verify CORS settings match dev server URL

2. **Playwright Tests Timeout**
   - Increase timeout in playwright.config.js
   - Check dev server is running
   - Verify base URL is correct

3. **Memory Issues During Tests**
   - Reduce test duration in ComprehensiveTestSuite
   - Lower interaction intensity
   - Clear browser cache between test runs

4. **Missing Artifacts**
   - Check test-results directory permissions
   - Ensure sufficient disk space
   - Verify artifact collection in testApiServer.js

### 11. Best Practices

1. **Test Isolation**: Each test should be independent
2. **Performance Baselines**: Establish and maintain performance budgets
3. **Regular Monitoring**: Run tests on every significant change
4. **Artifact Review**: Regularly review screenshots and videos
5. **Accessibility First**: Fix accessibility issues before other bugs
6. **Cross-Browser Testing**: Test on all supported browsers regularly
7. **Network Conditions**: Test under various network speeds
8. **Memory Profiling**: Monitor for memory leaks regularly

## Development Panels

### 1. DevPanel Component
**Location**: `src/components/DevPanel.jsx`

**Purpose**: Real-time control panel for visual effects and helix configuration

**Effect Categories**:

#### Color Effects
- **Ashfall Theme**: Light cream background color scheme
- **Monochrome**: Grayscale card rendering

#### Visual Effects
- **Chromatic Aberration**: RGB color separation effect
- **Depth Blur**: Distance-based blur rendering
- **Glitch Effects**: Hover-triggered glitch animations
- **Ambient Lighting**: Soft shadow rendering
- **Outward Turn**: Scroll-based opening animation with ghost effect
- **RGB Edge**: Chromatic edge effects on cards

#### Card Styling
- **Ashfall Style**: Clean white card design
- **Card Shadows**: Drop shadow effects
- **Card Borders**: Border styling for cards

#### Structure Controls
- **Wireframe**: Central wireframe visualization
- **Center Logo**: Ravie logo placement in center
  - Billboard mode: Always faces forward
  - Rotate mode: Rotates with scene
- **Smooth Rotation**: Enhanced easing functions
- **Depth Hierarchy**: Scale cards by distance
- **Repeat Turns**: Configurable helix rotation count (0-5)

#### Navigation
- **Project Counter**: Display project numbering
- **Navigation Dots**: Position indicators
- **Minimalist Controls**: Clean control interface

#### Typography
- **Ashfall Typography**: Custom font styling
- **Subtle Text**: Muted text colors

#### Placement Controls
- **Strength Slider**: 0-10 placement intensity control
- Always-on feature (no toggle)

#### Input Controls
- **Scroll Mode**:
  - Wheel: Manual scroll handling
  - Sticky: Scroll timeline API
- **Invert Scroll**: Reverse wheel direction

**Features**:
- Collapsible panel with Settings icon
- Reset button for defaults
- Ashfall preset button for quick theming
- Active effect counter
- Real-time effect toggling

### 2. AspectRatioTest Component
**Location**: `src/components/AspectRatioTest.jsx`

**Purpose**: Debug tool for monitoring card aspect ratios and positioning

**Measurements Collected**:
- Card dimensions (width, height)
- Actual vs expected aspect ratio (16:9)
- Transform matrix data
- Rotation angles (Y-axis)
- Translation Z-depth
- Card placement (Front, Near-Front, Side)

**Features**:
- Real-time card measurement
- Orb card filtering (skips < 20px elements)
- Front-facing card detection
- Aspect ratio compliance checking
- Export functionality (JSON, clipboard)
- Statistical analysis:
  - Min/Max/Average ratios
  - Standard deviation
  - Error percentages
  - Placement distribution

**Debug Output**:
- Console logging for first 5 cards
- Summary statistics
- Placement-based grouping
- Error metrics and percentages

### 3. TestRecorder Component
**Location**: `src/components/TestRecorder.jsx`

**Purpose**: Records user interactions for test replay

**Recording Capabilities**:
- Mouse movements and clicks
- Scroll events and velocity
- Keyboard inputs
- Performance metrics
- Timing data

**Features**:
- Start/stop recording
- Session export
- Performance overlay
- Event timeline visualization

### 4. TestDashboard Component
**Location**: `src/components/TestDashboard.jsx`

**Purpose**: Lightweight test monitoring interface

**Displays**:
- Current test status
- Performance metrics
- Memory usage
- FPS counter
- Test phase information

### 5. AdvancedTestDashboard Component
**Location**: `src/components/AdvancedTestDashboard.jsx`

**Purpose**: Extended test interface with more controls

**Additional Features**:
- Test scenario selection
- Browser selection
- Network throttling
- Advanced metrics display
- Multi-phase test execution

## Development Panel Usage

### Enabling Dev Panels
1. Add `?dev=true` to URL: `http://localhost:4000/?dev=true`
2. DevPanel appears on right side
3. Test components become available

### Common Workflows

#### Visual Testing
1. Enable DevPanel
2. Toggle effects to test combinations
3. Use AspectRatioTest to verify card dimensions
4. Check performance with ComprehensiveTestSuite

#### Performance Optimization
1. Enable TestRecorder to capture baseline
2. Make optimizations
3. Re-run tests to compare
4. Export reports for analysis

#### Debugging Layout Issues
1. Enable AspectRatioTest
2. Check placement distribution
3. Verify front-facing card ratios
4. Export data for detailed analysis

## Integration with Development Workflow

### Local Development
- Use DevPanel for real-time visual adjustments
- Monitor with AspectRatioTest during development
- Run ComprehensiveTestSuite before commits
- Use TestRecorder to capture user journeys

### Pull Request Validation
- Automated Playwright test runs
- Performance regression checks
- Accessibility violation screening
- Visual regression testing
- Aspect ratio compliance verification

### Production Monitoring
- Lighthouse CI integration
- Real user monitoring (RUM) data collection
- Error tracking and reporting
- Performance budget enforcement
- Aspect ratio analytics