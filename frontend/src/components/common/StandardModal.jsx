import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Standardized Modal Component
 * 
 * Provides consistent modal styling across the KhodKquiz application with:
 * - Blue theme background (blue-950)
 * - Orange-400 primary buttons
 * - Scroll prevention when modal is open
 * - Smooth animations and backdrop blur
 * - Responsive design
 * 
 * @component
 * @version 2.0.0
 * @author KhodKquiz Team
 */
const StandardModal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    preventClose = false,
    className = ''
}) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            // Store original overflow style
            const originalOverflow = document.body.style.overflow;
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            
            // Cleanup function to restore scrolling
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !preventClose) {
            onClose();
        }
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && !preventClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose, preventClose]);

    // Size configurations
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop with blue theme */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 "
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            relative bg-white rounded-xl shadow-2xl w-full
                            ${sizeClasses[size]}
                            max-h-[90vh] overflow-hidden
                            ${className}
                        `}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                {title && (
                                    <h3 className="text-xl font-semibold text-blue-950">
                                        {title}
                                    </h3>
                                )}
                                {showCloseButton && !preventClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

/**
 * Modal Footer Component
 * Provides consistent footer styling with orange primary buttons
 */
export const ModalFooter = ({ 
    children, 
    className = '',
    justifyContent = 'end' 
}) => {
    const justifyClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between'
    };

    return (
        <div className={`
            flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50
            ${justifyClasses[justifyContent]}
            ${className}
        `}>
            {children}
        </div>
    );
};

/**
 * Modal Body Component
 * Provides consistent body styling with proper padding
 */
export const ModalBody = ({ children, className = '' }) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

/**
 * Standard Button Components for Modals
 */
export const PrimaryButton = ({ 
    children, 
    onClick, 
    disabled = false, 
    loading = false,
    type = 'button',
    className = '' 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                px-6 py-2.5 bg-orange-400 text-white font-medium rounded-lg
                hover:bg-orange-500 focus:ring-4 focus:ring-orange-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${className}
            `}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export const SecondaryButton = ({ 
    children, 
    onClick, 
    disabled = false,
    type = 'button',
    className = '' 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg
                hover:bg-gray-50 focus:ring-4 focus:ring-gray-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export const DangerButton = ({ 
    children, 
    onClick, 
    disabled = false,
    loading = false,
    type = 'button',
    className = '' 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg
                hover:bg-red-700 focus:ring-4 focus:ring-red-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${className}
            `}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
};

/**
 * Confirmation Modal Component
 * Pre-built modal for confirmation dialogs
 */
export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'primary', // primary, danger
    loading = false
}) => {
    const ConfirmButton = type === 'danger' ? DangerButton : PrimaryButton;

    return (
        <StandardModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            preventClose={loading}
        >
            <ModalBody>
                <p className="text-gray-600 leading-relaxed">
                    {message}
                </p>
            </ModalBody>
            <ModalFooter>
                <SecondaryButton 
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </SecondaryButton>
                <ConfirmButton 
                    onClick={onConfirm}
                    loading={loading}
                >
                    {confirmText}
                </ConfirmButton>
            </ModalFooter>
        </StandardModal>
    );
};

export default StandardModal;
