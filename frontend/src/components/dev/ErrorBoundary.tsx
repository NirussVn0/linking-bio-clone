'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary for HMR and development errors
 * Helps recover from React JSX runtime errors during development
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // In development, try to recover from HMR errors
    if (process.env.NODE_ENV === 'development') {
      // Check if this is an HMR-related error
      const isHMRError = error.message.includes('jsx-dev-runtime') || 
                        error.message.includes('module factory is not available') ||
                        error.message.includes('HMR update');
      
      if (isHMRError) {
        console.warn('HMR Error detected, attempting recovery...');
        // Attempt to recover after a short delay
        setTimeout(() => {
          this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        }, 1000);
      }
    }
  }

  handleReload = () => {
    if (process.env.NODE_ENV === 'development') {
      // In development, try to reset the error state
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else {
      // In production, reload the page
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-400">
              Something went wrong
            </h1>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-gray-900 rounded-lg text-left">
                <h2 className="text-lg font-semibold mb-2 text-yellow-400">
                  Development Error Details:
                </h2>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                  {this.state.error?.message}
                </pre>
                {this.state.error?.message.includes('jsx-dev-runtime') && (
                  <div className="mt-3 p-3 bg-blue-900 rounded text-blue-200">
                    <strong>HMR Error Detected:</strong> This is likely a Hot Module Replacement issue. 
                    The page should recover automatically, or try refreshing.
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              {process.env.NODE_ENV === 'development' ? 'Try Again' : 'Reload Page'}
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <p className="mt-4 text-sm text-gray-400">
                If this error persists, try running <code className="bg-gray-800 px-2 py-1 rounded">pnpm dev:webpack</code> instead
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
