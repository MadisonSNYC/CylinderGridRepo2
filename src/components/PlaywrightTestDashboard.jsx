import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Square, Download, Copy, Clock, Activity, CheckCircle, AlertCircle, 
  XCircle, ExternalLink, Monitor, Smartphone, Globe, Zap, Eye, Shield, 
  Network, Settings, BarChart3, Image, Video, Wifi, WifiOff, Server
} from 'lucide-react';
import { playwrightApiClient } from '../services/PlaywrightApiClient.js';

const isDev = import.meta.env.DEV;

export const PlaywrightTestDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: '', phase: 'idle' });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [selectedScenarios, setSelectedScenarios] = useState(['visual-regression', 'performance-deep']);
  const [selectedBrowsers, setSelectedBrowsers] = useState(['chromium']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [artifacts, setArtifacts] = useState({ screenshots: [], videos: [], reports: [] });
  const [liveUpdates, setLiveUpdates] = useState([]);
  
  const currentSessionRef = useRef(null);

  // Only show in development
  if (!isDev) return null;

  const testScenarios = [
    { id: 'visual-regression', name: 'Visual Regression', icon: Eye, color: 'blue' },
    { id: 'performance-deep', name: 'Performance Deep', icon: Zap, color: 'green' },
    { id: 'accessibility-comprehensive', name: 'Accessibility Full', icon: Shield, color: 'purple' },
    { id: 'cross-browser', name: 'Cross-Browser', icon: Globe, color: 'orange' },
    { id: 'helix-specific', name: 'Helix Tests', icon: Activity, color: 'red' },
    { id: 'network-conditions', name: 'Network Tests', icon: Network, color: 'indigo' }
  ];

  const browsers = [
    { id: 'chromium', name: 'Chromium', icon: Monitor, color: 'blue' },
    { id: 'firefox', name: 'Firefox', icon: Globe, color: 'orange' },
    { id: 'webkit', name: 'Safari', icon: Smartphone, color: 'gray' }
  ];

  // Initialize API client and event listeners
  useEffect(() => {
    const initializeApiClient = async () => {
      try {
        // Check if server is available
        const isHealthy = await playwrightApiClient.checkServerHealth();
        setConnectionStatus(isHealthy ? 'connected' : 'server_unavailable');

        if (isHealthy) {
          await playwrightApiClient.connect();
          setConnectionStatus('connected');
        }
      } catch (error) {
        console.error('Failed to connect to Playwright API:', error);
        setConnectionStatus('error');
        setError(`Connection failed: ${error.message}`);
      }
    };

    initializeApiClient();

    // Set up event listeners
    const handleTestStarted = (data) => {
      currentSessionRef.current = data.sessionId;
      setLiveUpdates(prev => [...prev, { type: 'info', message: 'Tests started', timestamp: new Date() }]);
    };

    const handleTestProgress = (data) => {
      const formattedProgress = playwrightApiClient.formatProgress(data);
      setProgress(formattedProgress);
      setLiveUpdates(prev => [...prev.slice(-10), { 
        type: 'progress', 
        message: formattedProgress.message,
        percentage: formattedProgress.percentage,
        timestamp: new Date() 
      }]);
    };

    const handleTestCompleted = (data) => {
      setReport(data.results);
      setArtifacts(data.artifacts || { screenshots: [], videos: [], reports: [] });
      setProgress({ current: 100, total: 100, message: 'Tests completed!', phase: 'complete' });
      setLiveUpdates(prev => [...prev, { 
        type: 'success', 
        message: 'All tests completed successfully', 
        timestamp: new Date() 
      }]);
      setIsRunning(false);
    };

    const handleTestError = (data) => {
      setError(data.error);
      setProgress({ current: 0, total: 100, message: 'Test failed', phase: 'error' });
      setLiveUpdates(prev => [...prev, { 
        type: 'error', 
        message: `Test failed: ${data.error}`, 
        timestamp: new Date() 
      }]);
      setIsRunning(false);
    };

    const handleTestStopped = (data) => {
      setProgress({ current: 0, total: 0, message: 'Tests stopped', phase: 'idle' });
      setLiveUpdates(prev => [...prev, { 
        type: 'warning', 
        message: 'Tests stopped by user', 
        timestamp: new Date() 
      }]);
      setIsRunning(false);
    };

    const handleDisconnected = () => {
      setConnectionStatus('disconnected');
      setLiveUpdates(prev => [...prev, { 
        type: 'warning', 
        message: 'Disconnected from server', 
        timestamp: new Date() 
      }]);
    };

    const handleReconnected = () => {
      setConnectionStatus('connected');
      setLiveUpdates(prev => [...prev, { 
        type: 'info', 
        message: 'Reconnected to server', 
        timestamp: new Date() 
      }]);
    };

    // Register event listeners
    playwrightApiClient.on('testStarted', handleTestStarted);
    playwrightApiClient.on('testProgress', handleTestProgress);
    playwrightApiClient.on('testCompleted', handleTestCompleted);
    playwrightApiClient.on('testError', handleTestError);
    playwrightApiClient.on('testStopped', handleTestStopped);
    playwrightApiClient.on('disconnected', handleDisconnected);
    playwrightApiClient.on('reconnected', handleReconnected);

    // Cleanup
    return () => {
      playwrightApiClient.off('testStarted', handleTestStarted);
      playwrightApiClient.off('testProgress', handleTestProgress);
      playwrightApiClient.off('testCompleted', handleTestCompleted);
      playwrightApiClient.off('testError', handleTestError);
      playwrightApiClient.off('testStopped', handleTestStopped);
      playwrightApiClient.off('disconnected', handleDisconnected);
      playwrightApiClient.off('reconnected', handleReconnected);
    };
  }, []);

  const startPlaywrightTests = async () => {
    if (connectionStatus !== 'connected') {
      setError('Not connected to Playwright API server. Please ensure the server is running.');
      return;
    }

    setIsRunning(true);
    setError(null);
    setReport(null);
    setArtifacts({ screenshots: [], videos: [], reports: [] });
    setLiveUpdates([]);
    setProgress({ current: 0, total: 0, message: 'Initializing Playwright tests...', phase: 'starting' });

    try {
      await playwrightApiClient.startTests({
        selectedScenarios,
        selectedBrowsers
      });
    } catch (err) {
      console.error('Failed to start Playwright tests:', err);
      setError(err.message || String(err));
      setIsRunning(false);
    }
  };

  const stopPlaywrightTests = async () => {
    try {
      await playwrightApiClient.stopTests();
    } catch (err) {
      console.error('Failed to stop tests:', err);
    }
    setIsRunning(false);
  };

  const copyPlaywrightReport = async () => {
    if (!report) return;

    const humanSummary = [
      '=== PLAYWRIGHT HELIX TEST REPORT ===',
      `Overall Status: ${report.summary?.status || 'Unknown'}`,
      `Tests: ${report.summary?.successfulTests || 0}/${report.summary?.totalTests || 0} passed`,
      `Browsers: ${report.summary?.browsersTestedCount || 0}`,
      `Scenarios: ${report.summary?.scenariosTestedCount || 0}`,
      `Duration: ${report.meta?.duration || 'Unknown'}`,
      '',
      'Artifacts:',
      `  Screenshots: ${artifacts.screenshots.length}`,
      `  Videos: ${artifacts.videos.length}`,
      `  Reports: ${artifacts.reports.length}`,
      '',
      'Browser Results:',
      ...Object.entries(report.browserResults || {}).map(([browser, stats]) => 
        `  ${browser}: ${stats.successful}/${stats.total} passed`
      ),
      '',
      '=== DETAILED JSON REPORT ===',
      JSON.stringify(report, null, 2)
    ].join('\\n');

    try {
      await navigator.clipboard.writeText(humanSummary);
      // Show success feedback
      setLiveUpdates(prev => [...prev, { 
        type: 'info', 
        message: 'Report copied to clipboard', 
        timestamp: new Date() 
      }]);
    } catch (err) {
      console.error('Failed to copy report:', err);
      // Fallback to download
      const blob = new Blob([humanSummary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playwright-helix-report-${new Date().toISOString().slice(0, 19)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadArtifact = async (artifact) => {
    const success = await playwrightApiClient.downloadArtifact(artifact.path, artifact.name);
    if (success) {
      setLiveUpdates(prev => [...prev, { 
        type: 'info', 
        message: `Downloaded ${artifact.name}`, 
        timestamp: new Date() 
      }]);
    } else {
      setLiveUpdates(prev => [...prev, { 
        type: 'error', 
        message: `Failed to download ${artifact.name}`, 
        timestamp: new Date() 
      }]);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'WARNING': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'CRITICAL': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'server_unavailable': return <Server className="w-4 h-4 text-red-600" />;
      case 'disconnected': return <WifiOff className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getProgressColor = (phase) => {
    switch (phase) {
      case 'complete': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'testing': return 'bg-blue-600';
      default: return 'bg-gray-400';
    }
  };

  const toggleScenario = (scenarioId) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const toggleBrowser = (browserId) => {
    setSelectedBrowsers(prev => 
      prev.includes(browserId) 
        ? prev.filter(id => id !== browserId)
        : [...prev, browserId]
    );
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className={`fixed top-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-48' : isExpanded ? 'w-[700px] h-[600px]' : 'w-96'
    } overflow-hidden`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className={`font-semibold text-gray-900 ${isCollapsed ? 'text-sm' : ''}`}>
              {isCollapsed ? 'Tests' : 'Playwright Tests'}
            </span>
            {!isCollapsed && (
              <>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">PRO</span>
                {getConnectionIcon()}
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? '▶' : '▼'}
            </button>
            {!isCollapsed && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
          </div>
        </div>

        {/* Connection Status */}
        {!isCollapsed && (
          <div className="mt-2 text-xs">
            <span className={`px-2 py-1 rounded text-white ${
              connectionStatus === 'connected' ? 'bg-green-600' :
              connectionStatus === 'server_unavailable' ? 'bg-red-600' :
              connectionStatus === 'error' ? 'bg-red-600' : 'bg-yellow-600'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' :
               connectionStatus === 'server_unavailable' ? 'Server Unavailable' :
               connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
            </span>
          </div>
        )}

        {/* Tabs */}
        {isExpanded && !isCollapsed && (
          <div className="flex gap-1 mt-3">
            <TabButton id="overview" label="Control" icon={Activity} active={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="config" label="Config" icon={Settings} active={activeTab === 'config'} onClick={setActiveTab} />
            <TabButton id="results" label="Results" icon={BarChart3} active={activeTab === 'results'} onClick={setActiveTab} />
            <TabButton id="artifacts" label="Artifacts" icon={Image} active={activeTab === 'artifacts'} onClick={setActiveTab} />
            <TabButton id="live" label="Live" icon={Zap} active={activeTab === 'live'} onClick={setActiveTab} />
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="overflow-y-auto" style={{ height: isExpanded ? '520px' : '200px' }}>
        
        {/* Control Tab */}
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={isRunning ? stopPlaywrightTests : startPlaywrightTests}
                disabled={connectionStatus !== 'connected' || (isRunning && progress.phase === 'starting')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
                aria-label={isRunning ? 'Stop Playwright tests' : 'Run Playwright tests'}
              >
                {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Stop Tests' : 'Run Playwright'}
              </button>
              
              <button
                onClick={copyPlaywrightReport}
                disabled={!report}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                aria-label="Copy Playwright test report to clipboard"
              >
                <Copy className="w-4 h-4" />
                Copy Report
              </button>
            </div>

            {/* Progress */}
            {(isRunning || progress.phase !== 'idle') && (
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600">{progress.message}</span>
                  <span className="text-gray-500">
                    {progress.current}/{progress.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress.phase)}`}
                    style={{ width: `${progress.percentage || 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <XCircle className="w-4 h-4" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-700 text-xs mt-1">{error}</p>
              </div>
            )}

            {/* Quick Summary */}
            {report && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.summary?.status)}
                    <span className="font-medium text-gray-900">
                      {report.summary?.status || 'Complete'}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{report.summary?.successfulTests || 0}/{report.summary?.totalTests || 0} passed</div>
                    <div>{artifacts.screenshots.length + artifacts.videos.length} artifacts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Configuration Tab - Same as before but condensed */}
        {activeTab === 'config' && isExpanded && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Test Scenarios</h3>
              <div className="grid grid-cols-2 gap-2">
                {testScenarios.map(scenario => {
                  const Icon = scenario.icon;
                  const isSelected = selectedScenarios.includes(scenario.id);
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => toggleScenario(scenario.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs border transition-colors ${
                        isSelected 
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {scenario.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Browsers</h3>
              <div className="flex gap-2">
                {browsers.map(browser => {
                  const Icon = browser.icon;
                  const isSelected = selectedBrowsers.includes(browser.id);
                  return (
                    <button
                      key={browser.id}
                      onClick={() => toggleBrowser(browser.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs border transition-colors ${
                        isSelected 
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {browser.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Artifacts Tab */}
        {activeTab === 'artifacts' && isExpanded && (
          <div className="p-4 space-y-4">
            {artifacts.screenshots.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Screenshots ({artifacts.screenshots.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {artifacts.screenshots.slice(0, 6).map((screenshot, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={playwrightApiClient.getArtifactUrl(screenshot.path)}
                        alt={screenshot.name}
                        className="w-full h-16 object-cover rounded border cursor-pointer hover:opacity-75"
                        onClick={() => window.open(playwrightApiClient.getArtifactUrl(screenshot.path), '_blank')}
                      />
                      <button
                        onClick={() => downloadArtifact(screenshot)}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {artifacts.videos.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Videos ({artifacts.videos.length})
                </h3>
                <div className="space-y-2">
                  {artifacts.videos.slice(0, 3).map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600 truncate">{video.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(playwrightApiClient.getArtifactUrl(video.path), '_blank')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadArtifact(video)}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Updates Tab */}
        {activeTab === 'live' && isExpanded && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Live Updates
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {liveUpdates.length === 0 ? (
                <p className="text-gray-500 text-sm">No updates yet...</p>
              ) : (
                liveUpdates.slice(-20).reverse().map((update, index) => (
                  <div key={index} className={`p-2 rounded text-sm ${
                    update.type === 'error' ? 'bg-red-50 text-red-700' :
                    update.type === 'success' ? 'bg-green-50 text-green-700' :
                    update.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    <div className="flex justify-between items-start">
                      <span>{update.message}</span>
                      <span className="text-xs opacity-75">
                        {update.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {update.percentage !== undefined && (
                      <div className="mt-1 w-full bg-white/50 rounded-full h-1">
                        <div 
                          className="h-1 rounded-full bg-current opacity-50"
                          style={{ width: `${update.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && isExpanded && report && (
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Browser Results</h3>
              <div className="space-y-1">
                {Object.entries(report.browserResults || {}).map(([browser, stats]) => (
                  <div key={browser} className="flex justify-between items-center p-2 text-xs bg-white rounded border">
                    <span className="font-medium text-gray-800 capitalize">{browser}</span>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className={stats.successful === stats.total ? 'text-green-600' : 'text-yellow-600'}>
                        {stats.successful}/{stats.total}
                      </span>
                      {stats.failed > 0 && (
                        <span className="text-red-600">{stats.failed} failed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Scenario Results</h3>
              <div className="space-y-1">
                {Object.entries(report.scenarioResults || {}).map(([scenario, stats]) => (
                  <div key={scenario} className="flex justify-between items-center p-2 text-xs bg-white rounded border">
                    <span className="font-medium text-gray-800">{scenario.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className={stats.successful === stats.total ? 'text-green-600' : 'text-yellow-600'}>
                        {stats.successful}/{stats.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default PlaywrightTestDashboard;