import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  copied: boolean;
}

// Error logging service
class ErrorLogger {
  static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static logError(error: Error, errorInfo: ErrorInfo, errorId: string) {
    const errorData = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🚨 Error Boundary Caught Error [${errorId}]`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Error Data:', errorData);
      console.groupEnd();
    }

    // In production, send to error reporting service
    if (import.meta.env.PROD) {
      try {
        // Example: Send to error reporting service
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorData)
        // });

        // Store in localStorage as fallback
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push(errorData);
        // Keep only last 10 errors
        if (errors.length > 10) errors.shift();
        localStorage.setItem('app_errors', JSON.stringify(errors));
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }

    return errorData;
  }
}

class GlobalErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: ErrorLogger.generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || ErrorLogger.generateErrorId();

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log the error
    ErrorLogger.logError(error, errorInfo, errorId);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;

    // Prevent infinite retry loops
    if (newRetryCount > 3) {
      console.warn('Maximum retry attempts reached. Reloading page instead.');
      this.handleReload();
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: newRetryCount,
      copied: false,
    });

    // Add a small delay before retry to prevent immediate re-error
    this.retryTimeout = setTimeout(() => {
      // Force a re-render
      this.forceUpdate();
    }, 100);
  };

  handleCopyError = async () => {
    if (!this.state.error || !this.state.errorId) return;

    const errorText = `Error ID: ${this.state.errorId}
Error: ${this.state.error.message}
Stack: ${this.state.error.stack}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}`;

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId, retryCount, copied } = this.state;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Something went wrong
              </CardTitle>
              <CardDescription className="mt-2">
                We're sorry, but something unexpected happened. Please try one of the options below.
              </CardDescription>

              {/* Error ID and Retry Count */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {errorId && (
                  <Badge variant="outline" className="text-xs">
                    <Bug className="w-3 h-3 mr-1" />
                    ID: {errorId}
                  </Badge>
                )}
                {retryCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Retry #{retryCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error details in development */}
              {import.meta.env.DEV && error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-800">Error Details:</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={this.handleCopyError}
                      className="text-xs"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Error
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-red-700 font-mono break-all mb-2">
                    {error.message}
                  </p>
                  {errorInfo && (
                    <details className="mt-2">
                      <summary className="text-sm text-red-700 cursor-pointer hover:text-red-800">
                        Component Stack Trace
                      </summary>
                      <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-32 bg-red-25 p-2 rounded">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-sm text-red-700 cursor-pointer hover:text-red-800">
                        Full Stack Trace
                      </summary>
                      <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-32 bg-red-25 p-2 rounded">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="default"
                  disabled={retryCount >= 3}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1"
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                <p className="mb-2">
                  If this problem persists, please contact support with the error ID above.
                </p>
                {import.meta.env.PROD && (
                  <p className="text-xs text-gray-400">
                    Error details have been automatically logged for investigation.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
