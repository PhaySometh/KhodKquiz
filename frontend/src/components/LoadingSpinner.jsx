import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, Code, Brain, Pencil, FileText } from 'lucide-react';

/**
 * Custom Loading Spinner Component
 * Matches the blue-950/orange-400 color scheme
 * @param {string} size - 'sm', 'md', 'lg', 'xl'
 * @param {string} text - Loading text to display
 * @param {boolean} fullScreen - Whether to show as full screen overlay
 * @param {string} variant - 'spinner', 'dots', 'pulse', 'quiz', 'writing'
 */
const LoadingSpinner = ({
    size = 'md',
    text = 'Loading...',
    fullScreen = false,
    variant = 'spinner',
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    const SpinnerVariant = () => (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClasses[size]} text-blue-950`}
        >
            <Loader2 className="w-full h-full" />
        </motion.div>
    );

    const DotsVariant = () => (
        <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    animate={{
                        y: [0, -12, 0],
                        scale: [1, 1.3, 1],
                        backgroundColor: ['#1e3a8a', '#fb923c', '#1e3a8a'],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: index * 0.15,
                        ease: 'easeInOut',
                    }}
                    className={`rounded-full ${
                        size === 'sm'
                            ? 'w-2 h-2'
                            : size === 'md'
                            ? 'w-3 h-3'
                            : size === 'lg'
                            ? 'w-4 h-4'
                            : 'w-5 h-5'
                    } bg-blue-950`}
                />
            ))}
        </div>
    );

    const PulseVariant = () => (
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
                rotate: [0, 5, -5, 0],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={`${sizeClasses[size]} text-orange-400`}
        >
            <BookOpen className="w-full h-full" />
        </motion.div>
    );

    const QuizVariant = () => (
        <div className="flex items-center space-x-3">
            {[
                { icon: Code, color: 'text-blue-950', delay: 0 },
                { icon: Brain, color: 'text-orange-400', delay: 0.3 },
                { icon: Pencil, color: 'text-blue-950', delay: 0.6 },
            ].map(({ icon: Icon, color, delay }, index) => (
                <motion.div
                    key={index}
                    animate={{
                        y: [0, -8, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: delay,
                        ease: 'easeInOut',
                    }}
                    className={`${sizeClasses[size]} ${color}`}
                >
                    <Icon className="w-full h-full" />
                </motion.div>
            ))}
        </div>
    );

    const WritingVariant = () => (
        <div className="flex items-center space-x-2">
            <motion.div
                animate={{
                    rotate: [0, -15, 0, 15, 0],
                    x: [0, 2, -2, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className={`${sizeClasses[size]} text-blue-950`}
            >
                <Pencil className="w-full h-full" />
            </motion.div>
            <div className="flex space-x-1">
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        animate={{
                            width: [0, 8, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.2,
                            ease: 'easeInOut',
                        }}
                        className={`h-1 bg-orange-400 rounded-full ${
                            size === 'sm'
                                ? 'max-w-2'
                                : size === 'md'
                                ? 'max-w-3'
                                : size === 'lg'
                                ? 'max-w-4'
                                : 'max-w-6'
                        }`}
                    />
                ))}
            </div>
        </div>
    );

    const renderVariant = () => {
        switch (variant) {
            case 'dots':
                return <DotsVariant />;
            case 'pulse':
                return <PulseVariant />;
            case 'quiz':
                return <QuizVariant />;
            case 'writing':
                return <WritingVariant />;
            default:
                return <SpinnerVariant />;
        }
    };

    const LoadingContent = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center space-y-4"
        >
            {renderVariant()}
            {text && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${textSizes[size]} font-medium text-blue-950 text-center`}
                >
                    {text}
                </motion.p>
            )}
        </motion.div>
    );

    if (fullScreen) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center"
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <LoadingContent />
                </div>
            </motion.div>
        );
    }

    return <LoadingContent />;
};

export default LoadingSpinner;
