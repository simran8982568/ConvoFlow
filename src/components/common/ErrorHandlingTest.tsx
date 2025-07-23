import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, Network, Shield, Server, FileX } from 'lucide-react';
import useAsyncOperation from '@/hooks/useAsyncOperation';
import { LoadingButton, ErrorState, NetworkError } from '@/components/common/LoadingStates';
import apiService from '@/utils/apiService';

const ErrorHandlingTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Test different types of errors
  const networkErrorTest = useAsyncOperation({
    showToast: true,
    toastTitle: "Network Error Test",
  });

  const validationErrorTest = useAsyncOperation({
    showToast: true,
    toastTitle: "Validation Error Test",
  });

  const serverErrorTest = useAsyncOperation({
    showToast: true,
    toastTitle: "Server Error Test",
  });

  const authErrorTest = useAsyncOperation({
    showToast: true,
    toastTitle: "Auth Error Test",
  });

  const timeoutErrorTest = useAsyncOperation({
    showToast: true,
    toastTitle: "Timeout Error Test",
  });

  const retryTest = useAsyncOperation({
    showToast: true,
    toastTitle: "Retry Test",
    retryConfig: {
      maxAttempts: 3,
      baseDelay: 1000,
    }
  });

  // Test functions
  const testNetworkError = async () => {
    const result = await networkErrorTest.execute(async () => {
      // Simulate network error
      const error = new Error('Network connection failed');
      (error as any).isNetworkError = true;
      throw error;
    });
    setTestResults(prev => ({ ...prev, network: result }));
  };

  const testValidationError = async () => {
    const result = await validationErrorTest.execute(async () => {
      // Simulate validation error
      const error = new Error('Validation failed');
      (error as any).isValidationError = true;
      (error as any).fields = {
        email: ['Email is required'],
        password: ['Password must be at least 8 characters']
      };
      throw error;
    });
    setTestResults(prev => ({ ...prev, validation: result }));
  };

  const testServerError = async () => {
    const result = await serverErrorTest.execute(async () => {
      // Simulate server error
      const error = new Error('Internal server error');
      (error as any).status = 500;
      throw error;
    });
    setTestResults(prev => ({ ...prev, server: result }));
  };

  const testAuthError = async () => {
    const result = await authErrorTest.execute(async () => {
      // Simulate auth error
      const error = new Error('Unauthorized access');
      (error as any).status = 401;
      throw error;
    });
    setTestResults(prev => ({ ...prev, auth: result }));
  };

  const testTimeoutError = async () => {
    const result = await timeoutErrorTest.execute(async () => {
      // Simulate timeout
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'));
        }, 100);
      });
    });
    setTestResults(prev => ({ ...prev, timeout: result }));
  };

  const testRetryMechanism = async () => {
    let attempts = 0;
    const result = await retryTest.execute(async () => {
      attempts++;
      if (attempts < 3) {
        const error = new Error(`Attempt ${attempts} failed`);
        (error as any).status = 500;
        throw error;
      }
      return { success: true, attempts };
    });
    setTestResults(prev => ({ ...prev, retry: result }));
  };

  const testApiService = async () => {
    try {
      // This will fail since we don't have a real API
      await apiService.get('/test-endpoint');
    } catch (error) {
      console.log('API Service test completed (expected to fail):', error);
      setTestResults(prev => ({ 
        ...prev, 
        apiService: { 
          success: false, 
          error: 'Expected failure - no real API endpoint' 
        } 
      }));
    }
  };

  const testGlobalErrorHandling = () => {
    // Test unhandled promise rejection
    Promise.reject(new Error('Test unhandled promise rejection'));
    
    // Test global error
    setTimeout(() => {
      throw new Error('Test global error');
    }, 100);

    setTestResults(prev => ({ 
      ...prev, 
      global: { 
        success: true, 
        message: 'Global error handlers triggered (check console)' 
      } 
    }));
  };

  const clearResults = () => {
    setTestResults({});
  };

  const testCases = [
    {
      id: 'network',
      title: 'Network Error',
      description: 'Test network connection failure handling',
      icon: Network,
      color: 'red',
      test: testNetworkError,
      operation: networkErrorTest,
    },
    {
      id: 'validation',
      title: 'Validation Error',
      description: 'Test form validation error handling',
      icon: FileX,
      color: 'orange',
      test: testValidationError,
      operation: validationErrorTest,
    },
    {
      id: 'server',
      title: 'Server Error',
      description: 'Test server-side error handling',
      icon: Server,
      color: 'red',
      test: testServerError,
      operation: serverErrorTest,
    },
    {
      id: 'auth',
      title: 'Authentication Error',
      description: 'Test authentication failure handling',
      icon: Shield,
      color: 'yellow',
      test: testAuthError,
      operation: authErrorTest,
    },
    {
      id: 'timeout',
      title: 'Timeout Error',
      description: 'Test request timeout handling',
      icon: AlertTriangle,
      color: 'purple',
      test: testTimeoutError,
      operation: timeoutErrorTest,
    },
    {
      id: 'retry',
      title: 'Retry Mechanism',
      description: 'Test automatic retry with exponential backoff',
      icon: Bug,
      color: 'blue',
      test: testRetryMechanism,
      operation: retryTest,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Error Handling Test Suite
        </h1>
        <p className="text-gray-600">
          Test various error scenarios and recovery mechanisms in the application.
        </p>
      </div>

      {/* Test Controls */}
      <div className="mb-6 flex gap-4">
        <Button onClick={testApiService} variant="outline">
          Test API Service
        </Button>
        <Button onClick={testGlobalErrorHandling} variant="outline">
          Test Global Handlers
        </Button>
        <Button onClick={clearResults} variant="outline">
          Clear Results
        </Button>
      </div>

      {/* Test Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {testCases.map((testCase) => {
          const IconComponent = testCase.icon;
          const result = testResults[testCase.id];
          
          return (
            <Card key={testCase.id} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-${testCase.color}-100 flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 text-${testCase.color}-600`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testCase.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {testCase.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <LoadingButton
                  loading={testCase.operation.loading}
                  onClick={testCase.test}
                  className="w-full mb-4"
                  loadingText="Testing..."
                >
                  Run Test
                </LoadingButton>

                {/* Test Result */}
                {result && (
                  <div className="mt-4">
                    <Badge 
                      variant={result.success ? "default" : "destructive"}
                      className="mb-2"
                    >
                      {result.success ? 'Success' : 'Failed'}
                    </Badge>
                    {result.error && (
                      <p className="text-sm text-red-600 break-words">
                        {result.error.message || String(result.error)}
                      </p>
                    )}
                    {result.data && (
                      <p className="text-sm text-green-600">
                        Data: {JSON.stringify(result.data)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error State Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Error State Component</CardTitle>
            <CardDescription>Example of error state UI</CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorState
              title="Something went wrong"
              message="This is an example of how errors are displayed to users."
              onRetry={() => console.log('Retry clicked')}
              variant="inline"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Error Component</CardTitle>
            <CardDescription>Example of network error UI</CardDescription>
          </CardHeader>
          <CardContent>
            <NetworkError
              onRetry={() => console.log('Network retry clicked')}
              variant="inline"
            />
          </CardContent>
        </Card>
      </div>

      {/* Test Results Summary */}
      {Object.keys(testResults).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorHandlingTest;
