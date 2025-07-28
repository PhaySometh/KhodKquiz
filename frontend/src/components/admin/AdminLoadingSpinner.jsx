import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * AdminLoadingSpinner Component
 * 
 * A consistent loading spinner for admin interface with blue-950/orange-400 color scheme
 */
export default function AdminLoadingSpinner({ 
    size = 'md', 
    text = 'Loading...', 
    fullScreen = false,
    className = '' 
}) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };

    const containerClasses = fullScreen 
        ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
        : 'flex items-center justify-center';

    return (
        <div className={`${containerClasses} ${className}`}>
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <Loader2 
                        className={`${sizeClasses[size]} text-blue-950 animate-spin`} 
                    />
                    <div 
                        className={`absolute inset-0 ${sizeClasses[size]} border-2 border-orange-400 border-t-transparent rounded-full animate-spin`}
                        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                    />
                </div>
                {text && (
                    <p className={`${textSizeClasses[size]} text-blue-950 font-medium`}>
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}

/**
 * AdminTableLoadingSkeleton Component
 * 
 * Loading skeleton for admin tables
 */
export function AdminTableLoadingSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex space-x-4 p-4 bg-white rounded-lg border">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={colIndex} className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </div>
                        ))}
                        <div className="flex space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * AdminCardLoadingSkeleton Component
 * 
 * Loading skeleton for admin dashboard cards
 */
export function AdminCardLoadingSkeleton({ cards = 4 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: cards }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * AdminFormLoadingSkeleton Component
 * 
 * Loading skeleton for admin forms
 */
export function AdminFormLoadingSkeleton({ fields = 5 }) {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            {Array.from({ length: fields }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
            ))}
            <div className="flex space-x-4 pt-4">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>
        </div>
    );
}
