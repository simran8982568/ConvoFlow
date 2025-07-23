import React from 'react';
import { Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Loading Spinner Component
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

// Full Page Loading
export const PageLoading: React.FC<{
  message?: string;
}> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4 text-teal-600" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  </div>
);

// Card Loading Skeleton
export const CardSkeleton: React.FC<{
  rows?: number;
  showHeader?: boolean;
}> = ({ rows = 3, showHeader = true }) => (
  <Card>
    {showHeader && (
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
    )}
    <CardContent className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </CardContent>
  </Card>
);

// Table Loading Skeleton
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-6 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Inline Loading
export const InlineLoading: React.FC<{
  message?: string;
  size?: 'sm' | 'md';
}> = ({ message = 'Loading...', size = 'sm' }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <LoadingSpinner size={size} />
    <span className={size === 'sm' ? 'text-sm' : 'text-base'}>{message}</span>
  </div>
);

// Button Loading State
export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  [key: string]: any;
}> = ({ loading, children, loadingText, ...props }) => (
  <Button disabled={loading} {...props}>
    {loading ? (
      <>
        <LoadingSpinner size="sm" className="mr-2" />
        {loadingText || 'Loading...'}
      </>
    ) : (
      children
    )}
  </Button>
);

// Error States
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
  variant?: 'card' | 'inline' | 'page';
}> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  retryText = 'Try Again',
  showIcon = true,
  variant = 'card',
}) => {
  const content = (
    <>
      {showIcon && (
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
      )}
      <div className="text-center">
        <h3 className={`font-semibold text-gray-900 ${variant === 'page' ? 'text-xl' : 'text-lg'}`}>
          {title}
        </h3>
        <p className={`text-gray-600 mt-2 ${variant === 'page' ? 'text-base' : 'text-sm'}`}>
          {message}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-4"
            size={variant === 'page' ? 'default' : 'sm'}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryText}
          </Button>
        )}
      </div>
    </>
  );

  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="py-8">
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="py-8 px-4">
      {content}
    </div>
  );
};

// Network Error State
export const NetworkError: React.FC<{
  onRetry?: () => void;
  variant?: 'card' | 'inline' | 'page';
}> = ({ onRetry, variant = 'card' }) => (
  <ErrorState
    title="Connection Problem"
    message="Unable to connect to the server. Please check your internet connection and try again."
    onRetry={onRetry}
    retryText="Retry Connection"
    variant={variant}
    showIcon={false}
  />
);

// Empty State
export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}> = ({
  title = 'No data found',
  message = 'There is no data to display at the moment.',
  action,
  icon,
}) => (
  <div className="text-center py-12">
    {icon && (
      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {action && (
      <Button onClick={action.onClick} variant="outline">
        {action.label}
      </Button>
    )}
  </div>
);

// Connection Status Indicator
export const ConnectionStatus: React.FC<{
  isOnline: boolean;
  className?: string;
}> = ({ isOnline, className = '' }) => (
  <div className={`flex items-center gap-2 text-sm ${className}`}>
    {isOnline ? (
      <>
        <Wifi className="w-4 h-4 text-green-600" />
        <span className="text-green-600">Online</span>
      </>
    ) : (
      <>
        <WifiOff className="w-4 h-4 text-red-600" />
        <span className="text-red-600">Offline</span>
      </>
    )}
  </div>
);

// Progress Indicator
export const ProgressIndicator: React.FC<{
  progress: number;
  label?: string;
  showPercentage?: boolean;
}> = ({ progress, label, showPercentage = true }) => (
  <div className="w-full">
    {(label || showPercentage) && (
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        {label && <span>{label}</span>}
        {showPercentage && <span>{Math.round(progress)}%</span>}
      </div>
    )}
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  </div>
);

export default {
  LoadingSpinner,
  PageLoading,
  CardSkeleton,
  TableSkeleton,
  InlineLoading,
  LoadingButton,
  ErrorState,
  NetworkError,
  EmptyState,
  ConnectionStatus,
  ProgressIndicator,
};
