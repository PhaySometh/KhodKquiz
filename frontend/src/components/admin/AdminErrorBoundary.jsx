import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AdminErrorBoundary Component
 * 
 * Error boundary specifically designed for admin interface with consistent styling
 */
class AdminErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to console for debugging
        console.error('Admin Error Boundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 mb-6">
                                An unexpected error occurred in the admin interface. 
                                Please try refreshing the page or contact support if the problem persists.
                            </p>
                        </div>

                        {/* Error details (only in development) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                                <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
                                <p className="text-sm text-red-600 font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm text-gray-700">
                                            Stack Trace
                                        </summary>
                                        <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={this.handleRetry}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <Link
                                to="/admin"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * AdminErrorMessage Component
 * 
 * Reusable error message component for admin interface
 */
export function AdminErrorMessage({ 
    title = "Error", 
    message, 
    onRetry, 
    showRetry = true,
    className = "" 
}) {
    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        {title}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        {message}
                    </div>
                    {showRetry && onRetry && (
                        <div className="mt-4">
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * AdminEmptyState Component
 * 
 * Empty state component for admin interface
 */
export function AdminEmptyState({ 
    title, 
    description, 
    actionText, 
    onAction, 
    icon: Icon,
    className = "" 
}) {
    return (
        <div className={`text-center py-12 ${className}`}>
            {Icon && (
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {description}
            </p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}

export default AdminErrorBoundary;
