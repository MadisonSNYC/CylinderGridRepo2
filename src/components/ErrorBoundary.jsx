import React from 'react';
import { logBrowserInfo } from '../lib/browserCompat.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      browserInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details and browser info
    console.error('🔴 ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Get browser compatibility info
    const browserInfo = logBrowserInfo();
    
    // Log the component stack
    console.error('Component Stack:', errorInfo.componentStack);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
      browserInfo
    });
    
    // You can also log to an error reporting service here
    if (window.location.hostname === 'localhost') {
      console.group('🔍 Debug Information for Browser Compatibility');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Browser Details:', browserInfo);
      console.groupEnd();
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when there's an error
      return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-red-500">
              ⚠️ Rendering Error Detected
            </h1>
            
            <div className="bg-gray-800 rounded-lg p-6 mb-4">
              <h2 className="text-xl font-semibold mb-2">Error Details:</h2>
              <pre className="text-red-400 text-sm overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            
            {this.state.browserInfo && (
              <div className="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold mb-2">Browser Information:</h2>
                <div className="text-sm space-y-1">
                  <div>Browser: {
                    this.state.browserInfo.browser.isFirefox ? 'Firefox' :
                    this.state.browserInfo.browser.isWebKit ? 'WebKit/Safari' :
                    this.state.browserInfo.browser.isChrome ? 'Chrome' :
                    'Unknown'
                  } {this.state.browserInfo.browser.version || ''}</div>
                  <div>3D Transforms: {this.state.browserInfo.supports3D ? '✅' : '❌'}</div>
                  <div>Performance API: {this.state.browserInfo.supportsPerf ? '✅' : '⚠️'}</div>
                  <div>RAF Support: {this.state.browserInfo.supportsRAF ? '✅' : '⚠️'}</div>
                  <div>Video Format: {this.state.browserInfo.videoFormat || 'None'}</div>
                </div>
              </div>
            )}
            
            {this.state.errorInfo && (
              <div className="bg-gray-800 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold mb-2">Component Stack:</h2>
                <pre className="text-gray-400 text-xs overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            <div className="bg-blue-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">💡 Troubleshooting:</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Try refreshing the page</li>
                <li>Check if your browser supports WebGL and 3D transforms</li>
                <li>Try using Chrome or Edge for best compatibility</li>
                <li>Disable browser extensions that might interfere</li>
              </ul>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;