import React, { useState, useRef } from 'react';
import { Play, Square, Download, Copy, Clock, Activity, CheckCircle, AlertCircle, XCircle, ExternalLink } from 'lucide-react';
import { ClientTestRunner } from '../test/clientTestRunner.js';

const isDev = import.meta.env.DEV;

export const TestDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: '', phase: 'idle' });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const testRunnerRef = useRef(null);

  // Only show in development
  if (!isDev) return null;

  const startTests = async () => {
    setIsRunning(true);
    setError(null);
    setReport(null);
    setProgress({ current: 0, total: 0, message: 'Initializing...', phase: 'starting' });

    try {
      testRunnerRef.current = new ClientTestRunner();
      
      // Set up progress callback
      testRunnerRef.current.setProgressCallback((progressData) => {
        setProgress(progressData);
      });

      const result = await testRunnerRef.current.runBrowserTests();
      setReport(result);
      setProgress({ current: 100, total: 100, message: 'Tests completed!', phase: 'complete' });
    } catch (err) {
      console.error('Test suite error:', err);
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

  const copyReport = async () => {
    if (!report) return;

    const humanSummary = [
      '=== HELIX SHOWCASE TEST REPORT ===',
      `Overall Status: ${report.overall.status}`,
      `Overall Score: ${report.overall.score}%`,
      `Tests: ${report.overall.successfulPhases}/${report.overall.totalPhases} phases passed`,
      `Issues: ${report.overall.criticalIssues} critical, ${report.overall.warningIssues} warnings`,
      `Duration: ${report.meta.duration}`,
      `Viewport: ${report.meta.viewport}`,
      '',
      'Test Results:',
      ...report.results.map(result => 
        `  ${result.name}: ${result.success ? 'PASS' : 'FAIL'} (${result.duration}ms, ${result.issues.length} issues)`
      ),
      '',
      'Critical Issues:',
      ...report.issuesSummary.critical.slice(0, 10).map(issue => `  - ${issue.message}`),
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
      // Show temporary success feedback
      const button = document.querySelector('[data-test-copy]');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy report:', err);
      // Fallback: create a downloadable file
      const blob = new Blob([humanSummary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `helix-test-report-${new Date().toISOString().slice(0, 19)}.txt`;
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
    a.download = `helix-test-report-${new Date().toISOString().slice(0, 19)}.json`;
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

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-48' : isExpanded ? 'w-96' : 'w-80'
    } max-h-96 overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className={`font-semibold text-gray-900 ${isCollapsed ? 'text-sm' : ''}`}>
              {isCollapsed ? 'Test' : 'Test Dashboard'}
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
      </div>

      {/* Controls */}
      {!isCollapsed && (
        <div className="p-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={isRunning ? stopTests : startTests}
            disabled={isRunning && progress.phase === 'starting'}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50`}
            aria-label={isRunning ? 'Stop comprehensive test suite' : 'Run comprehensive test suite'}
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Stop' : 'Run Tests'}
          </button>
          
          <button
            onClick={copyReport}
            disabled={!report}
            data-test-copy
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            aria-label="Copy test report to clipboard"
          >
            <Copy className="w-4 h-4" />
            Copy Report
          </button>
          
          <button
            onClick={downloadReport}
            disabled={!report}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            aria-label="Download test report as JSON file"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
        </div>

        {/* Progress */}
        {(isRunning || progress.phase !== 'idle') && (
          <div className="mb-3">
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
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 text-sm">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">Test Error</span>
            </div>
            <p className="text-red-700 text-xs mt-1">{error}</p>
          </div>
        )}

        {/* Results Summary */}
        {report && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(report.overall.status)}
                <span className="font-medium text-gray-900">
                  {report.overall.status}
                </span>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>Score: {report.overall.score}% | {report.overall.successfulPhases}/{report.overall.totalPhases} passed</div>
                <div>{report.overall.criticalIssues} critical, {report.overall.warningIssues} warnings</div>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {report.results.map((result, index) => (
                  <div key={index} className="flex justify-between items-center p-2 text-xs bg-white rounded border">
                    <span className="font-medium text-gray-800 truncate">{result.name}</span>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                        {result.success ? 'PASS' : 'FAIL'}
                      </span>
                      <span>{result.duration}ms</span>
                      {result.issues.length > 0 && (
                        <span className="text-red-600">{result.issues.length} issues</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Duration: {report.meta.duration}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">Tests: {report.overall.totalTests}</span>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default TestDashboard;