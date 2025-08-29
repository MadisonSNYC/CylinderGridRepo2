import React, { useState, useRef } from 'react';
import { 
  Play, Square, Download, Copy, Clock, Activity, CheckCircle, AlertCircle, 
  XCircle, ExternalLink, Monitor, Smartphone, Globe, Zap, Eye, Shield, 
  Network, Settings, BarChart3, Image, Video
} from 'lucide-react';

const isDev = import.meta.env.DEV;

export const AdvancedTestDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: '', phase: 'idle' });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [selectedScenarios, setSelectedScenarios] = useState(['visual-regression', 'performance-deep']);
  const [selectedBrowsers, setSelectedBrowsers] = useState(['chromium']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const testRunnerRef = useRef(null);

  // Only show in development
  if (!isDev) return null;

  const testScenarios = [
    { id: 'visual-regression', name: 'Visual Regression', icon: Eye, color: 'blue' },
    { id: 'performance-deep', name: 'Performance Deep Dive', icon: Zap, color: 'green' },
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

  const startAdvancedTests = async () => {
    setIsRunning(true);
    setError(null);
    setReport(null);
    setProgress({ current: 0, total: 0, message: 'Initializing advanced tests...', phase: 'starting' });

    try {
      // Note: Advanced testing now runs through the Playwright API server
      // This is a placeholder for the legacy dashboard - use PlaywrightTestDashboard for full functionality
      
      setProgress({ current: 25, total: 100, message: 'Legacy dashboard - use Playwright dashboard instead', phase: 'info' });
      
      // Simulate test completion with a message
      setTimeout(() => {
        const mockResult = {
          summary: {
            testsRun: 0,
            passed: 0,
            failed: 0,
            duration: 0
          },
          message: 'This is a legacy dashboard. Please use the Playwright Test Dashboard for full testing capabilities.'
        };
        setReport(mockResult);
        setProgress({ current: 100, total: 100, message: 'Please use Playwright Test Dashboard', phase: 'complete' });
      }, 1000);
    } catch (err) {
      console.error('Advanced test suite error:', err);
      setError(err.message || String(err));
      setProgress({ current: 0, total: 100, message: 'Test failed', phase: 'error' });
    } finally {
      setIsRunning(false);
    }
  };

  const stopTests = () => {
    setIsRunning(false);
    testRunnerRef.current = null;
    setProgress({ current: 0, total: 0, message: 'Stopped', phase: 'idle' });
  };

  const copyAdvancedReport = async () => {
    if (!report) return;

    const humanSummary = [
      '=== ADVANCED HELIX TEST REPORT ===',
      `Overall Status: ${report.summary.status}`,
      `Tests: ${report.summary.successfulTests}/${report.summary.totalTests} passed`,
      `Browsers Tested: ${report.summary.browsersTestedCount}`,
      `Scenarios Tested: ${report.summary.scenariosTestedCount}`,
      `Duration: ${report.meta.duration}`,
      '',
      'Browser Results:',
      ...Object.entries(report.browserResults || {}).map(([browser, stats]) => 
        `  ${browser}: ${stats.successful}/${stats.total} passed`
      ),
      '',
      'Scenario Results:',
      ...Object.entries(report.scenarioResults || {}).map(([scenario, stats]) => 
        `  ${scenario}: ${stats.successful}/${stats.total} passed`
      ),
      '',
      'Test Artifacts:',
      `  Screenshots: ${report.artifacts?.screenshotsGenerated || 0}`,
      `  Videos: ${report.artifacts?.videosRecorded || 0}`,
      `  Network Logs: ${report.artifacts?.networkLogsCollected || 0}`,
      '',
      'Recommendations:',
      ...report.recommendations.flatMap(rec => 
        rec.items.slice(0, 3).map(item => `  ${rec.category}: ${item}`)
      ),
      '',
      '=== DETAILED JSON REPORT ===',
      JSON.stringify(report, null, 2)
    ].join('\\n');

    try {
      await navigator.clipboard.writeText(humanSummary);
      const button = document.querySelector('[data-advanced-copy]');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy report:', err);
      const blob = new Blob([humanSummary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `advanced-helix-test-report-${new Date().toISOString().slice(0, 19)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const reportJson = JSON.stringify(report, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced-helix-test-report-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'WARNING': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'CRITICAL': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
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
    <div className={`fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-48' : isExpanded ? 'w-[600px] h-[500px]' : 'w-96'
    } overflow-hidden`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className={`font-semibold text-gray-900 ${isCollapsed ? 'text-sm' : ''}`}>
              {isCollapsed ? 'Tests' : 'Advanced Test Suite'}
            </span>
            {!isCollapsed && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">DEV</span>
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

        {/* Tabs */}
        {isExpanded && !isCollapsed && (
          <div className="flex gap-1 mt-3">
            <TabButton id="overview" label="Overview" icon={Activity} active={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="config" label="Config" icon={Settings} active={activeTab === 'config'} onClick={setActiveTab} />
            <TabButton id="results" label="Results" icon={BarChart3} active={activeTab === 'results'} onClick={setActiveTab} />
            <TabButton id="artifacts" label="Media" icon={Image} active={activeTab === 'artifacts'} onClick={setActiveTab} />
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 overflow-y-auto" style={{ maxHeight: isExpanded ? '400px' : '300px' }}>
        
        {/* Configuration Tab */}
        {activeTab === 'config' && isExpanded && (
          <div className="space-y-4">
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

        {/* Overview/Controls Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={isRunning ? stopTests : startAdvancedTests}
                disabled={isRunning && progress.phase === 'starting'}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
                aria-label={isRunning ? 'Stop advanced test suite' : 'Run advanced test suite'}
              >
                {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Stop' : 'Run Advanced'}
              </button>
              
              <button
                onClick={copyAdvancedReport}
                disabled={!report}
                data-advanced-copy
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                aria-label="Copy advanced test report to clipboard"
              >
                <Copy className="w-4 h-4" />
                Copy Report
              </button>
              
              <button
                onClick={downloadReport}
                disabled={!report}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                aria-label="Download advanced test report as JSON file"
              >
                <Download className="w-4 h-4" />
                JSON
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
                    style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <XCircle className="w-4 h-4" />
                  <span className="font-medium">Test Error</span>
                </div>
                <p className="text-red-700 text-xs mt-1">{error}</p>
              </div>
            )}

            {/* Quick Summary */}
            {report && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.summary.status)}
                    <span className="font-medium text-gray-900">
                      {report.summary.status}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{report.summary.successfulTests}/{report.summary.totalTests} passed</div>
                    <div>{report.summary.browsersTestedCount} browsers, {report.summary.scenariosTestedCount} scenarios</div>
                  </div>
                </div>

                <div className="flex gap-2 text-xs text-gray-500">
                  <span>Duration: {report.meta.duration}</span>
                  <span>•</span>
                  <span>Screenshots: {report.artifacts?.screenshotsGenerated || 0}</span>
                  <span>•</span>
                  <span>Videos: {report.artifacts?.videosRecorded || 0}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && isExpanded && report && (
          <div className="space-y-3">
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

        {/* Artifacts Tab */}
        {activeTab === 'artifacts' && isExpanded && report && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Image className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-semibold text-blue-600">
                  {report.artifacts?.screenshotsGenerated || 0}
                </div>
                <div className="text-xs text-blue-600">Screenshots</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Video className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-semibold text-green-600">
                  {report.artifacts?.videosRecorded || 0}
                </div>
                <div className="text-xs text-green-600">Videos</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Network className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="text-lg font-semibold text-purple-600">
                  {report.artifacts?.networkLogsCollected || 0}
                </div>
                <div className="text-xs text-purple-600">Network Logs</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Test artifacts are saved to <code>./test-results/</code>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default AdvancedTestDashboard;