import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

/**
 * Reusable Confirmation Dialog Component
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {function} onClose - Function to close the dialog
 * @param {function} onConfirm - Function to call when confirmed
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Text for confirm button
 * @param {string} cancelText - Text for cancel button
 * @param {string} variant - 'warning', 'danger', 'info'
 * @param {boolean} isLoading - Whether the confirm action is loading
 */
const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    isLoading = false,
}) => {
    const variants = {
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-orange-400',
            iconBg: 'bg-orange-50',
            confirmBg: 'bg-orange-400 hover:bg-orange-500',
            confirmText: 'text-white',
        },
        danger: {
            icon: AlertTriangle,
            iconColor: 'text-red-500',
            iconBg: 'bg-red-50',
            confirmBg: 'bg-red-500 hover:bg-red-600',
            confirmText: 'text-white',
        },
        info: {
            icon: Check,
            iconColor: 'text-blue-950',
            iconBg: 'bg-blue-50',
            confirmBg: 'bg-blue-950 hover:bg-blue-800',
            confirmText: 'text-white',
        },
    };

    const currentVariant = variants[variant];
    const IconComponent = currentVariant.icon;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white-950 bg-opacity-50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 pb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`p-2 rounded-full ${currentVariant.iconBg}`}
                                >
                                    <IconComponent
                                        size={24}
                                        className={currentVariant.iconColor}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {title}
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-6 py-4 flex space-x-3 justify-end">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 ${currentVariant.confirmBg} ${currentVariant.confirmText} rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[100px] justify-center`}
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                            ) : (
                                <span>{confirmText}</span>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmationDialog;
