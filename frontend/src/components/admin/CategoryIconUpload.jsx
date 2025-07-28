import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * Category Icon Upload Component
 * 
 * Provides icon upload functionality for categories with:
 * - Image preview and cropping
 * - File validation (JPG, PNG, SVG)
 * - Size limits and error handling
 * - Default fallback icons
 * - Drag and drop support
 * 
 * @component
 * @version 2.0.0
 * @author KhodKquiz Team
 */
const CategoryIconUpload = ({
    currentIcon = null,
    onIconChange,
    onIconRemove,
    categoryName = '',
    disabled = false,
    className = ''
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(currentIcon);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Supported file types
    const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * Validates uploaded file
     */
    const validateFile = (file) => {
        const errors = [];

        if (!SUPPORTED_TYPES.includes(file.type)) {
            errors.push('Please upload a JPG, PNG, or SVG file');
        }

        if (file.size > MAX_FILE_SIZE) {
            errors.push('File size must be less than 5MB');
        }

        return errors;
    };

    /**
     * Processes uploaded file
     */
    const processFile = useCallback(async (file) => {
        const errors = validateFile(file);
        
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setUploading(true);

        try {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            // Call parent handler
            if (onIconChange) {
                await onIconChange(file);
            }

            toast.success('Icon uploaded successfully!');
        } catch (error) {
            console.error('Error uploading icon:', error);
            toast.error('Failed to upload icon');
            setPreview(currentIcon);
        } finally {
            setUploading(false);
        }
    }, [currentIcon, onIconChange]);

    /**
     * Handles file input change
     */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    /**
     * Handles drag and drop
     */
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    /**
     * Handles icon removal
     */
    const handleRemoveIcon = () => {
        setPreview(null);
        if (onIconRemove) {
            onIconRemove();
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success('Icon removed');
    };

    /**
     * Opens file picker
     */
    const openFilePicker = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    /**
     * Generates default icon based on category name
     */
    const getDefaultIcon = () => {
        const name = categoryName.toLowerCase();
        
        // Programming language icons mapping
        const iconMap = {
            'javascript': '🟨',
            'js': '🟨',
            'react': '⚛️',
            'node': '🟢',
            'nodejs': '🟢',
            'python': '🐍',
            'java': '☕',
            'c': '🔵',
            'cpp': '🔵',
            'c++': '🔵',
            'database': '🗄️',
            'sql': '🗄️',
            'web': '🌐',
            'html': '🌐',
            'css': '🎨',
            'data': '📊',
            'algorithm': '🧮',
            'software': '💻'
        };

        // Find matching icon
        for (const [key, icon] of Object.entries(iconMap)) {
            if (name.includes(key)) {
                return icon;
            }
        }

        // Default fallback
        return '📚';
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
                    ${dragActive 
                        ? 'border-orange-400 bg-orange-50' 
                        : preview 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300 hover:border-gray-400'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFilePicker}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled}
                />

                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-600">Uploading icon...</p>
                        </motion.div>
                    ) : preview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="relative">
                                <img
                                    src={preview}
                                    alt="Category icon preview"
                                    className="w-16 h-16 object-cover rounded-lg border-2 border-green-300"
                                />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-green-700">Icon uploaded</p>
                                <p className="text-xs text-gray-500">Click to change or drag new file</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                {dragActive ? (
                                    <Upload className="w-8 h-8 text-orange-400" />
                                ) : (
                                    getDefaultIcon()
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">
                                    {dragActive ? 'Drop icon here' : 'Upload category icon'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    JPG, PNG, SVG up to 5MB
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Remove Button */}
            {preview && !disabled && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveIcon();
                    }}
                    className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                    <X size={16} />
                    Remove Icon
                </motion.button>
            )}

            {/* Help Text */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>• Recommended size: 64x64 pixels or larger</p>
                <p>• Square images work best for consistent display</p>
                <p>• SVG files are preferred for crisp scaling</p>
            </div>
        </div>
    );
};

/**
 * Category Icon Display Component
 * Shows category icon with fallback
 */
export const CategoryIconDisplay = ({ 
    icon, 
    categoryName, 
    size = 'md',
    className = '' 
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6 text-sm',
        md: 'w-8 h-8 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl'
    };

    const getDefaultIcon = () => {
        const name = categoryName?.toLowerCase() || '';
        
        const iconMap = {
            'javascript': '🟨', 'js': '🟨', 'react': '⚛️', 'node': '🟢',
            'python': '🐍', 'java': '☕', 'c': '🔵', 'database': '🗄️',
            'web': '🌐', 'html': '🌐', 'css': '🎨', 'data': '📊'
        };

        for (const [key, emoji] of Object.entries(iconMap)) {
            if (name.includes(key)) return emoji;
        }
        return '📚';
    };

    return (
        <div className={`
            ${sizeClasses[size]} 
            rounded-lg flex items-center justify-center overflow-hidden
            ${className}
        `}>
            {icon ? (
                <img
                    src={icon}
                    alt={`${categoryName} icon`}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span>{getDefaultIcon()}</span>
            )}
        </div>
    );
};

export default CategoryIconUpload;
