import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  children: ReactNode;
  routeName?: string;
  fallbackRoute?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `route_err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || `route_err_${Date.now()}`;
    
    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log the error
    console.group(`🚨 Route Error Boundary [${this.props.routeName || 'Unknown Route'}]`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Route:', this.props.routeName);
    console.groupEnd();

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleGoBack = () => {
    if (this.props.fallbackRoute) {
      window.location.href = this.props.fallbackRoute;
    } else {
      window.history.back();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const { routeName } = this.props;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg text-gray-900">
                Page Error
              </CardTitle>
              <CardDescription>
                {routeName ? `The ${routeName} page` : 'This page'} encountered an error and couldn't load properly.
              </CardDescription>
              
              {errorId && (
                <Badge variant="outline" className="text-xs mt-2 mx-auto">
                  Error ID: {errorId}
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error message in development */}
              {import.meta.env.DEV && error && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-800 font-mono break-all">
                    {error.message}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={this.handleGoBack}
                    className="flex-1"
                    variant="outline"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    className="flex-1"
                    variant="outline"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>
              </div>

              {/* Help text */}
              <div className="text-center text-xs text-gray-500 pt-2 border-t">
                <p>
                  If this continues, try refreshing the entire page or contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
